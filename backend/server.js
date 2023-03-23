import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import chatRouter from "./routes/chatRouter.js";
import messageRouter from "./routes/messageRouter.js";
import { Server } from "socket.io";
const app = express();

//To use form body has json object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://0.0.0.0:27017/mern-chat-app")
  .then(() => {
    console.log("connected to MongoDb");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000, () => {
  console.log("server started at port 5000");
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket .io");

  socket.on("Join room", (room) => {
    socket.join(room._id);
    console.log("user Joined room ", room._id);
  });

  socket.on("User Join", (user) => {
    socket.join(user._id);
  });

  socket.on("New message", ({ data }) => {
    data.chat.users.forEach((user) => {
      if (user._id !== data.sender._id) {
        socket.to(user._id).emit("Receive message", data);
      }
    });
  });

  socket.on("typing", (room) => {
    socket.to(room._id).emit("typing", room);
  });
  socket.on("Stop typing", (room) => {
    socket.to(room._id).emit("Stop typing");
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
