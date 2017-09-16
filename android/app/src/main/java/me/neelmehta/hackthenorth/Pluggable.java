package me.neelmehta.hackthenorth;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
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

    private static void putLocationAndSize(View view, JSONObject object) throws JSONException {
        int[] outLocation = new int[2];
        view.getLocationOnScreen(outLocation);

        object.put("x", outLocation[0]);
        object.put("y", outLocation[1]);

        object.put("height", view.getHeight());
        object.put("width", view.getWidth());
    }

    private static JSONObject serialize(View view) throws JSONException {
        JSONObject object = new JSONObject();

        if (view instanceof ViewGroup) {
            object.put("type", "group");

            ViewGroup viewGroup = (ViewGroup) view;
            JSONArray array = new JSONArray();
            for (int i = 0; i < viewGroup.getChildCount(); i++) {
                JSONObject child = serialize(viewGroup.getChildAt(i));
                array.put(child);
            }

            object.put("elements", array);
        } else if (view instanceof Button) {
            object.put("type", "button");
        } else if (view instanceof EditText) {
            object.put("type", "input");
        } else if (view instanceof TextView) {
            object.put("type", "text");
        } else {
            object.put("type", "unknown");
        }

        putLocationAndSize(view, object);
        return object;
    }

    public static void plug(View rootView) {
        try {
            JSONObject object = serialize(rootView);
            Log.d(TAG, "plug: " + object.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
