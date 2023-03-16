import express from "express";
import {
  registerUser,
  authUser,
  searchUser,
} from "../controllers/userController.js";
import isAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuth, searchUser);
router.post("/signup", registerUser);
router.post("/login", authUser);

export default router;
