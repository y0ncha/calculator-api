/**
 * @module db/mongo/operation.model
 * @description Mongoose model for calculator operations collection
 * @requires ./mongoose.client
 * @requires ./calculator.schema
 */

const { client } = require("./mongoose.client");
const { calculator_schema } = require("./calculator.schema");

/**
 * @constant {Model} Operation
 * @description Mongoose model for operations collection
 */
const Operation =
  client.models.Operation || client.model("Operation", calculator_schema);

module.exports = {
  Operation,
};
