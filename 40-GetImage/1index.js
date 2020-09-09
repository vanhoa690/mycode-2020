const puppeteer = require("puppeteer");
// const xlsx = require("xlsx");
const URL = "https://truyenonline.info/nhat-niem-vinh-hang";
let truyen = [];
let linkTotal = [];
// const URL = "http://books.toscrape.com/";
// const URL =
// "http://books.toscrape.com/catalogue/tipping-the-velvet_999/index.html";
async function getTitle(link, page, key) {
  await page.goto(link, {
    // Set timeout cho page
    timeout: 3000000,
  });
  // Chờ 2s sau khi page được load để tránh overload
  await page.waitFor(2000);
  console.log(link);

  let title = await page.$eval(
    ".entry-header h1.entry-title",
    (el) => el.innerText
  );

  let content = await page.$eval("div.entry-content", (el) => el.innerHTML);
  truyen.push({
    title,
    content,
  });
  console.log("Page ID Spawned", key, title);
  // console.log(truyen);
  // });
  return page;
}
async function getPage(pageNum, page, key) {
  await page.goto(pageNum, {
    // Set timeout cho page
    timeout: 3000000,
  });
  // Chờ 2s sau khi page được load để tránh overload
  await page.waitFor(2000);
  console.log(pageNum);

  const links = await page.$$eval(".entry-header h3.entry-title a", (el) =>
    el.map((a) => a.href)
  );
  linkTotal.push(links);
  // console.log("Page ID Spawned", key, title);
  console.log(linkTotal);
  // });
  return page;
}
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 720 });
    await page.goto(URL);
    // let title = await page.$eval(".product_main h1", (el) => el.innerText);
    // console.log(title);

    const links = await page.$$eval(".entry-header h3.entry-title a", (el) =>
      el.map((a) => a.href)
    );
    console.log(links);
    linkTotal.push(links);
    const promisesGetpage = [];
    for (let i = 2; i < 3; i++) {
      let pageNum = URL + "/page/" + i;
      console.log(pageNum);
      promisesGetpage.push(await getPage(pageNum, page, i));
    }
    const promisesgetContent = [];
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 1; j++) {
        promisesgetContent.push(await getTitle(linkTotal[i][j], page, i));
      }
    }
    let truyenJson = JSON.stringify(truyen);
    console.log(truyenJson);
    // const aoeLinks = truyen.map((t, i) => [i, t.title, t.content]);
    // const aoeLinks = truyen.map((t) => [t]);
    // const wb = xlsx.utils.book_new();
    // const ws = xlsx.uigrid_to_sheet(aoeLinks);

    // const ws = xlsx.utils.aoa_to_sheet(aoeLinks);
    // xlsx.utils.book_append_sheet(wb, ws);
    // xlsx.writeFile(wb, "truyen.xlsx");
    // const articles = await page.$$eval((() => {
    //   let titles = document.querySelectorAll("h4.story__heading a");
    //   let ar_title = [];
    //   console.log(titles);
    // titles.forEach((item) => {
    //   ar_title.push({
    //     href: item.getAttribute("href").trim(),
    //     title: item.getAttribute("title").trim(),
    //   });
    // });
    // console.log(ar_title);
    // return ar_title;
    // });

    // console.log(ar_title);
    await browser.close();
  } catch (error) {
    console.log("Catch : " + error);
  }
})();

//     // await page.goto("http://books.toscrape.com/");
//     // const links = await page.$$eval(".product_pod .image_container a", (el) =>
//     //   el.map((a) => a.href)
//     // );
//     // console.log(links);
//     // const aoeLinks = links.map((l) => [l]);
//     // const wb = xlsx.utils.book_new();
//     // const ws = xlsx.utils.aoa_to_sheet(aoeLinks);
//     // xlsx.utils.book_append_sheet(wb, ws);
//     // xlsx.writeFile(wb, "links.xlsx");

//     await browser.close();
//   } catch (error) {
//     console.log("Catch : " + error);
//   }
// })();
