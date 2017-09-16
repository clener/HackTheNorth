package me.neelmehta.hackthenorth;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
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

/**
 * Created by neel on 2017-09-16 at 3:08 AM.
 */

public class Pluggable {
    private static final String URL = "http://34.229.167.116:3000/";
    private static final String TAG = "Pluggable";
    private static Map<UUID, Integer> IDs = new HashMap<>();

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

    private static void getTextViewProps(TextView view, JSONObject object) throws JSONException {
        object.put("text", view.getText());
        object.put("textSize", view.getTextSize());
        object.put("textColor", getCSSColor(view.getCurrentTextColor()));

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
    }

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

    public static void plug(final View rootView) {
        ViewTreeObserver observer = rootView.getViewTreeObserver();
        if (observer.isAlive()) {
            observer.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                @Override
                public void onGlobalLayout() {
                    rootView.getViewTreeObserver().removeOnGlobalLayoutListener(this);

                    try {
                        JSONObject object = serialize(rootView);
                        Log.d(TAG, "plug: " + object.toString());

                        mSocket = IO.socket(URL);
                        mSocket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
                            @Override
                            public void call(Object... args) {
                                Log.d(TAG, "call: Socket is connected.");
                            }
                        });
                        mSocket.on(Socket.EVENT_CONNECT_ERROR, new Emitter.Listener() {
                            @Override
                            public void call(Object... args) {
                                Log.d(TAG, "call: Socket connection failed.");
                            }
                        });
                        mSocket.connect();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }

    public static boolean initiateMenu(Activity activity, Menu menu) {
        MenuInflater inflater = activity.getMenuInflater();
        inflater.inflate(R.menu.pluggable_menu, menu);
        return true;
    }

    public static boolean menuItemSelected(Activity activity, MenuItem item) {
        switch (item.getItemId()) {
            case R.id.createIssue:
                return true;
            case R.id.startConnection:
                return true;
            case R.id.endConnection:
                return true;
            default:
                return false;
        }
    }
}
