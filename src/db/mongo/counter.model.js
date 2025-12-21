/**
 * @module db/mongo/counter.model
 * @description Mongoose model for counter collection used to generate sequential IDs
 * @requires ./mongoose.client
 */

const { client } = require("./mongoose.client");

const counter_schema = new client.Schema(
  {
    _id: { type: String, required: true }, // counter name
    seq: { type: Number, required: true }, // current value
  },
  {
    collection: "counters",
    versionKey: false,
  }
);

/**
 * @constant {Model} Counter
 * @description Mongoose model for counters collection
 */
const Counter =
  client.models.Counter || client.model("Counter", counter_schema);

module.exports = { Counter };
