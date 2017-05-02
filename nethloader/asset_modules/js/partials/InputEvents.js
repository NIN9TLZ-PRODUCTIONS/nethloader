// Contains the input elements to manage
var inputElements;

const init = () => {
  findElements();
  addListeners();
};

/*
 * Find all the inputs with the 'data-type' attribute
 */
const findElements = () => {
  inputElements = document.querySelectorAll('[data-type]');
};

/*
 * Add eventListeners of 'input' and 'mousedown' to every element found by 'findElements()'
 */
const addListeners = () => {
  for (let i = inputElements.length - 1; i >= 0; i--) {
    inputElements[i].addEventListener('input', manageLabelActiveState);
    inputElements[i].addEventListener('click', manageLabelActiveState);
    checkInputContent(inputElements[i]); // In case the input has a remembered value
  }
};

/*
 * Change the input's label state depending of wether it has content or not by adding or removing the 'has-content' class respectively
 */
const manageLabelActiveState = (event) => {
  let eventInput = event.currentTarget;

  checkInputContent(eventInput);
};

const checkInputContent = (input) => {
  let labelEl = input.nextElementSibling;

  if (input.value) {
    labelEl.classList.add('has-content');
  } else if (!input.value || input.value === '') {
    labelEl.classList.remove('has-content');
  }
};

export default {
  init
};
