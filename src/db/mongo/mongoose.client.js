/**
 * @module db/mongo/mongoose.client
 * @description Mongoose client for MongoDB connection management
 * @requires mongoose
 * @requires ../../config
 */

const mongoose = require("mongoose");
const { URL } = require("url");
const { config } = require("../../config");

mongoose.set("strictQuery", true);

let connected = false;

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

/**
 * @function connect
 * @description Connects to MongoDB using Mongoose, no-op if already connected
 */
async function connect() {
  if (connected) return;

  console.log(
    `[startup] Connecting to Mongo at ${maskConnectionString(
      config.mongo.uri,
    )}`,
  );

  await mongoose.connect(config.mongo.uri, {
    serverSelectionTimeoutMS: 1500,
  });

  connected = true;
}

/**
 * @function disconnect
 * @description Disconnects from MongoDB, safe to call if not connected
 */
async function disconnect() {
  if (!connected) return;

  await mongoose.disconnect();
  connected = false;
}

/**
 * @function isConnected
 * @description Returns MongoDB connection status
 */
function isConnected() {
  return connected;
}

/**
 * @constant {Object} client
 * @description Mongoose client instance
 */
const client = mongoose;

module.exports = {
  connect,
  disconnect,
  client,
  isConnected,
};
