/* 
* Delete image
*/
var deleteConfirmButton;
var deleteButtons;

const init = () => {
  deleteImagesInit();
  uploadImageInit();
  loginFormInit();
  registerFormInit();
}

const deleteImagesInit = () => {
  deleteConfirmButton = document.querySelector("[data-deleteconfirm]");
  if(deleteConfirmButton) {
    findDeleteButtons();
    addDelButEventListeners();
  }
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
  if(uploadInput){
    uploadButton = document.getElementById('upload-button');
    tempData = document.getElementById('temp-data');
    uploadInput.addEventListener( 'change', () => {
      tempData.innerHTML = uploadInput.files[0].name || '';
    });
    uploadButton.addEventListener('click', uploadImage);
  };
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
    tempData.innerHTML = "Please, provide an image";
  }
}

/*
* Login form
*/
var loginButton;
var userNameInput;
var passwordInput;
var rememberInput;


const loginFormInit = () => {
  loginButton = document.getElementById('login-button');
  if(loginButton) {
    userNameInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    rememberInput = document.getElementById('remember_me');
    loginButton.addEventListener('click', userLogin);
  }
}

const userLogin = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  var loginReq = new XMLHttpRequest();
  loginReq.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
        location.href = this.responseURL;
    } else if(!this.readyState == 4 || !this.status == 200) {
      console.log("The password or username are wrong");
    }
  }
  loginReq.open("POST", "/account/login/?Email=" + userNameInput.value + "&Password=" + passwordInput.value + "&RememberMe=" + rememberInput.checked, true);
  loginReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  loginReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  loginReq.send();
}

/*
* Register form
*/
var registerButton;
var fullNameInput;
var usernameInput;
var emailInput;
var confirmPasswordInput;



const registerFormInit = () => {
  registerButton = document.getElementById('register-button');
  if(registerButton) {
    fullNameInput = document.getElementById('fullname');
    usernameInput = document.getElementById('username');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    confirmPasswordInput = document.getElementById('cpassword');
    registerButton.addEventListener('click', userRegister);
  }
}

const userRegister = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  var registerReq = new XMLHttpRequest();
  registerReq.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
      location.href = this.responseURL;
    } else if(!this.readyState == 4 || !this.status == 200) {
      console.log("Something is wrong");
    }
  }
  registerReq.open("POST", "/account/register/?FullName=" + fullNameInput.value + "&UserName=" + usernameInput.value + "&Email=" + emailInput.value + "&Password=" + passwordInput.value + "&ConfirmPassword=" + confirmPasswordInput.value, true);
  registerReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  registerReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  registerReq.send();
}


export default {
  init
}