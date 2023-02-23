const express = require('express');
const cors = require('cors');
const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 5000;
app.use(cors());

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
})

io.on('connection', socket => {
    socket.emit("me", socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit("callended")
    })

    socket.on("calluser", ({ usertoCall, signalData, from, name }) => {
        io.to(usertoCall).emit("calluser", { signal: signalData, from, name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    })

})



server.listen(PORT, () => {
    console.log("Backend server is running");
})               