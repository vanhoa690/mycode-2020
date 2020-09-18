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

module.exports.getChapTruyenOnline = async function (story) {
  let { chapList, chapGet } = story;
  // let tap = 29;
  for (let i = 0; i < chapList.length; i++) {
    //  https://truyenonline.info/7-vien-ngoc-rong/chap-496-2
    // chap-496-2
    let linkChap = chapList[i];

    let chapNumber = path.basename(linkChap).split(".")[0];
    // let res = url.split("?")[0];
    let arrayChap = chapNumber.split("-");
    let tap = arrayChap[1];
    // const indexChap = arrayChap.indexOf("chuong");
    // let arrNumberChap = arrayChap.splice(indexChap + 1, arrayChap.length);
    // let tap = arrNumberChap.join("-");
    // let tap = arrayChap[indexChap + 1].split(".")[0];
    // console.log(tap);
    // tap = tap + 1;
    await getImageChap(linkChap, tap);
    await saveData(linkChap, story._id);
  }
  console.log("Done All " + story.name);
};

async function getImageChap(link, tap) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(link, {
    waitUntil: "load",
  });
  await page.waitFor(5000);

  // const imageURLs = await page.$$eval(".content-text img", (imgs) =>
  //   imgs.map((img) => img.src)
  // );
  // const imageURLs = await page.$$eval(".entry-content .truyen-tranh", (imgs) =>
  //   imgs.map((img) => img.src)
  // );
  const imageURLs = await page.$$eval(".entry-content img", (imgs) =>
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
    console.log("Done " + link);
  } else {
    await browser.close();
    console.log("Loi empty getImgae " + link);
  }
  // return { chapList, chapGet };
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
saveData = async function (linkChap, idStory) {
  try {
    const story = await Story.findById(idStory);
    let { chapList, chapGet } = story;
    chapGet.push(linkChap);
    const index = chapList.indexOf(linkChap);
    if (index > -1) {
      chapList.splice(index, 1);
    }

    const updateStory = await Story.updateOne(
      { _id: idStory },
      {
        $set: {
          chapList,
          chapGet,
        },
      }
    );
  } catch (errors) {
    console.log(errors);
  }
};
