/*---------------
 *  Delete image
 * ------------ */
var deleteConfirmButton,
    deleteButtons;

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
  deleteConfirmButton = document.querySelector('[data-deleteconfirm]');
  if(deleteConfirmButton) {
    findDeleteButtons();
    addDelButEventListeners();
  }
}

/*
 * Find the delete buttons (one per image)
 */
const findDeleteButtons = () => {
  deleteButtons = document.querySelectorAll('[data-delimageid]');
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
      console.log('Something went wrong');
    }
  }

  deleteReq.open('POST', '/image/delete/?id=' + imageId, true);
  deleteReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  deleteReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  deleteConfirmButton.onclick = () => {
    deleteReq.send();
  }
}

/*---------------
 *  Upload image
 * ------------ */
var uploadInput,   // File to be uploaded
    uploadButton,  // Button to open upload modal
    tempData,      // UX text response
    loader,        // Uploading image....
    cancelButton;  // Maybe not

const uploadImageInit = () => {
  uploadInput = document.getElementById('file');
  if(uploadInput){
    loader       = document.getElementsByClassName('loader-wrapper')[0];
    cancelButton = document.querySelector('[data-closedialog="upload"]');
    uploadButton = document.getElementById('upload-button');
    tempData     = document.getElementById('temp-data');
    // Show the name of the file when a file is selected
    uploadInput.addEventListener( 'change', () => {
      tempData.removeAttribute('style');
      tempData.innerHTML = `<svg viewBox="0 0 24 24"><use xlink:href="/img/icons.svg#file"></use></svg>&nbsp;&nbsp;<p>${uploadInput.files[0].name || ''}</p>`;
    });
    uploadButton.addEventListener('click', uploadImage);
  };
}

/*
* Checks if a file has a specific extension
*/
const isValidFormat = (filename) => {
  var parts  = filename.split('.'),
      ext    = parts[parts.length - 1],
      result = false;
  // supportedExtensions is declared and initialized in the _Layout view
  supportedExtensions.forEach(i => {
    if(ext === i) { result = true; }
  });

  return result;
}

/*
 * Upload an image (upload has been clicked after selecting a file)
 */
const uploadImage = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var uploadReq = new XMLHttpRequest();

  uploadReq.onreadystatechange = function() {
    uploadButton.classList.toggle('button--disabled');
    cancelButton.classList.toggle('button--disabled');
    loader.classList.toggle('is-uploading');

    if (this.readyState == 4 && this.status == 200) {
      loader.classList.toggle('is-uploading');
      uploadButton.classList.toggle('button--disabled');
      cancelButton.classList.toggle('button--disabled');
      location.href = this.responseURL;
    } else if(!this.readyState == 4 || !this.status == 200) {
      loader.classList.toggle('is-uploading');
      uploadButton.classList.toggle('button--disabled');
      cancelButton.classList.toggle('button--disabled');
      tempData.style.color = '#e53935';
      setTempData('There was an errror uploading your image');
    }
  }

  if(uploadInput.files[0]) {
    let formData = new FormData();

    formData.append('file', uploadInput.files[0], uploadInput.files[0].name);

    if(isValidFormat(uploadInput.files[0].name)) {
      tempData.removeAttribute('style');
      uploadReq.open('POST', '/image/upload/', true);
      uploadReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
      uploadReq.send(formData);
    } else {
      tempData.style.color = '#e53935';
      setTempData('Unsuported file extension');
    }
  } else {
    tempData.style.color = '#e53935'
    setTempData('Please, provide an image');
  }
}

/*
 * Sets the text feedback when manipulating files in the upload dialog
 */
const setTempData = (text) => {
  tempData.innerHTML = `<svg viewBox="0 0 24 24"><use xlink:href="/img/icons.svg#alert"></use></svg>&nbsp;&nbsp;<p>${text}</p>`;
}

/*
 * Input validation functions 
 */

const testUserName = (input) => {
  return (input.value ? manageEmptyField(input, true) : manageEmptyField(input, false)) &&
    (input.value.match(/^[!-~ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿ]*$/) ? manageInvalidField(input, true) : manageInvalidField(input, false));
}

const testEmail = (input) => {
  return (input.value ? manageEmptyField(input, true) : manageEmptyField(input, false)) &&
    (input.value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) ? manageInvalidField(input, true) : manageInvalidField(input, false));
}

const testGeneric = (input) => {
  return (input.value ? manageEmptyField(input, true) : manageEmptyField(input, false));
}

/*---------------
 *   Login form
 * ------------ */
var loginButton,
    usernameInput,
    passwordInput;

const loginFormInit = () => {
  loginButton = document.getElementById('login-button');
  if(loginButton) {
    usernameInput = document.getElementById('username');
    passwordInput = document.getElementById('password');

    usernameInput.addEventListener('input', () => { testUserName(usernameInput); });
    passwordInput.addEventListener('input', () => { testGeneric(passwordInput); })

    loginButton.addEventListener('click', userLogin);
  }
}

const userLogin = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var loginReq = new XMLHttpRequest(),
      data = new FormData(document.forms.namedItem('loginform'));

  loginReq.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
        location.href = this.responseURL;
    } else if(!this.readyState == 4 || !this.status == 200) {
      console.log('Something went wrong');
    }
  }

  loginReq.open('POST', '/account/login/', true);
  loginReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  if(validateLogin()) {
    loginReq.send(data);
  }
}

const validateLogin = () => {
  var testEm = testUserName(usernameInput),
      testPw = testGeneric(passwordInput);

  if(testEm && testPw) {
    return true;
  }

  return false;
}

/*---------------
 * Register form
 * ------------ */
var registerButton,
    usernameInput,
    emailInput,
    passwordInput,
    cpasswordInput;

const registerFormInit = () => {
  registerButton = document.getElementById('register-button');
  if(registerButton) {
    usernameInput  = document.getElementById('username');
    emailInput     = document.getElementById('email');
    passwordInput  = document.getElementById('password');
    cpasswordInput = document.getElementById('cpassword');

    usernameInput.addEventListener('input',  () => { testUserName(usernameInput); });
    emailInput.addEventListener('input',     () => { testEmail(emailInput); });
    passwordInput.addEventListener('input',  () => { testGeneric(passwordInput); });
    cpasswordInput.addEventListener('input', () => { testGeneric(cpasswordInput); })

    registerButton.addEventListener('click', userRegister);
  }
}

const userRegister = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var registerReq = new XMLHttpRequest(),
      data = new FormData(document.forms.namedItem('registerform'));

  registerReq.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
      location.href = this.responseURL;
    } else if(!this.readyState == 4 || !this.status == 200) {
      console.log('Something went wrong');
    }
  }

  registerReq.open('POST', '/account/register/', true);
  registerReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  if(validateRegister()) {
    registerReq.send(data);
  }
}

const validateRegister = () => {
  var testUn = testUserName(usernameInput),
      testEm = testEmail(emailInput),
      testPs = testGeneric(passwordInput),
      testCp = testGeneric(cpasswordInput);

  if(testUn && testEm && testPs && testCp) {
    return true;
  }

  return false;
}

const manageEmptyField = (input, state) => {
  if(!state) {
    input.classList.add('input--text--error');
    input.nextElementSibling.dataset.error = "This field can't be empty";
    return false;
  } else {
    input.classList.remove('input--text--error');
    return true;
  }
}

const manageInvalidField = (input, state) => {
  if(!state) {
    input.classList.add('input--text--error');
    input.nextElementSibling.dataset.error = "This field is not valid";
    return false;
  } else {
    input.classList.remove('input--text--error');
    return true;
  }
}

export default {
  init
}
