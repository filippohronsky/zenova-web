// Language Toggle
const toggleBtn = document.getElementById('lang-toggle');
let currentLang = 'sk';
toggleBtn.addEventListener('click', () => {
  const skElems = document.querySelectorAll('.lang-sk');
  const enElems = document.querySelectorAll('.lang-en');
  if (currentLang === 'sk') {
    skElems.forEach(el => el.style.display = 'none');
    enElems.forEach(el => el.style.display = '');
    document.documentElement.lang = 'en';
    toggleBtn.textContent = 'SK';
    currentLang = 'en';
  } else {
    enElems.forEach(el => el.style.display = 'none');
    skElems.forEach(el => el.style.display = '');
    document.documentElement.lang = 'sk';
    toggleBtn.textContent = 'EN';
    currentLang = 'sk';
  }
});

// Dynamic Year
document.getElementById('year').textContent = new Date().getFullYear();
