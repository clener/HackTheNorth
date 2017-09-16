var p2p = require('socket.io-p2p');
var io = require('socket.io-client');

var socket = io();
var opts = { numClients: 2 };
var p2p = new p2p(socket, opts, () => {
    p2p.emit('p2pEstablished', "p2p socket ID: " + p2psocket.peerId)
})

p2p.on('reRender', (data) => {
    console.log("JSON object of Android %s", JSON.stringify(data));
});

p2p.on('fetchAll', (data) => {
    console.log("JSON data of DB %s", JSON.stringify(data));
    // update state of table. Claudio idk how to do that.
});

function sendRenderToAndroid(data) {
    console.log("Sending new updated Android view to phone.");
    p2p.emit('reRender', data);
}

function sendFetchRequest() {
    p2p.emit('fetchAll');
}
