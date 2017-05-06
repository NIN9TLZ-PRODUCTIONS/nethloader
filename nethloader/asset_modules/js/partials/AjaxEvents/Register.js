import Utils from '../Utils';

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
  if (registerButton) {
    usernameInput = document.getElementById('username');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    cpasswordInput = document.getElementById('cpassword');

    usernameInput.addEventListener('input', () => { Utils.testUserName(usernameInput); });
    emailInput.addEventListener('input', () => { Utils.testEmail(emailInput); });
    passwordInput.addEventListener('input', () => { Utils.testPasswordLength(passwordInput); Utils.testEqual(passwordInput, cpasswordInput); Utils.testPassword(passwordInput); });
    cpasswordInput.addEventListener('input', () => { Utils.testPassword(cpasswordInput); Utils.testEqual(passwordInput, cpasswordInput); });

    registerButton.addEventListener('click', userRegister);
  }
};

const userRegister = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (validateRegister()) {
    document.forms.namedItem('registerform').submit();
  }
};

const validateRegister = () => {
  var testUn = Utils.testUserName(usernameInput),
      testEm = Utils.testEmail(emailInput),
      testCp = Utils.testPassword(cpasswordInput),
      testEq = Utils.testEqual(passwordInput, cpasswordInput),
      testLn = Utils.testPasswordLength(passwordInput);

  if (testUn && testEm && testCp && testLn && testEq) {
    return true;
  }

  return false;
};

export default {
  registerFormInit
};