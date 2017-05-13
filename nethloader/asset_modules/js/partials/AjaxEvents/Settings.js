import Utils from '../Utils';

var usernameTrigger,      // Username edit button
    passwordTrigger,      // Password edit button
    apikeyTrigger,        // APIkey edit button
    domainTrigger,        // Domain edit button
    removeDomainTrigger,  // Remove domain button
    deleteAccountTrigger, // Remove account button
    deleteDataTrigger,    // Remove images button

    newUserNameInput,  // New username input
    newPasswordInput,  // New password input
    cNewPasswordInput, // New password confirmation input
    oldPasswordInput,  // Old password input
    newDomainInput,    // New domain input

    activeDialogElements; // Self explanatory

const init = () => {
  findElements();
  addListeners();
};

/*
 * Find all the inputs with the 'data-type' attribute
 */
const findElements = () => {
  usernameTrigger      = document.querySelector('[data-param=\'pusername\'');
  passwordTrigger      = document.querySelector('[data-param=\'ppassword\'');
  apikeyTrigger        = document.querySelector('[data-param=\'papik\'');
  domainTrigger        = document.querySelector('[data-param=\'pdomain\''),
  removeDomainTrigger  = document.querySelector('[data-removedomain]'),
  deleteAccountTrigger = document.querySelector('[data-deleteaccount]'),
  deleteDataTrigger    = document.querySelector('[data-deletedata]');

  cNewPasswordInput = document.getElementById('cnpassword');
  newUserNameInput  = document.getElementById('nusername');
  newPasswordInput  = document.getElementById('npassword');
  oldPasswordInput  = document.getElementById('password');
  newDomainInput    = document.getElementById('ndomain');
};

/*
 * Add eventListeners of 'input' and 'click' to elements found by 'findElements()'
 */
const addListeners = () => {
  if(usernameTrigger) {
    usernameTrigger.addEventListener('click', changeUsername);
    passwordTrigger.addEventListener('click', changePassword);
    apikeyTrigger.addEventListener('click', rengenApik);
    domainTrigger.addEventListener('click', changeDomain);
    deleteAccountTrigger.addEventListener('click', removeAccount);
    deleteDataTrigger.addEventListener('click', removeData);
    if(removeDomainTrigger){ removeDomainTrigger.addEventListener('click', removeDomain); }

    newUserNameInput.addEventListener('input', () => { Utils.testUserName(newUserNameInput); });
    newPasswordInput.addEventListener('input', () => { Utils.testPasswordLength(newPasswordInput); Utils.testEqual(newPasswordInput, cNewPasswordInput); Utils.testPassword(newPasswordInput); });
    cNewPasswordInput.addEventListener('input', () => { Utils.testPassword(cNewPasswordInput); Utils.testEqual(newPasswordInput, cNewPasswordInput); });
    newDomainInput.addEventListener('input', () => { Utils.testDomain(newDomainInput); });
  }
};

/*
* Validates and sends a new username to the server to be updated in the database
*/
const changeUsername = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var newUsername       = newUserNameInput.value,
      changeuserNameReq = new XMLHttpRequest();

  changeuserNameReq.onreadystatechange = function () {
    usernameTrigger.children[0].innerHTML = '<div class=\'loader-wrapper flex flex-full-center is-processing\'><div class=\'loader\'></div></div>';

    if (this.readyState == 4 && this.status == 200) {
      document.querySelector("[data-itemvalueid = 'username']").innerHTML = this.responseText;
      usernameTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#save\'></use></svg>';
      activeDialogElements = document.getElementsByClassName('is-active');
      for (let i = activeDialogElements.length - 1; i >= 0; i--) {
        activeDialogElements[i].classList.toggle('is-active');
      }
      document.forms.namedItem('chunameForm').reset();
    } else if(this.readyState == 4 && this.status > 200){
      usernameTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#save\'></use></svg>';
    }
  }

  if(Utils.testUserName(newUserNameInput)) {
    changeuserNameReq.open('POST', '/Account/ChangeUserName/?newUserName=' + newUserNameInput.value, true);
    changeuserNameReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
    changeuserNameReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    changeuserNameReq.send();
  }
}

/*
* Validates and sends a new password to the server to be updated in the database
*/
const changePassword = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var newPassword       = newPasswordInput.value,
      cNewPassword      = cNewPasswordInput.value,
      password          = oldPasswordInput.value,
      changePasswordReq = new XMLHttpRequest();

  changePasswordReq.onreadystatechange = function () {
    passwordTrigger.children[0].innerHTML = '<div class=\'loader-wrapper flex flex-full-center is-processing\'><div class=\'loader\'></div></div>';

    if (this.readyState == 4 && this.status == 200) {
      passwordTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#save\'></use></svg>';
      activeDialogElements = document.getElementsByClassName('is-active');
      for (let i = activeDialogElements.length - 1; i >= 0; i--) {
        activeDialogElements[i].classList.toggle('is-active');
      }
      document.forms.namedItem('chpasswordForm').reset();
    } else if(this.readyState == 4 && this.status > 200){
      passwordTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#save\'></use></svg>';
    }
  }

  if(validateNewPassword()) {
    changePasswordReq.open('post', '/Account/ChangePassword/?OldPassword='+ password + '&NewPassword=' + newPassword + '&ConfirmNewPassword=' + cNewPassword, true);
    changePasswordReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
    changePasswordReq.send();
  }
}

/*
* Request a new APIkey from the server
*/
const rengenApik = () => {
  var newApikReq = new XMLHttpRequest();

  newApikReq.onreadystatechange = function () {
    apikeyTrigger.children[0].innerHTML = '<div class=\'loader-wrapper flex flex-full-center is-processing\'><div class=\'loader\'></div></div>';

    if (this.readyState == 4 && this.status == 200) {
      document.querySelector('[data-itemvalueid=\'apikey\']').innerHTML = this.responseText;
      apikeyTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#key-reset\'></use></svg>';
      activeDialogElements = document.getElementsByClassName('is-active');
      for (let i = activeDialogElements.length - 1; i >= 0; i--) {
        activeDialogElements[i].classList.toggle('is-active');
      }
    } else if(this.readyState == 4 && this.status > 200){
      apikeyTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#key-reset\'></use></svg>';
    }
  }

  newApikReq.open('POST', '/Account/RegenApiKey/', true);
  newApikReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  newApikReq.send();
}

/*
* Validate and send a new domain to the server to be updated in the database
*/
const changeDomain = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  var newDomain        = newDomainInput.value,
      changeDomaineReq = new XMLHttpRequest();

  changeDomaineReq.onreadystatechange = function () {
    domainTrigger.children[0].innerHTML = '<div class=\'loader-wrapper flex flex-full-center is-processing\'><div class=\'loader\'></div></div>';

    if (this.readyState == 4 && this.status == 200) {
      document.querySelector('[data-itemvalueid = \'domain\']').innerHTML = this.responseText;
      domainTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#save\'></use></svg>';
      activeDialogElements = document.getElementsByClassName('is-active');
      for (let i = activeDialogElements.length - 1; i >= 0; i--) {
        activeDialogElements[i].classList.toggle('is-active');
      }
      document.forms.namedItem('chdomainForm').reset();
    } else if(this.readyState == 4 && this.status > 200){
      domainTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#save\'></use></svg>';
    }
  }

  if(Utils.testDomain(newDomainInput)) {
    changeDomaineReq.open('POST', '/Account/ChangeCustomDomain/?domain=' + newDomain, true);
    changeDomaineReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
    changeDomaineReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    changeDomaineReq.send();
  }
}

/*
* Send an empty domain to the server to disable the custom domain service
*/
const removeDomain = () => {
  var removeDomainReq = new XMLHttpRequest();

  removeDomainReq.onreadystatechange = function () {
    removeDomainTrigger.children[0].innerHTML = "<div class='loader-wrapper flex flex-full-center is-processing'><div class='loader'></div></div>";

    if (this.readyState == 4) {
      document.querySelector('[data-itemvalueid=\'domain\']').innerHTML = 'N/D';
      removeDomainTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#reset-domain\'></use></svg>';
      activeDialogElements = document.getElementsByClassName('is-active');
      for (let i = activeDialogElements.length - 1; i >= 0; i--) {
        activeDialogElements[i].classList.toggle('is-active');
      }
    }
  }

  removeDomainReq.open('POST', '/Account/ChangeCustomDomain/', true);
  removeDomainReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  removeDomainReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  removeDomainReq.send();
}

/*
* Request user account removal from the server
*/
const removeAccount = () => {
  var remAccReq = new XMLHttpRequest();

  remAccReq.onreadystatechange = function () {
    deleteAccountTrigger.children[0].innerHTML = '<div class=\'loader-wrapper flex flex-full-center is-processing\'><div class=\'loader\'></div></div>';
  }

  remAccReq.open('POST', '/Account/RemoveAccount/', true);
  remAccReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  remAccReq.send();
}

/*
* Request user data(images) removal from the server
*/
const removeData = () => {
  var remDataReq = new XMLHttpRequest();


  remDataReq.onreadystatechange = function () {
    deleteAccountTrigger.children[0].innerHTML = '<div class=\'loader-wrapper flex flex-full-center is-processing\'><div class=\'loader\'></div></div>';

    if (this.readyState == 4) {
      deleteAccountTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#del-sweep\'></use></svg>';
      activeDialogElements = document.getElementsByClassName('is-active');
      for (let i = activeDialogElements.length - 1; i >= 0; i--) {
        activeDialogElements[i].classList.toggle('is-active');
      } 
    } else {
      deleteAccountTrigger.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#del-sweep\'></use></svg>';
    }
    
  }

  remDataReq.open('POST', '/Account/RemoveAllUserImages/', true);
  remDataReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  remDataReq.send();
}


const validateNewPassword = () => {
  var testCp = Utils.testPassword(cNewPasswordInput),
      testEq = Utils.testEqual(newPasswordInput, cNewPasswordInput),
      testLn = Utils.testPasswordLength(newPasswordInput);

  if (testCp && testLn && testEq) {
    return true;
  }

  return false;
};

export default {
  init
};