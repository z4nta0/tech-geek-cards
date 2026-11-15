


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the card answers the way it should. How: This asserts on what each check reads, such as the canvas's pixels.
import { test   } from '@playwright/test'; // What: Test. Why: Each behavior is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The helpers read a page. How: This types their page parameter.

// #endregion Imports



/**
 * turkeys.spec.ts = Turkeys Spec
 *
 * @summary
 * Checks the Turkeys Away card's own behavior, in whichever engine the
 * project runs: a tap in the studio drops a turkey, and under reduced motion
 * a tap leaves the canvas as it was; turning a phone partway through the
 * bulletin switches the scene to its wide layout without restarting the card;
 * the TV set shows only on a screen at least 1,024px wide and 640px tall; and
 * on a phone held sideways the screen ends above the floating bar, while on
 * one held upright it runs under it. A turkey is found by its body's brown,
 * which nothing else in the scenes uses.
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

const CAN_SEL_STR = '[class*="scePixCan"]';         // What: Canvas Selector String. Why: The scenes are drawn on the card's canvas. How: This finds it by the class name Vite keeps inside the hashed class.
const NEW_SEL_STR = '[class*="newBulDiv"]';            // What: News Selector String. Why: The rotation check waits for the bulletin. How: This finds its block by the class name Vite keeps inside the hashed class.
const PAN_SEL_STR = '[class*="panSidDiv"]';            // What: Panel Selector String. Why: The set's control panel shows only with the set. How: This finds it by the class name Vite keeps inside the hashed class.
const PHO_SIZ_OBJ = { height : 844, width : 390 };  // What: Phone Size Object. Why: The checks start on a phone held upright. How: This is a common phone's size.
const SCR_SEL_STR = '[class*="scrBoxDiv"]';            // What: Screen Selector String. Why: The checks tap and measure the screen box. How: This finds it by the class name Vite keeps inside the hashed class.

// #endregion Constants



// #region Helpers

// #region broCouFun

/**
 * broCouFun = Brown Count Function
 *
 * @summary
 * Counts the canvas pixels painted in the turkeys' body brown, the card's
 * --tur-bro-col token, in the top or bottom half of the canvas. Nothing else
 * in either scene uses that brown, so the count shows whether turkeys are
 * there. It expects the card's canvas on the page.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page showing the card.
 * @param topHalBoo - Top Half Boolean: Whether to count the top half, or the
 *                    bottom half.
 *
 * @returns A promise that resolves with the number of brown pixels.
 *
 * @example
 * ```ts
 * await broCouFun(curPagObj, true) // => 0
 * ```
 *
*/

const broCouFun = ( curPagObj : Page, topHalBoo : boolean ) : Promise< number > => curPagObj.locator( CAN_SEL_STR ).evaluate( ( canCurEle, topValBoo ) => { // What: Brown Count Function. Why: The checks look for turkeys in a part of the scene. How: This reads the half's pixels in the page and counts the ones that match the brown.


	const canEleObj = canCurEle as HTMLCanvasElement;                                                                                // What: Canvas Element Object. Why: The canvas's pixels are read through its drawing context. How: This names the element as a canvas. // What: Type Assertion Note. Why: The locator types its element generally. How: The selector matches only the canvas.
	const hexColStr = getComputedStyle( canEleObj ).getPropertyValue( '--tur-bro-col' ).trim();                                     // What: Hex Color String. Why: The brown is the card's own token. How: This reads it from the canvas, which inherits it. // Turkeys Brown Color = #5a3a22
	const halHeiNum = Math.floor( canEleObj.height / 2 );                                                                            // What: Half Height Number. Why: The check reads one half of the canvas. How: This is half its height in canvas pixels.
	const pixDatArr = canEleObj.getContext( '2d' )!.getImageData( 0, topValBoo ? 0 : halHeiNum, canEleObj.width, halHeiNum ).data; // What: Pixel Data Array. Why: Each pixel's color says whether a turkey is there. How: This reads the half's red, green, blue, and alpha values. // What: Non-Null Note. Why: TypeScript can't see the context exists. How: The card draws its scenes through this same 2D context.
	const rgbValArr = [ 1, 3, 5 ].map( ( hexIndNum ) => parseInt( hexColStr.slice( hexIndNum, hexIndNum + 2 ), 16 ) );               // What: RGB Value Array. Why: The pixels are compared by their channels. How: This reads the brown's red, green, and blue from its hex.

	let broCouNum = 0; // What: Brown Count Number. Why: The check needs how many pixels are brown. How: This starts at none.


	for ( let pixIndNum = 0; pixIndNum < pixDatArr.length; pixIndNum += 4 ) if ( rgbValArr.every( ( chaValNum, chaIndNum ) => pixDatArr[ pixIndNum + chaIndNum ] === chaValNum ) ) broCouNum++; // What: Brown Count Loop. Why: Only exact matches are turkeys, since the scenes draw flat colors. How: This counts each pixel whose three channels match the brown.



	return broCouNum; // What: Brown Count Return. Why: The caller compares counts. How: This hands back the count.


}, topHalBoo ); // What: Top Half Argument. Why: The page script can't read this file's variables. How: This hands it whether to count the top half.

// #endregion broCouFun

// #endregion Helpers



// #region Module Init

test( 'a tap in the Turkeys Away studio drops a turkey from the top of the screen', async ( { page : curPagObj } ) => { // What: Studio Tap Test. Why: Tapping the card is its one interaction, and a tap that drew nothing would go unnoticed. How: This plays the card to the studio, taps it, and checks a turkey's brown appears in the top half.


	test.setTimeout( 60000 ); // What: Timeout Call. Why: The card plays its whole first scene before the studio. How: This allows a minute.

	await curPagObj.setViewportSize( PHO_SIZ_OBJ ); // What: Viewport Size Call. Why: The tap is checked on a phone's full-screen layout. How: This sets the phone's size.

	await curPagObj.goto( '/turkeys-away' ); // What: Card Open Call. Why: The tap is checked on the card itself. How: This opens its page with motion allowed.

	await expect.poll( () => curPagObj.getByRole( 'heading', { level : 1 } ).evaluate( ( titHeaEle ) => getComputedStyle( titHeaEle ).opacity ), { intervals : [ 250 ], timeout : 30000 } ).toBe( '1' ); // What: Studio Shown Poll. Why: The studio's top half holds no turkeys until one is tapped in. How: This reads the greeting's opacity until it has fully faded in.

	expect( await broCouFun( curPagObj, true ) ).toBe( 0 ); // What: Empty Sky Assertion. Why: A turkey found before the tap would pass the check without one. How: This checks the top half holds no brown.

	await curPagObj.locator( SCR_SEL_STR ).click( { position : { x : 195, y : 200 } } ); // What: Studio Tap Call. Why: The tap is what should drop a turkey. How: This clicks the screen in the middle across, 200px down.

	await expect.poll( () => broCouFun( curPagObj, true ), { intervals : [ 50 ], timeout : 2000 } ).toBeGreaterThan( 0 ); // What: Falling Turkey Poll. Why: The tapped turkey should fall from the top at once. How: This reads the top half until it holds brown.


} );



test( 'a tap on the Turkeys Away card under reduced motion leaves the canvas as it was', async ( { page : curPagObj } ) => { // What: Reduced Tap Test. Why: Someone who asked for less motion shouldn't get a falling turkey from a tap. How: This opens the card under reduced motion, taps it, and checks the canvas didn't change.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Call. Why: The tap is checked with the setting on. How: This asks the page for reduced motion before it loads.

	await curPagObj.setViewportSize( PHO_SIZ_OBJ ); // What: Viewport Size Call. Why: The tap lands at the same point as with motion. How: This sets the phone's size.

	await curPagObj.goto( '/turkeys-away' ); // What: Card Open Call. Why: The tap is checked on the card itself. How: This opens its page.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toBeVisible(); // What: Card Shown Assertion. Why: The tap should land on the finished studio. How: This waits until the greeting shows.


	const befDatStr = await curPagObj.locator( CAN_SEL_STR ).evaluate( ( canCurEle ) => ( canCurEle as HTMLCanvasElement ).toDataURL() ); // What: Before Data String. Why: The canvas is compared before and after the tap. How: This reads it as an image address. // What: Type Assertion Note. Why: The locator types its element generally. How: The selector matches only the canvas.


	await curPagObj.locator( SCR_SEL_STR ).click( { position : { x : 195, y : 200 } } ); // What: Studio Tap Call. Why: The tap is what would drop a turkey. How: This clicks the screen in the middle across, 200px down.

	await curPagObj.waitForTimeout( 500 ); // What: Settle Wait. Why: A turkey dropped by mistake would show within half a second. How: This pauses half a second.

	expect( await curPagObj.locator( CAN_SEL_STR ).evaluate( ( canCurEle ) => ( canCurEle as HTMLCanvasElement ).toDataURL() ) ).toBe( befDatStr ); // What: Unchanged Canvas Assertion. Why: Under reduced motion nothing should be drawn after the tap. How: This checks the canvas reads the same as before. // What: Type Assertion Note. Why: The locator types its element generally. How: The selector matches only the canvas.


} );



test( 'turning a phone partway through the bulletin switches the scene to its wide layout without restarting', async ( { page : curPagObj } ) => { // What: Rotation Test. Why: A phone turned mid-play should keep its place rather than start over. How: This turns the phone while the bulletin types, then checks the canvas went wide, the bulletin kept typing, and the landed turkeys are still in the lot.


	test.setTimeout( 30000 ); // What: Timeout Call. Why: The card plays into its first scene before the turn. How: This allows half a minute.

	await curPagObj.setViewportSize( PHO_SIZ_OBJ ); // What: Viewport Size Call. Why: The card starts on a phone held upright. How: This sets the phone's size.

	await curPagObj.goto( '/turkeys-away' ); // What: Card Open Call. Why: The turn is checked on the card itself. How: This opens its page with motion allowed.

	await expect.poll( () => curPagObj.locator( NEW_SEL_STR ).evaluate( ( newDivEle ) => getComputedStyle( newDivEle ).opacity ), { intervals : [ 100 ], timeout : 15000 } ).toBe( '1' ); // What: Bulletin Shown Poll. Why: The turn comes partway through the bulletin. How: This reads the bulletin's opacity until its bar has faded in.


	const typBefNum = await curPagObj.locator( NEW_SEL_STR ).locator( '[aria-hidden="true"] div' ).evaluateAll( ( chaEleArr ) => chaEleArr.filter( ( chaCurEle ) => getComputedStyle( chaCurEle ).visibility === 'visible' ).length ); // What: Typed Before Number. Why: The bulletin's progress shows where the card is. How: This counts the letters already shown.


	await curPagObj.setViewportSize( { height : 390, width : 844 } ); // What: Turn Call. Why: Turning the phone swaps its width and height. How: This sets the phone on its side.

	await curPagObj.waitForTimeout( 300 ); // What: Settle Wait. Why: The scene rebuilds on the next resize and frame. How: This pauses briefly.


	const canSizArr = await curPagObj.locator( CAN_SEL_STR ).evaluate( ( canCurEle ) => [ ( canCurEle as HTMLCanvasElement ).width, ( canCurEle as HTMLCanvasElement ).height ] ); // What: Canvas Size Array. Why: The scene's layout shows in its canvas's shape. How: This reads the canvas's width and height in pixels. // What: Type Assertion Note. Why: The locator types its element generally. How: The selector matches only the canvas.
	const typAftNum = await curPagObj.locator( NEW_SEL_STR ).locator( '[aria-hidden="true"] div' ).evaluateAll( ( chaEleArr ) => chaEleArr.filter( ( chaCurEle ) => getComputedStyle( chaCurEle ).visibility === 'visible' ).length ); // What: Typed After Number. Why: A restarted card would hide the bulletin and start typing again. How: This counts the letters shown after the turn.


	expect( canSizArr[ 0 ] ).toBeGreaterThan( canSizArr[ 1 ] );                               // What: Wide Canvas Assertion. Why: A phone on its side takes the wide composition. How: This checks the canvas is wider than tall.
	expect( typAftNum ).toBeGreaterThanOrEqual( typBefNum );                                // What: Kept Place Assertion. Why: The card should carry on from where it was. How: This checks at least as many letters show as before the turn.
	expect( await broCouFun( curPagObj, false ) ).toBeGreaterThan( 0 );                     // What: Landed Turkeys Assertion. Why: The rebuilt moment should hold the turkeys already dropped. How: This checks the lot, the canvas's bottom half, holds brown.


} );



test( 'the TV set shows only on a screen at least 1,024px wide and 640px tall', async ( { page : curPagObj } ) => { // What: TV Set Test. Why: The set frames the scene only where there's room for it. How: This opens the card at sizes either side of each limit and checks whether the set's panel shows.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Call. Why: Only the layout is checked, so the card can open finished. How: This asks the page for reduced motion before it loads.

	await curPagObj.goto( '/turkeys-away' ); // What: Card Open Call. Why: The set is checked on the card itself. How: This opens its page.


	for ( const [ casWidNum, casHeiNum, casShoBoo ] of [ [ 1440, 900, true ], [ 1024, 640, true ], [ 1023, 900, false ], [ 1440, 639, false ], [ 390, 844, false ] ] as const ) { // What: Size Loop. Why: The set's limits are checked from both sides. How: This sizes the page to each case and checks the panel. // What: Type Assertion Note. Why: Without it the cases widen to arrays of numbers and booleans. How: as const keeps each case's three values typed in order.


		await curPagObj.setViewportSize( { height : casHeiNum, width : casWidNum } ); // What: Viewport Size Call. Why: Each case has its own size. How: This sets it.

		expect( await curPagObj.locator( PAN_SEL_STR ).evaluate( ( panDivEle ) => getComputedStyle( panDivEle ).display !== 'none' ), `${ casWidNum } by ${ casHeiNum }` ).toBe( casShoBoo ); // What: Set Shown Assertion. Why: The set shows only on a large enough screen. How: This checks the panel shows exactly when the case expects it, naming the size if it doesn't.


	}


} );



test( 'on a phone held sideways the Turkeys Away screen ends above the floating bar', async ( { page : curPagObj } ) => { // What: Bar Clearing Test. Why: A sideways phone is too short for the bar to cover the scene. How: This measures the screen's bottom against the bar's top and checks it ends above the bar sideways and runs under it upright.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Call. Why: Only the layout is checked, so the card can open finished. How: This asks the page for reduced motion before it loads.

	await curPagObj.setViewportSize( { height : 390, width : 844 } ); // What: Sideways Size Call. Why: The bar is cleared on a phone held sideways. How: This sets the phone on its side.

	await curPagObj.goto( '/turkeys-away' ); // What: Card Open Call. Why: The screen is checked on the card itself. How: This opens its page.


	const scrBotFun = () => curPagObj.locator( SCR_SEL_STR ).evaluate( ( scrDivEle ) => scrDivEle.getBoundingClientRect().bottom ); // What: Screen Bottom Function. Why: Both sizes measure the screen's bottom. How: This reads it.
	const barTopFun = () => curPagObj.getByRole( 'navigation', { name : 'Card' } ).evaluate( ( barNavEle ) => barNavEle.getBoundingClientRect().top ); // What: Bar Top Function. Why: Both sizes measure the bar's top. How: This reads it.


	expect( await scrBotFun() ).toBeLessThanOrEqual( await barTopFun() ); // What: Sideways Clear Assertion. Why: Sideways, the bar shouldn't cover the scene. How: This checks the screen ends at or above the bar.

	await curPagObj.setViewportSize( PHO_SIZ_OBJ ); // What: Upright Size Call. Why: Upright, the scene runs under the bar. How: This sets the phone upright.

	expect( await scrBotFun() ).toBeGreaterThan( await barTopFun() ); // What: Upright Under Assertion. Why: Upright, the scene fills the screen behind the bar. How: This checks the screen runs past the bar's top.


} );

// #endregion Module Init


