const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  urlGet: String,
  name: String,
  slug: String,
  titleSEO: String,
  content: String,
  descSEO: String,
  source: String,
  genres: { type: Array },
  comments: { type: Array },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  chapList: { type: Array },
  chapGet: { type: Array },
  chapError: { type: Array },
  chaps: { type: Array },
  isGet: { type: Boolean, default: false },
  completed: { type: Boolean, default: true },
  pulished: { type: Boolean, default: true },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
  views: { type: Number, default: 100 },
});

const Story = mongoose.model("Story", storySchema, "stories");

module.exports = Story;
