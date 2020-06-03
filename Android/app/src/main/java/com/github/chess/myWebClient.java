package com.github.chess;

import android.graphics.Bitmap;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class myWebClient extends WebViewClient
	{
    public void onPageStarted(WebView view, String url, Bitmap favicon)
    	{
        super.onPageStarted(view, url, favicon);
    	}

    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error)
		{
		}

    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request)
    	{
		view.loadUrl(request.getUrl().toString());
        return true;
    	}

    public void onPageFinished(WebView view, String url)
    	{
        super.onPageFinished(view, url);
    	}
	}