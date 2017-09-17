package me.neelmehta.hackthenorth.pluggable;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by neel on 2017-09-17 at 2:36 AM.
 */

class SocketSingleton {
    private static final String URL = "http://34.229.167.116:3000/";
    private static final SocketSingleton ourInstance = new SocketSingleton();

    static SocketSingleton getInstance() {
        return ourInstance;
    }

    private Socket socket;

    private SocketSingleton() {
        try {
            this.socket = IO.socket(URL).connect();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    void on(String event, Emitter.Listener listener) {
        this.socket.on(event, listener);
    }

    void emit(String emit, Object... objects) {
        this.socket.emit(emit, objects);
    }
}
