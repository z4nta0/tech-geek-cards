


// #region Imports

import { CAR_DAT_ARR } from '../../src/ui/card-data.ts'; // What: Card Data Array. Why: Every card's own page opens with its own skip link. How: This is the card catalog's plain data, one row per card, which the skip link checks walk to visit each card's page.
import { expect      } from '@playwright/test';          // What: Expect. Why: Each check passes only when the page lands where it should. How: This asserts on what each check reads.
import { test        } from '@playwright/test';          // What: Test. Why: Each navigation case is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The helpers drive a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * navigation.spec.ts = Navigation Spec
 *
 * @summary
 * Checks that moving between pages behaves like a multi-page site, in
 * whichever engine the project runs. A client-side router keeps the scroll
 * position when it swaps pages, so the useScrTopFun hook the app root calls
 * puts a link-driven navigation back at the top, and returns back, forward,
 * and a reload to the position each history entry was left at. Links clicked
 * far down a page, from the bar, and from the phone menu open the next page at
 * its top, while history and reloads return to the exact earlier position,
 * and a fresh load, a hash, and malformed saved positions are each handled.
 * With smooth scrolling on, a page change still jumps to the new page's top
 * before it's drawn. Every page, each card's page included, also opens with a
 * skip link that moves focus to the main content. Cards open from their tiles
 * and from the share dialog's preview, the router switching pages without
 * reloading the site.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

// #region PAG_LIN_ARR

/**
 * PAG_LIN_ARR = Page Link Array
 *
 * @summary
 * The four bar pages, in the bar's order, each one both a starting point
 * and a destination. Every row shares one shape, so its fields carry no
 * comments of their own:
 *
 * - `labStr` (String): Label String, the page's link text in the bar and the
 *   footer.
 *
 * - `patStr` (String): Path String, the route the link goes to.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const PAG_LIN_ARR = [ // What: Page Link Array. Why: The four bar pages are each checked as a starting point and as a destination. How: Each row pairs a route's path with its link text, in the bar's order.


	{ labStr : 'Home',    patStr : '/'        }, // What: Home Link Row. Why: Home is the bar's first page. How: This pairs its link text with its path.
	{ labStr : 'Gallery', patStr : '/gallery' }, // What: Gallery Link Row. Why: The Gallery is the bar's second page. How: This pairs its link text with its path.
	{ labStr : 'About',   patStr : '/about'   }, // What: About Link Row. Why: About is the bar's third page. How: This pairs its link text with its path.
	{ labStr : 'Contact', patStr : '/contact' }  // What: Contact Link Row. Why: Contact is the bar's last page. How: This pairs its link text with its path.


];

// #endregion PAG_LIN_ARR

// #endregion Constants



// #region Helpers

// #region botScrFun

/**
 * botScrFun = Bottom Scroll Function
 *
 * @summary
 * Waits for the page's heading, then jumps the window to the end of the page,
 * instantly whatever the stylesheet's scroll-behavior says, waits two
 * animation frames so the scroll hook records the position, and returns how
 * far down that is, so a check starts from a page scrolled as far as a visitor
 * reaching the footer would be.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to scroll.
 *
 * @returns A promise that resolves with the window's scroll offset once at
 *          the bottom.
 *
 * @example
 * ```ts
 * botScrFun(page) // => 1087
 * ```
 *
*/

async function botScrFun ( curPagObj : Page ) : Promise< number > {


	await curPagObj.getByRole( 'heading', { level : 1 } ).waitFor(); // What: Heading Wait Call. Why: The page's load event can fire before React has drawn it, while the page is still too short to scroll. How: This waits for the page's heading to appear.

	await curPagObj.evaluate( () => window.scrollTo( { behavior : 'instant', top : document.documentElement.scrollHeight } ) );          // What: Bottom Scroll Call. Why: The footer's links are clicked from the end of the page. How: This jumps past the page's full height, which the browser clamps to the bottom.
	await curPagObj.evaluate( () => new Promise( ( resProFun ) => requestAnimationFrame( () => requestAnimationFrame( resProFun ) ) ) ); // What: Two Frame Wait. Why: The scroll hook records a position from the scroll event, which the browser dispatches with its next frame, and a check that leaves the page right away would leave before it. How: This waits two animation frames, after which that frame's scroll event has run.



	return curPagObj.evaluate( () => window.scrollY ); // What: Scroll Offset Return. Why: Back is checked against where the page was. How: This reads the window's scroll offset.


}

// #endregion botScrFun



// #region hasCouFun

/**
 * hasCouFun = Hash Count Function
 *
 * @summary
 * Readies a page to count hashchange events, before any of its own script
 * runs, on the window's __hasChaNum, where a check reads it back. A plain
 * click on the skip link should never let the browser jump to #main, which
 * would fire one, even if the address were cleared again afterwards.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to ready.
 *
 * @returns A promise that settles once the counter is in place, with no
 *          value.
 *
 * @example
 * ```ts
 * hasCouFun(page) // => Promise<void>
 * ```
 *
*/

async function hasCouFun ( curPagObj : Page ) : Promise< void > {


	await curPagObj.addInitScript( () => { // What: Hash Counter Script. Why: The count has to start before the page could change its hash. How: This sets the count to 0 and adds 1 on every hashchange.


		const winCouObj = window as unknown as { __hasChaNum : number }; // What: Window Count Object. Why: The count is kept where the test can read it back. How: This views the window with its count. // What: Type Assertion Note. Why: The window has no such field in its type. How: The as names the one this script adds.


		winCouObj.__hasChaNum = 0; // What: Count Reset. Why: Each page starts with no hash changes. How: This sets the count to 0.


		window.addEventListener( 'hashchange', () => { winCouObj.__hasChaNum += 1; } ); // What: Hash Change Listener. Why: A jump to a hash fires hashchange. How: This adds 1 to the count each time.


	} );


}

// #endregion hasCouFun



// #region scrDowFun

/**
 * scrDowFun = Scroll Down Function
 *
 * @summary
 * Waits for the page's heading, then jumps the window 1,500px down, instantly
 * whatever the stylesheet's scroll-behavior says, waits two animation frames
 * so the scroll hook's recorder has run on the scroll event, and returns where
 * the page sits.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to scroll.
 *
 * @returns A promise that resolves with the window's scroll offset.
 *
 * @example
 * ```ts
 * scrDowFun(page) // => 1500
 * ```
 *
*/

async function scrDowFun ( curPagObj : Page ) : Promise< number > {


	await curPagObj.getByRole( 'heading', { level : 1 } ).waitFor(); // What: Heading Wait Call. Why: The page's load event can fire before React has drawn it, while the page is still too short to scroll. How: This waits for the page's heading to appear.

	await curPagObj.evaluate( () => window.scrollTo( { behavior : 'instant', left : 0, top : 1500 } ) );                                 // What: Scroll Down Call. Why: The position to return to has to be well below the top. How: This jumps 1,500px down the page, past any smooth scroll-behavior.
	await curPagObj.evaluate( () => new Promise( ( resProFun ) => requestAnimationFrame( () => requestAnimationFrame( resProFun ) ) ) ); // What: Two Frame Wait. Why: The scroll hook records a position from the scroll event, which the browser dispatches with its next frame. How: This waits two animation frames, after which that frame's scroll event has run.



	return curPagObj.evaluate( () => window.scrollY ); // What: Scroll Offset Return. Why: Each check compares a later position with this one. How: This reads the window's scroll offset.


}

// #endregion scrDowFun



// #region skiCheFun

/**
 * skiCheFun = Skip Check Function
 *
 * @summary
 * Loads a page at a desktop width with hash changes counted, waits for the
 * given locator to show that the page has drawn, presses Tab once, and checks
 * the skip link holds focus and has slid fully into view. It then clicks the
 * link and checks focus lands on the main element, the address keeps the
 * page's own path, and no hashchange fired along the way.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to check.
 * @param broNamStr - Browser Name String: The engine the test runs in, which
 *                    picks the key that moves focus to a link.
 * @param rouPatStr - Route Path String: The address to load.
 * @param reaSelStr - Ready Selector String: A selector for an element that
 *                    shows once the page has drawn.
 *
 * @returns A promise that settles once every check has passed, with no
 *          value.
 *
 * @example
 * ```ts
 * skiCheFun(page, 'firefox', '/about', 'h1') // => Promise<void>
 * ```
 *
*/

async function skiCheFun ( curPagObj : Page, broNamStr : string, rouPatStr : string, reaSelStr : string ) : Promise< void > {


	const skiLinLoc = curPagObj.getByRole( 'link', { name : 'Skip to main content' } ); // What: Skip Link Locator. Why: Each step below reaches the same link. How: This finds it by its role and name.


	await hasCouFun( curPagObj ); // What: Hash Counter Call. Why: A jump to #main would fire hashchange even if the address were cleared afterwards. How: This counts hash changes from before the page loads.

	await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The bar shows all its links at desktop width, the most a keyboard user would Tab past. How: This sizes the page before it loads.

	await curPagObj.goto( rouPatStr ); // What: Page Navigation. Why: The skip link is checked on each page. How: This loads the page.

	await expect( curPagObj.locator( reaSelStr ).first() ).toBeVisible(); // What: Ready Assertion. Why: The first Tab should land once the page has drawn. How: This waits for the element that shows the page is ready.

	await curPagObj.keyboard.press( broNamStr === 'webkit' ? 'Alt+Tab' : 'Tab' ); // What: First Tab Call. Why: The skip link should be the page's first stop. How: This presses Tab, or Alt+Tab in WebKit, whose plain Tab skips links.

	await expect( skiLinLoc ).toBeFocused();                   // What: Skip Focus Assertion. Why: The skip link has to be the page's first stop. How: This checks it holds focus after the first Tab.
	await expect( skiLinLoc ).toBeInViewport( { ratio : 1 } ); // What: Skip Shown Assertion. Why: A focused link waiting above the screen, or only partly down, would leave a keyboard user lost. How: This checks it has slid fully into view, retrying while it slides.

	await skiLinLoc.click(); // What: Skip Click Call. Why: This is the action under test. How: This clicks the focused skip link.

	await expect( curPagObj.locator( 'main' ) ).toBeFocused(); // What: Main Focus Assertion. Why: The jump has to land on the page's content, so the next Tab continues into it. How: This checks the main element holds focus.
	await expect( curPagObj ).toHaveURL( rouPatStr );          // What: Clean Address Assertion. Why: The jump shouldn't leave a hash in the address. How: This checks the address is still the page's own path.

	expect( await curPagObj.evaluate( () => ( window as unknown as { __hasChaNum : number } ).__hasChaNum ) ).toBe( 0 ); // What: No Hash Change Assertion. Why: A plain click should never put a hash in the address, even for a moment. How: This checks the page counted no hashchange. // What: Type Assertion Note. Why: The window has no such field in its type. How: hasCouFun's counter script set it.


}

// #endregion skiCheFun

// #endregion Helpers



// #region Module Init

test.use( { reducedMotion : 'reduce' } ); // What: Reduced Motion Use. Why: The page's entrance and any smooth scroll would otherwise still be moving when the offset is read. How: This makes every page in this file match prefers-reduced-motion: reduce, except in the smooth scrolling group, which sets its own.



test.beforeEach( async ( { page : curPagObj } ) => { // What: Fixed Random Hook. Why: Home picks four featured cards at random each time it opens, so a page returned to through history or a reload could be a different height from the one left, and a saved position near its end would no longer fit. How: Before each test, this makes the page's Math.random always return 0.5, so Home shows the same four every time.


	await curPagObj.addInitScript( () => { Math.random = () => 0.5; } ); // What: Fixed Random Call. Why: Each visit to Home should lay out the same cards. How: This replaces Math.random before any of the page's scripts run.


} );



for ( const [ froIndNum, froLinObj ] of PAG_LIN_ARR.entries() ) { // What: Start Page Loop. Why: Every page should hand off to the next at the top. How: This declares one footer test per page, going to the next page in the list.


	const nexLinObj = PAG_LIN_ARR[ ( froIndNum + 1 ) % PAG_LIN_ARR.length ]; // What: Next Link Object. Why: Each page links on to another. How: This picks the next page in the list, wrapping from the last back to Home.


	test( `the footer's "${ nexLinObj.labStr }" link from the bottom of ${ froLinObj.labStr } opens at the top`, async ( { page : curPagObj } ) => { // What: Footer Link Test. Why: A link clicked at the end of a page should open the next page at its top. How: This scrolls to the bottom, clicks the footer link, and checks the offset.


		await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The footer shows every page link side by side at desktop width. How: This sizes the page before it loads.

		await curPagObj.goto( froLinObj.patStr ); // What: Start Page Navigation. Why: The check starts on its page. How: This loads it.


		const botTopNum = await botScrFun( curPagObj ); // What: Bottom Top Number. Why: The click happens where the footer is. How: This scrolls to the end of the page and reads how far down it sits.


		expect( botTopNum ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll would let the check pass with nothing to reset. How: This checks the page sits below its top.

		await curPagObj.getByRole( 'navigation', { name : 'Footer navigation' } ).getByRole( 'link', { exact : true, name : nexLinObj.labStr } ).click(); // What: Footer Link Click. Why: The footer's links are the ones clicked furthest down a page. How: This clicks the link to the next page.

		await expect( curPagObj ).toHaveURL( nexLinObj.patStr );                         // What: Destination Assertion. Why: The offset only means something on the new page. How: This waits for the address to change.
		await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Offset Assertion. Why: The new page has to open at its top. How: This polls the scroll offset until it reads 0, failing if it never does.


	} );


}



test( "the current page's own bar link scrolls back to the top", async ( { page : curPagObj } ) => { // What: Same Page Link Test. Why: Clicking the page already showing is a request to go back to its start. How: This scrolls down About, clicks the bar's "About" link, and checks the offset.


	await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The bar shows its links at desktop width. How: This sizes the page before it loads.

	await curPagObj.goto( '/about' ); // What: About Page Navigation. Why: About is long enough to scroll well down. How: This loads it.


	const botTopNum = await botScrFun( curPagObj ); // What: Bottom Top Number. Why: The click should come from far down the page. How: This scrolls to the end of the page and reads how far down it sits.


	expect( botTopNum ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll would let the check pass with nothing to reset. How: This checks the page sits below its top.

	await curPagObj.getByRole( 'navigation', { name : 'Primary navigation' } ).getByRole( 'link', { exact : true, name : 'About' } ).click(); // What: Bar Link Click. Why: The bar stays in view at every scroll position. How: This clicks the link for the page already showing.

	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Offset Assertion. Why: The page has to return to its top. How: This polls the scroll offset until it reads 0.


} );



test( 'a phone menu link opens its page at the top', async ( { page : curPagObj } ) => { // What: Phone Menu Link Test. Why: Phone visitors move between pages through the menu. How: This scrolls down Home, opens the menu, clicks the "Contact" link, and checks the offset.


	await curPagObj.setViewportSize( { height : 844, width : 390 } ); // What: Phone Viewport Call. Why: The menu replaces the bar's links only at 1,024px and narrower. How: This sizes the page before it loads.

	await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: Home is long enough to scroll well down. How: This loads it.


	const botTopNum = await botScrFun( curPagObj ); // What: Bottom Top Number. Why: The menu link should be clicked from far down the page. How: This scrolls to the end of the page and reads how far down it sits.


	expect( botTopNum ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll would let the check pass with nothing to reset. How: This checks the page sits below its top.

	await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click();                                                                 // What: Menu Toggle Click. Why: The menu's links only show once it's open. How: This opens it from the fixed bar.
	await curPagObj.getByRole( 'navigation', { name : 'Menu navigation' } ).getByRole( 'link', { exact : true, name : 'Contact' } ).click(); // What: Menu Link Click. Why: A phone visitor picks a page from the open menu. How: This clicks the drawer's "Contact" link.

	await expect( curPagObj ).toHaveURL( '/contact' );                               // What: Destination Assertion. Why: The offset only means something on the new page. How: This waits for the address to change.
	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Offset Assertion. Why: The new page has to open at its top. How: This polls the scroll offset until it reads 0.


} );



test( 'back and forward return to the exact position, from a page scrolled further than the page between can scroll', async ( { page : curPagObj } ) => { // What: History Position Test. Why: The scroll hook restores positions itself, and Firefox would otherwise cut one short while a shorter page is still drawn. How: This scrolls Home to the bottom, follows the footer's "Contact" link to a page that can't scroll that far, and checks back, forward, and back again each return a page to the position it was left at.


	await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The footer shows every page link side by side at desktop width. How: This sizes the page before it loads.

	await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: Home is long enough to scroll well down. How: This loads it.


	const botOffNum = await botScrFun( curPagObj ); // What: Bottom Offset Number. Why: Back should return to exactly this position. How: This scrolls to the end of the page, which also waits for the scroll hook to record it, and keeps how far down that is.


	await curPagObj.getByRole( 'navigation', { name : 'Footer navigation' } ).getByRole( 'link', { exact : true, name : 'Contact' } ).click(); // What: Footer Link Click. Why: Back needs a shorter page to come back from. How: This follows the footer's "Contact" link.

	await expect( curPagObj ).toHaveURL( '/contact' );                                            // What: Destination Assertion. Why: The page between has to be showing before it's measured. How: This waits for the address to change.
	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toContainText( 'celebrate' ); // What: Contact Heading Assertion. Why: The address changes a moment before Contact renders, so measuring then would read Home's height. How: This waits for Contact's own heading.


	const conMaxNum = await curPagObj.evaluate( () => document.documentElement.scrollHeight - window.innerHeight ); // What: Contact Maximum Number. Why: The check only means something when Home sat further down than Contact can scroll. How: This reads Contact's furthest scroll position.


	expect( botOffNum ).toBeGreaterThan( conMaxNum ); // What: Further Scroll Assertion. Why: A Home position Contact could also reach wouldn't show a cut short restore. How: This checks the Home position lies past Contact's reach.

	await curPagObj.goBack(); // What: Back Navigation Call. Why: The visitor returns to Home. How: This presses the browser's back.

	await expect( curPagObj ).toHaveURL( '/' );                                              // What: Return Assertion. Why: The offset is read on Home again. How: This waits for the address to change back.
	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( botOffNum ); // What: Restored Offset Assertion. Why: Back should return to exactly where the visitor was. How: This polls until the offset matches the one read before leaving.

	await curPagObj.goForward(); // What: Forward Navigation Call. Why: Forward should return to Contact's own position, its top. How: This presses the browser's forward.

	await expect( curPagObj ).toHaveURL( '/contact' );                               // What: Forward Assertion. Why: The offset is read on Contact again. How: This waits for the address to change.
	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Forward Offset Assertion. Why: Contact was left at its top. How: This polls until the offset reads 0.

	await curPagObj.goBack(); // What: Second Back Navigation Call. Why: A position should survive more than one trip through history. How: This presses back again.

	await expect( curPagObj ).toHaveURL( '/' );                                              // What: Second Return Assertion. Why: The offset is read on Home again. How: This waits for the address to change back.
	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( botOffNum ); // What: Second Restored Offset Assertion. Why: Home should still return to where it was left. How: This polls until the offset matches the one read before leaving.


} );



test( 'a reload returns the page to where it was left', async ( { page : curPagObj } ) => { // What: Reload Position Test. Why: The scroll hook takes over the browser's restoring, so a reload has to find the position it saved. How: This scrolls Home down, reloads it, and checks it opens at the same position with the browser's own restoring switched off.


	await curPagObj.setViewportSize( { height : 844, width : 390 } ); // What: Phone Viewport Call. Why: Home's stacked phone layout scrolls well past 1,500px. How: This sizes the page before it loads.

	await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: The check starts on Home. How: This loads it.


	const leaTopNum = await scrDowFun( curPagObj ); // What: Leaving Top Number. Why: The reload should return the page to this position. How: This scrolls down and reads how far.


	expect( leaTopNum ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll would let the check pass without anything restored. How: This checks the page sits below its top.

	await curPagObj.reload(); // What: Page Reload Call. Why: This is the navigation under test. How: This reloads Home.

	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( leaTopNum ); // What: Reloaded Position Assertion. Why: A reload should open the page where it was left. How: This polls the scroll position until it matches the leaving position.

	expect( await curPagObj.evaluate( () => history.scrollRestoration ) ).toBe( 'manual' ); // What: Manual Restoration Assertion. Why: Chromium and WebKit restore a reload's position on their own, so the position alone can't show the hook did it. How: This checks the browser's own restoring is switched off, leaving the hook as the only thing that could have restored it.


} );



test( 'a fresh load of an address opens at its top, not where an earlier visit left it', async ( { page : curPagObj } ) => { // What: Fresh Load Test. Why: A new visit in the same tab reuses the first entry's default key, and shouldn't open where the last visit was left. How: This scrolls Home down, loads its address afresh, and checks it opens at the top, then still does after a reload.


	await curPagObj.setViewportSize( { height : 844, width : 390 } ); // What: Phone Viewport Call. Why: Home's stacked phone layout scrolls well past 1,500px. How: This sizes the page before it loads.

	await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: The earlier visit starts on Home. How: This loads it.

	expect( await scrDowFun( curPagObj ) ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll would let the check pass without a position to forget. How: This scrolls down and checks the page sits below its top.

	await curPagObj.goto( '/' ); // What: Fresh Load Call. Why: This is the navigation under test. How: This loads the same address again as a new navigation, not a reload.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toBeVisible(); // What: Heading Assertion. Why: The position is read once the page has rendered and the hook has run. How: This waits for Home's heading.

	expect( await curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Assertion. Why: A new visit should open at the top. How: This reads the scroll position once the page shows.

	await curPagObj.reload(); // What: Page Reload Call. Why: The fresh load has to forget the old position in storage too, or a reload before any scroll would bring it back. How: This reloads the page without scrolling it.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toBeVisible(); // What: Reloaded Heading Assertion. Why: The position is read once the reloaded page has rendered. How: This waits for Home's heading.

	expect( await curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Reloaded Top Assertion. Why: The reload should restore the fresh visit's top, not the earlier visit's position. How: This reads the scroll position once the page shows.


} );



test( 'a hash added to the address wins over a saved position', async ( { page : curPagObj } ) => { // What: Hash Entry Test. Why: A hash typed into the address adds an entry that shares the first entry's default key, whose saved position mustn't override the target. How: This scrolls Home down, adds the main element's hash to the address, and checks the page leaves the saved position for the top, where the main element sits, without restoring it.


	await curPagObj.addInitScript( () => { // What: Scroll Call Log Script. Why: A wrong restore could be undone by the jump to the target, leaving no trace in the position. How: This has each page record the top of every window.scrollTo call it makes.


		const winRecObj = window as unknown as { __scrTopArr : unknown[] }; // What: Window Record Object. Why: The log has to outlive this script for the test to read it. How: This views the window as holding it. // What: Type Assertion Note. Why: The window has no such field in its type. How: The script adds it here and the test reads it below.


		winRecObj.__scrTopArr = []; // What: Scroll Top Log Reset. Why: Each page starts with nothing logged. How: This sets the log to an empty list.


		window.scrollTo = new Proxy( window.scrollTo, { // What: Scroll Call Wrapper. Why: The scroll hook restores a saved position through window.scrollTo, while its hash jump scrolls the target into view instead. How: This logs each call's top before passing the call on unchanged.


			apply : ( appTarFun, appThiObj, argLisArr ) => { // What: Apply Trap. Why: Every call to window.scrollTo passes through the wrapper. How: This logs the call, then hands it on.


				winRecObj.__scrTopArr.push( argLisArr[ 0 ]?.top ); // What: Top Log Push. Why: The test reads which positions the page scrolled to. How: This records the call's top, or undefined when it has none.



				return Reflect.apply( appTarFun, appThiObj, argLisArr ); // What: Original Call Return. Why: The page should scroll as it would without the wrapper. How: This runs the real window.scrollTo with the same arguments.


			}


		} );


	} );


	await curPagObj.setViewportSize( { height : 844, width : 390 } ); // What: Phone Viewport Call. Why: Home's stacked phone layout scrolls well past 1,500px. How: This sizes the page before it loads.

	await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: The check starts on Home, the visit's first entry. How: This loads it.


	const savTopNum = await scrDowFun( curPagObj ); // What: Saved Top Number. Why: A wrong restore would scroll back to the position the hook just saved. How: This scrolls down and reads how far.


	expect( savTopNum ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll would leave nothing saved to wrongly restore. How: This checks the page sits below its top.

	await curPagObj.evaluate( () => { ( window as unknown as { __scrTopArr : unknown[] } ).__scrTopArr = []; } ); // What: Scroll Log Clear Call. Why: Only the calls the hash change causes matter. How: This empties the log just before it. // What: Type Assertion Note. Why: The window has no such field in its type. How: The init script set it.
	await curPagObj.evaluate( () => { location.hash = 'main'; } );                                                // What: Hash Change Call. Why: This is the navigation under test, the same as typing the hash into the address. How: This adds #main to the address, which the router reports as a POP sharing the first entry's key.

	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBeLessThan( savTopNum / 2 ); // What: Target Arrival Assertion. Why: The main element starts just below the bar, far above the saved position. How: This polls until the page sits near the top, where the main element is.

	expect( await curPagObj.evaluate( () => ( window as unknown as { __scrTopArr : unknown[] } ).__scrTopArr ) ).not.toContain( savTopNum ); // What: No Restore Assertion. Why: The hash should win over the saved position, not merely land last. How: This checks no scroll call after the hash change aimed at the saved position. // What: Type Assertion Note. Why: The window has no such field in its type. How: The init script set it.


} );



test( 'malformed saved scroll positions are ignored rather than breaking the page', async ( { page : curPagObj } ) => { // What: Malformed Storage Test. Why: Session storage can hold something another version or a visitor left, and the scroll hook reads it as the site loads. How: This plants a value that parses but isn't a list of pairs before the site loads, scrolls so the recorder and its save run too, and checks the page raised no error.


	const errLisArr : string[] = []; // What: Error List Array. Why: An uncaught error in the page would mean the hook choked on the stored value. How: This collects every one the page raises.


	curPagObj.on( 'pageerror', ( errCurObj ) => errLisArr.push( errCurObj.message ) ); // What: Page Error Listener. Why: Errors thrown in the page don't fail the test by themselves. How: This records each one's message.

	await curPagObj.addInitScript( () => sessionStorage.setItem( 'scroll-positions', 'null' ) ); // What: Malformed Storage Plant. Why: A stored null parses as JSON, so it gets past the parse and reaches the hook's handling of the value. How: This writes it before the site's scripts run.

	await curPagObj.setViewportSize( { height : 844, width : 390 } ); // What: Phone Viewport Call. Why: Home's stacked phone layout scrolls well past 1,500px. How: This sizes the page before it loads.

	await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: The hook reads the planted value as the site loads. How: This loads Home.

	expect( await scrDowFun( curPagObj ) ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll fires no scroll event, so the recorder and its save would never run. How: This scrolls down and checks the page sits below its top.
	expect( errLisArr ).toEqual( [] );                           // What: No Error Assertion. Why: The page passes only when the hook handled the bad value. How: This compares the collected errors with an empty list, so a failure prints each one.


} );



test( 'malformed saved entries are dropped while a well-formed saved position is still restored', async ( { page : curPagObj } ) => { // What: Mixed Storage Test. Why: The scroll hook checks each saved pair on its own, so one bad entry shouldn't cost the visitor a good position. How: This saves a real position, surrounds it with malformed entries, including a bad one under the same key after it, reloads, and checks the page raised no error and returned to the saved position.


	const errLisArr : string[] = []; // What: Error List Array. Why: An uncaught error in the page would mean the hook choked on the stored value. How: This collects every one the page raises.


	curPagObj.on( 'pageerror', ( errCurObj ) => errLisArr.push( errCurObj.message ) ); // What: Page Error Listener. Why: Errors thrown in the page don't fail the test by themselves. How: This records each one's message.

	await curPagObj.setViewportSize( { height : 844, width : 390 } ); // What: Phone Viewport Call. Why: Home's stacked phone layout scrolls well past 1,500px. How: This sizes the page before it loads.

	await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: The check starts on Home. How: This loads it.


	const leaTopNum = await scrDowFun( curPagObj ); // What: Leaving Top Number. Why: The reload should return the page to this position. How: This scrolls down and reads how far.


	expect( leaTopNum ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll would let the check pass without anything restored. How: This checks the page sits below its top.


	await curPagObj.evaluate( () => { // What: Malformed Entries Plant. Why: Only the hook's per-entry checks keep the good pair, since a bad entry under the same key would replace it and an entry that isn't a list would throw. How: This rewrites the saved record with malformed entries around the real ones, one of them a non-number position under each real key.


		const savPosArr : [ string, number ][] = JSON.parse( sessionStorage.getItem( 'scroll-positions' ) || '[]' ); // What: Saved Position Array. Why: The real pairs have to stay in the record. How: This reads the pairs the hook saved.


		sessionStorage.setItem( 'scroll-positions', JSON.stringify( [ null, [ 'bad' ], [ 1, 2 ], ...savPosArr, ...savPosArr.map( ( [ savKeyStr ] ) => [ savKeyStr, 'abc' ] ) ] ) ); // What: Mixed Record Write. Why: The reload reads this record. How: This puts a null, a one-item list, and a number key before the real pairs, and a text position under each real key after them.


	} );


	await curPagObj.reload(); // What: Page Reload Call. Why: The hook reads the planted record as the site loads. How: This reloads Home.

	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( leaTopNum ); // What: Reloaded Position Assertion. Why: The well-formed pair should survive the malformed entries around it. How: This polls the scroll position until it matches the leaving position.

	expect( errLisArr ).toEqual( [] ); // What: No Error Assertion. Why: The page passes only when the hook handled the bad entries. How: This compares the collected errors with an empty list, so a failure prints each one.


} );



for ( const { labStr : pagLabStr, patStr : rouPatStr } of [ ...PAG_LIN_ARR, { labStr : '404', patStr : '/missing' } ] ) { // What: Skip Link Loop. Why: Every page opens with the skip link. How: This declares one check per page, the 404 page included.


	test( `the first Tab on the ${ pagLabStr } page reaches the skip link, which moves focus to the main content`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Skip Link Test. Why: A keyboard user has to be able to jump past the bar. How: This presses Tab once on the page, clicks the skip link it lands on, and checks focus ends up on the main element without the address changing.


		await skiCheFun( curPagObj, broNamStr, rouPatStr, 'h1' ); // What: Skip Check Call. Why: The steps are shared with the card pages. How: This runs them on the page, ready once its heading shows.


	} );


}



for ( const { sluStr : carSluStr } of CAR_DAT_ARR ) { // What: Card Skip Link Loop. Why: Every card's page opens with its own skip link, since it has no site bar. How: This declares one check per card in the catalog, listed or not.


	test( `the first Tab on the /${ carSluStr } card page reaches the skip link, which moves focus to the card`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Card Skip Link Test. Why: A keyboard user has to be able to jump straight to the card. How: This presses Tab once on the card's page, clicks the skip link it lands on, and checks focus ends up on the main element holding the card without the address changing.


		await skiCheFun( curPagObj, broNamStr, `/${ carSluStr }`, 'nav[aria-label="Card"]' ); // What: Skip Check Call. Why: The steps are shared with the site's pages. How: This runs them on the card's page, ready once its floating bar shows.


	} );


}



test( 'the "Send a Card" button opens the Gallery without reloading the site', async ( { page : curPagObj } ) => { // What: Send A Card Link Test. Why: A plain link would reload the whole site instead of switching pages. How: This marks the document, clicks the bar's "Send a Card", and checks the mark survived, which only happens without a reload.


	await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The bar shows its "Send a Card" button at desktop width. How: This sizes the page before it loads.

	await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: The check starts away from the Gallery. How: This loads Home.

	await curPagObj.evaluate( () => document.documentElement.setAttribute( 'data-test-reload-marker', '' ) ); // What: Reload Marker Call. Why: A reload would build a fresh document without the mark. How: This sets a presence-only attribute on the root element.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'Send a Card' } ).click(); // What: Send A Card Click. Why: This is the bar's main action. How: This clicks the bar's "Send a Card".

	await expect( curPagObj ).toHaveURL( '/gallery' ); // What: Destination Assertion. Why: The button has to reach the Gallery. How: This waits for the address to change.

	expect( await curPagObj.evaluate( () => document.documentElement.hasAttribute( 'data-test-reload-marker' ) ) ).toBe( true ); // What: No Reload Assertion. Why: The router should switch pages within the same document. How: This checks the mark is still on the root element.


} );



test( 'a card tile opens its card, and the card leads back to the Gallery', async ( { page : curPagObj } ) => { // What: Card Round Trip Test. Why: Opening a card and coming back are the site's main path. How: This opens the Birthday card from its tile without a reload, checks the card's page and its own description, then follows "More cards" back to the Gallery at its top.


	await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The tiles sit three across at desktop width. How: This sizes the page before it loads.

	await curPagObj.goto( '/gallery' ); // What: Gallery Navigation. Why: The trip starts from the Gallery's tiles. How: This loads the Gallery.

	await curPagObj.evaluate( () => document.documentElement.setAttribute( 'data-test-reload-marker', '' ) ); // What: Reload Marker Call. Why: A reload would build a fresh document without the mark. How: This sets a presence-only attribute on the root element.

	await curPagObj.getByRole( 'link', { exact : true, name : 'Happy Birthday' } ).click(); // What: Tile Click. Why: A tile's title is its link. How: This clicks the Birthday card's tile.

	await expect( curPagObj ).toHaveURL( '/happy-birthday' );                                                                                                                         // What: Card Address Assertion. Why: The tile has to open its own card. How: This waits for the card's address.
	await expect( curPagObj.getByRole( 'navigation', { name : 'Card' } ) ).toBeVisible();                                                                                             // What: Card Bar Assertion. Why: Every card page floats its own small bar instead of the site's. How: This checks the bar is there.
	await expect( curPagObj.locator( 'meta[name="description"]' ) ).toHaveAttribute( 'content', CAR_DAT_ARR.find( ( carDatObj ) => carDatObj.sluStr === 'happy-birthday' )!.seaStr ); // What: Card Description Assertion. Why: A card opened inside the site has to swap in its own search description, which only its page's hook sets after a router move. How: This waits for the one description to read the Birthday card's. // What: Non-Null Note. Why: TypeScript can't see the catalog holds the Birthday card. How: The test opened that card's tile by its title just above.

	expect( await curPagObj.evaluate( () => document.documentElement.hasAttribute( 'data-test-reload-marker' ) ) ).toBe( true ); // What: No Reload Assertion. Why: The router should switch to the card within the same document. How: This checks the mark is still on the root element.

	await curPagObj.getByRole( 'link', { exact : true, name : 'More cards' } ).click(); // What: More Cards Click. Why: The card's bar leads back to the Gallery. How: This clicks "More cards".

	await expect( curPagObj ).toHaveURL( '/gallery' );                               // What: Return Assertion. Why: "More cards" has to reach the Gallery. How: This waits for the address to change back.
	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Assertion. Why: A link opens its page at the top. How: This polls until the Gallery sits at its top.


} );



test( "the share dialog's preview link opens its card from the Gallery", async ( { page : curPagObj } ) => { // What: Gallery Preview Test. Why: A sender may want to see a card as it will arrive before sending it. How: This opens the Birthday card's share dialog from its tile, names the recipient, follows "Preview card", and checks the card opens with the name and no dialog.


	await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The tiles sit three across at desktop width. How: This sizes the page before it loads.

	await curPagObj.goto( '/gallery' ); // What: Gallery Navigation. Why: The preview starts from a tile's "Share" button. How: This loads the Gallery.

	await curPagObj.getByRole( 'button', { name : 'Share Happy Birthday' } ).click(); // What: Share Click. Why: The dialog opens from the tile's "Share" button. How: This presses the Birthday card's.

	await curPagObj.getByLabel( 'Their name (optional)' ).fill( 'Sam' ); // What: Name Fill. Why: The preview should carry the name the link will. How: This types a recipient's name.

	await curPagObj.getByRole( 'link', { name : 'Preview card' } ).click(); // What: Preview Click. Why: The preview link is what's under test. How: This follows it.

	await expect( curPagObj ).toHaveURL( '/happy-birthday?name=Sam' );                      // What: Preview Address Assertion. Why: The preview opens the card as its link will. How: This waits for the card's address with the name.
	await expect( curPagObj.getByRole( 'dialog' ) ).toBeHidden();                           // What: Closed Dialog Assertion. Why: The card should be in view, not under the dialog. How: This checks no dialog shows.
	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toContainText( 'Sam' ); // What: Named Greeting Assertion. Why: The card should greet the recipient the link names. How: This checks the greeting holds the name.


} );



test( "the share dialog's preview link on a card's own page closes the dialog and replays the card", async ( { page : curPagObj } ) => { // What: Own Page Preview Test. Why: On the card's own page the preview opens that same page, so it has to close the dialog and start the card over itself. How: This marks the card's greeting, opens "Share", names the recipient, follows "Preview card", and checks the dialog closed and a fresh greeting holds the name.


	await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The card's bar shows its full wordmark at desktop width. How: This sizes the page before it loads.

	await curPagObj.goto( '/happy-birthday' ); // What: Card Navigation. Why: The preview starts from the card's own page. How: This loads the Birthday card.

	await curPagObj.getByRole( 'heading', { level : 1 } ).evaluate( ( heaCurEle ) => heaCurEle.setAttribute( 'data-test-mount-marker', '' ) ); // What: Mount Marker Call. Why: A card that starts over is mounted fresh, without the mark. How: This sets a presence-only attribute on the greeting.

	await curPagObj.getByRole( 'button', { exact : true, name : 'Share' } ).click(); // What: Share Click. Why: The dialog opens from the card bar's "Share" button. How: This presses it.

	await curPagObj.getByLabel( 'Their name (optional)' ).fill( 'Sam' ); // What: Name Fill. Why: The replayed card should carry the name the link will. How: This types a recipient's name.

	await curPagObj.getByRole( 'link', { name : 'Preview card' } ).click(); // What: Preview Click. Why: The preview link is what's under test. How: This follows it.

	await expect( curPagObj ).toHaveURL( '/happy-birthday?name=Sam' );                      // What: Preview Address Assertion. Why: The preview opens the card as its link will. How: This waits for the card's address with the name.
	await expect( curPagObj.getByRole( 'dialog' ) ).toBeHidden();                           // What: Closed Dialog Assertion. Why: The card should be in view, not under the dialog. How: This checks the dialog closed.
	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toContainText( 'Sam' ); // What: Named Greeting Assertion. Why: The card should greet the recipient the link names. How: This checks the greeting holds the name.
	await expect( curPagObj.locator( 'h1[data-test-mount-marker]' ) ).toHaveCount( 0 );     // What: Replay Assertion. Why: The card should start over, not just change its name in place. How: This checks the marked greeting is gone, replaced by a freshly mounted one.


} );



test( "a card's share dialog starts with the names its address carries", async ( { page : curPagObj } ) => { // What: Carried Names Test. Why: A sender who previewed a card, or opened a named one, shouldn't have to type its names again to share it. How: This opens the signable Christmas card with both names in its address, opens "Share", and checks both fields start with them.


	await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The card's bar shows its full wordmark at desktop width. How: This sizes the page before it loads.

	await curPagObj.goto( '/merry-christmas?name=Sam&from=Alex' ); // What: Named Card Navigation. Why: The Christmas card takes both a recipient's and a sender's name. How: This loads it with both in its address.

	await curPagObj.getByRole( 'button', { exact : true, name : 'Share' } ).click(); // What: Share Click. Why: The dialog opens from the card bar's "Share" button. How: This presses it.

	await expect( curPagObj.getByLabel( 'Their name (optional)' ) ).toHaveValue( 'Sam' ); // What: Recipient Field Assertion. Why: The recipient's name should carry over. How: This checks the field holds the address's name.
	await expect( curPagObj.getByLabel( 'Your name (optional)' ) ).toHaveValue( 'Alex' ); // What: Sender Field Assertion. Why: The sender's name should carry over. How: This checks the field holds the address's `from`.


} );



test.describe( 'with smooth scrolling on', () => { // What: Smooth Scroll Group. Why: Reduced motion turns the stylesheet's smooth scroll-behavior off, so the tests above would pass even if the jump to the top glided or came a frame late. How: This groups the check that runs with smooth scrolling left on.


	test.use( { reducedMotion : 'no-preference' } ); // What: Full Motion Use. Why: The stylesheet only scrolls smoothly when no reduced motion is asked for. How: This makes the group's pages match prefers-reduced-motion: no-preference.



	test( 'a footer link opens the next page at its top before the new page is drawn', async ( { page : curPagObj } ) => { // What: Instant Top Test. Why: A smooth glide or a late jump would show the old position on the new page first. How: This scrolls Home to the bottom, records the offset the moment the Gallery's heading appears and again in the frame after, follows the footer's "Gallery" link, and checks both readings are 0.


		await curPagObj.setViewportSize( { height : 900, width : 1440 } ); // What: Desktop Viewport Call. Why: The footer shows every page link side by side at desktop width. How: This sizes the page before it loads.

		await curPagObj.goto( '/' ); // What: Home Page Navigation. Why: Home is long enough to scroll well down. How: This loads it.

		expect( await curPagObj.evaluate( () => getComputedStyle( document.documentElement ).scrollBehavior ) ).toBe( 'smooth' ); // What: Smooth Premise Assertion. Why: The check only proves an instant jump when the stylesheet would otherwise glide. How: This reads the root element's scroll-behavior and checks it's smooth.


		const botTopNum = await botScrFun( curPagObj ); // What: Bottom Top Number. Why: The click happens where the footer is. How: This scrolls to the end of the page and reads how far down it sits.


		expect( botTopNum ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: A page that can't scroll would let the check pass with nothing to reset. How: This checks the page sits below its top.



		await curPagObj.evaluate( () => { // What: Top Recorder Script. Why: A retrying check would pass a glide that only reaches the top later. How: This watches for the next page's heading and records the offset once as it appears and once in the frame after, before that frame is drawn.


			const oldHeaEle = document.querySelector( 'h1' );                                                               // What: Old Heading Element. Why: Home's own heading is already on the page. How: This holds it, so only a new heading counts.
			const winRecObj = window as unknown as { __topRecPro : Promise< { fraTopNum : number, heaTopNum : number } > }; // What: Window Record Object. Why: The readings have to outlive this script for the test to read them. How: This views the window as holding them. // What: Type Assertion Note. Why: The window has no such field in its type. How: The script adds it here and the test reads it below.


			winRecObj.__topRecPro = new Promise( ( resProFun ) => { // What: Top Record Promise. Why: The test waits for both readings. How: This resolves with them once the next page's heading has appeared and a frame has passed.


				const mutObsObj = new MutationObserver( () => { // What: Mutation Observer Object. Why: The router swaps the page in without a load event, and React's layout effects, the scroll hook's among them, run in the same commit, before the observer's callback. How: On each change to the page, this checks for a new heading and records the offset once it's there.


					const newHeaEle = document.querySelector( 'h1' ); // What: New Heading Element. Why: The next page's heading marks the moment it exists. How: This reads the page's heading now.


					if ( !newHeaEle || newHeaEle === oldHeaEle ) return; // What: New Heading Guard. Why: Changes before the next page renders don't count. How: This stops while there's no heading or it's still Home's.



					const heaTopNum = window.scrollY; // What: Heading Top Number. Why: The new page has to be at its top the moment it exists. How: This reads the offset once, without waiting.


					mutObsObj.disconnect(); // What: Observer Disconnect Call. Why: Only the first appearance is recorded. How: This stops watching the page.

					requestAnimationFrame( () => resProFun( { fraTopNum : window.scrollY, heaTopNum } ) ); // What: Frame Top Record Call. Why: The first frame drawn with the new page shouldn't show the old position, as it would mid-glide. How: This reads the offset again in the next animation frame, before it's painted, and resolves with both readings.


				} );


				mutObsObj.observe( document.body, { childList : true, subtree : true } ); // What: Page Observe Call. Why: The next page is added somewhere under the body. How: This watches every added or removed element there.


			} );


		} );


		await curPagObj.getByRole( 'navigation', { name : 'Footer navigation' } ).getByRole( 'link', { exact : true, name : 'Gallery' } ).click(); // What: Footer Link Click. Why: This is the navigation under test. How: This clicks the footer's "Gallery" link from the bottom of Home.

		await expect( curPagObj ).toHaveURL( '/gallery' ); // What: Destination Assertion. Why: The readings only mean something on the new page. How: This waits for the address to change.


		const { fraTopNum, heaTopNum } = await curPagObj.evaluate( () => ( window as unknown as { __topRecPro : Promise< { fraTopNum : number, heaTopNum : number } > } ).__topRecPro ); // What: Frame Top Number. Why: The first drawn frame should be at the top. How: This holds the offset read in the frame after the heading appeared. // What: Heading Top Number. Why: The new page should be at its top as it appears. How: This holds the offset read the moment the heading appeared. // What: Type Assertion Note. Why: The window has no such field in its type. How: The recorder script set it.


		expect( heaTopNum ).toBe( 0 ); // What: Heading Top Assertion. Why: The jump has to happen before the new page is drawn, never as a glide. How: This checks the offset read once as the heading appeared is 0.
		expect( fraTopNum ).toBe( 0 ); // What: Frame Top Assertion. Why: The first frame drawn with the new page shouldn't show the old position. How: This checks the offset read in that frame is 0.


	} );


} );

// #endregion Module Init


