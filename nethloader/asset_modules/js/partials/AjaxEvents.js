/* 
* Find and manage delete buttons
*/
var deleteConfirmButton;
var deleteButtons;

const init = () => {
  deleteImagesInit();
  uploadImageInit();
}

const deleteImagesInit = () => {
  deleteConfirmButton = document.querySelector("[data-deleteconfirm]");
  findDeleteButtons();
  addDelButEventListeners();
}

const findDeleteButtons = () => {
  deleteButtons = document.querySelectorAll("[data-delimageid]");
}

const addDelButEventListeners = () => {
  for (let i = deleteButtons.length - 1; i >= 0; i--) {
    deleteButtons[i].addEventListener('click', deleteImage);
  }
}

const deleteImage = (event) => {
  let imageId = event.currentTarget.dataset.delimageid;
  var deleteReq = new XMLHttpRequest();
  deleteReq.open("POST", "/image/delete/?id=" + imageId, true);
  deleteReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  deleteReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  deleteConfirmButton.onclick = () => {
    deleteReq.send();
    location.reload(true);
  }

}

/*
* Upload image
*/
var uploadInput;
var uploadButton;
var tempData;

const uploadImageInit = () => {
  uploadInput = document.getElementById('file');
  uploadButton = document.getElementById('upload-button');
  tempData = document.getElementById('temp-data');
  uploadInput.addEventListener( 'change', () => {
    tempData.innerHTML = uploadInput.files[0].name || '';
  })
  if(uploadButton){uploadButton.addEventListener('click', uploadImage)};
}

const uploadImage = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  var uploadReq = new XMLHttpRequest();

  uploadReq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      location.href = this.responseURL;
    } else if(!this.readyState == 4 || !this.status == 200) {
      tempData.innerHTML = "There was an errror uploading your image";
    }
  }

  if(uploadInput.files[0]) {
    let formData = new FormData();
    formData.append('file', uploadInput.files[0], uploadInput.files[0].name);
    uploadReq.open("POST", "/image/upload/", true);
    uploadReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
    uploadReq.send(formData);
  } else {
    tempData.innerHTML = "Provide an image";
  }
}


export default {
  init
}