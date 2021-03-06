const PhotoFile = document.getElementById('photo-file');
const imagePreview = document.getElementById('photo-preview');
let imageFile;
let imageName;

//select e preview

document.getElementById('select-image').onclick = function () {
  PhotoFile.click();
};

window.addEventListener('DOMContentLoaded', () => {
  PhotoFile.addEventListener('change', () => {
    let file = PhotoFile.files.item(0);
    let reader = new FileReader();
    imageName = file.name;

    reader.readAsDataURL(file);
    reader.onload = function (event) {
      imageFile = new Image();
      imageFile.src = event.target.result;
      imageFile.onload = onloadImage;
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

    cropButton.style.display = 'initial';
  },
};

Object.keys(mouseEvents).forEach((event) => {
  imagePreview.addEventListener(event, mouseEvents[event]);
});

//canvas

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

function onloadImage() {
  const { width, height } = imageFile;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(imageFile, 0, 0);

  imagePreview.src = canvas.toDataURL();
}

//cortar imagem

const cropButton = document.getElementById('crop-image');

cropButton.onclick = () => {
  const { width: fileWidth, height: fileHeight } = imageFile;
  const { width: previewWidth, height: previewHeight } = imagePreview;

  const widthFactor = fileWidth / previewWidth;
  const heightFactor = fileHeight / previewHeight;

  const [selectionWidth, selectionHeight] = [
    +selectionTool.style.width.replace('px', ''),
    +selectionTool.style.height.replace('px', ''),
  ];

  const [croppedWidth, croppedHeight] = [
    +(selectionWidth * widthFactor),
    +(selectionHeight * heightFactor),
  ];

  const [actualX, actualY] = [
    +(relativeStartX * widthFactor),
    +(relativeStartY * heightFactor),
  ];

  const croppedImg = ctx.getImageData(
    actualX,
    actualY,
    croppedWidth,
    croppedHeight
  );

  ctx.clearRect(0, 0, ctx.width, ctx.height);

  imageFile.width = canvas.width = croppedWidth;
  imageFile.height = canvas.height = croppedHeight;

  ctx.putImageData(croppedImg, 0, 0);

  selectionTool.style.display = 'none';

  imagePreview.src = canvas.toDataURL();

  downloadButton.style.display = 'initial';
};

const downloadButton = document.getElementById('download');
downloadButton.onclick = function () {
  const downloadLink = document.createElement('a');
  downloadLink.download = imageName + '-cropped.png';
  downloadLink.href = canvas.toDataURL();
  downloadLink.click();
};
