const socket_io = require("socket.io");

var io;

function connect(server) {
    io = socket_io(server);
    module.exports.io = io;
}

async function emit(message, data) {
    if (!io) return;
    for (let socket_id in io.sockets.sockets) {
        io.sockets.sockets[socket_id].emit(message, data);
    }
}

module.exports.connect = connect;
module.exports.emit = emit;
