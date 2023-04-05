import { Button, MenuItem } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Store } from "../store";
import { getError } from "../utils";

function Notification({ notification }) {
  const [loading, setLoading] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user, chats } = state;

  const rejectRequest = async (request) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/notification/${request._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setLoading(false);
      ctxDispatch({ type: "DELETE_NOTIFICATION", payload: request });
      toast.success(data);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };
  const acceptRequest = async (request) => {
    try {
      const { data } = await axios.put(
        `/api/notification/${request._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      ctxDispatch({ type: "DELETE_NOTIFICATION", payload: request });
      ctxDispatch({ type: "SET_CHATS", payload: [data, ...chats] });
      ctxDispatch({ type: "SET_SELECTED_CHAT", payload: data });
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <>
      {notification.map((singleNotification) =>
        singleNotification.type ? (
          <MenuItem key={singleNotification._id}>
            Request from {singleNotification.sender.name}
            <Button
              colorScheme="teal"
              size="xs"
              variant="ghost"
              onClick={() => acceptRequest(singleNotification)}
            >
              Accept
            </Button>
            <Button
              isLoading={loading}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={() => rejectRequest(singleNotification)}
            >
              Reject
            </Button>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              ctxDispatch({
                type: "DELETE_NOTIFICATION",
                payload: singleNotification,
              });
              ctxDispatch({
                type: "SET_SELECTED_CHAT",
                payload: singleNotification.chat,
              });
            }}
            key={singleNotification._id}
          >
            New Message from {singleNotification.sender.name}
          </MenuItem>
        )
      )}
    </>
  );
}

export default Notification;
