const mongoose = require("mongoose");

const chapSchema = new mongoose.Schema({
  name: String,
  slug: {
    type: String,
    unique: true,
  },
  titleSEO: String,
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
  },
  content: String,
  descSEO: String,
  pulished: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  views: { type: Number, default: 100 },
});

const Chap = mongoose.model("Chap", chapSchema, "chaps");

module.exports = Chap;
