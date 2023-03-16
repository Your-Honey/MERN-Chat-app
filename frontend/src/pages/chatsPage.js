import { Box } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/chatBox";
import MyChats from "../components/myChats";
import SideDrawer from "../components/sideDrawer";
import { Store } from "../store";

function ChatPage() {
  const { state } = useContext(Store);
  const { user } = state;
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default ChatPage;
