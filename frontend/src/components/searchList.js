import { Avatar, Box, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { Store } from "../store";
import { getError } from "../utils";

function SearchListItem({
  searchUser,
  onClose,
  setLoadingChat,
  searchHandler,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user, chats, notification } = state;

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        "/api/chat/",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!chats.find((chat) => chat._id === data._id)) {
        ctxDispatch({ type: "SET_CHATS", payload: [data, ...chats] });
      }
      ctxDispatch({ type: "SET_SELECTED_CHAT", payload: data });
      onClose();
      setLoadingChat(false);
    } catch (err) {
      setLoadingChat(false);
      toast.error(err.message);
    }
  };

  const sendRequest = async (userId) => {
    try {
      const { data } = await axios.post(
        "/api/notification/",
        {
          receiver: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success(data);
      searchHandler();
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const acceptRequest = async (userId) => {
    const request = notification.find((noti) => noti?.sender._id === userId);
    if (!request) {
      toast.warning("Refresh Page");
      return;
    }
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
      onClose();
      searchHandler();
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const rejectRequest = async (userId) => {
    const request = notification.find((noti) => noti?.sender._id === userId);
    if (!request) {
      toast.warning("Refresh Page");
      return;
    }
    try {
      const { data } = await axios.delete(`/api/notification/${request._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      ctxDispatch({ type: "DELETE_NOTIFICATION", payload: request });
      searchHandler();
      toast.success(data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const cancelRequest = async (userId) => {
    try {
      const { data } = await axios.delete(
        `/api/notification/cancelrequest/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success(data);
      searchHandler();
    } catch (err) {
      console.log(err);
      toast.error(getError(err));
    }
  };
  return (
    <Box
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={searchUser.name}
        src={searchUser.pic}
      />
      <Box flex="1">
        <Text>{searchUser.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {searchUser.email}
        </Text>
      </Box>
      <Box>
        {searchUser.relation === "Accept/Reject" ? (
          <Box display="flex">
            <Button
              size="xs"
              colorScheme="teal"
              variant="ghost"
              onClick={() => acceptRequest(searchUser._id)}
            >
              Accept
            </Button>
            <Button
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={() => rejectRequest(searchUser._id)}
            >
              Reject
            </Button>
          </Box>
        ) : (
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              searchUser.relation === "Add"
                ? sendRequest(searchUser._id)
                : searchUser.relation === "Cancel"
                ? cancelRequest(searchUser._id)
                : accessChat(searchUser._id)
            }
          >
            {searchUser.relation}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default SearchListItem;
