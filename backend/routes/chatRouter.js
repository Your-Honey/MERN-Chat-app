import isAuth from "../middleware/authMiddleware.js";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} from "../controllers/chatController.js";
import express from "express";

const router = express.Router();

router.post("/", isAuth, accessChat);
router.get("/", isAuth, fetchChats);
router.route("/group").post(isAuth, createGroupChat);
router.route("/rename").put(isAuth, renameGroup);
router.route("/groupremove").put(isAuth, removeFromGroup);
router.route("/groupadd").put(isAuth, addToGroup);

export default router;
