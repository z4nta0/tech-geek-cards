# TechGeek.cards

Animated digital greeting cards by z4nta0, a full stack web developer. Every card is hand-coded and plays right in the browser: pick one from the Gallery, add a name to the cards that take one, and send the link.

To be live at [techgeek.cards](https://techgeek.cards/).

It's one of three sister sites that share a design so they read as one family, and its footer links to the other two. The shared design (the tokens, fonts, base styles, bar, footer, and mark) lives in the [techgeek-design](https://github.com/z4nta0/techgeek-design) package, which each site installs:

- **[techgeek.dev](https://techgeek.dev/)**: z4nta0's developer portfolio.
- **[techgeek.support](https://techgeek.support/)**: tech support help and articles.
- **[techgeek.cards](https://techgeek.cards/)**: these greeting cards.

## Stack

- **Node.js** 22.22 or newer (React Router 8 requires it)
- **Vite 8** dev server / bundler
- **React 19** + **TypeScript 6**
- **React Router 8** (Home, Gallery, About, and Contact, a page for each card, and a 404 page for every other path)
- **GSAP** for the cards' animation
- **techgeek-design**, the family's shared design package, installed from GitHub at a tagged release
- **ESLint 9** with typescript-eslint, and **Playwright** with axe-core for the test suites
- Deployed on **Netlify**, which serves `index.html` for every path (`public/_redirects`), sends the security headers in `public/_headers`, and handles the contact form through Netlify Forms

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Checks

```bash
npm run lint       # ESLint across the repo
npm run typecheck  # TypeScript across src/, the configs, tests/, and the design/ scripts
```

## Tests

```bash
npm test                    # every suite
npm run test:accessibility  # axe-core plus scripted keyboard, naming, reflow, and motion checks
npm run test:interaction    # page navigation, a card's round trip, the phone menu, the contact form, and every link and button's hover, press, and focus feedback
npm run test:rendering      # full-page screenshots of each page state against approved baselines
npm run test:responsive     # every page and the phone menu from 320 to 1,920px: no sideways scroll, spill, or overlap, and every paragraph within its measure
npm run test:seo            # titles, descriptions, canonical links, robots, structured data, icons, robots.txt, and the sitemap, for every page and card
```

Each suite runs in Chromium, Firefox, and WebKit against its own dev server on port 5195, so a dev server already running on 5173 is left alone. The states the suites visit are every page and the 404 page at phone and desktop widths, the open phone menu, and the share dialog open on the Gallery. Reports land in `tests/output/` (git-ignored); `npx playwright show-report tests/output/report` opens the HTML report. The rendering suite's approved screenshots live in `tests/rendering/baselines/` and match to the pixel, so after a change meant to alter how a page looks, review the diff in the report, then run `npm run test:rendering -- --update-snapshots` and commit the new baselines with the change. Chromium and WebKit capture with the faint confetti circuit pattern hidden, since they draw it slightly differently from run to run; Firefox still checks it. The baselines were captured on Linux, and font rendering differs between systems, so on macOS or Windows refresh them locally before relying on the comparison. If a browser is missing, `npx playwright install chromium firefox webkit` installs all three.

Converted cards join every suite, starting with the Christmas card at both widths, checked at its finished scene under reduced motion. The cards still to be converted are only checked by the SEO and navigation suites; each joins the others as it's converted to the site's rules.

## Build

```bash
npm run build
npm run preview
```

## Images

The card images and the icons are rendered by scripts, so they can be rebuilt whenever something changes:

```bash
npm run images  # encodes the originals in design/images/originals/ as WebP where the site imports them
npm run icons   # copies the design package's favicon.svg into public/ and renders favicon.ico, the PNG icons, and the Apple touch icon from it
```

The originals in `design/images/originals/` are large and kept out of git, so a fresh checkout needs the original files before `npm run images` can run.

## Adding a card

1. Give the card its own folder, `src/cards/<card-name>/`, holding its component, its CSS module, any script only it uses, its illustrations, and its fonts as Latin WOFF2 files. `src/cards/christmas/` is the first converted card and the pattern to follow.
2. Add the originals of its illustrations and its preview to `design/images/originals/`, list them in `design/images/render.mts`, and run `npm run images`. The preview lands in `src/assets/`, since the Gallery and Home show it too.
3. Give it a row in `CAR_REC_ARR` in `src/ui/cards.ts`: its title, occasion, descriptions, preview, address, and component. The row makes its tile, its page, and its share dialog; nothing else needs a route.
4. Add its address to `public/sitemap.xml`, its row to the SEO suite's page list, its desktop and phone states to `tests/support/states.ts`, and its case to the two responsive suites, then run the tests and approve its new screenshots.

## Project structure

```
src/
├── assets/            Card previews, illustrations, and fonts
├── cards/             The cards themselves, each loaded only when its page opens; a converted card has its own folder, such as christmas/
├── hooks/             The unconverted cards' window size hook
├── pages/
│   ├── home/          Home page and its .module.css
│   ├── gallery/       Gallery page and its .module.css
│   ├── about/         About page and its .module.css
│   ├── contact/       Contact page and its .module.css
│   ├── card/          The page every card plays in, with its floating bar
│   └── not-found/     The 404 page every unknown path shows, with its .module.css
├── ui/                What more than one page uses: the card catalog (cards.ts), the card tile, the share dialog, the confetti circuit pattern, and page-links.ts, the pages the bar and footer link to
├── styles/            styles.css: this site's berry color, ease-in-out curve, and layout values, loaded after the design package's stylesheets
├── utils/             Helpers any card can use: the reduced-motion check, the easing tokens, and the design scale's steps for GSAP timelines
├── app.tsx            Root component and the route table
└── main.tsx           Entry point
public/                Files served at fixed addresses: the icons, robots.txt, sitemap.xml, Netlify's _headers and _redirects, and the birthday card's old preview image, kept until each card has its own
tests/
├── accessibility/     axe-core scan and scripted checks
├── interaction/       navigation, phone menu, contact form, and hover, press, and focus feedback checks
├── rendering/         screenshot comparisons, their baselines/, and the stylesheet that hides the background pattern
├── responsive/        layout checks across screen widths
├── seo/               head tags, structured data, icon, and crawler file checks
├── support/           the page states the suites visit
└── playwright.config.ts

design/                Source artwork and the scripts that render it, not served
├── icons/             render.mts, which builds the icon set in public/ (npm run icons)
└── images/            render.mts, which builds the card images (npm run images)
```

## Design notes

- **Theme:** "Confetti Circuit": circuit traces that end in bursts of confetti, joining the family's technical side to this site's celebrating one, with a little stationery borrowed in: card previews in perforated postage-stamp frames, heroes ending in a stamp's scalloped edge, an open envelope on Home with cards fanning out of it, and a postcard banner.
- **Type pairing:** The family's three self-hosted fonts from the design package: Syne for headings, body text, and the wordmark, DM Mono for labels and buttons, and Lora's italic for the phone menu's tagline. Each card brings its own fonts to match its theme.
- **Palette:** The family's warm ivory page (`#F5F0E8`), deep ink (`#1A1A2E`), bright orange (`#F26419`), and soft blue (`#7DB9D8`), plus one color of this site's own, a berry pink (`#E64E82`), used only for confetti, dots, stamps, and labels, never for buttons or links. Text in those hues reads darker shades of each so it meets contrast. Occasions take one color each: orange for Birthday, berry for Family, and blue for Holiday.
- **Scale:** Every size, from type to spacing to motion, is a step on one scale built from the plastic ratio (about 1.32) on an 11px base, and layout widths grow with the screen between fixed bounds.
- **Motion:** Each page fades up into place, Home's cards rise out of their envelope one after another and fan wider on hover, and confetti pops in around them. Links, buttons, and tiles respond to hover, press, and keyboard focus with a color shift, a small lift or press-in, and a focus ring that eases in, and the share dialog pops in over a dimmed page. All of it turns off when a visitor's system asks for reduced motion, leaving only the instant color and position changes.

## Sharing a card

Every card opens full screen at its own address (`/happy-birthday`), with a small floating bar to go home, see more cards, replay the card from the start, or share it. Sharing opens a dialog that copies the card's link or opens the phone's share sheet, and for a card that takes a name, adds it to the link (`/happy-birthday?name=Sam`), which the card reads as it opens. A card can also be shared straight from its tile on Home or in the Gallery.

## Search and the contact form

Home, the Gallery, About, Contact, and every listed card are indexed, each with its own title, description, and canonical link, while the 404 page and any unlisted card carry `noindex`. The structured data describes the site as z4nta0's, the same person TechGeek.dev describes. `index.html` carries the home page's title and description, since link checkers and many crawlers read it without running the site's script. Each card's own link preview card is still to come.

The contact form posts to Netlify Forms: a hidden copy of the form in `index.html` registers its fields, and Netlify emails each submission to the address set in its dashboard, with the visitor's email as the reply-to.
