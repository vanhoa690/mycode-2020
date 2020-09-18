// const imagemin = require("imagemin");
// const imageminJpegtran = require("imagemin-jpegtran");
// const imageminPngquant = require("imagemin-pngquant");
// (async () => {
//   const files = await imagemin([dirSource + "/*.{jpg,jpeg,png}"], {
//     destination: dirDest,
//     plugins: [
//       imageminJpegtran(),
//       imageminPngquant({
//         quality: [0.6, 0.8],
//       }),
//     ],
//   });

//   console.log(files);
//   //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
// })();
const compress_images = require("compress-images");
const dirSource = "E:/appvivungcungcon/test/srouce/tap-3";
const dirDest = "E:/appvivungcungcon/test/copy";
let INPUT_path_to_your_images =
  dirSource + "/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
let OUTPUT_path = dirDest + "/";

compress_images(
  INPUT_path_to_your_images,
  OUTPUT_path,
  { compress_force: false, statistic: true, autoupdate: true },
  false,
  { jpg: { engine: "webp", command: false } },
  { png: { engine: "webp", command: false } },
  // { svg: { engine: false, command: false } },
  // { gif: { engine: false, command: false } },
  // { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
  // { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
  { svg: { engine: "svgo", command: "--multipass" } },
  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
  function (error, completed, statistic) {
    console.log("-------------");
    console.log(error);
    console.log(completed);
    console.log(statistic);
    console.log("-------------");
  }
);
