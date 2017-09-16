package me.neelmehta.hackthenorth;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class MainActivity extends Activity {
    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String values[] = {"This", "list", "took", "a", "long", "time", "to", "come", "up", "with"};
        ListView list = findViewById(R.id.listView);
        list.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, android.R.id.text1, values));

        Pluggable.plug(findViewById(R.id.root_view));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return Pluggable.initiateMenu(this, menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (Pluggable.menuItemSelected(this, item)) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
