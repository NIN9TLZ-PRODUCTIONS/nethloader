// Contains the dropdown elements to manage
var dropdownElements; 

const init = () => {
  findElements();
  addListeners();
};

/*
* Find all the inputs with the 'data-dropdownelement' attribute
*/
const findElements = () => {
  dropdownElements = document.querySelectorAll('[data-dropdownelement]');
};

/*
* Add eventListeners 'mousedown' to every element found by 'findElements()'
*/
const addListeners = () => {
  for (let i = dropdownElements.length - 1; i >= 0; i--) {
    dropdownElements[i].addEventListener('click', manageDropdownActiveState);
  }
};

/*
* Find the child elements of the dropdown and change the their state by adding or removing the 'is-active' class
*/
const manageDropdownActiveState = (event) => {
  let eventTarget     = event.currentTarget,
      dropdownElement = document.querySelector(`[data-dropdownid=${eventTarget.dataset.dropdownelement}]`),
      dropdownItems   = dropdownElement.children[0].children;

  if(!dropdownElement.contains(event.target) || (!event.target == dropdownElement)) {
    document.querySelector('.user-header__user-menu-icon').classList.toggle('drop-open');
    eventTarget.children[1].classList.toggle('drop-open');
    for(let i = dropdownItems.length - 1; i >= 0; i--) {
      if(dropdownItems[i].classList.contains('logout-form')) {
        dropdownItems[i].children[0].children[0].classList.toggle('is-active');
      } else {
        dropdownItems[i].classList.toggle('is-active');
      }
    }
  }
};

export default {
  init
};
