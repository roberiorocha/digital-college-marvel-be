import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import cors from "cors"

import { checkIfIsAutenticated, logErrors } from "./middlewares";
import { readDBAsync, writeDBAsync } from "./db/db";

import { userAlreadyExists, signToken } from "./auth";

import { fetchApi } from "./api";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.post("/auth/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await userAlreadyExists({ email });

    if (userExists) {
      throw "Access is denied due to invalid credentials";
    }

    const db = await readDBAsync();
    const lastAddedUser = db.users[db.users.length - 1];
    const id = lastAddedUser ? lastAddedUser.id + 1 : 0;

    const user = {
      id,
      name,
      email,
      password,
    };

    db.users.push(user);

    await writeDBAsync(db);
    const access_token = signToken({ email });
    res.status(200).json({ user, access_token });
  } catch (err) {
    next(createError(401));
  }
});

app.post("/auth/signin", async (req, res, next) => {
  try {
    const { email } = req.body;

    const userExists = await userAlreadyExists({ email });

    if (!userExists) {
      throw "Access is denied due to invalid credentials";
    }

    const access_token = signToken({ email });
    res.status(200).json({ access_token });
  } catch (err) {
    next(createError(401));
  }
});

app.get("/privated", checkIfIsAutenticated, (req, res) => {
  res.send({
    test: "dsds",
  });
});

app.get("/characters", async (req, res) => {
  try {
    const response = await fetchApi("/characters");
    const data = await response.json();
    res.json({
      data,
    });
  } catch (err) {
    console.log(err);
  }
});

app.use(logErrors);

export default app;
