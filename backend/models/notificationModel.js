import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["friend-request", "message"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
