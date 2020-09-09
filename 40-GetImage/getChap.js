const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Chap = require("./models/chap.model");
const Story = require("./models/story.model");
const createSlug = require("./createSlug");
const Downloader = require("./Downloader");
const path = require("path");
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
// const MONGO_URL = "mongodb://localhost:27017/truyentranhv2";
// mongoose.set("useCreateIndex", true);
// mongoose
//   .connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .catch((err) => {
//     throw err;
//   });
module.exports.getChap = async function (story) {
  let { chapList, chapGet, chapError } = story;
  // console.log(chapList);
  // let idStory = story._id;
  // let tap = 268;

  for (let i = 0; i < chapList.length; i++) {
    //   // for (let i = 0; i < 3; i++) {
    // function getNumberChap() {
    // let linkChap = " http://truyentranhtuan.com/darwins-game-abx-chuong-87/";
    let linkChap = chapList[i];
    // console.log(linkChap);
    let chapNumber = path.basename(linkChap);
    // let res = url.split("?")[0];
    let arrayChap = chapNumber.split("-");
    const indexChap = arrayChap.indexOf("chuong");
    let arrNumberChap = arrayChap.splice(indexChap + 1, arrayChap.length);
    let tap = arrNumberChap.join("-");
    // console.log(tap);
    // console.log(arrayChap[indexChap + 1]);

    await getImageChap(linkChap, tap, chapList, chapGet, chapError, story._id);
    // await saveData(data, idStory, chapList[i]);

    // if (data) {
    //   chapGet.push(linkChap);
    //   console.log("Done " + linkChap);
    // } else {
    //   chapError.push(linkChap);
    //   console.log("Loi " + linkChap);
    // }
    // const index = chapList.indexOf(linkChap);
    // if (index > -1) {
    //   chapList.splice(index, 1);
    // }
    // try {
    //   const updateStory = await Story.updateOne(
    //     { _id: story._id },
    //     // { new: true },
    //     {
    //       $set: {
    //         chapList,
    //         chapGet,
    //         chapError,
    //       },
    //     }
    //   );
    // } catch (error) {
    //   console.log("Update error" + error);
    // }
  }
  console.log("Done All " + story.name);
  // return {chapList,chapGet, chapError}
};
// getNumberChap();
async function getImageChap(link, tap, chapList, chapGet, chapError, id) {
  // let ni = 1;
  // let link = "http://truyentranhtuan.com/hiep-khach-giang-ho-chuong-592/";
  // let id = 592;
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(link, {
    waitUntil: "load",
  });
  await page.waitFor(5000);

  // const imageURLs = await page.$$eval(".entry-content .truyen-tranh", (imgs) =>
  //   imgs.map((img) => img.src)
  // );
  // const imageURLs = await page.$$eval(".story-see-content .lazy", (imgs) =>
  //   imgs.map((img) => img.src)
  // );
  const imageURLs = await page.$$eval("#viewer img", (imgs) =>
    imgs.map((img) => img.src)
  );
  if (imageURLs.length > 0) {
    let dirname = createFolder(tap);
    const filePath = path.resolve(__dirname, dirname);
    let ni = 1;

    imageURLs.forEach((imageURL) => {
      Downloader.downloadFile(imageURL, filePath, ni, tap);
      ni++;
    });
    await browser.close();
    chapGet.push(link);
    const index = chapList.indexOf(link);
    if (index > -1) {
      chapList.splice(index, 1);
    }
    try {
      const updateStory = await Story.updateOne(
        { _id: id },
        // { new: true },
        {
          $set: {
            chapList,
            chapGet,
          },
        }
      );
    } catch (error) {
      console.log("Update error 1" + error);
    }
    console.log("Done " + link);
  } else {
    await browser.close();
    chapError.push(link);

    try {
      const updateStory = await Story.updateOne(
        { _id: id },
        // { new: true },
        {
          $set: {
            chapError,
          },
        }
      );
    } catch (error) {
      console.log("Update error 2" + error);
    }
    console.log("Loi empty getImgae " + link);
  }

  // console.log(chapContent);
}
function createFolder(tap) {
  let dirname = "tap-" + tap;
  try {
    fs.mkdirSync(dirname, 0o776);
  } catch (error) {
    createFolder(dirname);
    console.log("Trung thu muc da tao");
  }
  return dirname;
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
