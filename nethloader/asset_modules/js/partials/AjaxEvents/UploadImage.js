/*---------------
 *  Upload image
 * ------------ */
var uploadInput,   // File to be uploaded
    uploadButton,  // Button to open upload modal
    tempData,      // UX text response
    cancelButton;  // Maybe not

const init = () => {
  uploadInput = document.getElementById('file');
  if (uploadInput) {
    cancelButton = document.querySelector('[data-closedialog=\'upload\']');
    uploadButton = document.getElementById('upload-button');
    tempData = document.getElementById('temp-data');
    // Show the name of the file when a file is selected
    uploadInput.addEventListener('change', () => {
      tempData.removeAttribute('style');
      tempData.innerHTML = `<svg viewBox='0 0 24 24'><use xlink:href='/img/icons.svg#file'></use></svg>&nbsp;&nbsp;<p>${uploadInput.files[0].name || ''}</p>`;
    });
    uploadButton.addEventListener('click', uploadImage);
  }
};

/*
* Checks if a file has a specific extension
*/
const isValidFormat = (filename) => {
  var parts = filename.split('.'),
      ext = parts[parts.length - 1],
      result = false;
  // supportedExtensions is declared and initialized in the _Layout view
  supportedExtensions.forEach(i => {
    if (ext === i) { result = true; }
  });

  return result;
};

/*
 * Upload an image (upload has been clicked after selecting a file)
 */
const uploadImage = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var uploadReq = new XMLHttpRequest();

  uploadReq.onreadystatechange = function () {
    uploadButton.classList.toggle('button--disabled');
    cancelButton.classList.toggle('button--disabled');
    uploadButton.children[0].innerHTML = '<div class=\'loader-wrapper flex flex-full-center is-processing\'><div class=\'loader\'></div></div>';

    if (this.readyState == 4 && this.status > 200) {
      uploadButton.classList.toggle('button--disabled');
      cancelButton.classList.toggle('button--disabled');
      tempData.style.color = '#e53935';
      setTempData('There was an errror uploading your image');
      uploadButton.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#upload\'></use></svg>';
    } else if (this.readyState == 4 && this.status == 200) {
      uploadButton.classList.toggle('button--disabled');
      cancelButton.classList.toggle('button--disabled');
      location.href = this.responseURL;
    }
  };

  if (uploadInput.files[0]) {
    let formData = new FormData();

    formData.append('file', uploadInput.files[0], uploadInput.files[0].name);

    if (isValidFormat(uploadInput.files[0].name)) {
      tempData.removeAttribute('style');
      uploadReq.open('POST', '/image/upload/', true);
      uploadReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
      uploadReq.send(formData);
    } else {
      tempData.style.color = '#e53935';
      setTempData('Unsuported file extension');
    }
  } else {
    tempData.style.color = '#e53935';
    setTempData('Please, provide an image');
  }
};

/*
 * Sets the text feedback when manipulating files in the upload dialog
 */
const setTempData = (text) => {
  tempData.innerHTML = `<svg viewBox='0 0 24 24'><use xlink:href='/img/icons.svg#alert'></use></svg>&nbsp;&nbsp;<p>${text}</p>`;
};

export default {
  init
};