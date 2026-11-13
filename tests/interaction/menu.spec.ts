


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the menu behaves as it should. How: This asserts on the menu's state, the page's inert parts, and focus.
import { test   } from '@playwright/test'; // What: Test. Why: Each way of using the menu is its own test. How: This declares them.


import type { Locator } from '@playwright/test'; // What: Locator. Why: The click kinds pass Playwright's own click options. How: This types the options each row holds.
import type { Page    } from '@playwright/test'; // What: Page. Why: The helpers drive a Playwright page. How: This types their page parameters.

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
 * hides the toggle. Choosing one of its links closes it too, whether the link
 * opens in place or in a new tab, through a plain tap, a Ctrl or Cmd click, a
 * middle click, or a plain tap on a profile that opens another site. The email
 * link hands its address to the visitor's mail app rather than a tab, so its
 * plain tap and modified clicks are checked only for closing the menu and
 * leaving the page where it was.
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

const CLI_KIN_ARR : Array< [ string, Parameters< Locator[ 'click' ] >[ 0 ] ] > = [ [ 'Ctrl or Cmd', { modifiers : [ 'ControlOrMeta' ] } ], [ 'middle', { button : 'middle' } ] ]; // What: Click Kind Array. Why: Both ways of asking for a new tab have to close the menu. How: Each row pairs a name for the test title with the click options that make that kind of click.

const MEN_LIN_ARR = [ // What: Menu Link Array. Why: A page link, the call to action, and each profile icon have to close the open menu. How: Each entry is a link's accessible name: a page link, the call to action, then the profile icons.


	'About',       // What: Page Link Name. Why: The menu's page links route inside the site. How: This names the "About" link.
	'Send a Card', // What: Call-To-Action Link Name. Why: The menu's button routes inside the site too. How: This names the "Send a Card" link.
	'GitHub',      // What: Profile Link Name. Why: The profile icons open another site in a new tab. How: This names the "GitHub" icon.
	'LinkedIn'     // What: Profile Link Name. Why: The profile icons open another site in a new tab. How: This names the "LinkedIn" icon.


];

// #endregion Constants



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


	await curPagObj.setViewportSize( { height : 844, width : 390 } ); // What: Phone Viewport Call. Why: The menu replaces the bar's links only at 1,024px and narrower. How: This sizes the page before it loads.

	await curPagObj.goto( '/about' ); // What: About Page Navigation. Why: About is long enough for the scrim to cover real content. How: This loads it.

	await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); // What: Menu Toggle Click. Why: Every check starts with the menu open. How: This opens it.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Open State Assertion. Why: The toggle has to report the menu open. How: This checks its aria-expanded.
	await expect( curPagObj.locator( 'main[inert], footer[inert]' ) ).toHaveCount( 2 );                                   // What: Inert Page Assertion. Why: Content under the scrim shouldn't take focus or be read. How: This checks the main content and the footer are both inert.


}

// #endregion menOpeFun



// #region newTabFun

/**
 * newTabFun = New Tab Function
 *
 * @summary
 * Opens the menu, clicks one of its links with the given click options while
 * waiting for the new tab the click opens, and checks the menu closed while
 * the page clicked from stayed on About. Requests to other sites are refused
 * first, so a profile never loads for real.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to click from.
 * @param linNamStr - Link Name String: The link's accessible name.
 * @param cliOptObj - Click Options Object: How the link is clicked.
 *
 * @returns A promise that settles once the menu has been checked closed, with
 *          no value.
 *
 * @example
 * ```ts
 * newTabFun(page, 'About', { button : 'middle' }) // => Promise<void>
 * ```
 *
*/

async function newTabFun ( curPagObj : Page, linNamStr : string, cliOptObj : Parameters< Locator[ 'click' ] >[ 0 ] ) : Promise< void > {


	await curPagObj.context().route( /^https:\/\//, ( rouCurObj ) => rouCurObj.abort() ); // What: Outside Request Block. Why: A test shouldn't reach GitHub or any other site. How: This refuses every HTTPS request, which only other sites use here.

	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The link is clicked from the open menu. How: This opens and checks it on About.


	const newTabPro = curPagObj.context().waitForEvent( 'page' ); // What: New Tab Promise. Why: The click opens its page in a new tab. How: This waits for the browser context to report a new page, set up before the click so it can't be missed.


	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { name : new RegExp( `^${ linNamStr }( \\(opens in a new tab\\))?$` ) } ).click( cliOptObj ); // What: Link Click Call. Why: This is the action under test. How: This clicks the link the given way, found by its name alone or followed by the note a profile adds that it opens a new tab.

	await newTabPro; // What: New Tab Wait. Why: The click should open a new tab. How: This waits for the browser to report it.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The menu should close whichever way the link opens. How: This waits until the toggle reports it closed.
	await expect( curPagObj ).toHaveURL( '/about' );                                                                       // What: Original Address Assertion. Why: The page clicked from shouldn't navigate. How: This checks it's still on About.
	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 );                                                       // What: Page Restored Assertion. Why: The page clicked from has to be usable again. How: This checks nothing is left inert.


}

// #endregion newTabFun

// #endregion Helpers



// #region Module Init

test.use( { reducedMotion : 'reduce' } ); // What: Reduced Motion Use. Why: The menu's fade would otherwise still be running when the checks read it. How: This makes every page in this file match prefers-reduced-motion: reduce.



test( 'the open menu offers the pages, profiles, and email over a dimmed page', async ( { page : curPagObj } ) => { // What: Open Menu Test. Why: The menu should stand apart from the page and offer more than its links. How: This opens it and checks the page links, the profile links, the email link, and that the scrim sits over the page.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The checks need the menu open. How: This opens and checks it.

	await expect( curPagObj.getByRole( 'navigation', { name : 'Menu navigation' } ).getByRole( 'link' ) ).toHaveCount( 4 ); // What: Page Links Assertion. Why: Every page should be one tap away. How: This counts the links in the menu's navigation landmark.
	await expect( curPagObj.getByRole( 'banner' ).locator( 'a[target="_blank"][aria-label]' ) ).toHaveCount( 2 );           // What: Profile Links Assertion. Why: Both of z4nta0's profiles should be one tap away. How: This counts the menu's named links that open in a new tab.
	await expect( curPagObj.getByRole( 'banner' ).getByRole( 'link', { name : 'contact@techgeek.cards' } ) ).toBeVisible(); // What: Email Link Assertion. Why: The contact email should be one tap away. How: This checks the menu shows the mailto link.

	expect( await curPagObj.evaluate( () => document.elementFromPoint( 200, 800 )?.getAttribute( 'aria-hidden' ) ) ).toBe( 'true' ); // What: Scrim On Top Assertion. Why: A tap on the page below the menu has to land on the scrim, not the page. How: This checks the element at a point below the panel is the scrim, the one element there hidden from screen readers.


} );



test( 'tapping the scrim closes the menu', async ( { page : curPagObj } ) => { // What: Scrim Close Test. Why: A tap anywhere on the dimmed page should close the menu. How: This taps below the panel and checks the menu closes and the page comes back.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The check needs the menu open. How: This opens and checks it.

	await curPagObj.mouse.click( 200, 800 ); // What: Scrim Tap Call. Why: The scrim covers the page below the panel. How: This taps it.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The tap should close the menu. How: This checks the toggle reports it closed.
	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 );                                                       // What: Page Restored Assertion. Why: The page has to be usable again. How: This checks nothing is left inert.


} );



test( 'Escape closes the menu and returns focus to the toggle', async ( { page : curPagObj } ) => { // What: Escape Close Test. Why: Escape is the expected way out of a layer over the page, and focus shouldn't be left in a closed menu. How: This presses Escape and checks the menu, the page, and focus.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The check needs the menu open. How: This opens and checks it.

	await curPagObj.keyboard.press( 'Escape' ); // What: Escape Press Call. Why: The keyboard way out is checked. How: This presses Escape.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: Escape should close the menu. How: This checks the toggle reports it closed.
	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toBeFocused();                               // What: Focus Return Assertion. Why: The visitor should be back where they opened the menu. How: This checks the toggle has focus.
	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 );                                                       // What: Page Restored Assertion. Why: The page has to be usable again. How: This checks nothing is left inert.


} );



test( 'tapping the brand goes home and closes the menu', async ( { page : curPagObj } ) => { // What: Brand Close Test. Why: The brand stays tappable above the open menu, and the home page it opens shouldn't be left inert behind a menu still open. How: This taps the brand and checks the address, the menu, and the main content.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The check needs the menu open on a page other than Home. How: This opens and checks it on About.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'TechGeek.cards' } ).click(); // What: Brand Tap Call. Why: The brand is the way home from the open menu. How: This taps the bar's brand link.

	await expect( curPagObj ).toHaveURL( '/' );                                                                            // What: Home Assertion. Why: The brand links to the home page. How: This waits for the address to change.
	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The tap should close the menu. How: This checks the toggle reports it closed.
	await expect( curPagObj.locator( 'main[inert]' ) ).toHaveCount( 0 );                                                   // What: Main Restored Assertion. Why: The home page's content has to be usable. How: This checks the main content is no longer inert.


} );



test( 'widening the screen closes the menu', async ( { page : curPagObj } ) => { // What: Resize Close Test. Why: Past the phone layout the toggle disappears, which would leave the page inert with no way to close the menu. How: This widens the screen and checks the menu closes and the page comes back.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The check needs the menu open. How: This opens and checks it.

	await curPagObj.setViewportSize( { height : 900, width : 1280 } ); // What: Wide Viewport Call. Why: A laptop screen, or a widened window, passes the menu layout. How: This resizes the page past the bar's 1,024px breakpoint.

	await expect( curPagObj.getByRole( 'button', { includeHidden : true, name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: Widening the screen should close the menu, not just hide its toggle. How: This checks the toggle, hidden at this width, reports the menu closed.
	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 );                                                                             // What: Page Restored Assertion. Why: The wide page has to be usable. How: This checks nothing is left inert.


} );



for ( const [ cliKinStr, cliOptObj ] of CLI_KIN_ARR ) { // What: Click Kind Loop. Why: Each way of asking for a new tab gets its own checks. How: This declares one test per menu link for each row of CLI_KIN_ARR.


	for ( const linNamStr of MEN_LIN_ARR ) { // What: Menu Link Loop. Why: Each link in MEN_LIN_ARR has to close the menu. How: This declares one test per link.


		test( `a ${ cliKinStr } click on the menu's "${ linNamStr }" link opens a new tab and closes the menu`, async ( { page : curPagObj } ) => { // What: Menu New Tab Test. Why: The menu should close once any link is chosen, even one opening in a new tab. How: This clicks the link the loop's way and checks a new tab opened, the menu closed, and the page stayed put.


			await newTabFun( curPagObj, linNamStr, cliOptObj ); // What: New Tab Check Call. Why: The steps are shared by every link and click kind. How: This clicks the link and checks the result.


		} );


	}


}



test( 'a plain tap on the "Gallery" link in the menu opens the Gallery and closes the menu', async ( { page : curPagObj } ) => { // What: Page Link Close Test. Why: Choosing a page from the menu should leave the menu closed on the page it opens. How: This taps the menu's "Gallery" link and checks the address, the toggle, and the page.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The link is tapped from the open menu. How: This opens and checks it on About.

	await curPagObj.getByRole( 'navigation', { name : 'Menu navigation' } ).getByRole( 'link', { exact : true, name : 'Gallery' } ).click(); // What: Gallery Link Tap Call. Why: This is the action under test. How: This taps the menu's "Gallery" link.

	await expect( curPagObj ).toHaveURL( '/gallery' );                                                                     // What: Gallery Address Assertion. Why: The link routes to the Gallery. How: This waits for the address to change.
	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The menu should close once a link is chosen. How: This checks the toggle reports it closed.
	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 );                                                       // What: Page Restored Assertion. Why: The page it opens has to be usable. How: This checks nothing is left inert.


} );



for ( const [ cliKinStr, cliOptObj ] of CLI_KIN_ARR ) { // What: Email Click Kind Loop. Why: Each way of asking for a new tab has to close the menu on the email link too. How: This declares one test per row of CLI_KIN_ARR.


	test( `a ${ cliKinStr } click on the menu's email link closes the menu and leaves the page in place`, async ( { page : curPagObj } ) => { // What: Email Link Close Test. Why: A mailto link hands its address to a mail app rather than opening a page, so no new tab is waited for, but the menu still has to close. How: This clicks the email link the loop's way and checks the menu closed and the page stayed on About.


		await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The link is clicked from the open menu. How: This opens and checks it on About.

		await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'contact@techgeek.cards' } ).click( cliOptObj ); // What: Email Link Click Call. Why: This is the action under test. How: This clicks the email link the given way.

		await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The menu should close whichever way the link is clicked. How: This waits until the toggle reports it closed.
		await expect( curPagObj ).toHaveURL( '/about' );                                                                       // What: Original Address Assertion. Why: The page clicked from shouldn't navigate. How: This checks it's still on About.
		await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 );                                                       // What: Page Restored Assertion. Why: The page clicked from has to be usable again. How: This checks nothing is left inert.


	} );


}



test( "a plain tap on the menu's email link closes the menu and leaves the page in place", async ( { page : curPagObj } ) => { // What: Email Link Tap Test. Why: A mailto link hands its address to a mail app rather than opening a page, so the menu has to close and the page stay put on a plain tap too. How: This taps the email link and checks the menu closed and the page stayed on About.


	await menOpeFun( curPagObj ); // What: Menu Open Call. Why: The link is tapped from the open menu. How: This opens and checks it on About.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'contact@techgeek.cards' } ).click(); // What: Email Link Tap Call. Why: This is the action under test. How: This taps the email link plainly.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The menu should close once a link is chosen. How: This waits until the toggle reports it closed.
	await expect( curPagObj ).toHaveURL( '/about' );                                                                       // What: Original Address Assertion. Why: The page tapped from shouldn't navigate. How: This checks it's still on About.
	await expect( curPagObj.locator( '[inert]' ) ).toHaveCount( 0 );                                                       // What: Page Restored Assertion. Why: The page tapped from has to be usable again. How: This checks nothing is left inert.


} );



for ( const linNamStr of MEN_LIN_ARR.slice( 2 ) ) { // What: Outside Link Loop. Why: A profile icon opens a new tab even on a plain tap, which leaves the page behind. How: This declares one test per profile link, each of which opens another site.


	test( `a plain tap on the menu's "${ linNamStr }" link opens a new tab and closes the menu`, async ( { page : curPagObj } ) => { // What: Outside Link Test. Why: A visitor coming back from the other site should find the page usable, not inert behind a menu still open. How: This taps the link and checks a new tab opened, the menu closed, and the page stayed put.


		await newTabFun( curPagObj, linNamStr, {} ); // What: New Tab Check Call. Why: The steps are shared with the modified clicks. How: This taps the link plainly and checks the result.


	} );


}

// #endregion Module Init


