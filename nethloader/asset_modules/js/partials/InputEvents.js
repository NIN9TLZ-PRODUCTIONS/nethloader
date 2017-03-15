var inputs;

const findInputs = () => {
    inputs = document.querySelectorAll("[data-type]");
};

const addListeners = () => {
    for (let i = inputs.length - 1; i >= 0; i--) {
        inputs[i].addEventListener('input', manageLabelActiveState);
    }
}

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