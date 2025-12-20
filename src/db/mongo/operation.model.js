const { client } = require("./mongoose.client");
const { calculator_schema } = require("./calculator.schema");

/**
 * Mongo model for calculator operations.
 */
const Operation =
  client.models.Operation || client.model("Operation", calculator_schema);

module.exports = {
  Operation,
};
