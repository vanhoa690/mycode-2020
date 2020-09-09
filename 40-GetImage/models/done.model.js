const mongoose = require("mongoose");

const doneSchema = new mongoose.Schema({
  urlList: { type: Array },
  urlTrung: { type: Array },
});

const Done = mongoose.model("Done", doneSchema, "dones");

module.exports = Done;
