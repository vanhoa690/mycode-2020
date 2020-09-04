const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  urlGet: String,
  storyList: { type: Array },
  storyGet: { type: Array },
});

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
