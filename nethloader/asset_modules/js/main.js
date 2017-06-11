import InputEvents from './partials/InputEvents';
import DropDownEvents from './partials/DropDownEvents';
import DialogEvents from './partials/DialogEvents';
import AjaxEvents from './partials/AjaxEvents';
import themeManager from './partials/themeManager';
import './partials/mdripple.js';

(function init() {
  'use strict';
  themeManager.init();
  InputEvents.init();
  DropDownEvents.init();
  DialogEvents.init();
  AjaxEvents.init();
})();