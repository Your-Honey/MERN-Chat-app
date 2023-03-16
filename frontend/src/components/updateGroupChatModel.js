import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Store } from "../store";
import { getError } from "../utils";
import UserBadgeItem from "./userBadgeItem";
import UserListItem from "./userListItem";
import axios from "axios";
import { toast } from "react-toastify";

function UpdateGroupChatModel() {
  const [updateName, setUpdateName] = useState("");
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    state: { user, selectedChat },
    dispatch: ctxDispatch,
  } = useContext(Store);

  const updateHandler = async () => {
    try {
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatName: updateName,
          chatId: selectedChat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      ctxDispatch({ type: "SET_SELECTED_CHAT", payload: data });
      ctxDispatch({ type: "SET_FETCH_CHAT" });
      toast.success("Group name update Successfull");
      onClose();
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const searchHandler = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchList([]);
      return;
    }
    try {
      console.log(query);

      const { data } = await axios.get(`api/user?search=${query}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setSearchList(data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleAdd = async (userToAdd) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admin add to Group");
      return;
    }
    if (selectedChat.users.find((user) => user._id === userToAdd._id)) {
      toast.error("User already in Group");
      return;
    }
    try {
      const { data } = await axios.put(
        "api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      ctxDispatch({ type: "SET_SELECTED_CHAT", payload: data });
      ctxDispatch({ type: "SET_FETCH_CHAT" });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admin can remove from Group");
      return;
    }
    try {
      const { data } = await axios.put(
        "api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      ctxDispatch({
        type: "SET_SELECTED_CHAT",
        payload: user._id === userToRemove._id ? null : data,
      });
      ctxDispatch({ type: "SET_FETCH_CHAT" });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.put(
        "api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      ctxDispatch({ type: "SET_SELECTED_CHAT", payload: null });
      ctxDispatch({ type: "SET_FETCH_CHAT" });
      toast.success("Group left...!!!");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal size="md" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="20px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex" p="">
              <Input
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
                placeholder="New Group Name"
                mb={3}
              />
              <Button onClick={updateHandler} colorScheme="green" ml={3}>
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                value={search}
                onChange={(e) => searchHandler(e.target.value)}
                placeholder="Add new Member"
                mb={1}
              />
            </FormControl>
            {searchList?.slice(0, 4).map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAdd(user)}
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleLeaveGroup} colorScheme="red" mr={3}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModel;
