'use strict'

import InputEvents from './partials/InputEvents'

function init() {
    InputEvents.findInputs();
    InputEvents.addListeners();
};

init();