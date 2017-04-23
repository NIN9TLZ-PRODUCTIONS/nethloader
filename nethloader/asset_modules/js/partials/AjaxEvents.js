/*---------------
 *  Delete image
 * ------------ */
var deleteConfirmButton;
var deleteButtons;

const init = () => {
  deleteImagesInit();
  uploadImageInit();
  loginFormInit();
  registerFormInit();
}

/*
 * Find the delete confirm button element (located in the dialog) then find all the delete buttons on the images and listen for clicks
 */
const deleteImagesInit = () => {
  deleteConfirmButton = document.querySelector("[data-deleteconfirm]");
  if(deleteConfirmButton) {
    findDeleteButtons();
    addDelButEventListeners();
  }
}

/*
 * Find the delete buttons (one per image)
 */
const findDeleteButtons = () => {
  deleteButtons = document.querySelectorAll("[data-delimageid]");
}

/*
 * Listen for clicks and proceed (a dialog will be launched)
 */
const addDelButEventListeners = () => {
  for (let i = deleteButtons.length - 1; i >= 0; i--) {
    deleteButtons[i].addEventListener('click', deleteImage);
  }
}

/*
 * Get the image id to be deleted and delete the image if confirmed (user has clicked on yes, delete it)
 */
const deleteImage = (event) => {
  let imageId = event.currentTarget.dataset.delimageid;
  var deleteReq = new XMLHttpRequest();
  deleteReq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    } else if(!this.readyState == 4 || !this.status == 200) {
      console.log("Something went wrong");
    }
  }
  deleteReq.open("POST", "/image/delete/?id=" + imageId, true);
  deleteReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  deleteReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  deleteConfirmButton.onclick = () => {
    deleteReq.send();
  }
}

/*---------------
 *  Upload image
 * ------------ */
var uploadInput; // File to be uploaded
var uploadButton;
var tempData; // UX text response

const uploadImageInit = () => {
  uploadInput = document.getElementById('file');
  if(uploadInput){
    uploadButton = document.getElementById('upload-button');
    tempData     = document.getElementById('temp-data');
    // Show the name of the file when a file is selected
    uploadInput.addEventListener( 'change', () => {
      tempData.innerHTML = uploadInput.files[0].name || '';
    });
    uploadButton.addEventListener('click', uploadImage);
  };
}

/*
 * If we have ourselves a file, then proceed with the request
 */
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
    tempData.innerHTML = "Please, provide an image";
  }
}

/*---------------
 *   Login form
 * ------------ */
var loginButton;
var userNameInput;
var passwordInput;
var rememberInput;

const loginFormInit = () => {
  loginButton = document.getElementById('login-button');
  if(loginButton) {
    loginButton.addEventListener('click', userLogin);
  }
}

const userLogin = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var loginReq = new XMLHttpRequest();
  var data = new FormData(document.forms.namedItem("loginform"));

  loginReq.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
        location.href = this.responseURL;
    } else if(!this.readyState == 4 || !this.status == 200) {
      console.log("Something went wrong");
    }
  }
  loginReq.open("POST", "/account/login/", true);
  loginReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  loginReq.send(data);
}

/*---------------
 * Register form
 * ------------ */
var registerButton;
var fullNameInput;
var usernameInput; // Not the login one, notice the lowercase 'n'
var emailInput;
var confirmPasswordInput;

const registerFormInit = () => {
  registerButton = document.getElementById('register-button');
  if(registerButton) {
    registerButton.addEventListener('click', userRegister);
  }
}

const userRegister = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var registerReq = new XMLHttpRequest();
  var data = new FormData(document.forms.namedItem("registerform"));

  registerReq.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
      location.href = this.responseURL;
    } else if(!this.readyState == 4 || !this.status == 200) {
      console.log("Something went wrong");
    }
  }

  registerReq.open("POST", "/account/register/", true);
  registerReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  registerReq.send(data);
}

export default {
  init
}