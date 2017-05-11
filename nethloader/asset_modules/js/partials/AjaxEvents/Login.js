import Utils from '../Utils';

/*---------------
 *   Login form
 * ------------ */
var loginButton,
    usernameInput,
    passwordInput;

const init = () => {
  loginButton = document.getElementById('login-button');
  if (loginButton) {
    usernameInput = document.getElementById('username');
    passwordInput = document.getElementById('password');

    usernameInput.addEventListener('input', () => { Utils.testUserName(usernameInput); });
    passwordInput.addEventListener('input', () => { Utils.testPassword(passwordInput); });

    loginButton.addEventListener('click', userLogin);
  }
};

const userLogin = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (validateLogin()) {
    document.getElementsByClassName('dyn-icon')[0].innerHTML = "<div class='loader-wrapper flex flex-full-center is-processing'><div class='loader'></div></div>";
    document.forms.namedItem('loginform').submit();
  }
};

const validateLogin = () => {
  var testEm = Utils.testUserName(usernameInput),
      testPw = Utils.testPassword(passwordInput);

  if (testEm && testPw) {
    return true;
  }

  return false;
};

export default {
  init
};