/* 
* Find and manage delete buttons
*/
const deleteConfirmButton = document.querySelector("[data-deleteconfirm]");

var deleteButtons;

const deleteImagesInit = () => {
  // Find the confirm button
  findDeleteButtons();
  addDelButEventListeners();
}

const findDeleteButtons = () => {
  deleteButtons = document.querySelectorAll("[data-delimageid]");

}

const addDelButEventListeners = () => {
  for (let i = deleteButtons.length - 1; i >= 0; i--) {
    deleteButtons[i].addEventListener('click', deleteImage);
  }
}

const deleteImage = (event) => {
  let imageId = event.currentTarget.dataset.delimageid;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/image/delete/?id=" + imageId, true);
  xmlhttp.setRequestHeader('RequestVerificationToken', antiforgeryToken);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  deleteConfirmButton.addEventListener('click', () => {
    xmlhttp.send();
    location.reload(true);
  });
  deleteConfirmButton.removeEventListener('click', () => {});
}

export default {
  deleteImagesInit
}