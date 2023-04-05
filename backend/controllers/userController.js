import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/genrateToken.js";
import Chat from "../models/chatModel.js";
import Notification from "../models/notificationModel.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the feilds");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password),
    pic,
  });
  if (user) {
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(400);
    throw new Error("Wrong email or password");
  }
});

const searchUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const searchWithRequest = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .lean();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(Object.keys(user));

    const isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: user._id } } },
        { users: { $elemMatch: { $eq: senderId } } },
      ],
    });

    if (isChat.length > 0) {
      user.relation = "Chat";
      continue;
    }

    const pendingRequest = await Notification.find({
      receiver: user._id,
      sender: senderId,
    });
    if (pendingRequest.length > 0) {
      user.relation = "Cancel";
      continue;
    }

    const recivedRequest = await Notification.find({
      receiver: senderId,
      sender: user._id,
    });
    if (recivedRequest.length > 0) {
      user.relation = "Accept/Reject";
      continue;
    }

    user.relation = "Add";
  }

  res.send(users);
});

export { registerUser, authUser, searchUser, searchWithRequest };
