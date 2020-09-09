const puppeteer = require("puppeteer");
// const xlsx = require("xlsx");

// const mongoose = require("mongoose");
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
async function getLinks() {
  const URL = "http://truyentranhtuan.com/hiep-khach-giang-ho/";
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
  console.log(links);
  await browser.close();
  // return links;
}
// getLinks();
async function getImageChap(link, tap) {
  // let ni = 1;
  // let link = "http://truyentranhtuan.com/hiep-khach-giang-ho-chuong-592/";
  // let id = 592;
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  // await page.goto(link);
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
// async function getLinks() {
//   const URL = "https://truyenonline.info/nhat-niem-vinh-hang";
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(URL);
//   // const links = await page.$eval(".entry-header h3.entry-title a", (link) =>
//   //   link.map((a) => a.href)
//   // );
//   const links = await page.$eval(
//     ".entry-header h3.entry-title a",
//     (a) => a.href
//   );
//   //   link.map((a) => a.href)
//   // );
//   await browser.close();
//   return links;
// }
// async function getPageData(link, page) {
//   await page.goto(link);
//   await page.waitFor(2000);

//   let title = await page.$eval(
//     ".entry-header h1.entry-title",
//     (tit) => tit.innerText
//   );

//   let content = await page.$eval("div.entry-content", (cont) => cont.innerHTML);

//   // await browser.close();
//   return {
//     title,
//     content,
//   };
// }
// async function main() {
//   const allLinks = await getLinks();
//   console.log(allLinks);
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   const truyens = [];
//   // for (let link of allLinks) {
//   const data = await getPageData(allLinks, page);
//   truyens.push(data);
//   // }
//   // console.log(truyens);
//   // const wb = xlsx.utils.book_new();
//   // const ws = xlsx.utils.json_to_sheet(truyens);
//   // xlsx.utils.book_append_sheet(wb, ws);
//   // xlsx.writeFile(wb, "truyens.xlsx");

//   const MONGO_URL = "mongodb://localhost:27017/truyenonline";
//   mongoose.connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   // get reference to database
//   const db = mongoose.connection;
//   db.on("error", console.error.bind(console, "connection error:"));
//   db.once("open", function () {
//     console.log("Connection Successful!");
//     const truyenSchema = new mongoose.Schema({
//       title: String,
//       content: String,
//       category: String,
//     });
//     const TruyenChu = mongoose.model("truyenchu", truyenSchema, "truyenchus");
//     // let chap = new TruyenChu({
//     //   title: "so 1",
//     //   content: "so 2",
//     //   category: "so 3",
//     // });
//     truyens.forEach((truyen) => {
//       let chap = new TruyenChu({
//         title: truyen.title,
//         content: truyen.content,
//         category: "nhatniemvinhhang",
//       });
//       chap.save(function (er, res) {
//         if (er) console.error(er);
//         console.log(res.title + " saved.");
//       });
//     });
//   });
//   await browser.close();
// }
// main();
