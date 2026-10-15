# Project CLAUDE.md: tech-geek-cards

z4nta0's digital greeting card site (React, Vite, React Router, to be deployed
on Netlify at https://techgeek.cards/). Every rule in the user-level CLAUDE.md
applies here; this file records only what's specific to this project.
TechGeek.dev (`../tech-geek-dev`) is the closest worked example and the source
of this project's configs, and the shared design comes from
`techgeek-design` (`../techgeek-design`, installed from its `v0.1.0` tag).

## Origin and sibling sites
Decided 2026-10-12, recorded 2026-10-14. TechGeek.support
(`../tech-geek-support`) once held the portfolio, the support articles, and
the greeting cards on one site. It's splitting into three sister sites that
share one design: techgeek.dev (the portfolio, done), techgeek.cards (this
project), and techgeek.support (converted last). The Cards page, every card,
their assets, and the image render script were copied from
`../tech-geek-support` on 2026-10-14.
- **No redirects** from the old techgeek.support card addresses
  (`/happybirthdaycard` and the like), decided by the user 2026-10-14: those
  links weren't live long or used much, so they aren't worth the complexity.

## Kind of site
Decided by the user 2026-10-14. z4nta0's real site, indexed with normal SEO
(never the demo treatment). It showcases the cards z4nta0 has made and lets
anyone share one; some cards take a recipient's name (Happy Birthday and
both Christmas cards, through `?name=`), and some a sender's (the Christmas
cards, through `?from=`, marked `froBoo` in the catalog, which adds a second
field to the share dialog).
- **Pages**: Home (an introduction and a few cards picked at random), Gallery
  (search and an occasion filter), About (who TechGeek is and the sister
  sites), Contact (contact@techgeek.cards, through Netlify Forms as on
  TechGeek.dev), a 404, and one page per card at its own address
  (`/happy-birthday`), which plays the card full screen with a small floating
  bar instead of the site's bar and footer.
- **The floating bar** (decided by the user 2026-10-14): the wordmark (home),
  More cards, Replay, and Share, the same on every card. Replay remounts the
  card through a key, so every card restarts from its first frame the same
  way without code of its own; the cards' own Replay and Toggle Fullscreen
  buttons were removed.
- **Unlisted cards end in `-prank`** (decided by the user 2026-10-15): a
  card kept off the Gallery and Home, reached only by its own link, gets an
  address ending in `-prank` (`/christmas-prank`), so every unlisted card is
  named the same way, and the README's Unlisted cards section lists each one.
- **The special Father's Day card** (`/fathers-day-prank`) stays unlisted,
  since the user made it for their own father (decided 2026-10-14).
- **The Christmas cards** (decided by the user 2026-10-15): one component,
  two catalog rows. The listed Merry Christmas card (`/merry-christmas`) is
  the snowy scene alone, signed From, Tech Geek unless `?from=` says
  otherwise; the full prank (`/christmas-prank`), a fake hack before the
  snowy scene, made for the user's family, stays unlisted and keeps its From,
  Mr. Awesome default.
- **Structured data**: a `WebSite` for this domain whose author is the same
  `Person` TechGeek.dev describes (`https://techgeek.dev/#person`), with the
  GitHub and LinkedIn profiles the footer links to and no email, since this
  site's address isn't TechGeek.dev's.
- **Search**: the home title is "Animated Digital Greeting Cards to Send |
  TechGeek.cards" (lengthened past 50 characters for the raw-page check), and
  each card has its own search description (`seaStr`, 100 to 125
  characters). Unlisted cards carry noindex and no canonical link, and stay
  out of the sitemap.
- **Link previews**: every card gets its own preview image and tags (decided
  by the user 2026-10-14), which needs each card's page prerendered or given
  its own HTML shell. Until that's built, the site has no Open Graph or
  Twitter tags at all. In the same step, the tile previews (1653x930 now,
  more than twice their largest display size) are rendered at about
  1200x675, with the intrinsic `width` and `height` updated in
  `ui/card-tile.tsx` and `pages/home/home.tsx`.
- **Voice**: page copy speaks as z4nta0 in the first person ("I build..."),
  as TechGeek.dev does; search descriptions name z4nta0 in the third person.

## Theme
Decided by the user 2026-10-14: "Confetti Circuit" (the second of three
suggested directions) with the card stacks and envelopes borrowed from the
first ("Paper & Pixels"). Playful and celebratory, but clean and tech-y, on
the family's fonts and colors.
- **Motif**: circuit traces that end in confetti (`ui/confetti-circuit.tsx`),
  previews in postage-stamp frames cut with a perforation mask, tiles tipped
  a degree and a half, hero bottoms cut in scallops, and Home's envelope with
  cards fanning out of it.
- **Colors**: the family's palette, plus one role this site adds, the berry
  accent family: `--act-mai-col` (#E64E82, lightened from #E2457A so ink text
  on it reaches 4.69:1), `--act-dar-col` (its text shade), and
  `--act-tin-col` (#FAD3E0). Berry is for confetti, dots, stamps, eyebrows,
  and the Family occasion, never buttons or links, which stay orange.
- **Fonts**: the family's three, none added, since each card brings its own.
- **Occasions**: Birthday (orange), Family (berry: Mother's and Father's
  Day), and Holiday (blue: Fourth of July, Halloween, Thanksgiving, and
  Christmas).
- **Motion token**: `--mot-ino-eas` (in-out, the quint curve matching GSAP's
  `power4.inOut`), decided by the user 2026-10-15 for this site only, since
  it's far more animated than its siblings. It sits in `styles.css`'s Motion
  Tokens, not the design package.
- **Horizontal layout**: TechGeek.dev's (the horizontal rhythm, the same
  content cap, gutter, and hero gap), kept by the user 2026-10-14 after
  looking at the initial version; responsiveness still to be tested by hand.

## Card Grids exception
Decided by the user 2026-10-14, as on TechGeek.dev's Work page. The Gallery's
grid is exempt from the user-level Card Grids rule: its cards change with the
search and the filter and grow as cards are added, so even rows can't be kept.
It steps through three, two, and one columns at 1,024px and 640px as a
centered wrapping row, each tile taking a column's share through
`--car-til-wid`, so a short last row sits centered. Every other card grid on
the site keeps even rows (Home's four featured cards go four, two, and one
across).

## Directory structure
```
src/
  main.tsx, app.tsx      entry point, and the routes, bar, and footer
  pages/                 home/, gallery/, about/, contact/, not-found/, and
                         card/ (the page every card plays in)
  ui/                    the card catalog (cards.ts), the card tile, the
                         share dialog, the motif, and the page list
  cards/                 the cards; a converted card has its own folder
                         (christmas/), the rest are copied unchanged (see
                         below)
  hooks/                 the unconverted cards' window size hook
  utils/                 motion.ts and rhythm.ts, the reduced-motion check,
                         easing tokens, and scale steps for GSAP
  assets/                card previews, illustrations, and fonts
  styles/                styles.css: the berry role and the layout values
```
`design/` holds the image and icon render scripts and the git-ignored image
originals (about 89 MB, never committed, decided by the user 2026-10-14).

## Converted cards
Decided with the user 2026-10-15, converting the Christmas card first; the
rest follow the same pattern.
- **Each card gets a comparison table** before it's converted: every number
  it uses beside its nearest step on our scale, with the difference. Every
  number is then snapped, and any that doesn't work out is reverted.
- **One folder per card**: `src/cards/<name>/` holds the card's main file,
  named in full (`christmas-card.tsx`, the way a tab's main file keeps its
  `tab-` name), its CSS module, any script only it uses (`snowfall.ts`), its
  rendered illustrations, and its fonts. Its preview stays in `src/assets/`,
  since Home and the Gallery show it. The originals go in
  `design/images/originals/<name>-card/`; a full-screen background renders
  to the `stage` box, twice 1920 by 1080.
- **Fonts** are Fontsource's Latin WOFF2 files, declared with `@font-face` in
  the card's own module, so they load only with the card.
- **The component is a named export**, and the catalog's lazy import maps it
  to the default React.lazy needs.
- **GSAP timelines follow the scale**: durations through `durMilFun` (steps
  below `m03` included, for glitches), distances through `rhyPxlFun`, angles
  through `cdnPowFun`, and curves from the easing tokens, registered with
  GSAP's CustomEase (the Christmas card's `gsaEasFun`, which moves to `ui/`
  once a second card needs it). Under reduced motion the timeline jumps to
  its end and any JS motion (the snow) never starts.
- **Lettering pinned to the bottom** takes `--car-bar-mar` as its bottom
  margin, which the card page sets to clear the floating bar.
- **Text split by SplitText**: a heading keeps SplitText's own label, but a
  paragraph can't take one, so its visible copy is split with `aria :
  'none'` and marked `aria-hidden`, beside a visually hidden copy of the
  whole text.
- **Base styles to override**: the design package's `p` sets the secondary
  text color, and its headings set weight 700 to 800 and tight letter
  spacing, so a card's lettering resets those it doesn't want.
- **Shadows on split text** go on the whole heading or paragraph as a
  `filter: drop-shadow()`, never a `text-shadow` on every letter, which made
  WebKit's frames take up to 700ms and stalled the timeline.
- **Tests**: each converted card joins every suite at 1,440px and 390px,
  captured at its finished scene under reduced motion.
- **Known issue**: on a phone the floating bar (about 459px wide) is wider
  than the screen and hangs off both sides; it needs its own fix.

## Legacy cards
The cards in `src/cards/` (and `src/hooks/useWinSiz.ts`) are TechGeek.support's
code, still unconverted to the formatting, naming, and token rules. Changes so
far, each to keep them working in the new frame:
- `react-router-dom` became `react-router` in the birthday card.
- Their TTF fonts became Fontsource's Latin WOFF2 files (1,055 KB to 231 KB).
- Their 24 inline `rem` sizes became the same pixel values (rem times 16),
  since the family's root is 11px where theirs was 16px.
- The card page restores their 1.6 line height around them (`carStaDiv`).
- Their own Replay and Toggle Fullscreen buttons, the code behind them, and
  their styles were removed (2026-10-14); the toggle only switched each card
  between fixed and relative positioning, and each keeps its full-screen
  default. Fourth of July's stylesheet held nothing else, so it's gone.

**Converting them** (decided by the user 2026-10-14): the cards are gone
through one by one, with the user, before the site is done. Everything moves
onto the family's tokens: font sizes onto the font size scale (replacing the
interim pixel values above), headings' line heights equal to their font
size (the m01 step, 1), and every other value onto its scale, while each
card keeps its own custom fonts, since nearly every card has a font to match
its own theme. Pale previews (Mother's and Father's Day) are redone in the
same pass.

Still to do in their conversion pass: the rules themselves; one h1 per card,
its main greeting (most have none, and Halloween's and Thanksgiving's already
have theirs); ESLint's 10 findings in them (loose types, a variable read
before it's declared, a stray expression); their z-indexes up to 999, which
force the floating bar to 1000; reduced-motion variants; the typing cursor on
the Mother's and Father's Day cards now taking the card's font instead of
Syne; and names outside Latin (the extended Latin font files, loaded only when
a name needs them).

## Test suites
Added 2026-10-14, adapted from TechGeek.dev's (see its CLAUDE.md for what
each check does). The user always has their own dev server running on the
usual 5173 (decided 2026-10-14), so Claude never starts one to look at the
site and uses theirs instead. Playwright suites live in `tests/`, one project
per suite and engine in `tests/playwright.config.ts`, which starts its own dev
server on port 5195 (never the user's 5173, nor the siblings' 5190 through
5194) and stops it afterwards. Every suite runs in Chromium, Firefox, and WebKit. The states the
suites visit (`tests/support/states.ts`) are every page and the 404 at 390px
and 1,440px, each converted card, the phone menu, the share dialog open on
the Gallery at both widths, and a signable card's share dialog at 390px.
- `npm run test:accessibility`: axe and the scripted checks, the pre-commit
  accessibility scan.
- `npm run test:interaction`: navigation (including Send a Card and a card's
  round trip from its tile and back through More cards), interaction
  feedback, the phone menu, and the contact form (its topic arriving as Not
  specified when none is chosen).
- `npm run test:rendering`: full-page screenshots against
  `tests/rendering/baselines/`, with the clock and `Math.random` fixed (Home
  picks its cards at random), the confetti circuit hidden in Chromium and
  WebKit by its `conCirDiv` hook.
- `npm run test:responsive`: 14 widths from 320 to 1,920px, and the text
  measure.
- `npm run test:seo`: every page's head, every card page's too (listed cards
  indexed with their own `seaStr` description, the unlisted one noindex), the
  structured data, the raw page, `robots.txt`, the sitemap, and the icons.
- **Not covered yet**: the unconverted card pages in the accessibility,
  interaction, rendering, and responsive suites, and their one-h1 check in
  the SEO suite, which join as each card is converted (the Christmas card
  already has); and the social preview checks, which return with the
  per-card preview images.
