const fs = require("fs");
const path = require("path");
const naturalCompare = require("string-natural-compare");
const ABSPATH = path.dirname(process.mainModule.filename);
const dir = "E:/appvivungcungcon/test";
const dirSource = "E:/Truyenvn/14-nguyen-ton";
const dirDest = "E:/appvivungcungcon/test/copy";
// var files = fs.readdirSync(dir);

// files.sort(function (a, b) {
//   let s1 = fs.statSync(ABSPATH + path + a);
//   let s2 = fs.statSync(ABSPATH + path + b);
//   console.log(s1.ctime < s2.ctime);
//   // return s1.ctime < s2.ctime;
//   //  return
//   // console.log(
//   //   fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime()
//   // );
// });
// fs.readdir(dir, (err, files) => {
//   console.log(files.length);
// });
let files = fs.readdirSync(dirSource);
// .forEach((file) => {
//   // console.log(file);
//   return file;
// });
// files.sort(function (a, b) {
//   return String.naturalCompare(a.name, b.name);
// });
files.sort((a, b) => naturalCompare(a, b));
// files.forEach((file) => {
//   console.log(file);
//   // return file;
// });
// function compare(a, b) {
//   if (a < b) {
//     return -1;
//   }
//   if (a > b) {
//     return 1;
//   }
//   return 0;
// }

// files.sort(compare);
// files.sort((a, b) =>
//   a.split(".")[0] > b.split(".")[0]
//     ? 1
//     : b.split(".")[0] > a.split(".")[0]
//     ? -1
//     : 0
// );
// files.sort((a, b) => a - b);
// files.sort((a, b) => {
//   return a.split(".")[0] - b.split(".")[0];
// });
// let arrSplice = [23];
// let files = [];
console.log(files.length === 0);
let xoa = true;
let chay = true;
let emptyTruyen = [];
for (let i = 0; i < files.length; i++) {
  // console.log(i + " la cua " + files[i]);
  let dirFolder = dirSource + "/" + files[i];
  let item = fs.readdirSync(dirFolder);
  item.sort((a, b) => {
    return a.split(".")[0] - b.split(".")[0];
  });
  if (item.length === 0) emptyTruyen.push(files[i]);
  if (chay) {
    if (item.length > 0) {
      // console.log(item);
      // let typeFile = item[0].split(".")[1];
      try {
        fs.copyFileSync(
          dirFolder + "/" + item[0],
          dirDest + "/" + files[i] + "-" + item[0]
        );
        console.log(item[0] + "-" + files[i] + " was copied");
      } catch (err) {
        console.log(err);
      }
      if (xoa) {
        try {
          let pathFile = dirSource + "/" + files[i] + "/" + item[0];
          console.log(pathFile);
          fs.unlinkSync(pathFile);
          console.log(files[i] + "/" + item[0] + "da xoa");
          //file removed
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      console.error(item + "empty");
    }
  }
}
console.error(emptyTruyen);
// let pathFile = dir + "/1.jpg";
// fs.unlinkSync(pathFile);
// let typeFile = files[0].split(".")[1];
// console.log(typeFile);
// fs.copyFile(dirSource + "/" + files[0], dirDest + "/new." + typeFile, (err) => {
//   if (err) throw err;
//   console.log("source.txt was copied to destination.txt");
// });
// fs.readdir(dir, function (err, files) {
//   files = files
//     .map(function (fileName) {
//       return {
//         name: fileName,
//         time: fs.statSync(dir + "/" + fileName).mtime.getTime(),
//       };
//     })
//     .sort(function (a, b) {
//       return a.time - b.time;
//     })
//     .map(function (v) {
//       console.log(v.name);
//       // return v.name;
//     });
// });
