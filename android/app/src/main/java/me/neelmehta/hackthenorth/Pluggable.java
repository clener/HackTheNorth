package me.neelmehta.hackthenorth;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by neel on 2017-09-16 at 3:08 AM.
 */

public class Pluggable {
    private static final String TAG = "Pluggable";

    private static void putLocationAndSize(final View view, final JSONObject object, final DimenCallbacks callbacks) throws JSONException {
        int[] outLocation = new int[2];
        view.getLocationOnScreen(outLocation);

        object.put("x", outLocation[0]);
        object.put("y", outLocation[1]);

        ViewTreeObserver observer = view.getViewTreeObserver();
        if (observer.isAlive()) {
            observer.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                @Override
                public void onGlobalLayout() {
                    view.getViewTreeObserver().removeOnGlobalLayoutListener(this);

                    try {
                        object.put("height", view.getHeight());
                        object.put("width", view.getWidth());
                        callbacks.onDimen();
                    } catch (JSONException e) {
                        e.printStackTrace();
                        callbacks.onDimen();
                    }
                }
            });
        } else {
            callbacks.onDimen();
        }
    }

    private static String getGravity(View view) {}

    private static void serialize(View view, final SerializerCallbacks callbacks) throws JSONException {
        final JSONObject object = new JSONObject();

        if (view instanceof ViewGroup) {
            object.put("type", "group");

            ViewGroup viewGroup = (ViewGroup) view;
            final JSONArray array = new JSONArray();
            for (int i = 0; i < viewGroup.getChildCount(); i++) {
                serialize(viewGroup.getChildAt(i), new SerializerCallbacks() {
                    @Override
                    public void onSerialized(JSONObject object) {
                        array.put(object);
                    }
                });
            }

            object.put("elements", array);
        } else if (view instanceof Button) {
            Button button = (Button) view;

            object.put("type", "button");
            object.put("text", button.getText());
        } else if (view instanceof EditText) {
            EditText editText = (EditText) view;

            object.put("type", "input");
            object.put("text", editText.getText());
            object.put("hint", editText.getHint());
        } else if (view instanceof TextView) {
            object.put("type", "text");
        } else {
            object.put("type", "unknown");
        }

        putLocationAndSize(view, object, new DimenCallbacks() {
            @Override
            public void onDimen() {
                callbacks.onSerialized(object);
            }
        });
    }

    public static void plug(View rootView) {
        try {
            serialize(rootView, new SerializerCallbacks() {
                @Override
                public void onSerialized(JSONObject object) {
                    Log.d(TAG, "plug: " + object.toString());
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private interface DimenCallbacks {
        void onDimen();
    }

    private interface SerializerCallbacks {
        void onSerialized(JSONObject object);
    }
}
