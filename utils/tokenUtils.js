// A JSON Web Token (JWT) is a compact and secure way of transmitting data between parties. It is often used to authenticate and 
// authorize users in web applications and APIs. JWTs contain information about the user and additional metadata, and can be used
// to securely transmit this information.

// payload is the data that we want to send in the token.

import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};


export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};