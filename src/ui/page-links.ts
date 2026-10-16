


// #region Imports

import type { PagLinTyp } from 'techgeek-design/ui/link-types.ts'; // What: Page Link Type. Why: The bar and footer from the design package take page links in its shape. How: This types the list.

// #endregion Imports



/**
 * page-links.ts = Page Links
 *
 * @summary
 * The site's pages in the order the bar, the phone menu, and the footer link
 * to them, so a page added or renamed changes in one place. The app root
 * hands the list to the design package's bar and footer. The cards
 * themselves aren't listed, since the Gallery is the way to them.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const PAG_LIN_ARR : PagLinTyp[] = [ // What: Page Link Array. Why: The bar, the phone menu, and the footer all link to the same pages in the same order. How: Each row names a page's label and route.


	{ labStr : 'Home',    patStr : '/'        }, // What: Home Link Row. Why: Every page links back to the home page. How: This routes to the root path.
	{ labStr : 'Gallery', patStr : '/gallery' }, // What: Gallery Link Row. Why: The cards are the site's main content. How: This routes to the Gallery page.
	{ labStr : 'About',   patStr : '/about'   }, // What: About Link Row. Why: A visitor can read who makes the cards. How: This routes to the About page.
	{ labStr : 'Contact', patStr : '/contact' }  // What: Contact Link Row. Why: A visitor can ask for a custom card or get in touch. How: This routes to the Contact page.


];

// #endregion Constants



// #region Exports

export { PAG_LIN_ARR }; // What: Named Exports. Why: The bar, the phone menu, and the footer render their links from this list. How: This exports the list.

// #endregion Exports


