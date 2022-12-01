"use strict";

import path from "path";

console.log(
  path.resolve(process.cwd(), "src/db/db.json"),
  (process.env.NODE_ENV = process.env.NODE_ENV || "development")
);

import * as dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";

const server = http.createServer(app);

/**
 * start server
 */

setImmediate(() => {
  server.listen(4000, "0.0.0.0", () => {
    console.log("Express server listening on %d, in %s mode");
  });
});
