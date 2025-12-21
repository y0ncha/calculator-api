/**
 * @module db/mongo/rawid.service
 * @description Sequential rawid generator for MongoDB operations
 * @requires ./counter.model
 */

const { Counter } = require("./counter.model");

/**
 * @function nextId
 * @description Returns next sequential rawid starting at 1
 */
async function nextId() {
  const doc = await Counter.findOneAndUpdate(
    { _id: "operation_rawid" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return doc.seq;
}

module.exports = {
  nextId,
};
