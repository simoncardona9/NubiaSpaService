function applyLang(lang) {
  const safeLang = lang === 'en' ? 'en' : 'es';
  document.body.classList.toggle('en', safeLang === 'en');
  document.documentElement.lang = safeLang;
  try {
    localStorage.setItem('nubia-lang', safeLang);
  } catch (e) {}
}

function getSavedLang() {
  try {
    return localStorage.getItem('nubia-lang') || 'es';
  } catch (e) {
    return 'es';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang(getSavedLang());

  // Hybrid routing:
  // - file:// keeps explicit index.html paths so Windows opens pages directly.
  // - http(s) uses clean Netlify routes.
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    document.querySelectorAll('[data-clean-href]').forEach((link) => {
      link.setAttribute('href', link.getAttribute('data-clean-href'));
    });
  }

  document.querySelectorAll('.nav-inner').forEach((navInner, index) => {
    const navLinks = navInner.querySelector('.nav-links');
    const brand = navInner.querySelector('.brand');
    if (!navLinks || !brand) return;

    const menuId = `site-menu-${index}`;
    navLinks.id = menuId;

    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.type = 'button';
    menuToggle.setAttribute('aria-controls', menuId);
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    brand.insertAdjacentElement('afterend', menuToggle);

    const closeMenu = () => {
      navLinks.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  });

  document.querySelectorAll('[data-lang-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      applyLang(document.body.classList.contains('en') ? 'es' : 'en');
    });
  });

  const ambientAudio = document.querySelector('[data-ambient-audio]');
  const soundToggle = document.querySelector('[data-sound-toggle]');

  if (ambientAudio && soundToggle) {
    const setSoundState = (isPlaying) => {
      soundToggle.setAttribute('aria-pressed', String(isPlaying));
      soundToggle.classList.toggle('is-playing', isPlaying);
    };

    soundToggle.addEventListener('click', async () => {
      if (ambientAudio.paused) {
        try {
          await ambientAudio.play();
        } catch (error) {
          console.warn('Ambient audio could not start:', error);
        }
      } else {
        ambientAudio.pause();
      }
    });

    ambientAudio.addEventListener('play', () => setSoundState(true));
    ambientAudio.addEventListener('pause', () => setSoundState(false));
  }

  const form = document.querySelector('form[name="contacto-nubia"]');
  if (!form) return;

  const phone = form.querySelector('input[name="phone"]');
  const message = form.querySelector('textarea[name="message"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const phoneOk = /^[0-9+().\-\s]{7,25}$/.test(phone.value.trim());

    if (!phoneOk) {
      phone.setCustomValidity(
        document.body.classList.contains('en')
          ? 'Please enter a valid phone number.'
          : 'Ingresa un número de teléfono válido.'
      );
      phone.reportValidity();
      return;
    }
    phone.setCustomValidity('');

    if (message.value.trim().length > 2000) {
      message.setCustomValidity(
        document.body.classList.contains('en')
          ? 'Please keep your message under 2000 characters.'
          : 'El mensaje debe tener menos de 2000 caracteres.'
      );
      message.reportValidity();
      return;
    }
    message.setCustomValidity('');

    // Local preview: file:// cannot submit to Netlify Forms.
    if (window.location.protocol === 'file:') {
      window.location.href = 'gracias/index.html';
      return;
    }

    const submitButtons = form.querySelectorAll('button[type="submit"]');
    submitButtons.forEach((btn) => {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent;
      btn.textContent = document.body.classList.contains('en') ? 'Sending…' : 'Enviando…';
    });

    try {
      const formData = new FormData(form);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Redirect with a normal GET only after Netlify accepted the submission.
      window.location.assign('/gracias/');
    } catch (error) {
      console.error('Form submission failed:', error);
      alert(
        document.body.classList.contains('en')
          ? 'We could not send your inquiry. Please try again or contact Nubia by WhatsApp.'
          : 'No pudimos enviar tu consulta. Intenta nuevamente o contacta a Nubia por WhatsApp.'
      );

      submitButtons.forEach((btn) => {
        btn.disabled = false;
        if (btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
      });
    }
  });

  phone.addEventListener('focus', () => phone.setCustomValidity(''));
  message.addEventListener('input', () => message.setCustomValidity(''));
});
