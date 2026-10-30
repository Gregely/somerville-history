#!/usr/bin/env bash
# Build the Android app (an offline copy of the archive in a WebView).
#
#   scripts/build-apk.sh              -> dist/somerville-archive-<version>.apk
#
# Needs: JDK 17+, Node, and the Android SDK (platform android-34, build-tools
# 34.0.0) at $ANDROID_HOME (default /opt/android-sdk). No Gradle.
#
# Signing: uses $APK_KEYSTORE (default android/release.keystore, git-ignored),
# creating it on first use. Keep that file: Android only installs an update
# over an existing install if it is signed with the same key.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$PWD
SDK=${ANDROID_HOME:-/opt/android-sdk}
BT=$SDK/build-tools/34.0.0
JAR=$SDK/platforms/android-34/android.jar
OUT=android/build
KEYSTORE=${APK_KEYSTORE:-android/release.keystore}
KEYPASS=${APK_KEYPASS:-somerville-archive}
VERSION=$(sed -n 's/.*android:versionName="\([^"]*\)".*/\1/p' android/AndroidManifest.xml)
for f in "$BT/aapt2" "$BT/d8" "$BT/zipalign" "$BT/apksigner" "$JAR"; do [ -e "$f" ] || { echo "missing $f (install platforms;android-34 and build-tools;34.0.0)"; exit 1; }; done

echo "1/6 validate and bundle the archive"
node scripts/build.mjs

echo "2/6 stage an offline copy of the site"
rm -rf "$OUT/www" "$OUT/gen" "$OUT/classes" "$OUT"/*.apk "$OUT"/*.zip "$OUT/classes.dex"
mkdir -p "$OUT/www/transcripts" "$OUT/vendor"
cp index.html "$OUT/www/"
cp -r assets "$OUT/www/"
cp transcripts/*.txt "$OUT/www/transcripts/"

# Leaflet (map) and the web fonts are bundled so the app works without a connection;
# only the map tiles themselves still need the internet. Downloads are cached.
if [ ! -f "$OUT/vendor/leaflet/leaflet.js" ]; then
  (cd "$OUT/vendor" && npm pack leaflet@1.9.4 --silent >/dev/null && tar xzf leaflet-1.9.4.tgz && rm -rf leaflet && mv package/dist leaflet && rm -rf package leaflet-1.9.4.tgz)
fi
# the fonts are the ones index.html asks for; the cached copy is refreshed when that list changes
FONTS_URL=$(grep -o 'https://fonts.googleapis.com/css2[^"]*' index.html | head -1)
[ -n "$FONTS_URL" ] || { echo "index.html has no Google Fonts link" >&2; exit 1; }
if [ ! -f "$OUT/vendor/fonts/fonts.css" ] || [ "$(cat "$OUT/vendor/fonts/url.txt" 2>/dev/null)" != "$FONTS_URL" ]; then
  rm -rf "$OUT/vendor/fonts" && mkdir -p "$OUT/vendor/fonts"
  curl -sSfL -A 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36' "$FONTS_URL" -o "$OUT/vendor/fonts/remote.css"
  node -e '
    const fs = require("fs"), path = require("path"), dir = process.argv[1];
    let css = fs.readFileSync(path.join(dir, "remote.css"), "utf8"), i = 0, list = [];
    css = css.replace(/url\((https:[^)]+)\)/g, (m, u) => { const f = `f${i++}.woff2`; list.push(`${u} ${f}`); return `url(${f})`; });
    fs.writeFileSync(path.join(dir, "fonts.css"), css); fs.writeFileSync(path.join(dir, "list.txt"), list.join("\n") + "\n");' "$OUT/vendor/fonts"
  while read -r url file; do [ -n "$url" ] && curl -sSfL "$url" -o "$OUT/vendor/fonts/$file"; done < "$OUT/vendor/fonts/list.txt"
  rm "$OUT/vendor/fonts/remote.css" "$OUT/vendor/fonts/list.txt"
  printf '%s' "$FONTS_URL" > "$OUT/vendor/fonts/url.txt"
fi
mkdir -p "$OUT/www/vendor" && cp -r "$OUT/vendor/leaflet" "$OUT/vendor/fonts" "$OUT/www/vendor/"
rm -f "$OUT/www/vendor/fonts/url.txt"
find "$OUT/www/vendor" -name "*.map" -delete
node -e '
  const fs = require("fs"), f = process.argv[1];
  let h = fs.readFileSync(f, "utf8");
  const swap = (a, b) => { if (!h.includes(a)) { console.error("index.html: not found: " + a); process.exit(1); } h = h.replace(a, b); };
  swap(/<link rel="preconnect" href="https:\/\/fonts.googleapis.com" \/>\n\s*/.exec(h)[0], "");
  swap(/<link rel="preconnect" href="https:\/\/fonts.gstatic.com" crossorigin \/>\n\s*/.exec(h)[0], "");
  swap(/href="https:\/\/fonts.googleapis.com\/css2[^"]*"/.exec(h)[0], "href=\"vendor/fonts/fonts.css\"");
  swap("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "vendor/leaflet/leaflet.css");
  swap("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "vendor/leaflet/leaflet.js");
  if (/https:\/\/(unpkg|fonts\.)/.test(h)) { console.error("index.html still loads remote code"); process.exit(1); }
  fs.writeFileSync(f, h);' "$OUT/www/index.html"

echo "3/6 compile resources and link the APK"
mkdir -p "$OUT/gen" "$OUT/classes"
"$BT/aapt2" compile --dir android/res -o "$OUT/res.zip"
mkdir -p "$OUT/assets" && rm -rf "$OUT/assets/www" && mv "$OUT/www" "$OUT/assets/www"
"$BT/aapt2" link -o "$OUT/unsigned.apk" -I "$JAR" --manifest android/AndroidManifest.xml \
  -A "$OUT/assets" --java "$OUT/gen" --min-sdk-version 24 --target-sdk-version 34 "$OUT/res.zip"

echo "4/6 compile Java and convert to dex"
javac -nowarn --release 8 -Xlint:-options -classpath "$JAR" -d "$OUT/classes" $(find android/src "$OUT/gen" -name '*.java') 2>&1 | grep -v 'JAVA_TOOL_OPTIONS' || true
"$BT/d8" --release --min-api 24 --lib "$JAR" --output "$OUT" $(find "$OUT/classes" -name '*.class')
(cd "$OUT" && zip -q -j unsigned.apk classes.dex)

echo "5/6 align and sign"
if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -keystore "$KEYSTORE" -storepass "$KEYPASS" -keypass "$KEYPASS" -alias archive \
    -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Somerville Family Archive" 2>&1 | grep -v JAVA_TOOL_OPTIONS || true
  echo "   created $KEYSTORE (keep it to sign future updates)"
fi
"$BT/zipalign" -f -p 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"
mkdir -p dist
APK="dist/somerville-archive-$VERSION.apk"
"$BT/apksigner" sign --ks "$KEYSTORE" --ks-pass "pass:$KEYPASS" --ks-key-alias archive --out "$APK" "$OUT/aligned.apk" 2>&1 | grep -v JAVA_TOOL_OPTIONS || true

echo "6/6 verify"
"$BT/apksigner" verify --print-certs "$APK" 2>&1 | grep -E "Signer #1 certificate (DN|SHA-256)" || { echo "signature verification failed"; exit 1; }
ls -la "$APK"
