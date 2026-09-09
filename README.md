# Nubia Spa Service

Static, bilingual (Spanish/English) marketing website for Nubia Spa Service in Clifton, New Jersey. The site presents aesthetic and wellness services, provides WhatsApp contact links, and collects inquiries through Netlify Forms.

## Features

- Responsive home, services, and thank-you pages
- Spanish/English toggle, with the selected language saved in `localStorage`
- Service categories for facials, aesthetic technology, massage/body care, and sugaring
- Client-side validation and a honeypot field for the contact form
- Netlify-ready clean routes, security headers, and cache settings
- Local `file://` preview support for direct browser opening

## Project structure

```text
.
├── index.html              # Home page and contact form
├── servicios/index.html    # Services page
├── gracias/index.html      # Form-success page
├── assets/
│   ├── style.css           # Shared responsive styles
│   └── site.js             # Language, routing, and form logic
├── netlify.toml            # Hosting, headers, and redirects
└── SECURITY_NOTES.txt      # Deployment and security notes
```

## Run locally

No installation or build step is required. You can open `index.html` directly in a browser. To test the HTTP behavior used in deployment, serve the site locally:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Test navigation, responsive layouts, the language switcher, form validation, and the thank-you route.

> The contact form submits only when hosted by Netlify. Direct `file://` previews simulate success by redirecting to `gracias/index.html`.

## Deployment

The repository is configured for Netlify with the repository root as the publish directory. On deployment, verify that Netlify detects the `contacto-nubia` form and configure its submission notifications in the Netlify dashboard.

`netlify.toml` defines the site's security headers, long-lived caching for `assets/`, and redirects from legacy `.html` routes to `/servicios/` and `/gracias/`.

## Content and maintenance

Keep every user-facing addition paired with both `data-es` and `data-en` markup. Preserve `data-clean-href` on links that need to work both from local files and through Netlify’s clean URLs. See [AGENTS.md](AGENTS.md) for contributor conventions and `SECURITY_NOTES.txt` for deployment-specific security guidance.
