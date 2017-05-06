import DeleteImage from './AjaxEvents/DeleteImage';
import UploadImage from './AjaxEvents/UploadImage';
import Register    from './AjaxEvents/Register';
import Login       from './AjaxEvents/Login';

const init = () => {
  DeleteImage.deleteImagesInit();
  UploadImage.uploadImageInit();
  Register.registerFormInit();
  Login.loginFormInit();
};

export default {
  init
};