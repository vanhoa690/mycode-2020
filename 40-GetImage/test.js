// var express = require("express");
// var app = express();

// app.get("/", function (req, res) {
//   res.send("hello world");
// });

// app.listen(3000);
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const URL = require("url").URL;
const mkdirp = require("mkdirp");

function downloadFile() {
  let src = "https://truyenvn.com/wp-content/themes/TruyenVN/captcha.php";
  const nameImage = path.basename(src);
  // let res = url.split("?")[0];
  let res = nameImage.split(".");
  if (res[1] === "php") return 1;
  console.log(res[1]);
  // let linkChap =
  //   "https://truyenvn.com/a-returners-magic-should-be-special-chuong-209-2.html";
  // let chapNumber = path.basename(linkChap).split(".")[0];
  // // let res = url.split("?")[0];
  // let arrayChap = chapNumber.split("-");
  // const indexChap = arrayChap.indexOf("chuong");
  // let arrNumberChap = arrayChap.splice(indexChap + 1, arrayChap.length);
  // let tap = arrNumberChap.join("-");
  // // let tap = arrayChap[indexChap + 1].split(".")[0];
  // console.log(tap);

  // let url = "http://truyentranhtuan.com/the-gamer-chuong-129/";
  // // const userURL = new URL(url);
  // // const requestCaller = userURL.protocol === "http:" ? http : https;
  // const nameImage = path.basename(url);
  // // let res = url.split("?")[0];
  // let res = nameImage.split("-");
  // console.log(res[3]);
  // // let fileName = ni + "." + res[2];
  // // let fileName = ni + "." + res[1];
}
downloadFile();
