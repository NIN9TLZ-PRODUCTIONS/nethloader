/*
 * Input validation functions 
 */
const testUserName = (input) => {
  return (input.value ? manageEmptyField(input, true) : manageEmptyField(input, false)) &&
   (input.value.match(input.dataset.valRegexPattern) ? manageInvalidField(input, true) : manageInvalidField(input, false));
};

const testEmail = (input) => {
  return (input.value ? manageEmptyField(input, true) : manageEmptyField(input, false)) &&
    (input.value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) ? manageInvalidField(input, true) : manageInvalidField(input, false));
};

const testPassword = (input) => {
  return (input.value ? manageEmptyField(input, true) : manageEmptyField(input, false));
};

const testPasswordLength = (input) => {
  return (input.value.length >= 8 ? managePasswordLength(input, true) : managePasswordLength(input, false));
};

const testEqual = (input1, input2) => {
  return (input1.value == input2.value ? manageEqualPasswords(input2, true) : manageEqualPasswords(input2, false));
};

/*
 * Input state functions 
 */
const manageEmptyField = (input, state) => {
  var inputVal = document.querySelector(`[data-for="${input.id}"]`);
  if(!state) {
    input.classList.remove('input--text--warning');
    input.classList.add('input--text--error');
    inputVal.dataset.error = "This field can't be empty.";
    return false;
  } else {
    input.classList.remove('input--text--error');
    return true;
  }
};

const manageInvalidField = (input, state) => {
  var inputVal = document.querySelector(`[data-for="${input.id}"]`);
  if(!state) {
    input.classList.remove('input--text--warning');
    input.classList.add('input--text--error');
    inputVal.dataset.error = "This field is not valid.";
    return false;
  } else {
    input.classList.remove('input--text--error');
    return true;
  }
};

const manageEqualPasswords = (input, state) => {
  var inputVal = document.querySelector(`[data-for="${input.id}"]`);
  if(!state) {
    input.classList.remove('input--text--warning');
    input.classList.add('input--text--error');
    inputVal.dataset.error = "The passwords don't match.";
    return false;
  } else {
    input.classList.remove('input--text--error');
    return true;
  }
};

const managePasswordLength = (input, state) => {
  var inputVal = document.querySelector(`[data-for="${input.id}"]`);
  if(!state) {
    input.classList.remove('input--text--error');
    input.classList.add('input--text--warning');
    inputVal.dataset.error = "Use at least 8 characters.";
    return false;
  } else {
    input.classList.remove('input--text--warning');
    return true;
  }
};

export default {
  testUserName,
  testEmail,
  testPassword,
  testPasswordLength,
  testEqual
};