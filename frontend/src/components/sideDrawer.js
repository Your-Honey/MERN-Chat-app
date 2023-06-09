import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import { Store } from "../store";
import ProfileModal from "./profileModal";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "../components/chatLoading";
import { getError } from "../utils";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import Notification from "./notification";
import SearchListItem from "./searchList";

function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    state: { user, chats, notification },
    dispatch: ctxDispatch,
  } = useContext(Store);

  const logoutHandle = () => {
    ctxDispatch({ type: "LOGOUT" });
    localStorage.removeItem("userInfo");
  };

  const searchHandler = async () => {
    if (!search) {
      setSearchResult([]);
      toast.error("Please enter something");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/user/searchWithRequest?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchRequestNotification = async () => {
      try {
        const { data } = await axios.get("/api/notification/", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        ctxDispatch({ type: "SET_NOTIFICATION", payload: data });
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchRequestNotification();
  }, [ctxDispatch, user.token]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={
                  notification && notification.length ? notification.length : 0
                }
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {notification && notification.length > 0 ? (
              <MenuList>
                <Notification notification={notification} />
              </MenuList>
            ) : null}
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandle}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                mr={2}
              />
              <Button onClick={searchHandler}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <SearchListItem
                  key={user._id}
                  searchUser={user}
                  onClose={onClose}
                  setLoadingChat={setLoadingChat}
                  searchHandler={searchHandler}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
