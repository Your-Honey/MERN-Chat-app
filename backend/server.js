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
  },
});
