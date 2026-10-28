package org.somervillefamily.archive;

import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Keeps the archive's own pages in the app and hands every other link to MainActivity.openOutside. */
public class ArchiveWebClient extends WebViewClient {
    private final MainActivity activity;

    public ArchiveWebClient(MainActivity activity) {
        this.activity = activity;
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        return activity.openOutside(request.getUrl());
    }
}
