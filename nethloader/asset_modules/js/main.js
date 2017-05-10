import InputEvents from './partials/InputEvents';
import DropDownEvents from './partials/DropDownEvents';
import SettingsEvents from './partials/SettingsEvents';
import DialogEvents from './partials/DialogEvents';
import AjaxEvents from './partials/AjaxEvents';
import './partials/mdripple.js';

(function init() {
  'use strict';
  InputEvents.init();
  DropDownEvents.init();
  SettingsMenuEvents.init();
  DialogEvents.init();
  AjaxEvents.init();
})();