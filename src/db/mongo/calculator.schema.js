/**
 * @module db/mongo/calculator.schema
 * @description Mongoose schema for calculator operations collection
 * @requires mongoose
 */

const mongoose = require("mongoose");

/**
 * @constant {Schema} calculator_schema
 * @description Schema for operations collection with rawid, flavor, operation, arguments as JSON string, and result
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
