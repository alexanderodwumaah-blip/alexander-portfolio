# Alexander Opoku Dwumaah Portfolio

A clean, responsive personal portfolio built with plain HTML, CSS and JavaScript.

## Files

- `index.html` - page structure and portfolio content
- `styles.css` - layout, typography, responsive design and visual system
- `script.js` - mobile navigation, project detail modal and current year
- `firebase.json` - Firebase Hosting configuration
- `.firebaserc` - Firebase project placeholder
- `404.html` - simple not found page

## Before deployment

Open `index.html` and replace these two placeholders in the Contact section:

- `YOUR_EMAIL@example.com`
- `https://www.linkedin.com/in/YOUR-LINKEDIN/`

Also replace the displayed LinkedIn text with the real profile URL.

Then update `.firebaserc`:

`YOUR-FIREBASE-PROJECT-ID`

## Firebase Hosting

Install the Firebase CLI if it is not already installed:

```bash
npm install -g firebase-tools
```

Sign in:

```bash
firebase login
```

If you want Firebase to create the project configuration for you, you can run:

```bash
firebase init hosting
```

Choose the Firebase project you want to use and set the public directory to `.`.

For a manual setup using the included files, update `.firebaserc` and run:

```bash
firebase deploy --only hosting
```

## Notes

This portfolio intentionally does not include:

- fake counters
- fake testimonials
- fake metrics
- a terms and conditions page
- a privacy policy page
- a favicon
- cursor effects
- excessive scroll animation
- emoji based interface icons
- purple gradients
- AI generated images
- AI written style labels or badges

The project links point to the live websites supplied for the portfolio.
