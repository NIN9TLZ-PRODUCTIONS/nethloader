var inputs;

/*
* Find all the inputs with the 'data-type' attribute
*/
const findInputs = () => {
    inputs = document.querySelectorAll("[data-type]");
};

/*
* Add eventListeners for input to every input found with 'findInputs()'
*/
const addListeners = () => {
    for (let i = inputs.length - 1; i >= 0; i--) {
        inputs[i].addEventListener('input', manageLabelActiveState);
    }
}

/*
* Changes the input's label state depending of wether it has content or not by adding or removing the 'has-content' class respectively.
*/
const manageLabelActiveState = (event) => {
    let eventInput = event.currentTarget;
    let labelEl = eventInput.nextElementSibling;
    console.log(labelEl);
    if (eventInput.value) {
        labelEl.classList.add('has-content');
    } else if (!eventInput.value || eventInput.value == "") {
        labelEl.classList.remove('has-content');
    }
};

export default {
    findInputs,
    addListeners,
    manageLabelActiveState
};