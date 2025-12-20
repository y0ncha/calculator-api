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
 * Connects to MongoDB using Mongoose.
 * No-op if already connected or if Mongo mode is disabled.
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
 * Disconnects from MongoDB.
 * Safe to call even if not connected.
 */
async function disconnect() {
  if (!connected) return;

  await mongoose.disconnect();
  connected = false;
}

function isConnected() {
  return connected;
}

/**
 * Expose mongoose client (like prisma client)
 */
const client = mongoose;

module.exports = {
  connect,
  disconnect,
  client,
  isConnected,
};
