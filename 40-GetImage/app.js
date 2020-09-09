const puppeteer = require("puppeteer");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Chap = require("./models/chap.model");
const Story = require("./models/story.model");
const Downloader = require("./Downloader");
const createSlug = require("./createSlug");
const getChap = require("./getChap");
const getChapTruyenvn = require("./getChapTruyenvn");
// const getChap = require("./getChap");
// const Category = require("./models/category.model");
// const Done = require("./models/done.model");
const port = 4000;
const path = require("path");
// const url = "https://truyenonline.info/one-piece/tap-987";
const fs = require("fs");
const options = {
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
    "--single-process", // <- this one doesn't works in Windows
    "--disable-gpu",
  ],
  headless: true,
};

const app = express();
const MONGO_URL = "mongodb://localhost:27017/truyentranhv2";
mongoose.set("useCreateIndex", true);
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    throw err;
  });
app.set("view engine", "pug");
// app.set("views", "./views");
app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.get("/", async function (req, res) {
  res.render("index");
});
app.post("/", async function (req, res) {
  let { url } = req.body;
  let storyInfo = await getStory(url);
  let chapList = await getLinks(url);
  let { name, content } = storyInfo;
  let story = {
    url,
    name,
    content,
    chapList,
  };
  // console.log(data);
  // let authorInfo = await saveAuthor(author);
  await saveStory(story);
  // // console.log(authorInfo);
  console.log("Done");
  // // res.render("index", { authorInfo, storyInfo });
});
app.get("/stories", async function (req, res) {
  // res.render("story");
  try {
    const stories = await Story.find({ isGet: false });
    // console.log(stories);
    res.render("story", { stories });
  } catch (errors) {
    console.log(errors);
  }
});
app.get("/stories/:id", async function (req, res) {
  // res.render("story");
  let id = req.params.id;
  // console.log(id);
  try {
    const story = await Story.findById(id);
    // const result = await getChap.getChap(story); // GET Chap Truyen Tranh Tuan
    const result = await getChapTruyenvn.getChapTruyenvn(story);
    // let isGet = true;
    // let { chapList, chapGet, chapError } = result;
    // const updateStory = await Story.updateOne(
    //   { _id: id },
    //   // { new: true },
    //   {
    //     $set: {
    //       chapList,
    //       chapGet,
    //       chapError
    //     },
    //   }
    // );
    // console.log(chapList);
    // res.render("chapList", { story });
    // res.send("Geting chap...." + story.name + story.isGet);
  } catch (errors) {
    console.log(errors);
  }
});
saveStory = async function (story) {
  let name = story.name;
  let slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[!)?$]+/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/g, "");
  let storyFind = await Story.findOne({ slug });
  if (storyFind) return storyFind;
  try {
    let urlGet = story.url;
    let titleSEO = "Đọc truyện tranh ".concat(story.name, " Online");
    let content = story.content;
    let descSEO = titleSEO.concat(" : ", content.slice(0, 100), "...");
    let chapList = story.chapList;
    const newStory = new Story({
      urlGet,
      name,
      slug,
      content,
      chapList,
      titleSEO,
      descSEO,
    });
    const saveStory = await newStory.save();
    return saveStory;
  } catch (errors) {
    console.log(errors);
    // res.render("chaps/chap", { errors });
  }
  // res.redirect("/chaps");
};
/* Get Story Truyenvn*/
async function getStory(url) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  // await page.setDefaultNavigationTimeout(0);
  await page.goto(url, {
    waitUntil: "load",
  });
  const name = await page.$eval(".info h1.name", (name) => name.innerText);
  const content = await page.$eval(
    ".inner span",
    (content) => content.innerText
  );

  let infoStory = {
    name,
    content,
  };
  await browser.close();
  return infoStory;
}
async function getLinks(URL) {
  // const URL = "http://truyentranhtuan.com/hiep-khach-giang-ho/";
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(URL, {
    waitUntil: "load",
  });
  // const links = await page.$eval(".entry-header h3.entry-title a", (link) =>
  //   link.map((a) => a.href)
  // );
  const links = await page.$$eval("#chapterList a", (link) =>
    link.map((a) => a.href)
  );
  // console.log(links);
  await browser.close();
  return links;
}
/* Get Story Truyen Tranh Tuan
async function getStory(url) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  // await page.setDefaultNavigationTimeout(0);
  await page.goto(url, {
    waitUntil: "load",
  });
  const name = await page.$eval('h1[itemprop="name', (name) => name.innerText);
  const content = await page.$eval(
    "#manga-summary p",
    (content) => content.innerText
  );

  let infoStory = {
    name,
    content,
  };
  await browser.close();
  return infoStory;
}
async function getLinks(URL) {
  // const URL = "http://truyentranhtuan.com/hiep-khach-giang-ho/";
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(URL, {
    waitUntil: "load",
  });
  // const links = await page.$eval(".entry-header h3.entry-title a", (link) =>
  //   link.map((a) => a.href)
  // );
  const links = await page.$$eval("#manga-chapter .chapter-name a", (link) =>
    link.map((a) => a.href)
  );
  // console.log(links);
  await browser.close();
  return links;
}
*/
app.listen(port, function () {
  console.log("Server listening on port " + port);
});
