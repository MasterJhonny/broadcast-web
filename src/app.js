const { Socket } = require('dgram');
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const { appConfig } = require('./config');

// connect socket io
const io = require('socket.io')(http);

// router
app.use(require('./routes/broadcast'));

// files static
app.use(express.static(path.join(__dirname,'public')));

app.get('/ip', (req, res) => {
    res.json({
        host: appConfig.host
    })
})


io.on('connect', (socket) => {
    socket.on('stream', (image) => {
        // emit stream
        socket.broadcast.emit('stream', image);
    })
})

module.exports = http;