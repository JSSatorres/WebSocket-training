import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express.default();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection',(socket)=>{
  console.log(`user connected ${socket.id}`);

  socket.on('send_message',(data)=>{
    console.log(data);
    socket.broadcast.emit('receive_message',data);
  })
})

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
