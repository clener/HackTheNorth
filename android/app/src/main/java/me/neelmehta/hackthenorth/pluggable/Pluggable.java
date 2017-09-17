package me.neelmehta.hackthenorth.pluggable;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import me.neelmehta.hackthenorth.R;

/**
 * Created by neel on 2017-09-16 at 3:08 AM.
 */

public class Pluggable {
    private static final String URL = "http://34.229.167.116:3000/";
    private static final String TAG = "Pluggable";
    private static Map<UUID, Integer> IDs = null;
    private static Menu mMenu = null;
    private static SharedPreferences preferences = null;
    private static String mUUID = null;
    private static boolean connected = false;
    private static boolean loaded = false;
    private static View mRootView = null;

    private static Socket mSocket;

    private static void putLocationAndSize(final View view, final JSONObject object) throws JSONException {
        int[] outLocation = new int[2];
        view.getLocationOnScreen(outLocation);

        object.put("x", outLocation[0]);
        object.put("y", outLocation[1]);

        object.put("height", view.getHeight());
        object.put("width", view.getWidth());
    }

    private static String getCSSColor(int color) {
        return "rgba(" + Color.red(color) + "," +
                Color.green(color) + "," + Color.blue(color) +
                "," + Color.alpha(color) + ")";
    }

    private static JSONObject getPadding(View view) throws JSONException {
        JSONObject padding = new JSONObject();

        padding.put("left", view.getPaddingLeft());
        padding.put("top", view.getPaddingTop());
        padding.put("right", view.getPaddingRight());
        padding.put("bottom", view.getPaddingBottom());

        return padding;
    }

    private static void getTextViewProps(TextView view, JSONObject object) throws JSONException {
        object.put("text", view.getText());
        object.put("textSize", view.getTextSize());
        object.put("textColor", getCSSColor(view.getCurrentTextColor()));
        object.put("padding", getPadding(view));

        if (view.getBackground() instanceof ColorDrawable) {
            object.put("backgroundColor", getCSSColor(((ColorDrawable) view.getBackground()).getColor()));
        }
    }

    private static void getViewGroupProps(ViewGroup viewGroup, JSONObject object) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < viewGroup.getChildCount(); i++) {
            JSONObject child = serialize(viewGroup.getChildAt(i));
            array.put(child);
        }

        object.put("children", array);

        int color = Color.TRANSPARENT;
        if (viewGroup.getBackground() instanceof ColorDrawable) {
            color = ((ColorDrawable) viewGroup.getBackground()).getColor();
        }

        object.put("backgroundColor", getCSSColor(color));
        object.put("padding", getPadding(viewGroup));
    }

    private static TextWatcher watcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

        }

        @Override
        public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

        }

        @Override
        public void afterTextChanged(Editable editable) {
            if (mRootView != null) {
                reRender(mRootView);
            }
        }
    };

    private static JSONObject serialize(View view) throws JSONException {
        final JSONObject object = new JSONObject();

        UUID uuid = UUID.randomUUID();
        IDs.put(uuid, view.getId());
        object.put("id", uuid.toString());

        if (view instanceof ListView) {
            object.put("type", "list");

            ListView listView = (ListView) view;
            getViewGroupProps(listView, object);
        } else if (view instanceof ViewGroup) {
            object.put("type", "group");

            ViewGroup viewGroup = (ViewGroup) view;
            getViewGroupProps(viewGroup, object);
        } else if (view instanceof Button) {
            Button button = (Button) view;

            object.put("type", "button");
            getTextViewProps(button, object);
        } else if (view instanceof EditText) {
            EditText editText = (EditText) view;

            object.put("type", "input");
            object.put("hint", editText.getHint());
            getTextViewProps(editText, object);

            editText.removeTextChangedListener(watcher);
            editText.addTextChangedListener(watcher);
        } else if (view instanceof TextView) {
            TextView textView = (TextView) view;

            object.put("type", "text");
            getTextViewProps(textView, object);
        } else {
            object.put("type", "unknown");
        }

        putLocationAndSize(view, object);
        return object;
    }

    public static void reRender(final View rootView) {
        IDs = new HashMap<>();

        if (loaded) {
            try {
                JSONObject object = serialize(rootView);
                Log.d(TAG, "plug: " + object.toString());

                if (mSocket != null && mSocket.connected()) {
                    mSocket.emit("reRender", object);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            ViewTreeObserver observer = rootView.getViewTreeObserver();
            if (observer.isAlive()) {
                observer.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                    @Override
                    public void onGlobalLayout() {
                        rootView.getViewTreeObserver().removeOnGlobalLayoutListener(this);

                        try {
                            JSONObject object = serialize(rootView);
                            Log.d(TAG, "plug: " + object.toString());

                            if (mSocket != null && mSocket.connected()) {
                                mSocket.emit("reRender", object);
                            }

                            loaded = true;
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        }
    }

    public static void plug(Activity activity, View rootView) {
        preferences = activity.getPreferences(Context.MODE_PRIVATE);
        if (preferences.contains("uuid")) {
            mUUID = preferences.getString("uuid", null);
        }

        mRootView = rootView;
        reRender(rootView);
    }

    public static void unplug(Activity activity) {
        loaded = false;
        mRootView = null;
    }

    public static boolean initiateMenu(Activity activity, Menu menu) {
        MenuInflater inflater = activity.getMenuInflater();
        inflater.inflate(R.menu.pluggable_menu, menu);
        mMenu = menu;

        if (mUUID != null) {
            mMenu.getItem(0).setVisible(false);
            mMenu.getItem(1).setVisible(true);
            mMenu.getItem(2).setVisible(false);
        }
        return true;
    }

    public static boolean menuItemSelected(Activity activity, MenuItem item) {
        switch (item.getItemId()) {
            case R.id.createIssue:
                IssueDialog dialog = new IssueDialog();
                dialog.setCallbacks(new IssueDialog.IssueDialogCallbacks() {
                    @Override
                    public void onPositiveButtonClicked(String name, String issue) {
                        JSONObject data = new JSONObject();

                        try {
                            mSocket = IO.socket(URL).connect();
                            mSocket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
                                @Override
                                public void call(Object... args) {
                                }
                            });
                            mSocket.on(Socket.EVENT_CONNECT_ERROR, new Emitter.Listener() {
                                @Override
                                public void call(Object... args) {
                                }
                            });

                            UUID uuid = UUID.randomUUID();

                            data.put("uuid", uuid.toString());
                            data.put("name", name);
                            data.put("problem", issue);

                            SharedPreferences.Editor editor = preferences.edit();
                            editor.putString("uuid", uuid.toString());
                            editor.apply();

                            mUUID = uuid.toString();

                            mSocket.emit("createIssue", data);

                            mMenu.getItem(0).setVisible(false);
                            mMenu.getItem(1).setVisible(true);
                            mMenu.getItem(2).setVisible(false);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        } catch (URISyntaxException e) {
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onNegativeButtonClicked() {

                    }
                });

                dialog.show(activity.getFragmentManager(), "IssueDialog");
                return true;
            case R.id.startConnection:
                JSONObject data = new JSONObject();

                try {
                    data.put("uuid", mUUID);

                    mSocket.emit("createSession", data);
                    connected = true;

                    mMenu.getItem(0).setVisible(false);
                    mMenu.getItem(1).setVisible(false);
                    mMenu.getItem(2).setVisible(true);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                return true;
            case R.id.endConnection:
                JSONObject endData = new JSONObject();

                try {
                    endData.put("uuid", mUUID);

                    mSocket.emit("endSession", endData);
                    connected = false;

                    mSocket.disconnect();

                    mMenu.getItem(0).setVisible(true);
                    mMenu.getItem(1).setVisible(false);
                    mMenu.getItem(2).setVisible(false);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                return true;
            default:
                return false;
        }
    }
}
