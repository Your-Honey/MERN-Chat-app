import express from "express";
import isAuth from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:chatId", isAuth, allMessages);
router.post("/", isAuth, sendMessage);

export default router;
