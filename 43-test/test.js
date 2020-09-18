function onload() {
  xhr.open("GET", "image.jpge");
  xhr.responseType = "arraybuffer";
  xhr.onload = function (e) {
    let blob = new Blob([xhr.response]);
    let url = URL.createObjectURL(blob);
    console.log(url);
    let img = document.getElementById("image");
    img.src = url;
  };
  xhr.send();
}
