const puppeteer = require("puppeteer");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Author = require("./models/author.model");
const Story = require("./models/story.model");
const createSlug = require("./createSlug");
const getChap = require("./getChap");
const port = 3000;

const app = express();
const MONGO_URL = "mongodb://localhost:27017/toolget";
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
  // try {
  //   const stories = await Story.find();
  //   // console.log(stories);
  //   res.render("index", { stories });
  // } catch (errors) {
  //   res.render("index", { errors });
  // }
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
    const chapList = await getChap.getChap(story);
    // let {isGet} = story;
    let isGet = true;
    const updateStory = await Story.updateOne(
      { _id: story._id },
      // { new: true },
      {
        $set: {
          isGet,
        },
      }
    );
    // console.log(chapList);
    // res.render("chapList", { story });
    res.send("Geting chap...." + story.name + story.isGet);
  } catch (errors) {
    console.log(errors);
  }
});
app.post("/", async function (req, res) {
  let { url, min, max, isDone } = req.body;
  console.log(url, min, max);
  let story = await getStory(url);
  let chapList = await getLinks(url, min, max);
  // let { name, content, author, genres, source } = story;
  let { name, content, author, genres } = story;
  let completed = isDone ? true : false;
  let data = {
    url,
    name,
    content,
    genres,
    completed,
    chapList,
  };
  console.log(data);
  let authorInfo = await saveAuthor(author);
  let storyInfo = await saveStory(data, authorInfo);
  // console.log(authorInfo);
  console.log("Done");
  // res.render("index", { authorInfo, storyInfo });
});
async function getStory(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // await page.setDefaultNavigationTimeout(0);
  await page.goto(url, {
    waitUntil: "load",
  });
  const name = await page.$eval("h3.title", (name) => name.innerText);
  const content = await page.$eval(
    ".desc-text",
    (content) => content.innerText
  );
  const author = await page.$eval(
    '.info a[itemprop="author"]',
    (author) => author.innerText
  );
  const genres = await page.$$eval('.info a[itemprop="genre"]', (genre) =>
    genre.map((g) => g.innerText)
  );
  // const source = await page.$eval(
  //   ".info .source",
  //   (source) => source.innerText
  // );
  let infoStory = {
    name,
    content,
    author,
    genres,
  };
  await browser.close();
  return infoStory;
}

async function getLinks(url, min, max) {
  let linksChap = [];
  for (let i = min; i <= max; i++) {
    const URL = url.concat("trang-", i, "/#list-chapter");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // await page.goto(URL);
    // await page.setDefaultNavigationTimeout(0);
    await page.goto(URL, {
      waitUntil: "load",
    });
    const links = await page.$$eval(".row ul.list-chapter li a", (link) =>
      link.map((a) => a.href)
    );
    await browser.close();
    linksChap = [...linksChap, ...links];
  }

  return linksChap;
}
// getLinks();

// async function getPageData(link, page) {
//   // try {
//   await page.setDefaultNavigationTimeout(0);
//   await page.goto(link, {
//     waitUntil: "load",
//   });
//   await page.waitFor(2000);
//   const name = await page.$eval(
//     ".row h2 .chapter-title",
//     (tit) => tit.innerText
//   );

//   let content = await page.$eval("div#chapter-c", (cont) => cont.innerHTML);
//   content = content
//     .replace(/<div[\s\S]+?><\/div>/g, "")
//     .replace(/<style([\s\S]+?)<\/style>/g, "")
//     .replace(/<script([\s\S]+?)<\/script>/g, "")
//     .replace(/<\/div>/g, "");
//   // const name = await page.$eval(
//   //   ".entry-header h1.entry-title",
//   //   (tit) => tit.innerText
//   // );

//   // const content = await page.$eval(
//   //   "div.entry-content",
//   //   (cont) => cont.innerHTML
//   // );

//   // await browser.close();
//   return {
//     name,
//     content,
//   };
//   // } catch (err) {
//   // await page.waitFor(40000);
//   // getPageData(link, page);
//   // console.log(err);
//   // throw err;
//   // }
// }
saveAuthor = async function (name) {
  let slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9]+/g, "-");
  let authorFind = await Author.findOne({ slug });
  if (authorFind) return authorFind;
  try {
    let titleSEO = "Tác giả ".concat(name);
    let about = titleSEO;
    let descSEO = titleSEO;
    const author = new Author({
      name,
      slug,
      titleSEO,
      about,
      descSEO,
    });
    const saveAuthor = await author.save();
    return saveAuthor;
  } catch (errors) {
    console.log(errors);
    // res.render("chaps/chap", { errors });
  }
  // res.redirect("/chaps");
};
saveStory = async function (story, authorInfo) {
  let name = story.name;
  let slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[!)?$]+/gi, "")
    .replace(/[^a-z0-9]+/g, "-");
  let storyFind = await Story.findOne({ slug });
  if (storyFind) return storyFind;
  try {
    let urlGet = story.url;
    let titleSEO = "Đọc truyện ".concat(story.name, " Online");
    let content = story.content;
    let descSEO = titleSEO.concat(" : ", content.slice(0, 100), "...");
    let genres = story.genres;
    let author = authorInfo._id;
    let stories = authorInfo.stories;
    // let source = story.source;
    let chapList = story.chapList;
    let completed = story.completed;
    const newStory = new Story({
      urlGet,
      name,
      slug,
      author,
      content,
      chapList,
      titleSEO,
      descSEO,
      genres,
      completed,
    });
    const saveStory = await newStory.save();
    stories.push(saveStory._id);
    const updateAuthor = await Author.updateOne(
      { _id: author },
      // { new: true },
      {
        $set: {
          stories,
        },
      }
    );

    return saveStory;
  } catch (errors) {
    console.log(errors);
    // res.render("chaps/chap", { errors });
  }
  // res.redirect("/chaps");
};
// saveData = async function (data) {
//   createSlug
//     .createSlug(data.name, Chap)
//     .then(async (slug) => {
//       try {
//         // console.log(slug);
//         let name, titleSEO, descSEO, fomatCotent;
//         const idStory = "5f472bb7d35bc59ea80dc882";
//         const story = await Story.findById(idStory);
//         let chaps = story.chaps;
//         name = data.name.trim().replace(/[-:?"'><!@#$%\^&*()~`\.,;+ ]+/g, " ");
//         titleSEO = "Đọc truyện ".concat(story.name, " Online - ", name);
//         fomatCotent = data.content.replace(/<[^>]+>/g, "");
//         descSEO = titleSEO.concat(" : ", fomatCotent.slice(0, 100), "...");
//         // console.log(titleSEO);
//         // console.log(descSEO);
//         // console.log(slug);
//         const chap = new Chap({
//           name,
//           slug,
//           story: idStory,
//           content: data.content,
//           titleSEO,
//           descSEO,
//         });
//         // console.log(chap);
//         const saveChap = await chap.save();
//         // console.log(saveChap);
//         chaps.push(saveChap._id);
//         const updateStory = await Story.updateOne(
//           { _id: story._id },
//           // { new: true },
//           {
//             $set: {
//               chaps,
//             },
//           }
//         );
//         // console.log(updateStory);
//       } catch (errors) {
//         console.log(errors);
//         // res.render("chaps/chap", { errors });
//       }
//       // res.redirect("/chaps");
//     })
//     .catch((err) => console.log(err));
// };
// getContent = async function () {
//   for (let i = 31; i <= 53; i++) {
//     let allLinks = await getLinks(i);
//     // allLinks = allLinks.slice(71);
//     // console.log(allLinks);

//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     const stories = [];
//     for (let link of allLinks) {
//       // let data;
//       // try {
//       const data = await getPageData(link, page);
//       // } catch (err) {
//       // await page.waitFor(20000);
//       // data = await getPageData(link, page);
//       // console.log(err);
//       // throw err;
//       // }
//       saveData(data);
//       console.log("Done " + link);
//     }
//     console.log("Done " + i);
//   }
//   console.log("Done All ");
// };
// getContent();
app.listen(port, function () {
  console.log("Server listening on port " + port);
});
