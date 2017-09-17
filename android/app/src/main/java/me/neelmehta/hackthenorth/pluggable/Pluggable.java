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

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import io.socket.emitter.Emitter;
import me.neelmehta.hackthenorth.R;

/**
 * Created by neel on 2017-09-16 at 3:08 AM.
 */

public class Pluggable {
    private static final String TAG = "Pluggable";
    private static Map<String, Integer> IDs = null;
    private static Menu mMenu = null;
    private static SharedPreferences preferences = null;
    private static String mUUID = null;
    private static boolean loaded = false;
    private static PluggableCallbacks mCallbacks = null;

    private static SocketSingleton mSocket;

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
            reRender();
        }
    };

    private static JSONObject serialize(View view) throws JSONException {
        final JSONObject object = new JSONObject();

        UUID uuid = UUID.randomUUID();
        IDs.put(uuid.toString(), view.getId());
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

    public static void reRender() {
        IDs = new HashMap<>();

        if (loaded) {
            try {
                JSONObject object = serialize(mCallbacks.getRootView());

                if (mSocket != null) {
                    mSocket.emit("reRender", object, mUUID);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            ViewTreeObserver observer = mCallbacks.getRootView().getViewTreeObserver();
            if (observer.isAlive()) {
                observer.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                    @Override
                    public void onGlobalLayout() {
                        mCallbacks.getRootView().getViewTreeObserver().removeOnGlobalLayoutListener(this);

                        try {
                            JSONObject object = serialize(mCallbacks.getRootView());

                            if (mSocket != null) {
                                mSocket.emit("reRender", object, mUUID);
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

    private static void runSocketEvents() {
        if (mSocket != null) {
            mSocket.on("myEvent", new Emitter.Listener() {
                @Override
                public void call(final Object... args) {
                    Log.d(TAG, "tihngs, excitement");
                    mCallbacks.getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Log.d(TAG, "run: I here");
                            JSONObject data = (JSONObject) args[0];

                            String type = data.optString("type", "click");
                            String id = data.optString("id", null);

                            if (id != null && IDs.containsKey(id)) {
                                switch (type) {
                                    case "move":
                                        ListView listView = mCallbacks.getRootView().findViewById(IDs.get(id));
                                        //listView.
                                        break;
                                    case "text":
                                        EditText editText = mCallbacks.getRootView().findViewById(IDs.get(id));
                                        editText.removeTextChangedListener(watcher);
                                        editText.setTextKeepState(data.optString("text", editText.getText().toString()));
                                        editText.addTextChangedListener(watcher);
                                        break;
                                    default:
                                        View view = mCallbacks.getRootView().findViewById(IDs.get(id));
                                        view.performClick();
                                        reRender();
                                }
                            }

                        }
                    });
                }
            });
        }
    }

    public static void plug(PluggableCallbacks callbacks) {
        preferences = callbacks.getActivity().getPreferences(Context.MODE_PRIVATE);
        if (preferences.contains("uuid")) {
            mUUID = preferences.getString("uuid", null);
        }

        mSocket = SocketSingleton.getInstance();
        mCallbacks = callbacks;

        reRender();
        runSocketEvents();
    }

    public static void unplug() {
        loaded = false;

        mCallbacks = null;
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
                        }
                    }

                    @Override
                    public void onNegativeButtonClicked() {

                    }
                });

                dialog.show(activity.getFragmentManager(), "IssueDialog");
                return true;
            case R.id.startConnection:
                if (mSocket != null) {
                    mSocket.emit("createSession", mUUID);

                    mMenu.getItem(0).setVisible(false);
                    mMenu.getItem(1).setVisible(false);
                    mMenu.getItem(2).setVisible(true);
                }

                return true;
            case R.id.endConnection:
                mSocket.emit("endSession", mUUID);

                mMenu.getItem(0).setVisible(true);
                mMenu.getItem(1).setVisible(false);
                mMenu.getItem(2).setVisible(false);

                return true;
            default:
                return false;
        }
    }

    public interface PluggableCallbacks {
        Activity getActivity();
        View getRootView();
    }
}
