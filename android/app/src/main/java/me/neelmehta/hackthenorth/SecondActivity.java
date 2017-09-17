package me.neelmehta.hackthenorth;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;

import me.neelmehta.hackthenorth.pluggable.Pluggable;

public class SecondActivity extends Activity implements Pluggable.PluggableCallbacks {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);

        findViewById(R.id.takeBack).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(SecondActivity.this, MainActivity.class);
                startActivity(intent);
            }
        });

        findViewById(R.id.makeRed).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                findViewById(R.id.takeBack).setBackground(new ColorDrawable(Color.RED));
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        Pluggable.plug(this);
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        boolean val = super.dispatchTouchEvent(ev);
        Pluggable.reRender();
        return val;
    }

    @Override
    protected void onPause() {
        super.onPause();

        Pluggable.unplug();
    }

    @Override
    public Activity getActivity() {
        return this;
    }

    @Override
    public View getRootView() {
        return findViewById(R.id.secondRoot);
    }
}
