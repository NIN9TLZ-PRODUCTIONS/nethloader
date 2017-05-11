import DeleteImage from './AjaxEvents/DeleteImage';
import UploadImage from './AjaxEvents/UploadImage';
import Settings    from './AjaxEvents/Settings';
import Register    from './AjaxEvents/Register';
import Login       from './AjaxEvents/Login';

const init = () => {
  DeleteImage.init();
  UploadImage.init();
  Settings.init();
  Register.init();
  Login.init();
};

export default {
  init
};