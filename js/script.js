const PhotoFile = document.getElementById('photo-file');
const imagePreview = document.getElementById('photo-preview');
const imageFile = new Image();

//select e preview

document.getElementById('select-image').onclick = function () {
  PhotoFile.click();
};

window.addEventListener('DOMContentLoaded', () => {
  PhotoFile.addEventListener('change', () => {
    let file = PhotoFile.files.item(0);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      imageFile.src = event.target.result;
    };
  });
});

//selection tool
const selectionTool = document.getElementById('selection-tool');
let startX, startY, relativeStartX, relativeStartY;
let endX, endY, relativeEndX, relativeEndY;
let startSelection = false;

const mouseEvents = {
  mouseover() {
    this.style.cursor = 'crosshair';
  },
  mousedown() {
    const { clientX, clientY, offsetX, offsetY } = event;
    startX = clientX;
    startY = clientY;
    relativeStartX = offsetX;
    relativeStartY = offsetY;

    startSelection = true;
  },
  mousemove() {
    endX = event.clientX;
    endY = event.clientY;
    if (startSelection) {
      selectionTool.style.display = 'initial';
      selectionTool.style.top = startY + 'px';
      selectionTool.style.left = startX + 'px';
      selectionTool.style.width = endX - startX + 'px';
      selectionTool.style.height = endY - startY + 'px';
    }
  },
  mouseup() {
    startSelection = false;
    relativeEndX = event.layerX;
    relativeEndY = event.layerY;
  },
};

Object.keys(mouseEvents).forEach((event) => {
  imagePreview.addEventListener(event, mouseEvents[event]);
});

//canvas

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

imageFile.onload = function () {
  const { width, height } = imageFile;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(imageFile, 0, 0);

  imagePreview.src = canvas.toDataURL();
};
