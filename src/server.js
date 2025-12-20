/**
 * @module server
 * @description Express app entry point with middleware setup and route registration
 * @requires express
 * @requires ./middlewares/requests
 * @requires ./routes/stack
 * @requires ./routes/independent
 * @requires ./routes/general
 */

const express = require("express");
const { URL } = require("url");
const logReq = require("./middlewares/requests");
const { config } = require("./config");
const {
  server: { port: serverPort },
} = config;
const app = express();

// Middleware setup
app.use(express.json());
app.use(logReq);

// Route registration
const stackRoutes = require("./routes/stack");
app.use("/calculator", stackRoutes);

const independentRoutes = require("./routes/independent");
app.use("/calculator", independentRoutes);

const generalRoutes = require("./routes/general");
app.use(generalRoutes);

const maskConnectionString = (uri) => {
  if (!uri) return "";
  try {
    const parsed = new URL(uri);
    if (parsed.password) {
      parsed.password = "***";
    }
    return parsed.toString();
  } catch (error) {
    return uri.replace(/(\/\/[^:]+):[^@]+@/, "$1:***@");
  }
};

app.listen(serverPort, () => {
  console.log(`[startup] Server running on http://localhost:${serverPort}`);
});
