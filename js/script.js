const PhotoFile = document.getElementById('photo-file');

document.getElementById('select-image').onclick = function () {
  PhotoFile.click();
};

window.addEventListener('DOMContentLoaded', () => {
  PhotoFile.addEventListener('change', () => {
    let file = PhotoFile.files.item(0);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      let image = document.getElementById('photo-preview');
      image.src = event.target.result;
    };
  });
});
