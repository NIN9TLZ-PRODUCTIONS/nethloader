var inputs; // Contains the input elements to manage


const init = () => {
  findInputs();
  addListeners();
}

/*
* Find all the inputs with the 'data-type' attribute
*/
const findInputs = () => {
  inputs = document.querySelectorAll("[data-type]");
};

/*
* Add eventListeners of 'input' to every element found by 'findInputs()'
*/
const addListeners = () => {
  for (let i = inputs.length - 1; i >= 0; i--) {
    inputs[i].addEventListener('input', manageLabelActiveState);
    inputs[i].addEventListener('mousedown', manageLabelActiveState);
  }
}

/*
* Change the input's label state depending of wether it has content or not by adding or removing the 'has-content' class respectively.
*/
const manageLabelActiveState = (event) => {
  let eventInput = event.currentTarget;
  let labelEl = eventInput.nextElementSibling;
  if (eventInput.value) {
      labelEl.classList.add('has-content');
  } else if (!eventInput.value || eventInput.value == "") {
      labelEl.classList.remove('has-content');
  }
};

export default {
  init
};