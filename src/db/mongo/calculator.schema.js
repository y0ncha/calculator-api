const mongoose = require("mongoose");

/**
 * Calculator operation schema (MongoDB).
 * Matches the exercise specification exactly.
 */
const calculator_schema = new mongoose.Schema(
  {
    rawid: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    flavor: {
      type: String,
      required: true,
      enum: ["STACK", "INDEPENDENT"],
    },

    operation: {
      type: String,
      required: true,
    },

    arguments: {
      type: String, // JSON string per spec
      required: true,
    },

    result: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "calculator",
    versionKey: false,
  }
);

module.exports = {
  calculator_schema,
};
