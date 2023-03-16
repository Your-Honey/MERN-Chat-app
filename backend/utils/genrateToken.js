import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, "this secret should be in env file", {
    expiresIn: "30d",
  });
};

export default generateToken;
