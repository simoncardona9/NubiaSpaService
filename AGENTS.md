# Repository Guidelines

## Project Structure & Module Organization

This is a static bilingual (Spanish/English) website for Nubia Spa Service.

- `index.html` is the home page and contains the Netlify contact form.
- `servicios/index.html` is the services page; `gracias/index.html` is the post-submission thank-you page.
- `assets/style.css` holds the shared responsive styles.
- `assets/site.js` manages language selection, clean-route behavior, and form validation/submission.
- `netlify.toml` contains deployment configuration. `SECURITY_NOTES.txt` records form-security considerations.

Keep page-specific markup in its page directory and shared behavior or styles in `assets/`.

## Build, Test, and Development Commands

No package manager, build system, or automated test suite is configured. Open `index.html` directly in a browser for a quick local preview, or serve the repository through a simple static server when testing HTTP-only behavior such as clean routes and form submission.

For example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Check the home page, services anchors, ES/EN toggle, responsive layout, and contact-form validation. Netlify Forms submissions require a Netlify deployment; under `file://`, the form intentionally redirects to `gracias/index.html`.

## Coding Style & Naming Conventions

Preserve the existing lightweight, dependency-free approach: plain HTML, CSS, and modern browser JavaScript. Existing files are intentionally compact, though newly edited CSS and JavaScript should favor readable indentation and small focused functions. Use lowercase kebab-case for CSS classes, HTML attributes, page directories, and asset filenames (for example, `service-preview` and `data-lang-toggle`).

Maintain paired `data-es` and `data-en` content for every user-facing change, and use the existing `data-clean-href` pattern for links that need both local-file and Netlify routing.

## Testing Guidelines

Manually verify both languages after each UI or copy change. Test at desktop and mobile widths, navigate all internal links and anchors, and validate invalid and valid contact-form inputs. Do not place production secrets or sensitive customer data in the static files.

## Commit & Pull Request Guidelines

The history currently uses concise Spanish commit subjects (for example, `Primer Commit`). Use short, imperative summaries in Spanish or English, ideally scoped to the changed area, such as `Fix bilingual form validation`. Pull requests should explain the user-visible change, link relevant issues when available, and include before/after screenshots for layout or visual updates.
