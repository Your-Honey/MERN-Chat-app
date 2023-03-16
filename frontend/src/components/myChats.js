import { useContext, useEffect } from "react";
import { Store } from "../store";

import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./chatLoading";
import { Button } from "@chakra-ui/react";
import { toast } from "react-toastify";
import GroupChatModel from "./groupChatModel";

function MyChats() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user, chats, selectedChat, fetchChatAgain } = state;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get("/api/chat", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        ctxDispatch({ type: "SET_CHATS", payload: data });
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchChats();
  }, [ctxDispatch, user.token, fetchChatAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() =>
                  ctxDispatch({ type: "SET_SELECTED_CHAT", payload: chat })
                }
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
