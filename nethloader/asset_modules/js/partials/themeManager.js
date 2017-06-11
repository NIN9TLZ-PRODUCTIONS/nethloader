import Cookies from 'cookies-js';

const init = () => {
  if(Cookies.get('darkMode') == undefined || Cookies.get('darkMode') == null) {
    Cookies.set('darkMode', 'false');
  } else if(Cookies.get('darkMode') == 'true') {
    applyDarkMode();
  }

  var modeTrigger = document.getElementById('dark-theme-trigger');
  if(modeTrigger) {
    modeTrigger.addEventListener('click', () => {
      if(Cookies.get('darkMode') == 'true') {
        applyLightMode();
        Cookies.set('darkMode', 'false');
        modeTrigger.innerHTML = 'Dark mode off';
      } else if(Cookies.get('darkMode') == 'false') {
        applyDarkMode();
        Cookies.set('darkMode', 'true');
        modeTrigger.innerHTML = 'Dark mode on';
      }
    })
  }
}

const applyDarkMode = () => {
  document.documentElement.style.setProperty('--body-bg', 'var(--dark-body-bg)');
  document.documentElement.style.setProperty('--card-bg', 'var(--dark-card-bg)');
  document.documentElement.style.setProperty('--card-bg-light', 'var(--dark-card-bg-light)');
  document.documentElement.style.setProperty('--primary-dark', 'var(--dark-primary-dark)');
  document.documentElement.style.setProperty('--secondary-dark', 'var(--dark-secondary-dark)');
  document.documentElement.style.setProperty('--secondary-dark-darker', 'var(--dark-secondary-dark-darker)');
  document.documentElement.style.setProperty('--base-text-colour', 'var(--dark-base-text-colour)');
  document.documentElement.style.setProperty('--transparent-hover', 'var(--dark-transparent-hover)');
  document.documentElement.style.setProperty('--dropdown-item-hover', 'var(--dark-dropdown-item-hover)');
}

const applyLightMode = () => {
  document.documentElement.removeAttribute("style")
}

export default {
  init
};