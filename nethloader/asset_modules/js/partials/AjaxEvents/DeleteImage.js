/*---------------
 *  Delete image
 * ------------ */
var deleteConfirmButton,
    deleteButtons;

/*
 * Find the delete confirm button element (located in the dialog) then find all the delete buttons on the images and listen for clicks
 */
const deleteImagesInit = () => {
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
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    } else if (this.readyState != 4 || this.status != 200) {
      console.log('Something went wrong');
    }
  };

  deleteReq.open('POST', '/image/delete/?id=' + imageId, true);
  deleteReq.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  deleteReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  deleteConfirmButton.onclick = () => {
    deleteReq.send();
  };
};

export default {
  deleteImagesInit
};