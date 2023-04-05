import express from "express";
import isAuth from "../middleware/authMiddleware.js";
import {
  fetchNotification,
  addFirendRequestNotification,
  accpetFirendRequest,
  rejectFirendRequest,
  cancelFriendRequest,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", isAuth, fetchNotification);
router.post("/", isAuth, addFirendRequestNotification);
router.put("/:notificationId", isAuth, accpetFirendRequest);
router.delete("/:notificationId", isAuth, rejectFirendRequest);
router.delete("/cancelrequest/:Id", isAuth, cancelFriendRequest);

export default router;
