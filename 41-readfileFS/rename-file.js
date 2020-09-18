const fs = require("fs");
const path = require("path");
const naturalCompare = require("string-natural-compare");
const dir = "E:/appvivungcungcon/test/copy/cp1";
const dirSource = "E:/Truyenvn/14-nguyen-ton";
const dirDest = "E:/appvivungcungcon/test/copy";
const gm = require("gm");
const sharp = require("sharp");

let oldFile = dir + "/newFile-4.webp";
var sizeOf = require("image-size");

sharp("17.jpg")
  .resize(420)
  .toFile("190.jpg", function (err) {
    if (err) {
      throw err;
    }
  });

sizeOf("180.jpg", function (err, dimensions) {
  console.log(dimensions.width, dimensions.height);
});
// gm("17.jpg").size(function (err, size) {
//   if (!err) {
//     console.log("width = " + size.width);
//     console.log("height = " + size.height);
//   } else {
//     console.log(err);
//   }
// });
// fs.readdirSync(dir).forEach((file) => {
//   console.log(file);
//   fs.rename(dir + "/" + file, dir + "/newFile-" + file, (err) => {
//     if (err) throw err;
//     console.log("Rename complete!");
//   });
// });
// let oldFile = dir + "/8.webp";
// let newFile = dir + "/20.webp";
// fs.rename(oldFile, newFile, (err) => {
//   if (err) throw err;
//   console.log("Rename complete!");
// });
