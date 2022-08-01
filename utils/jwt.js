require("dotenv").config();
const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
    console.log("payload: ", payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  console.log("token: ", token);
  return token;
};

const isTokenValid = (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken; 
};

module.exports = {
  createJWT,
  isTokenValid,
};
