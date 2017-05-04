// Contains the dropdown elements to manage
var menuElements,
    contentElements,
    activeMenu,
    activeElement; 

const init = () => {
  findElements();
  addListeners();
};

/*
* Find all the inputs with the 'data-dropdownelement' attribute
*/
const findElements = () => {
  menuElements = document.querySelectorAll('[data-menutrigger]');
  contentElements = document.querySelectorAll('[data-menuid]');
  activeMenu = menuElements[0];
  activeElement = contentElements[0];
};

/*
* Add eventListeners 'mousedown' to every element found by 'findElements()'
*/
const addListeners = () => {
  for (let i = menuElements.length - 1; i >= 0; i--) {
    menuElements[i].addEventListener('click', manageMenuActiveState);
  }
};

/*
* Find the child elements of the dropdown and change the their state by adding or removing the 'is-active' class
*/
const manageMenuActiveState = (event) => {
  let eventTarget    = event.currentTarget,
      contentElement = document.querySelector(`[data-menuid=${eventTarget.dataset.menutrigger}]`);
  if(!eventTarget.classList.contains('is-active')) {

    eventTarget.classList.add('is-active');
    contentElement.classList.add('is-active');

    activeMenu.classList.remove('is-active');
    activeElement.classList.remove('is-active');

    activeMenu = eventTarget;
    activeElement = contentElement;

  }
};

export default {
  init
};
