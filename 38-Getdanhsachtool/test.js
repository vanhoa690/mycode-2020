const puppeteer = require("puppeteer");
let url = "https://truyenfull.vn/thien-dao-do-thu-quan-070820";
async function getStory(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // await page.setDefaultNavigationTimeout(0);
  await page.goto(url, {
    waitUntil: "load",
  });
  // const name = await page.$eval("h3.title", (name) => name.innerText);
  // const content = await page.$eval(
  //   ".desc-text",
  //   (content) => content.innerText
  // );
  // const author = await page.$eval(
  //   '.info a[itemprop="author"]',
  //   (author) => author.innerText
  // );
  // const genres = await page.$$eval('.info a[itemprop="genre"]', (genre) =>
  //   genre.map((g) => g.innerText)
  // );
  let done;
  try {
    const isDone = await page.$eval(".info .text-success", (e) => e.innerText);
    if (isDone === "Full") done = true;
  } catch (error) {
    // console.log(error);
    done = false;
  }
  console.log(done);
  // let infoStory = {
  //   name,
  //   content,
  //   author,
  //   genres,
  // };
  // await browser.close();
  // return infoStory;
}
getStory(url);
// async function getLinks() {
//   let linksChap = [];
//   for (let i = 1; i <= 4; i++) {
//     const url = "https://truyenfull.vn/dao-lu-noi-han-muon-thoai-hon/";
//     const URL = url.concat("trang-", i, "/#list-chapter");
//     // url.concat("trang-", i, "/#list-chapter");
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     await page.goto(URL, {
//       waitUntil: "load",
//     });

//     const links = await page.$$eval(".row ul.list-chapter li a", (link) =>
//       link.map((a) => a.href)
//     );
//     await browser.close();
//     const index = linksChap.includes(links[0]);
//     if (index) break;
//     // console.log(index);
//     linksChap = [...linksChap, ...links];
//   }
//   console.log(linksChap);
//   // return linksChap;
// }
// getLinks();
