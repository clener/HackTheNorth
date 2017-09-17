package me.neelmehta.hackthenorth.pluggable;

import android.os.Build;
import android.view.ActionMode;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.SearchEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityEvent;

import org.jetbrains.annotations.Nullable;

/**
 * Created by neel on 2017-09-16 at 5:36 PM.
 */

public class RenderWindowCallback implements Window.Callback {
    private final Window.Callback localCallback;
    private final View rootView;

    public RenderWindowCallback(Window.Callback localCallback, View rootView) {
        this.localCallback = localCallback;
        this.rootView = rootView;
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent keyEvent) {
        return localCallback.dispatchKeyEvent(keyEvent);
    }

    @Override
    public boolean dispatchKeyShortcutEvent(KeyEvent keyEvent) {
        return localCallback.dispatchKeyShortcutEvent(keyEvent);
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent motionEvent) {
        boolean val = localCallback.dispatchTouchEvent(motionEvent);
        Pluggable.reRender(rootView);
        return val;
    }

    @Override
    public boolean dispatchTrackballEvent(MotionEvent motionEvent) {
        return localCallback.dispatchTrackballEvent(motionEvent);
    }

    @Override
    public boolean dispatchGenericMotionEvent(MotionEvent motionEvent) {
        return localCallback.dispatchGenericMotionEvent(motionEvent);
    }

    @Override
    public boolean dispatchPopulateAccessibilityEvent(AccessibilityEvent accessibilityEvent) {
        return localCallback.dispatchPopulateAccessibilityEvent(accessibilityEvent);
    }

    @Nullable
    @Override
    public View onCreatePanelView(int i) {
        return localCallback.onCreatePanelView(i);
    }

    @Override
    public boolean onCreatePanelMenu(int i, Menu menu) {
        return localCallback.onCreatePanelMenu(i, menu);
    }

    @Override
    public boolean onPreparePanel(int i, View view, Menu menu) {
        return localCallback.onPreparePanel(i, view, menu);
    }

    @Override
    public boolean onMenuOpened(int i, Menu menu) {
        return localCallback.onMenuOpened(i, menu);
    }

    @Override
    public boolean onMenuItemSelected(int i, MenuItem menuItem) {
        return localCallback.onMenuItemSelected(i, menuItem);
    }

    @Override
    public void onWindowAttributesChanged(WindowManager.LayoutParams layoutParams) {
        localCallback.onWindowAttributesChanged(layoutParams);
    }

    @Override
    public void onContentChanged() {
        localCallback.onContentChanged();
    }

    @Override
    public void onWindowFocusChanged(boolean b) {
        localCallback.onWindowFocusChanged(b);
    }

    @Override
    public void onAttachedToWindow() {
        localCallback.onAttachedToWindow();
    }

    @Override
    public void onDetachedFromWindow() {
        localCallback.onDetachedFromWindow();
    }

    @Override
    public void onPanelClosed(int i, Menu menu) {
        localCallback.onPanelClosed(i, menu);
    }

    @Override
    public boolean onSearchRequested() {
        return localCallback.onSearchRequested();
    }

    @Override
    public boolean onSearchRequested(SearchEvent searchEvent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return localCallback.onSearchRequested(searchEvent);
        } else {
            return localCallback.onSearchRequested();
        }
    }

    @Nullable
    @Override
    public ActionMode onWindowStartingActionMode(ActionMode.Callback callback) {
        return localCallback.onWindowStartingActionMode(callback);
    }

    @Nullable
    @Override
    public ActionMode onWindowStartingActionMode(ActionMode.Callback callback, int i) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return localCallback.onWindowStartingActionMode(callback, i);
        } else {
            return localCallback.onWindowStartingActionMode(callback);
        }
    }

    @Override
    public void onActionModeStarted(ActionMode actionMode) {
        localCallback.onActionModeStarted(actionMode);
    }

    @Override
    public void onActionModeFinished(ActionMode actionMode) {
        localCallback.onActionModeFinished(actionMode);
    }
}
