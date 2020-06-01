package com.github.chess;

import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.view.DisplayCutout;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MainActivity extends Activity
    {
    @Override protected void onCreate(Bundle savedInstanceState)
        {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        WebView webView = (WebView) findViewById(R.id.webView1);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setUseWideViewPort(true);
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setAppCacheEnabled(true);
        webView.getSettings().setTextZoom(100);

        String htmlData = loadAssetTextAsString("ChessGame.htm", this);
        webView.loadDataWithBaseURL(null, htmlData, "text/html", "UTF-8",null);
        }

    private String loadAssetTextAsString(String name, Context myContext)
        {
        BufferedReader in = null;
        try
            {
            StringBuilder buf = new StringBuilder();
            InputStream is = myContext.getAssets().open(name);
            in = new BufferedReader(new InputStreamReader(is));

            String str;
            boolean isFirst = true;
            while ((str=in.readLine())!=null)
                {
                if (isFirst)
                    {
                    isFirst = false;
                    }
                    else
                    {
                    buf.append("\n");
                    }
                buf.append(str);
                }
            return buf.toString();
            }
            catch (IOException e)
            {
            }
            finally
            {
            if (in!=null)
                {
                try
                    {
                    in.close();
                    }
                    catch (IOException e)
                    {
                    }
                }
            }
        return null;
        }

    @Override public void onResume()
        {
        super.onResume();
        toggleNavigationBarStatus();
        }

    @Override public void onConfigurationChanged(Configuration newConfig)
        {
        super.onConfigurationChanged(newConfig);
        toggleNavigationBarStatus();
        }

    private void toggleNavigationBarStatus()
        {
        if (isLandscape()==true)
            {
            hideNavigationBar();
            }
        else
            {
            showNavigationBar();
            }
        }

    private boolean isLandscape()
        {
        try
            {
            int orientation = getResources().getConfiguration().orientation;
            if (orientation == Configuration.ORIENTATION_LANDSCAPE)
                {
                return true;
                }
            else
                {
                return false;
                }
            }
            catch(Exception e)
            {
            }
        return false;
        }

    private void hideNavigationBar()
        {

        try
            {
            View decorView = getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            decorView.setSystemUiVisibility(uiOptions);
            }
            catch(Exception e)
            {
            }
        }

    private void showNavigationBar()
        {
        try
            {
            View decorView = getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            decorView.setSystemUiVisibility(uiOptions);
            }
            catch(Exception e)
            {
            }
        }
    }