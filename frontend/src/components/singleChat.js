import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { Store } from "../store";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./profileModal";
import UpdateGroupChatModel from "./updateGroupChatModel";
import axios from "axios";
import { getError } from "../utils";
import { toast } from "react-toastify";
import "./styles.css";
import Lottie from "react-lottie";
import ScrollableChat from "./scrollableChat";
import io from "socket.io-client";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCopy;

function SingleChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user, selectedChat, notification } = state;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCopy = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("User Join", user);
    socket.on("typing", (room) => {
      if (room?._id === selectedChatCopy?._id) {
        setIsTyping(true);
      }
    });

    socket.on("Stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("Receive message", (message) => {
      if (
        !selectedChatCopy?._id ||
        message.chat._id !== selectedChatCopy?._id
      ) {
        if (!notification.includes(message)) {
          ctxDispatch({ type: "SET_NOTIFICATION", payload: message });
          ctxDispatch({ type: "SET_FETCH_CHAT" });
        }
      } else {
        setMessages([...messages, message]);
      }
    });
  }, [socket]);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`api/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessages(data);
      setLoading(false);
      socket.emit("Join room", selectedChatCopy);
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      setNewMessage("");
      try {
        const { data } = await axios.post(
          "api/message/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setMessages([...messages, data]);
        socket.emit("New message", { data, selectedChat });
        socket.emit("Stop typing", selectedChatCopy);
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", selectedChatCopy);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeLimit = 3000;
    const timeout = setTimeout(() => {
      socket.emit("Stop typing", selectedChatCopy);
    }, timeLimit);
    setTypingTimeout(timeout);
  };

  return selectedChat ? (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        {" "}
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() =>
            ctxDispatch({ type: "SET_SELECTED_CHAT", payload: "" })
          }
        />
        {selectedChat.isGroupChat ? (
          <>
            {selectedChat.chatName}
            <UpdateGroupChatModel />
          </>
        ) : (
          <>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
          </>
        )}
      </Text>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
          ></Spinner>
        ) : (
          <div className="messages">
            <ScrollableChat messages={messages}></ScrollableChat>
          </div>
        )}

        <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
          {isTyping ? (
            <div>
              <Lottie
                options={defaultOptions}
                // height={50}
                width={70}
                style={{ marginBottom: 15, marginLeft: 0 }}
              />
            </div>
          ) : (
            <></>
          )}
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message.."
            value={newMessage}
            onChange={typingHandler}
          />
        </FormControl>
      </Box>
    </>
  ) : (
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
      <Text fontSize="3xl" pb={3} fontFamily="Work sans">
        Click on a user to start chatting
      </Text>
    </Box>
  );
}

export default SingleChat;
