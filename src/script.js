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

const headerEl = document.querySelector('.site-header');
const navToggle = document.getElementById('nav-toggle');

const setNavState = (isOpen) => {
  if (!headerEl || !navToggle) {
    return;
  }
  headerEl.classList.toggle('nav-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
};

if (navToggle && headerEl) {
  navToggle.addEventListener('click', () => {
    const isOpen = !headerEl.classList.contains('nav-open');
    setNavState(isOpen);
  });

  document.querySelectorAll('.site-nav a, .nav-cta a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        setNavState(false);
      }
    });
  });
}

const updateHeaderState = () => {
  if (!headerEl) {
    return;
  }
  headerEl.classList.toggle('is-compact', window.scrollY > 20);
};

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateHeaderState();
      scrollTicking = false;
    });
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    setNavState(false);
  }
});

updateHeaderState();

const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');
const cookieKey = 'zenova_cookie_choice';

const updateCookieBanner = () => {
  if (!cookieBanner) {
    return;
  }
  try {
    const choice = window.localStorage.getItem(cookieKey);
    cookieBanner.classList.toggle('hidden', Boolean(choice));
  } catch (err) {
    cookieBanner.classList.remove('hidden');
  }
};

const setCookieChoice = (value) => {
  if (!cookieBanner) {
    return;
  }
  try {
    window.localStorage.setItem(cookieKey, value);
  } catch (err) {
    // Ignore storage errors.
  }
  cookieBanner.classList.add('hidden');
};

if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    setCookieChoice('accepted');
  });
}

if (cookieDecline) {
  cookieDecline.addEventListener('click', () => {
    setCookieChoice('declined');
  });
}

updateCookieBanner();
