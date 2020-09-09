const puppeteer = require("puppeteer");
const Downloader = require("./Downloader");
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
// async function getLinks() {
//   const URL = "https://truyenonline.info/conan/page/3";
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(URL);
//   const links = await page.$$eval(".entry-header h3.entry-title a", (el) =>
//     el.map((a) => a.href)
//   );
//   await browser.close();
//   return links;
// }

// async function getImageChap(link, page, id) {
async function getImageChap(link, tap) {
  // let ni = 1;
  // let link = "http://truyentranhtuan.com/hiep-khach-giang-ho-chuong-592/";
  // let id = 592;
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(link, {
    waitUntil: "load",
  });
  // await page.waitFor(2000);

  // const imageURLs = await page.$$eval(".entry-content .truyen-tranh", (imgs) =>
  //   imgs.map((img) => img.src)
  // );
  // const imageURLs = await page.$$eval(".story-see-content .lazy", (imgs) =>
  //   imgs.map((img) => img.src)
  // );
  const imageURLs = await page.$$eval("#viewer img", (imgs) =>
    imgs.map((img) => img.src)
  );
  const dirname = "tap-" + tap;
  // path.basename(link);
  fs.mkdirSync(dirname, 0o776);

  const filePath = path.resolve(__dirname, dirname);
  let ni = 1;
  let chapContent = `<h2>ĐỌC TRUYỆN TRANH HIỆP KHÁCH GIANG HỒ ONLINE - Tập ${tap}</h2>`;
  imageURLs.forEach((imageURL) => {
    let imageResult = Downloader.downloadFile(imageURL, filePath, ni, tap);
    ni++;
    // , function (filename) {
    // console.log("ok - " + filename);
    // });
    // });
    // await browser.close();
    chapContent += imageResult;
  });
  await browser.close();
  return chapContent;
  // console.log(chapContent);
}
module.exports.getImageChap = getImageChap;
// getImageChap();
// async function main() {
//   let id = 200;
//   const allLinks = await getLinks();
//   // console.log(allLinks);
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   // const truyens = [];
//   for (let link of allLinks) {
//     const data = await getImageChap(link, page, id);
//     // truyens.push(data);
//     id++;
//   }
// }
// main();
