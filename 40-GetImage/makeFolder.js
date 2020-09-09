// const puppeteer = require("puppeteer");
// const Downloader = require("./Downloader");
const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");

const dirnames = "2";
// fs.mkdirSync(dirnames, 0o776);
fs.mkdir(dirnames, (err) => {
  if (err) console.log(err);
  else console.log(`${dirnames} duoc tao`);
});
// const url =
//   "https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg";
// const filename = path.basename(url);
// const filepath = path.resolve(__dirname, filename);
// console.log(filepath);

// const filePath = path.resolve(__dirname, "images");
// (async () => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto("https://truyenonline.info/one-piece/tap-987");
//   const imageURLs = await page.$$eval(".entry-content .truyen-tranh", (imgs) =>
//     imgs.map((img) => img.src)
//   );
// console.log(imageURLs);
// await page.goto(
//   "http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html"
// );
// let imageURL = await page.$eval(
//   ".thumbnail .item.active img",
//   (img) => img.src
// );
// console.log(imageURL);
//   imageURLs.forEach((imageURL) => {
//     Downloader.downloadFile(imageURL, filePath, function (filename) {
//       console.log("ok - " + filename);
//     });
//   });
//   await browser.close();
// })();
