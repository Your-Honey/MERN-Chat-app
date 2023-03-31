import express from "express";
import isAuth from "../middleware/authMiddleware.js";
import {
  fetchNotification,
  addFirendRequestNotification,
  accpetFirendRequest,
  rejectFirendRequest,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", isAuth, fetchNotification);
router.post("/", isAuth, addFirendRequestNotification);
router.put("/:notificationId", isAuth, accpetFirendRequest);
router.delete("/:notificationId", isAuth, rejectFirendRequest);

export default router;
