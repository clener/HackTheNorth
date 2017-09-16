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

    private static void putLocationAndSize(final View view, final JSONObject object) throws JSONException {
        int[] outLocation = new int[2];
        view.getLocationOnScreen(outLocation);

        object.put("x", outLocation[0]);
        object.put("y", outLocation[1]);

        object.put("height", view.getHeight());
        object.put("width", view.getWidth());
    }

    private static JSONObject serialize(View view) throws JSONException {
        final JSONObject object = new JSONObject();

        if (view instanceof ViewGroup) {
            object.put("type", "group");

            ViewGroup viewGroup = (ViewGroup) view;
            final JSONArray array = new JSONArray();
            for (int i = 0; i < viewGroup.getChildCount(); i++) {
                JSONObject child = serialize(viewGroup.getChildAt(i));
                array.put(child);
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
            TextView textView = (TextView) view;

            object.put("type", "text");
            object.put("text", textView.getText());
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
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }
}
