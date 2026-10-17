


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the menu behaves as it should. How: This asserts on the menu's state, the page's inert parts, and focus.
import { test   } from '@playwright/test'; // What: Test. Why: Each way of using the menu is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The helper drives a Playwright page. How: This types its page parameter.

// #endregion Imports



/**
 * menu.spec.ts = Menu Spec
 *
 * @summary
 * Checks the phone menu's layer behavior in whichever engine the project
 * runs. While the menu is open, the page behind it is dimmed by a scrim and
 * inert, so keyboard and screen reader users stay in the bar, and the menu
 * offers the page links, z4nta0's two profiles, and the contact email. The
 * usual ways out each close it and give the page back: tapping the scrim,
 * pressing Escape, which also returns focus to the toggle, tapping the brand,
 * which also goes home, and widening the screen past the phone layout, which
 * hides the toggle.
 *
 * Sections:
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region menOpeFun

/**
 * menOpeFun = Menu Open Function
 *
 * @summary
 * Loads the About page at a phone's width, opens the menu with its toggle,
 * and checks the open state every test starts from: the toggle reports it
 * open, and the page's main content and footer are inert.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the menu on.
 *
 * @returns A promise that settles once the menu is open and checked, with
 *          no value.
 *
 * @example
 * ```ts
 * menOpeFun(page) // => Promise<void>
 * ```
 *
*/

async function menOpeFun ( curPagObj : Page ) : Promise< void > {


	await curPagObj.setViewportSize( { height : 844, width : 390 } ); // What: Phone Viewport Call. Why: The menu exists only at a phone's width. How: This sizes the page before it loads.

	await curPagObj.goto( '/about' ); // What: About Page Navigation. Why: About is long enough for the scrim to cover real content. How: This loads it.

	await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); // What: Menu Toggle Click. Why: Every check starts with the menu open. How: This opens it.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Open State Assertion. Why: The toggle has to report the menu open. How: This checks its aria-expanded.

	await expect( curPagObj.locator( 'main[inert], footer[inert]' ) ).toHaveCount( 2 ); // What: Inert Page Assertion. Why: Content under the scrim shouldn't take focus or be read. How: This checks the main content and the footer are both inert.


}

// #endregion menOpeFun

// #endregion Helpers



// #region Module Init

test.use( { reducedMotion : 'reduce' } ); // What: Reduced Motion Use. Why: The menu's fade would otherwise still be running when the checks read it. How: This makes every page in this file match prefers-reduced-motion: reduce.



test( 'the open menu offers the pages, profiles, and email over a dimmed page', async ( { page : curPagObj } ) => { // What: Open Menu Test. Why: The menu should stand apart from the page and offer more than its links. How: This opens it and checks the page links, the profile links, the email link, and the visible scrim.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The checks need the menu open. How: This opens and checks it.

	await expect( curPagObj.getByRole( 'navigation', { name : 'Menu navigation' } ).getByRole( 'link' ) ).toHaveCount( 4 ); // What: Page Links Assertion. Why: Every page should be one tap away. How: This counts the links in the menu's navigation landmark.

	await expect( curPagObj.getByRole( 'banner' ).locator( 'a[target="_blank"][aria-label]' ) ).toHaveCount( 2 ); // What: Profile Links Assertion. Why: Both of z4nta0's profiles should be one tap away. How: This counts the menu's named links that open in a new tab.

	await expect( curPagObj.getByRole( 'banner' ).getByRole( 'link', { name : 'contact@techgeek.cards' } ) ).toBeVisible(); // What: Email Link Assertion. Why: The contact email should be one tap away. How: This checks the menu shows the mailto link.

	expect( await curPagObj.evaluate( () => document.elementFromPoint( 200, 800 )?.getAttribute( 'aria-hidden' ) ) ).toBe( 'true' ); // What: Scrim On Top Assertion. Why: A tap on the page below the menu has to land on the scrim, not the page. How: This checks the element at a point below the panel is the scrim, the one element there hidden from screen readers.


} );



test( 'tapping the scrim closes the menu', async ( { page : curPagObj } ) => { // What: Scrim Close Test. Why: A tap anywhere on the dimmed page should close the menu. How: This taps below the panel and checks the menu closes and the page comes back.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The check needs the menu open. How: This opens and checks it.

	await curPagObj.mouse.click( 200, 800 ); // What: Scrim Tap Call. Why: The scrim covers the page below the panel. How: This taps it.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The tap should close the menu. How: This checks the toggle reports it closed.

	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 ); // What: Page Restored Assertion. Why: The page has to be usable again. How: This checks nothing is left inert.


} );



test( 'Escape closes the menu and returns focus to the toggle', async ( { page : curPagObj } ) => { // What: Escape Close Test. Why: Escape is the expected way out of a layer over the page, and focus shouldn't be left in a closed menu. How: This presses Escape and checks the menu, the page, and focus.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The check needs the menu open. How: This opens and checks it.

	await curPagObj.keyboard.press( 'Escape' ); // What: Escape Press Call. Why: The keyboard way out is checked. How: This presses Escape.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: Escape should close the menu. How: This checks the toggle reports it closed.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toBeFocused(); // What: Focus Return Assertion. Why: The visitor should be back where they opened the menu. How: This checks the toggle has focus.

	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 ); // What: Page Restored Assertion. Why: The page has to be usable again. How: This checks nothing is left inert.


} );



test( 'tapping the brand goes home and closes the menu', async ( { page : curPagObj } ) => { // What: Brand Close Test. Why: The brand stays tappable above the open menu, and the home page it opens shouldn't be left inert behind a menu still open. How: This taps the brand and checks the address, the menu, and the main content.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The check needs the menu open on a page other than Home. How: This opens and checks it on About.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'TechGeek.cards' } ).click(); // What: Brand Tap Call. Why: The brand is the way home from the open menu. How: This taps the bar's brand link.

	await expect( curPagObj ).toHaveURL( '/' ); // What: Home Assertion. Why: The brand links to the home page. How: This waits for the address to change.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The tap should close the menu. How: This checks the toggle reports it closed.

	await expect( curPagObj.locator( 'main[inert]' ) ).toHaveCount( 0 ); // What: Main Restored Assertion. Why: The home page's content has to be usable. How: This checks the main content is no longer inert.


} );



test( 'widening the screen closes the menu', async ( { page : curPagObj } ) => { // What: Resize Close Test. Why: Past the phone layout the toggle disappears, which would leave the page inert with no way to close the menu. How: This widens the screen and checks the menu closes and the page comes back.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The check needs the menu open. How: This opens and checks it.

	await curPagObj.setViewportSize( { height : 900, width : 1280 } ); // What: Wide Viewport Call. Why: A laptop screen, or a widened window, passes the menu layout. How: This resizes the page past the bar's 1,024px breakpoint.

	await expect( curPagObj.getByRole( 'button', { includeHidden : true, name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: Widening the screen should close the menu, not just hide its toggle. How: This checks the toggle, hidden at this width, reports the menu closed.

	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 ); // What: Page Restored Assertion. Why: The wide page has to be usable. How: This checks nothing is left inert.


} );

// #endregion Module Init


