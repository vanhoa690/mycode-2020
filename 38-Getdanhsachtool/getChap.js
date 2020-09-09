const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Chap = require("./models/chap.model");
const Story = require("./models/story.model");
const createSlug = require("./createSlug");
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
module.exports.getChap = async function (story) {
  let { chapList } = story;
  let idStory = story._id;
  for (let i = 0; i < chapList.length; i++) {
    const data = await getPageData(chapList[i]);
    saveData(data, idStory, chapList[i]);
    console.log("Done " + chapList[i]);
  }
  console.log("Done All " + story.name);
};

async function getPageData(link) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(link, {
    waitUntil: "load",
  });
  await page.waitFor(2000);
  const name = await page.$eval(
    ".row h2 .chapter-title",
    (tit) => tit.innerText
  );
  // h3.title
  // 'h3[itemprop="name"]'
  // .row h2 .chapter-title
  let content = await page.$eval("div#chapter-c", (cont) => cont.innerHTML);
  content = content
    .replace(/<div[\s\S]+?><\/div>/g, "")
    .replace(/<style([\s\S]+?)<\/style>/g, "")
    .replace(/<script([\s\S]+?)<\/script>/g, "")
    .replace(/<\/div>/g, "");

  await browser.close();
  return {
    name,
    content,
  };
}
saveData = async function (data, idStory, linkChap) {
  createSlug
    .createSlug(data.name, Chap)
    .then(async (slug) => {
      try {
        let name, titleSEO, descSEO, fomatCotent;
        const story = await Story.findById(idStory);
        let { chapList, chapGet, chaps } = story;
        name = data.name.trim();
        titleSEO = "Đọc truyện ".concat(story.name, " Online - ", name);
        fomatCotent = data.content.replace(/<[^>]+>/g, "");
        descSEO = titleSEO.concat(" : ", fomatCotent.slice(0, 100), "...");

        const chap = new Chap({
          name,
          slug,
          story: idStory,
          content: data.content,
          titleSEO,
          descSEO,
        });
        const saveChap = await chap.save();
        chaps.push(saveChap._id);
        chapGet.push(linkChap);
        const index = chapList.indexOf(linkChap);
        if (index > -1) {
          chapList.splice(index, 1);
        }
        const updateStory = await Story.updateOne(
          { _id: story._id },
          {
            $set: {
              chaps,
              chapGet,
              chapList,
            },
          }
        );
      } catch (errors) {
        console.log(errors);
      }
    })
    .catch((err) => console.log(err));
};
