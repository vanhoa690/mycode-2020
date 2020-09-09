const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const URL = require("url").URL;
const mkdirp = require("mkdirp");

// url: <img src="http://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&amp;gadget=a&amp;no_expand=1&amp;resize_h=0&amp;rewriteMime=image/*&amp;url=https://i.imgur.com/rm8wnvZ.jpg?imgmax=3000">
// function downloadFile(url, filePath, ni, tap) {
//   // function downloadFile() {
//   // let url =
//   // "http://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&amp;gadget=a&amp;no_expand=1&amp;resize_h=0&amp;rewriteMime=image/*&amp;url=https://i.imgur.com/rm8wnvZ.jpg?imgmax=3000";
//   // let ni = 1;
//   url = url.split("=")[6];
//   url = url.split("?")[0];
//   console.log(url);
//   const userURL = new URL(url);
//   const requestCaller = userURL.protocol === "http:" ? http : https;
//   const nameImage = path.basename(url);
//   // // let res = url.split("?")[0];
//   let res = nameImage.split(".");
//   // // console.log(res[1]);
//   // // let fileName = ni + "." + res[2];
//   let fileName = ni + "." + res[1];
//   console.log(fileName);

//   const req = requestCaller.get(url, function (res) {
//     // const dirnames = "2";
//     // fs.mkdirSync(dirnames, 0o776);
//     // const filePath = path.resolve(__dirname, dirnames);
//     const fileStream = fs.createWriteStream(path.resolve(filePath, fileName));
//     res.pipe(fileStream);
//     fileStream.on("error", function (err) {
//       console.log(err);
//     });
//     fileStream.on("finish", function () {
//       fileStream.close();
//       // console.log("Done!");
//     });
//   });
//   req.on("error", function (err) {
//     console.log(err);
//   });
//   // let imgSelector = `<img src='https://img.truyennho.com/images/hiep-khach-giang-ho/tap-${tap}/${fileName}' alt='ĐỌC TRUYỆN TRANH HIỆP KHÁCH GIANG HỒ ONLINE - Tập ${tap} - Chap ${tap} - Chương ${tap} - TruyệnNhỏ.Com - truyennho.com - ${ni}' />`;
//   // return imgSelector;
//   return 1;
// }

// downloadFile();
function downloadFile(url, filePath, ni, tap) {
  const userURL = new URL(url);
  const requestCaller = userURL.protocol === "http:" ? http : https;
  const nameImage = path.basename(url);
  // let res = url.split("?")[0];
  let res = nameImage.split(".");
  if (res[1] === "php") return 1;
  // console.log(res[1]);
  // let fileName = ni + "." + res[2];
  let fileName = ni + "." + res[2];
  const req = requestCaller.get(url, function (res) {
    // const dirnames = "2";
    // fs.mkdirSync(dirnames, 0o776);
    // const filePath = path.resolve(__dirname, dirnames);
    const fileStream = fs.createWriteStream(path.resolve(filePath, fileName));
    res.pipe(fileStream);
    fileStream.on("error", function (err) {
      console.log(err);
    });
    fileStream.on("finish", function () {
      fileStream.close();
      // console.log("Done!");
    });
  });
  req.on("error", function (err) {
    console.log(err);
  });
  return 1;
}
module.exports.downloadFile = downloadFile;
// downloadFile(url);

// function downloadFile(url, filePath, ni) {
//   console.log(url);
//   const userURL = new URL(url);
//   const requestCaller = userURL.protocol === "http:" ? http : https;
//   const nameImage = path.basename(url);
//   let res = nameImage.split(".");
//   console.log(res[2]);
// let fileName = ni + "." + res[2];

// const req = requestCaller.get(url, function (res) {
//   // const dirnames = "2";
//   // fs.mkdirSync(dirnames, 0o776);
//   // const filePath = path.resolve(__dirname, dirnames);
//   const fileStream = fs.createWriteStream(path.resolve(filePath, fileName));
//   res.pipe(fileStream);
//   fileStream.on("error", function (err) {
//     console.log(err);
//   });
//   fileStream.on("finish", function () {
//     fileStream.close();
//     // console.log("Done!");
//   });
// });
// req.on("error", function (err) {
//   console.log(err);
// });
// let imgSelector = `<img src="https://img.truyennho.com/images/one-piece/tap-989/${fileName}" alt="truyện one piece - Tập 989 - đảo hải tặc - truyennho.com - ${ni} " />`;
// console.log(imgSelector);
// // return imgSelector;
// }
// let url =
//   "http://2.bp.blogspot.com/-10KbQGwwqy4/UGGYkCodc-I/AAAAAAAABtM/HTOXrIz6LYg/HKGH-BLOGTRUYEN.COM-Vol1-Chap2-P02.jpg?imgmax=3000";
// let res = url.split("?")[0];
// const filePath = path.resolve(__dirname, "tap-1");
// downloadFile(res, filePath, 1);
