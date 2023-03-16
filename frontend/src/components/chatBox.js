import { useContext } from "react";
import { Store } from "../store";
import { Box } from "@chakra-ui/react";
import SingleChat from "./singleChat";

function ChatBox() {
  const { state } = useContext(Store);
  const { selectedChat } = state;
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat />
    </Box>
  );
}

export default ChatBox;
