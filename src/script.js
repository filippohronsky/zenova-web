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

const certGrid = document.getElementById('cert-grid');
const lightboxEl = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxClose = document.getElementById('lightbox-close');

let certItems = [];
let currentCertIndex = 0;

const toAltText = (filename) => {
  const match = filename.match(/Cert(\d+)/);
  const num = match ? match[1] : filename;
  return `ZENOVA Labs certificate ${num}`;
};

const openLightbox = (index) => {
  if (!lightboxEl || !lightboxImg || !lightboxCaption) return;
  currentCertIndex = index;
  const item = certItems[index];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxCaption.textContent = item.alt;
  lightboxEl.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  if (!lightboxEl) return;
  lightboxEl.classList.add('hidden');
  document.body.style.overflow = '';
};

const showPrev = () => {
  if (!certItems.length) return;
  currentCertIndex = (currentCertIndex - 1 + certItems.length) % certItems.length;
  openLightbox(currentCertIndex);
};

const showNext = () => {
  if (!certItems.length) return;
  currentCertIndex = (currentCertIndex + 1) % certItems.length;
  openLightbox(currentCertIndex);
};

const bindLightbox = () => {
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxEl) {
    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) {
        closeLightbox();
      }
      if (e.target === lightboxImg) {
        closeLightbox();
      }
    });
  }

  let touchStartX = null;
  if (lightboxEl) {
    lightboxEl.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    lightboxEl.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX > 40) {
        showPrev();
      } else if (deltaX < -40) {
        showNext();
      }
      touchStartX = null;
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightboxEl && lightboxEl.classList.contains('hidden')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });
};

const renderCertGrid = () => {
  if (!certGrid) return;
  certGrid.innerHTML = '';
  if (!certItems.length) {
    const empty = document.createElement('p');
    empty.className = 'cert-placeholder';
    empty.innerHTML = '<span class="lang-sk">Certifikáty sa nepodarilo načítať.</span><span class="lang-en">Certificates could not be loaded.</span>';
    certGrid.appendChild(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  certItems.forEach((item, index) => {
    const link = document.createElement('button');
    link.className = 'cert-thumb';
    link.type = 'button';
    link.setAttribute('aria-label', item.alt);
    link.addEventListener('click', () => openLightbox(index));

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = item.src;
    img.alt = item.alt;

    link.appendChild(img);
    fragment.appendChild(link);
  });
  certGrid.appendChild(fragment);
};

const loadCertificates = () => {
  if (!certGrid) return;
  const loadFromManifest = () =>
    fetch('assets/certificates/manifest.json', { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('no manifest');
        return res.json();
      })
      .then((list) => {
        if (!Array.isArray(list)) throw new Error('invalid manifest');
        certItems = list.map((name) => ({
          src: `assets/certificates/${name}`,
          alt: toAltText(name),
        }));
        renderCertGrid();
      });

  const fallbackSequential = () => {
    const maxCount = 200;
    let i = 1;

    const tryLoad = () => {
      if (i > maxCount) {
        renderCertGrid();
        return;
      }
      const pad = String(i).padStart(3, '0');
      const src = `assets/certificates/ZENOVA-Labs-Cert${pad}.webp`;
      const img = new Image();
      img.onload = () => {
        certItems.push({
          src,
          alt: `ZENOVA Labs certificate ${pad}`,
        });
        i += 1;
        tryLoad();
      };
      img.onerror = () => {
        renderCertGrid();
      };
      img.src = src;
    };

    tryLoad();
  };

  loadFromManifest().catch(() => {
    fallbackSequential();
  });
};

loadCertificates();
bindLightbox();
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
