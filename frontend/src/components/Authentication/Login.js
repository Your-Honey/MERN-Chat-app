import {
  FormControl,
  Input,
  FormLabel,
  Button,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../../store";
import { getError } from "../../utils";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch: ctxDispatch } = useContext(Store);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
    } else {
      setLoading(true);
      try {
        const { data } = await axios.post("/api/user/login", {
          email,
          password,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        ctxDispatch({ type: "SET_USER", payload: data });
        console.log(data);
        setLoading(false);
        navigate("/chat");
      } catch (err) {
        toast.error(getError(err));
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <FormControl isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        isLoading={loading}
        onClick={handleSubmit}
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
