import {
  FormControl,
  Input,
  FormLabel,
  Button,
  InputRightElement,
  InputGroup,
  VStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Store } from "../../store";
import { getError } from "../../utils";

function Signup() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { dispatch: ctxDispatch } = useContext(Store);

  const postDetails = async (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast.warning("Please select an Image!");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      try {
        const dataa = new FormData();
        dataa.append("file", pics);
        dataa.append("upload_preset", "chat-app");
        dataa.append("cloud_name", "dybliglrj");
        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/dybliglrj/image/upload",
          dataa
        );
        setPic(data.url.toString());
        setLoading(false);
      } catch (err) {
        toast.warning("Please select an Image");
        setLoading(false);
      }
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/signup", {
        name,
        email,
        password,
        pic,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      ctxDispatch({ action: "SET_USER", payload: data });
      setLoading(false);
      navigate("/chat");
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Full Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Email"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Enter password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        onClick={submitHandler}
        isLoading={loading}
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup;
