import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";
import Chat from "../models/chatModel.js";

const fetchNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const notification = await Notification.find({
      receiver: userId,
    })
      .populate("sender", "-password")
      .populate("receiver", "-password");

    res.status(200).send(notification);
    Chat;
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addFirendRequestNotification = asyncHandler(async (req, res) => {
  const sender = req.user._id;
  const receiver = req.body.receiver;
  try {
    const groupChat = await Notification.create({
      sender,
      receiver,
      type: "friend-request",
    });
    res.status(200).json("Request Send");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const accpetFirendRequest = asyncHandler(async (req, res) => {
  const notificationId = req.params.notificationId;
  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(400).send("Not Found");
    }
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [notification.sender, notification.receiver],
    });
    const chat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );
    await Notification.deleteOne({ _id: notificationId });
    res.status(200).send(chat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const rejectFirendRequest = asyncHandler(async (req, res) => {
  const notificationId = req.params.notificationId;
  try {
    await Notification.deleteOne({ _id: notificationId });
    res.status(200).send("Request Rejected");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export {
  fetchNotification,
  addFirendRequestNotification,
  accpetFirendRequest,
  rejectFirendRequest,
};
