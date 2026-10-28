package org.somervillefamily.archive;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

/**
 * The Somerville Family Archive as an Android app: a full-screen WebView showing
 * the site bundled in assets/www. Everything works offline except map tiles and
 * links to external sources, which open in the phone's browser.
 */
public class MainActivity extends Activity {
    private static final String HOME = "file:///android_asset/www/index.html";
    private WebView web;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // theme choice is remembered in localStorage
        s.setAllowFileAccess(false);           // assets load regardless; no access to other files
        s.setAllowContentAccess(false);
        s.setBuiltInZoomControls(true);        // pinch-zoom for the family tree and transcripts
        s.setDisplayZoomControls(false);

        web.setWebViewClient(new ArchiveWebClient(this));

        if (state != null) web.restoreState(state);
        else web.loadUrl(HOME);
    }

    /** Pages of the archive stay in the app; anything else goes to the browser or other app. */
    boolean openOutside(Uri uri) {
        if ("file".equals(uri.getScheme()) && uri.getPath() != null && uri.getPath().startsWith("/android_asset/")) return false;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException e) {
            // no app can open it; stay on the current page
        }
        return true;
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    /** Back walks the archive's own history (each page is a #/ route) before leaving the app. */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (web != null) web.destroy();
        super.onDestroy();
    }
}
