import jwt from "jsonwebtoken";
import { readDBAsync } from "./db/db";

export const signToken = (payload) => jwt.sign(payload, "digitalcollege");

export const verifyToken = (access_token) => {
  const decoded = jwt.verify(access_token, "digitalcollege");
  return decoded;
};

export const userAlreadyExists = async ({ email }) => {
  try {
    const db = await readDBAsync();
    return db.users.findIndex((user) => user.email === email) !== -1;
  } catch (_) {
    return false;
  }
};
