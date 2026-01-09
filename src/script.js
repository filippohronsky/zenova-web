document.documentElement.classList.add('js-ready');

const toggleBtn = document.getElementById('lang-toggle');
let currentLang = document.documentElement.lang || 'sk';

const applyStagger = () => {
  document.querySelectorAll('.stagger').forEach((group) => {
    let visibleIndex = 0;
    Array.from(group.children).forEach((child) => {
      if (window.getComputedStyle(child).display === 'none') {
        child.style.removeProperty('--stagger');
        return;
      }
      child.style.setProperty('--stagger', visibleIndex);
      visibleIndex += 1;
    });
  });
};

const hostname = window.location.hostname.toLowerCase();
if (
  hostname === 'zenovalabs.cloud' ||
  hostname.endsWith('.zenovalabs.cloud') ||
  hostname === 'zenovalabs.eu' ||
  hostname.endsWith('.zenovalabs.eu')
) {
  currentLang = 'en';
} else if (
  hostname === 'zenova.sk' ||
  hostname.endsWith('.zenova.sk') ||
  hostname === 'zenovalabs.sk' ||
  hostname.endsWith('.zenovalabs.sk')
) {
  currentLang = 'sk';
}

function switchLang(to) {
  document.documentElement.lang = to;
  if (toggleBtn) {
    toggleBtn.textContent = to === 'sk' ? 'EN' : 'SK';
  }
  currentLang = to;
  applyStagger();
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    switchLang(currentLang === 'sk' ? 'en' : 'sk');
  });
}

switchLang(currentLang);

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
