package me.neelmehta.hackthenorth.pluggable;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;

import me.neelmehta.hackthenorth.R;

/**
 * Created by neel on 2017-09-16 at 3:08 PM.
 */

public class IssueDialog extends DialogFragment {
    IssueDialogCallbacks mCallbacks = null;

    public void setCallbacks(IssueDialogCallbacks callbacks) {
        this.mCallbacks = callbacks;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();

        final View view = inflater.inflate(R.layout.dialog_issue, null);

        builder.setView(view).setPositiveButton(R.string.create_issue, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                if (mCallbacks != null) {
                    EditText name = view.findViewById(R.id.issueName);
                    EditText issue = view.findViewById(R.id.issueDetails);

                    mCallbacks.onPositiveButtonClicked(name.getText().toString(), issue.getText().toString());
                }
                dialogInterface.cancel();
            }
        }).setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                if (mCallbacks != null) {
                    mCallbacks.onNegativeButtonClicked();
                }
                dialogInterface.cancel();
            }
        }).setTitle(R.string.issue_title).setCancelable(false);

        return builder.create();
    }

    public interface IssueDialogCallbacks {
        void onPositiveButtonClicked(String name, String issue);

        void onNegativeButtonClicked();
    }
}
