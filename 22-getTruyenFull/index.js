const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Chap = require("./models/chap.model");
const Story = require("./models/story.model");
const createSlug = require("./createSlug");

const MONGO_URL = "mongodb://localhost:27017/truyenfull";
mongoose.set("useCreateIndex", true);
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    throw err;
  });
async function getLinks(i) {
  // const linkStory = "https://truyenonline.info/pham-nhan-tu-tien-2/page/";
  // const URL = linkStory.concat(i);
  const linkStory = "https://truyenfull.vn/thien-dao-do-thu-quan-070820/trang-";
  const URL = linkStory.concat(i, "/#list-chapter");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // await page.goto(URL);
  await page.setDefaultNavigationTimeout(0);
  await page.goto(URL, {
    waitUntil: "load",
  });
  const links = await page.$$eval(".row ul.list-chapter li a", (link) =>
    link.map((a) => a.href)
  );
  //   const links = await page.$$eval(".entry-header h3.entry-title a", (link) =>
  //   link.map((a) => a.href)
  // );
  // const links = await page.$eval(
  //   ".entry-header h3.entry-title a",
  //   (a) => a.href
  // );
  //   link.map((a) => a.href)
  // );
  await browser.close();
  return links;
}
// async function getDataOnePage() {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   // await page.setDefaultNavigationTimeout(0);
//   let link = "https://truyenfull.vn/lao-dai-la-nu-lang/chuong-6/";
//   await page.goto(link, {
//     waitUntil: "networkidle2",
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
//   let data = {
//     name,
//     content,
//   };
//   saveData(data);
//   console.log("Done");
//   // } catch (err) {
//   // await page.waitFor(40000);
//   // getPageData(link, page);
//   // console.log(err);
//   // throw err;
//   // }
// }
// getDataOnePage();
async function getPageData(link) {
  // try {
  const browser = await puppeteer.launch({ headless: true });
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

  let content = await page.$eval("div#chapter-c", (cont) => cont.innerHTML);
  content = content
    .replace(/<div[\s\S]+?><\/div>/g, "")
    .replace(/<style([\s\S]+?)<\/style>/g, "")
    .replace(/<script([\s\S]+?)<\/script>/g, "")
    .replace(/<\/div>/g, "");
  // const name = await page.$eval(
  //   ".entry-header h1.entry-title",
  //   (tit) => tit.innerText
  // );

  // const content = await page.$eval(
  //   "div.entry-content",
  //   (cont) => cont.innerHTML
  // );

  await browser.close();
  return {
    name,
    content,
  };
  // } catch (err) {
  // await page.waitFor(40000);
  // getPageData(link, page);
  // console.log(err);
  // throw err;
  // }
}
saveData = async function (data) {
  createSlug
    .createSlug(data.name, Chap)
    .then(async (slug) => {
      try {
        // console.log(slug);
        let name, titleSEO, descSEO, fomatCotent;
        const idStory = "5f49ace5be7a9d59836ff0b8";
        const story = await Story.findById(idStory);
        let chaps = story.chaps;
        name = data.name.trim().replace(/[-:?"'><!@#$%\^&*()~`\.,;+ ]+/g, " ");
        titleSEO = "Đọc truyện ".concat(story.name, " Online - ", name);
        fomatCotent = data.content.replace(/<[^>]+>/g, "");
        descSEO = titleSEO.concat(" : ", fomatCotent.slice(0, 100), "...");
        // console.log(titleSEO);
        // console.log(descSEO);
        // console.log(slug);
        const chap = new Chap({
          name,
          slug,
          story: idStory,
          content: data.content,
          titleSEO,
          descSEO,
        });
        // console.log(chap);
        const saveChap = await chap.save();
        // console.log(saveChap);
        chaps.push(saveChap._id);
        const updateStory = await Story.updateOne(
          { _id: story._id },
          // { new: true },
          {
            $set: {
              chaps,
            },
          }
        );
        // console.log(updateStory);
      } catch (errors) {
        console.log(errors);
        // res.render("chaps/chap", { errors });
      }
      // res.redirect("/chaps");
    })
    .catch((err) => console.log(err));
};
getContent = async function () {
  for (let i = 41; i <= 70; i++) {
    let allLinks = await getLinks(i);
    // allLinks = allLinks.slice(71);
    // console.log(allLinks);

    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    const stories = [];
    for (let link of allLinks) {
      const data = await getPageData(link);
      // let data;
      // try {
      // const data = await getPageData(link, page);
      // } catch (err) {
      // await page.waitFor(20000);
      // data = await getPageData(link, page);
      // console.log(err);
      // throw err;
      // }
      saveData(data);
      console.log("Done " + link);
    }
    console.log("Done " + i);
  }
  console.log("Done All ");
};
getContent();
