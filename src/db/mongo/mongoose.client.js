const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

let connected = false;

/**
 * Connects to MongoDB using Mongoose.
 * No-op if already connected or if MONGO_MODE !== "on".
 */
async function connect() {
  if (connected) return;

  const mode = (process.env.MONGO_MODE || "off").toLowerCase();
  if (mode !== "on") return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI env var");
  }

  await mongoose.connect(uri, {
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
