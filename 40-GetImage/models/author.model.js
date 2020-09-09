const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
  slug: String,
  titleSEO: String,
  about: String,
  descSEO: String,
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
});

const Author = mongoose.model("Author", authorSchema, "authors");

module.exports = Author;
