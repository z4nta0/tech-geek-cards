


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the page ends up where it should. How: This asserts on what each check reads, such as the section's position.
import { test   } from '@playwright/test'; // What: Test. Why: Each section link behavior is its own test. How: This declares them.


import type { Locator } from '@playwright/test'; // What: Locator. Why: The new tab checks hand the button's click its options. How: This types those options from the click method's own parameter.
import type { Page    } from '@playwright/test'; // What: Page. Why: The helpers drive a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * section-link.spec.ts = Section Link Spec
 *
 * @summary
 * Checks Home's one section link, the hero's "How It Works" button, in
 * whichever engine the project runs. A plain click lands the steps just below
 * the fixed bar without ever putting a hash in the address. A Ctrl, Cmd, or
 * middle click opens the steps in a new tab instead, which lands on them and
 * clears its hash, while the page clicked from stays put. Loading Home with
 * the steps' ID as the hash lands on them and clears the hash too. Pages open
 * under reduced motion, so scrolling jumps straight to its target and each
 * position can be read at once.
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

const BUT_LAB_STR = 'How It Works';                 // What: Button Label String. Why: The hero's button is found by its words. How: This is its accessible name.
const DES_VIE_OBJ = { height : 900, width : 1440 }; // What: Desktop Viewport Object. Why: The hero sets its text beside the envelope on wide screens. How: This is the desktop size the checks use.
const PHO_VIE_OBJ = { height : 844, width : 390 };  // What: Phone Viewport Object. Why: The hero stacks at 768px and below, which moves the button. How: This is the phone size the checks use.
const SEC_IDE_STR = 'how-it-works';                 // What: Section Identifier String. Why: The button leads to the steps section. How: This is its ID.

const CLI_KIN_ARR : Array< [ string, Parameters< Locator[ 'click' ] >[ 0 ] ] > = [ [ 'Ctrl or Cmd', { modifiers : [ 'ControlOrMeta' ] } ], [ 'middle', { button : 'middle' } ] ]; // What: Click Kind Array. Why: Both ways of asking for a new tab have to keep working. How: Each row pairs a name for the test title with the click options that make that kind of click.

// #endregion Constants



// #region Helpers

// #region opeRouFun

/**
 * opeRouFun = Open Route Function
 *
 * @summary
 * Opens one address at one viewport size, ready to be used: it turns on
 * reduced motion so in-page scrolling jumps rather than glides, sizes the
 * viewport, counts every hashchange event the page fires on the window's
 * __hasChaNum, so a check can tell that no plain jump to the section ever put
 * a hash in the address, loads the address, and waits for the web fonts, so
 * positions read afterwards are final.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the address on.
 * @param rouPatStr - Route Path String: The address to load.
 * @param vieSizObj - Viewport Size Object: {@link DES_VIE_OBJ} or
 *                    {@link PHO_VIE_OBJ}.
 *
 * @returns A promise that settles once the address is loaded and its fonts
 *          are ready, with no value.
 *
 * @example
 * ```ts
 * opeRouFun(page, '/', DES_VIE_OBJ) // => Promise<void>
 * ```
 *
*/

async function opeRouFun ( curPagObj : Page, rouPatStr : string, vieSizObj : { height : number, width : number } ) : Promise< void > {


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Scrolling should land at once, so its target can be read right away. How: This makes the page match prefers-reduced-motion, which turns smooth scrolling off.

	await curPagObj.setViewportSize( vieSizObj ); // What: Viewport Size Call. Why: The hero's layout depends on the width. How: This sizes the page before it loads.


	await curPagObj.addInitScript( () => { // What: Hash Change Counter. Why: A plain jump that put a hash in the address would see Home clear it again, so the address alone couldn't show it happened. How: This counts every hashchange event on the window, from the first script that runs.


		Reflect.set( window, '__hasChaNum', 0 ); // What: Hash Change Number Set. Why: The count starts at zero on every load. How: This puts the counter on the window, where a check reads it.

		window.addEventListener( 'hashchange', () => Reflect.set( window, '__hasChaNum', Number( Reflect.get( window, '__hasChaNum' ) ) + 1 ) ); // What: Hash Change Listener. Why: Each jump has to be counted. How: This adds one to the counter whenever the hash changes.


	} );


	await curPagObj.goto( rouPatStr ); // What: Route Load Call. Why: Each check starts from a fresh load. How: This opens the address on the suite's dev server.

	await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Positions measured before the fonts load would shift. How: This waits until the fonts the page uses have loaded.


}

// #endregion opeRouFun



// #region secGapFun

/**
 * secGapFun = Section Gap Function
 *
 * @summary
 * Reads how far the steps section's top edge sits from where a jump to it
 * should leave it, in pixels: just below the fixed bar, at the root's scroll
 * padding, unless the page can't scroll far enough. Zero means the section
 * landed there, to the nearest pixel.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page holding the section.
 *
 * @returns A promise that resolves with the gap in pixels, positive when
 *          the section sits too low.
 *
 * @example
 * ```ts
 * secGapFun(page) // => 0
 * ```
 *
*/

async function secGapFun ( curPagObj : Page ) : Promise< number > {


	return curPagObj.evaluate( ( tarIdeStr ) => { // What: Gap Measure Return. Why: The section's position is read in the page. How: This works out where the section should land and returns how far it is from there.


		const docRooEle = document.documentElement;                                                     // What: Document Root Element. Why: The scroll padding and the scroll range belong to the root. How: This reads it.
		const secTopNum = document.getElementById( tarIdeStr )!.getBoundingClientRect().top;            // What: Section Top Number. Why: The section's position on screen is what's checked. How: This reads its top edge from the viewport's top. // What: Non-Null Note. Why: getElementById can return null. How: Every check waits for Home, which renders the section.
		const maxScrNum = docRooEle.scrollHeight - docRooEle.clientHeight;                              // What: Maximum Scroll Number. Why: A jump can't scroll past the page's end. How: This is the furthest the page can scroll.
		const padTopNum = parseFloat( getComputedStyle( docRooEle ).scrollPaddingTop );                 // What: Padding Top Number. Why: A jump stops below the bar by the root's scroll padding. How: This reads it in pixels.
		const tarScrNum = Math.min( maxScrNum, Math.max( 0, secTopNum + window.scrollY - padTopNum ) ); // What: Target Scroll Number. Why: The page scrolls as far toward the section as it can. How: This clamps the ideal scroll to the page's range.



		return Math.round( secTopNum - ( secTopNum + window.scrollY - tarScrNum ) ); // What: Gap Return. Why: The caller compares the section with its landing spot. How: This subtracts the landing spot's top from the section's.


	}, SEC_IDE_STR ); // What: Measuring Argument. Why: The page can't read this file's constants. How: This hands the section's ID into the page.


}

// #endregion secGapFun

// #endregion Helpers



// #region Module Init

for ( const vieSizObj of [ DES_VIE_OBJ, PHO_VIE_OBJ ] ) { // What: Viewport Loop. Why: The button sits in a different place on wide screens and phones. How: This declares each plain click and arrival test once per viewport size.


	test( `a plain click on "${ BUT_LAB_STR }" at ${ vieSizObj.width.toLocaleString( 'en-US' ) }px scrolls to the steps with no hash`, async ( { page : curPagObj } ) => { // What: Plain Click Test. Why: A section link has to take the visitor to its section without a hash. How: This clicks the button and checks the section's position, the address, and that no hashchange fired.


		await opeRouFun( curPagObj, '/', vieSizObj ); // What: Home Open Call. Why: The button sits in Home's hero. How: This opens Home at the loop's size.

		await curPagObj.getByRole( 'main' ).getByRole( 'link', { exact : true, name : BUT_LAB_STR } ).click(); // What: Button Click Call. Why: This is the action under test. How: This clicks the button by its words.

		await expect.poll( async () => Math.abs( await secGapFun( curPagObj ) ) ).toBeLessThan( 1 ); // What: Section Position Assertion. Why: The steps should land just below the bar. How: This waits until their top sits less than a pixel from where the jump should leave it.
		await expect( curPagObj ).toHaveURL( /\/$/ );                                                // What: Clean Address Assertion. Why: The address bar should stay free of hashes. How: This checks the URL still ends at the root.

		expect( await curPagObj.evaluate( () => Reflect.get( window, '__hasChaNum' ) ) ).toBe( 0 ); // What: No Hash Jump Assertion. Why: A plain jump would have put a hash in the address before Home cleared it. How: This checks the page never fired a hashchange event.


	} );



	test( `loading /#how-it-works at ${ vieSizObj.width.toLocaleString( 'en-US' ) }px lands on the steps and clears the hash`, async ( { page : curPagObj } ) => { // What: Hash Arrival Test. Why: A shared address naming the steps should land on them and leave a clean address. How: This loads Home with the steps' ID as the hash and checks the section's position and the address.


		await opeRouFun( curPagObj, `/#${ SEC_IDE_STR }`, vieSizObj ); // What: Hash Address Open Call. Why: This is the arrival under test. How: This loads Home with the steps' ID as the hash at the loop's size.

		await expect.poll( async () => Math.abs( await secGapFun( curPagObj ) ) ).toBeLessThan( 1 ); // What: Section Position Assertion. Why: The arrival should land the steps just below the bar. How: This waits until their top sits less than a pixel from there.
		await expect( curPagObj ).toHaveURL( /\/$/ );                                                // What: Clean Address Assertion. Why: The hash should be cleared once used. How: This checks the URL ends at the root.


	} );


}



for ( const [ cliKinStr, cliOptObj ] of CLI_KIN_ARR ) { // What: Modified Click Loop. Why: Each way of asking for a new tab gets its own check. How: This declares one test per row of CLI_KIN_ARR.


	test( `a ${ cliKinStr } click on "${ BUT_LAB_STR }" opens the steps in a new tab`, async ( { page : curPagObj } ) => { // What: New Tab Test. Why: A visitor opening the steps in a new tab should land on them there, while the page they clicked from stays put. How: This makes the click, then checks the new tab's section and address and the original page's address and scroll.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The button sits in Home's hero. How: This opens Home at desktop size.


		const butCurObj = curPagObj.getByRole( 'main' ).getByRole( 'link', { exact : true, name : BUT_LAB_STR } ); // What: Button Current Object. Why: The click and the scroll before it target the same button. How: This finds it by its words inside the main content.


		await butCurObj.scrollIntoViewIfNeeded(); // What: Button Scroll Call. Why: The page's scroll before the click has to be read after any scroll the click itself would make to reach the button. How: This brings the button into view first.


		const oriScrNum = await curPagObj.evaluate( () => window.scrollY ); // What: Original Scroll Number. Why: The page clicked from should stay where it was. How: This reads its scroll just before the click.
		const oriUrlStr = curPagObj.url();                                  // What: Original URL String. Why: The page clicked from shouldn't navigate. How: This reads its address just before the click.
		const newTabPro = curPagObj.context().waitForEvent( 'page' );       // What: New Tab Promise. Why: The click opens its page in a new tab. How: This waits for the browser context to report a new page, set up before the click so it can't be missed.


		await butCurObj.click( cliOptObj ); // What: Modified Click Call. Why: This is the action under test. How: This clicks the button the way the loop's row says.


		const newTabObj = await newTabPro; // What: New Tab Object. Why: The steps should open in the new tab. How: This is the page the click opened.


		await expect( newTabObj.locator( `#${ SEC_IDE_STR }` ) ).toBeVisible();                      // What: Section Render Wait. Why: The new tab loads Home from scratch, so the section has to exist before it's measured. How: This waits until the steps are on the page.
		await expect.poll( async () => Math.abs( await secGapFun( newTabObj ) ) ).toBeLessThan( 1 ); // What: New Tab Position Assertion. Why: The new tab should land on the steps. How: This waits until they sit less than a pixel from just below the bar.
		await expect( newTabObj ).toHaveURL( /\/$/ );                                                // What: New Tab Address Assertion. Why: The new tab's hash should be cleared once used. How: This checks its URL ends at the root.

		expect( curPagObj.url() ).toBe( oriUrlStr );                                  // What: Original Address Assertion. Why: The page clicked from shouldn't navigate. How: This checks its address is unchanged.
		expect( await curPagObj.evaluate( () => window.scrollY ) ).toBe( oriScrNum ); // What: Original Scroll Assertion. Why: The page clicked from should stay where it was. How: This checks its scroll is unchanged.


	} );


}

// #endregion Module Init


