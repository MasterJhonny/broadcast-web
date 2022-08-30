const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { appConfig } = require("./src/config")

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = appConfig.port;

app.use(express.static(path.join(__dirname, "src/public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/public"));
})
io.on("connect", socket => {
    console.log(socket.id)

    socket.on("saludo", (saludo) => {
        socket.broadcast.emit("saludo:send", saludo)
    })
    socket.on("stream", (stream) => {
        socket.broadcast.emit("stream", stream)
    })
})

httpServer.listen(port, () => {
    console.log(`http://localhost:${port}`);
});