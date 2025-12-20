const { Counter } = require("./counter.model");

/**
 * Returns the next sequential rawid (starts at 1).
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
