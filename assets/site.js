function applyLang(lang) {
  const safeLang = lang === "en" ? "en" : "es";
  document.body.classList.toggle("en", safeLang === "en");
  document.documentElement.lang = safeLang;
  try {
    localStorage.setItem("nubia-lang", safeLang);
  } catch (e) {}
}

function getSavedLang() {
  try {
    return localStorage.getItem("nubia-lang") || "es";
  } catch (e) {
    return "es";
  }
}

function setupNavigation() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const toggle = nav.querySelector(".nav-toggle");
  const links = nav.querySelector(".nav-links");
  const dropdown = nav.querySelector(".dropdown");
  const mobile = window.matchMedia("(max-width: 900px)");

  function closeMenu(restoreFocus = false) {
    if (restoreFocus) toggle.focus();
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("nav-open");
    dropdown.open = false;
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("nav-open", open);
    if (!open) dropdown.open = false;
  });

  nav.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (dropdown.open) {
      dropdown.open = false;
      dropdown.querySelector("summary").focus();
    } else if (mobile.matches && nav.classList.contains("nav-open")) {
      closeMenu(true);
    }
  });

  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu(mobile.matches);
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
      closeMenu(mobile.matches && links.contains(document.activeElement));
    }
  });

  nav.addEventListener("focusout", (event) => {
    if (!nav.contains(event.relatedTarget)) {
      // A breakpoint can hide the focused link before the media event runs.
      closeMenu(
        mobile.matches && !event.relatedTarget && links.contains(event.target),
      );
    }
  });

  mobile.addEventListener("change", () => {
    closeMenu(mobile.matches && links.contains(document.activeElement));
  });

  nav.classList.add("nav-enhanced");
  toggle.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  applyLang(getSavedLang());
  setupNavigation();

  // Hybrid routing:
  // - file:// keeps explicit index.html paths so Windows opens pages directly.
  // - http(s) uses clean Netlify routes.
  if (
    window.location.protocol === "http:" ||
    window.location.protocol === "https:"
  ) {
    document.querySelectorAll("[data-clean-href]").forEach((link) => {
      link.setAttribute("href", link.getAttribute("data-clean-href"));
    });
  }

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLang(document.body.classList.contains("en") ? "es" : "en");
    });
  });

  const form = document.querySelector('form[name="contacto-nubia"]');
  if (!form) return;

  const phone = form.querySelector('input[name="phone"]');
  const message = form.querySelector('textarea[name="message"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phoneOk = /^[0-9+().\-\s]{7,25}$/.test(phone.value.trim());

    if (!phoneOk) {
      phone.setCustomValidity(
        document.body.classList.contains("en")
          ? "Please enter a valid phone number."
          : "Ingresa un número de teléfono válido.",
      );
      phone.reportValidity();
      return;
    }
    phone.setCustomValidity("");

    if (message.value.trim().length > 2000) {
      message.setCustomValidity(
        document.body.classList.contains("en")
          ? "Please keep your message under 2000 characters."
          : "El mensaje debe tener menos de 2000 caracteres.",
      );
      message.reportValidity();
      return;
    }
    message.setCustomValidity("");

    // Local preview: file:// cannot submit to Netlify Forms.
    if (window.location.protocol === "file:") {
      window.location.href = "gracias/index.html";
      return;
    }

    const submitButtons = form.querySelectorAll('button[type="submit"]');
    submitButtons.forEach((btn) => {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent;
      btn.textContent = document.body.classList.contains("en")
        ? "Sending…"
        : "Enviando…";
    });

    try {
      const formData = new FormData(form);
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Redirect with a normal GET only after Netlify accepted the submission.
      window.location.assign("/gracias/");
    } catch (error) {
      console.error("Form submission failed:", error);
      alert(
        document.body.classList.contains("en")
          ? "We could not send your inquiry. Please try again or contact Nubia by WhatsApp."
          : "No pudimos enviar tu consulta. Intenta nuevamente o contacta a Nubia por WhatsApp.",
      );

      submitButtons.forEach((btn) => {
        btn.disabled = false;
        if (btn.dataset.originalText)
          btn.textContent = btn.dataset.originalText;
      });
    }
  });

  phone.addEventListener("focus", () => phone.setCustomValidity(""));
  message.addEventListener("input", () => message.setCustomValidity(""));
});
