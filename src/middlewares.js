import jwt from "jsonwebtoken";
import createError from "http-errors";

import { verifyToken } from "./auth";

export const checkIfIsAutenticated = async (req, res, next) => {
  try {
    if (req.query && req.query.hasOwnProperty("access_token")) {
      req.headers.authorization = `Bearer ${req.query.access_token}`;
    }

    if (req.query && typeof req.headers.authorization === "undefined") {
      req.headers.authorization = `Bearer ${req.cookies.access_token}`;
    }

    const access_token = req.headers.authorization.split(" ")[1];

    console.log("ddd", access_token);

    await verifyToken(access_token);

    next();
  } catch (err) {
    next(createError(401));
  }
};

export const logErrors = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err });
};
