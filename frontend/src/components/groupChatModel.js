import {
  Box,
  Button,
  FormControl,
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
import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Store } from "../store";
import { getError } from "../utils";
import UserBadgeItem from "./userBadgeItem";
import UserListItem from "./userListItem";

function GroupChatModel(props) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [toAdd, setToAdd] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user, chats } = state;

  const searchHandle = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${query}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSearchResult(data);
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleAdd = (user) => {
    if (toAdd.includes(user)) {
      toast.error("user already added");
      return;
    }
    setToAdd([user, ...toAdd]);
  };

  const handleDelete = (user) => {
    setToAdd(toAdd.filter((u) => u._id !== user._id));
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: toAdd,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      ctxDispatch({ type: "SET_CHATS", payload: [data, ...chats] });
      onClose();
      toast.success("Group chat created..!!");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <>
      <span onClick={onOpen}>{props.children}</span>
      <Modal size="md" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="20px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
                mb={3}
              />
            </FormControl>
            <FormControl>
              <Input
                value={search}
                onChange={(e) => searchHandle(e.target.value)}
                placeholder="Altest 3 member"
                mb={1}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {toAdd.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading
              ? "Loading...."
              : searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAdd(user)}
                    />
                  ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue" mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModel;
