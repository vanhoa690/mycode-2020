const puppeteer = require("puppeteer");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Author = require("./models/author.model");
const Story = require("./models/story.model");
const createSlug = require("./createSlug");
const getChap = require("./getChap");
const Category = require("./models/category.model");
const Done = require("./models/done.model");
const port = 5000;
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
const MONGO_URL = "mongodb://localhost:27017/getdanhsach";
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
app.get("/gettruyen", async function (req, res) {
  let doneId = "5f506c0a42f4cb9603def1d8";
  try {
    const doneList = await Done.findById(doneId);
    let { urlList } = doneList;
    const stories = await Story.find({ isGet: false });
    // console.log(stories);
    for (let i = 0; i < stories.length; i++) {
      let story = stories[i];
      let { isGet } = story;
      const chapList = await getChap.getChap(story);
      isGet = true;
      const updateStory = await Story.updateOne(
        { _id: story._id },
        {
          $set: {
            isGet,
          },
        }
      );
      //update urlGet done in coll dones
      urlList.push(story.urlGet);
      const updateDone = await Done.updateOne(
        { _id: doneId },
        {
          $set: {
            urlList,
          },
        }
      );
    }
  } catch (errors) {
    console.log(errors);
  }
});
app.post("/", async function (req, res) {
  let { url, max, isDone } = req.body;
  let min = 1;
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
//List danh sach
// router GET /danh-sach
// @get danh sach
app.get("/danh-sach", async function (req, res) {
  try {
    const category = await Category.find();
    res.render("danhsach", { category });
  } catch (error) {
    console.log(error);
  }
});

// router POST /danh-sach
// @POST danh sach
app.post("/danh-sach", async function (req, res) {
  let { url, max } = req.body;
  // let min = 1;
  let storyList = await getLinksDS(url, max);
  let newCategory = new Category({
    urlGet: url,
    storyList,
  });
  // console.log(storyList);
  try {
    const saveCategory = await newCategory.save();
  } catch (error) {
    console.log(error);
  }

  console.log("Done");
  // // res.render("index", { authorInfo, storyInfo });
});
// router POST /danh-sach/:id
// @POST danh sach :id
app.get("/danh-sach/:id", async function (req, res) {
  // res.render("story");
  let id = req.params.id;
  // console.log(id);
  let doneId = "5f506c0a42f4cb9603def1d8";
  try {
    const doneList = await Done.findById(doneId);
    const categoryList = await Category.findById(id);
    let { storyList, storyGet } = categoryList;
    let { urlList, urlTrung } = doneList;
    for (let i = 0; i < storyList.length; i++) {
      let linkStory = storyList[i];
      const index = urlList.indexOf(linkStory);
      if (index > -1) {
        urlTrung.push(linkStory);
      } else {
        let url = storyList[i];
        let min = 1;
        let max = 1000;
        // let isDone = true;
        let story = await getStory(url);
        let chapList = await getLinks(url, min, max);
        // let { name, content, author, genres, source } = story;
        let { name, content, author, genres, completed } = story;
        // let completed = isDone ? true : false;
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
        storyGet.push(linkStory);
        const index = storyList.indexOf(linkStory);
        if (index > -1) {
          storyList.splice(index, 1);
        }
        const updateCategory = await Category.updateOne(
          { _id: id },
          {
            $set: {
              storyList,
              storyGet,
            },
          }
        );
        console.log("Done");
      }
    }
  } catch (error) {}
});

async function getLinksDS(url, max) {
  let linksStory = [];
  for (let i = 1; i <= max; i++) {
    const URL = url.concat("trang-", i, "/");
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    // await page.goto(URL);
    // await page.setDefaultNavigationTimeout(0);
    await page.goto(URL, {
      waitUntil: "load",
    });
    const links = await page.$$eval(
      ".row .col-xs-7 h3.truyen-title a",
      (link) => link.map((a) => a.href)
    );

    await browser.close();
    linksStory = [...linksStory, ...links];
  }
  // console.log(linksStory);
  return linksStory;
}

async function getStory(url) {
  const browser = await puppeteer.launch(options);
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
  let completed;
  try {
    const done = await page.$eval(".info .text-success", (e) => e.innerText);
    if (done === "Full") completed = true;
  } catch (error) {
    // console.log(error);
    completed = false;
  }
  // const source = await page.$eval(
  //   ".info .source",
  //   (source) => source.innerText
  // );
  let infoStory = {
    name,
    content,
    author,
    genres,
    completed,
  };
  await browser.close();
  return infoStory;
}

async function getLinks(url, min, max) {
  let linksChap = [];
  for (let i = min; i <= max; i++) {
    const URL = url.concat("trang-", i, "/#list-chapter");
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    // await page.goto(URL);
    // await page.setDefaultNavigationTimeout(0);
    await page.goto(URL, {
      waitUntil: "load",
    });
    const links = await page.$$eval(".row ul.list-chapter li a", (link) =>
      link.map((a) => a.href)
    );
    // check xem lap trang tiep trung trang truoc ko
    const index = linksChap.includes(links[0]);
    if (index) break;
    await browser.close();
    linksChap = [...linksChap, ...links];
  }

  return linksChap;
}

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

app.listen(port, function () {
  console.log("Server listening on port " + port);
});
