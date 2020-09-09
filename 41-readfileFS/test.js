const fs = require("fs");
const path = require("path");
const naturalCompare = require("string-natural-compare");
const ABSPATH = path.dirname(process.mainModule.filename);
const dir = "E:/appvivungcungcon/test";
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
let files = fs.readdirSync(dir);
// .forEach((file) => {
//   // console.log(file);
//   return file;
// });
// files.sort(function (a, b) {
//   return String.naturalCompare(a.name, b.name);
// });
// files.sort((a, b) => naturalCompare(a, b));
// files.forEach((file) => {
//   console.log(file);
//   // return file;
// });
function compare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

files.sort(compare);
// files.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
console.log(files);
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
