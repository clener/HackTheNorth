package me.neelmehta.hackthenorth;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import me.neelmehta.hackthenorth.pluggable.Pluggable;

public class MainActivity extends Activity {
    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String values[] = {"This", "list", "took", "a", "long", "time", "to", "come", "up", "with.", "Like", "it", "is", "a", "very", "long", "list.", "Very", "long."};
        ListView list = findViewById(R.id.listView);
        list.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, android.R.id.text1, values));

        findViewById(R.id.mainButton).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ((TextView) findViewById(R.id.mainText))
                        .setText(((EditText) findViewById(R.id.mainEditText)).getText().toString());
            }
        });

        findViewById(R.id.secondaryButton).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MainActivity.this, SecondActivity.class);
                startActivity(intent);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();

        Pluggable.plug(this, findViewById(R.id.root_view));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return Pluggable.initiateMenu(this, menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        return Pluggable.menuItemSelected(this, item) || super.onOptionsItemSelected(item);
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        boolean val = super.dispatchTouchEvent(ev);
        Pluggable.reRender(findViewById(R.id.root_view));
        return val;
    }

    @Override
    protected void onPause() {
        super.onPause();

        Pluggable.unplug(this);
    }
}
