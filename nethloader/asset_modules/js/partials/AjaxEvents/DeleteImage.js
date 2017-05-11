/*---------------
 *  Delete image
 * ------------ */
var deleteConfirmButton,
    deleteButtons;

/*
 * Find the delete confirm button element (located in the dialog) then find all the delete buttons on the images and listen for clicks
 */
const init = () => {
  deleteConfirmButton = document.querySelector('[data-deleteconfirm]');
  if (deleteConfirmButton) {
    findDeleteButtons();
    addDelButEventListeners();
  }
};

/*
 * Find the delete buttons (one per image)
 */
const findDeleteButtons = () => {
  deleteButtons = document.querySelectorAll('[data-delimageid]');
};

/*
 * Listen for clicks and proceed (a dialog will be launched)
 */
const addDelButEventListeners = () => {
  for (let i = deleteButtons.length - 1; i >= 0; i--) {
    deleteButtons[i].addEventListener('click', deleteImage);
  }
};

/*
 * Get the image id to be deleted and delete the image if confirmed (user has clicked on yes, delete it)
 */
const deleteImage = (event) => {
  let imageId = event.currentTarget.dataset.delimageid;
  var deleteReq = new XMLHttpRequest();

  deleteReq.onreadystatechange = function () {
    deleteConfirmButton.children[0].innerHTML = '<div class=\'loader-wrapper flex flex-full-center is-processing\'><div class=\'loader\'></div></div>';
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    } else if (this.status > 200) {
      deleteConfirmButton.children[0].innerHTML = '<svg viewBox=\'0 0 24 24\'><use xlink:href=\'/img/icons.svg#delete\'></use></svg>';
      console.log('Something went wrong');
    }
  };
  
  deleteConfirmButton.onclick = () => {
    deleteReq.open('POST', '/image/delete/?id=' + imageId, true);
    deleteReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
    deleteReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    deleteReq.send();
  };
};

export default {
  init
};