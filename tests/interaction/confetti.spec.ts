


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the canvas holds what the tap should leave. How: This asserts on what each check reads, such as the canvas's drawn pixels.
import { test   } from '@playwright/test'; // What: Test. Why: The tap with motion and under reduced motion are separate tests. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The pixel helper reads a page. How: This types its page parameter.

// #endregion Imports



/**
 * confetti.spec.ts = Confetti Spec
 *
 * @summary
 * Checks that the Happy Birthday card throws confetti where it's tapped, in
 * whichever engine the project runs. With motion allowed, the card plays until
 * its invitation to tap shows and its own confetti has settled, leaving the
 * canvas empty, then a tap has to draw pieces near the point tapped. Under reduced motion no confetti flies, so the
 * card renders no canvas and a tap draws nothing.
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

const CAN_SEL_STR = 'canvas';                       // What: Canvas Selector String. Why: The card draws its confetti on its only canvas. How: This finds it.
const TAP_XCO_NUM = 720;                            // What: Tap X-Coordinate Number. Why: The tap lands in the card's middle, clear of the floating bar. How: This is half the 1,440px desktop width.
const TAP_YCO_NUM = 300;                            // What: Tap Y-Coordinate Number. Why: The tap lands well above the floating bar. How: This is 300px down the screen.
const VIE_SIZ_OBJ = { height : 900, width : 1440 }; // What: Viewport Size Object. Why: The tap's point is measured on a known screen. How: This opens the card at the desktop size.

// #endregion Constants



// #region Helpers

/**
 * pixCouFun = Pixel Count Function
 *
 * @summary
 * Counts the canvas pixels with any opacity inside a square around a point
 * given in the page's own pixels, so a check can tell an empty canvas from
 * one with confetti on it. The square is clipped to the canvas, and a radius
 * larger than the canvas counts the whole of it. It expects the card's canvas
 * on the page.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page showing the card.
 * @param radPixNum - Radius Pixel Number: Half the square's side, in pixels.
 *
 * @returns A promise that resolves with the number of drawn pixels.
 *
 * @example
 * ```ts
 * await pixCouFun(curPagObj, 200) // => 0
 * ```
 *
*/

const pixCouFun = ( curPagObj : Page, radPixNum : number ) : Promise< number > => curPagObj.locator( CAN_SEL_STR ).evaluate( ( canCurEle, argValArr ) => { // What: Pixel Count Function. Why: The checks compare the canvas before and after a tap. How: This reads the square's pixels in the page and counts those that aren't transparent.


	const [ radValNum, tapXcoNum, tapYcoNum ] = argValArr; // What: Radius Value Number. Why: The square's size comes from the caller. How: This takes the list's first value. // What: Tap X-Coordinate Number. Why: The square centers on the tap. How: This takes the list's second value. // What: Tap Y-Coordinate Number. Why: The square centers on the tap. How: This takes the list's third value.

	const canEleObj = canCurEle as HTMLCanvasElement;                                                                   // What: Canvas Element Object. Why: The canvas's pixels are read through its drawing context. How: This names the element as a canvas. // What: Type Assertion Note. Why: The locator types its element generally. How: The selector matches only the canvas.
	const canRecObj = canEleObj.getBoundingClientRect();                                                                // What: Canvas Rect Object. Why: The point is given in page pixels, while the canvas counts its own. How: This reads where the canvas sits and how big it's drawn.
	const scaValNum = canEleObj.width / canRecObj.width;                                                                // What: Scale Value Number. Why: The canvas may hold more pixels than it's drawn at, on a dense screen. How: This is its pixels per page pixel.
	const lefPixNum = Math.max( 0, Math.floor( ( tapXcoNum - radValNum - canRecObj.left ) * scaValNum ) );              // What: Left Pixel Number. Why: The square starts left of the point. How: This is its left edge in canvas pixels, held inside the canvas.
	const topPixNum = Math.max( 0, Math.floor( ( tapYcoNum - radValNum - canRecObj.top ) * scaValNum ) );               // What: Top Pixel Number. Why: The square starts above the point. How: This is its top edge in canvas pixels, held inside the canvas.
	const rigPixNum = Math.min( canEleObj.width, Math.ceil( ( tapXcoNum + radValNum - canRecObj.left ) * scaValNum ) ); // What: Right Pixel Number. Why: The square ends right of the point. How: This is its right edge in canvas pixels, held inside the canvas.
	const botPixNum = Math.min( canEleObj.height, Math.ceil( ( tapYcoNum + radValNum - canRecObj.top ) * scaValNum ) ); // What: Bottom Pixel Number. Why: The square ends below the point. How: This is its bottom edge in canvas pixels, held inside the canvas.


	if ( rigPixNum <= lefPixNum || botPixNum <= topPixNum ) return 0; // What: Empty Square Guard. Why: A square wholly outside the canvas holds nothing. How: This returns no pixels.



	const pixDatArr = canEleObj.getContext( '2d' )!.getImageData( lefPixNum, topPixNum, rigPixNum - lefPixNum, botPixNum - topPixNum ).data; // What: Pixel Data Array. Why: Each pixel's opacity says whether something is drawn there. How: This reads the square's red, green, blue, and alpha values. // What: Non-Null Note. Why: TypeScript can't see the context exists. How: The card draws its confetti through this same 2D context.

	let drwCouNum = 0; // What: Drawn Count Number. Why: The check needs how many pixels hold confetti. How: This starts at none.


	for ( let alpIndNum = 3; alpIndNum < pixDatArr.length; alpIndNum += 4 ) if ( pixDatArr[ alpIndNum ] > 0 ) drwCouNum++; // What: Alpha Count Loop. Why: A pixel with any opacity is drawn. How: This walks every fourth value, each pixel's alpha, counting those above zero.



	return drwCouNum;


}, [ radPixNum, TAP_XCO_NUM, TAP_YCO_NUM ] ); // What: Page Argument List. Why: The page script can't read this file's values. How: This hands it the square's radius and the tap's point.

// #endregion Helpers



// #region Module Init

test( 'a tap on the Happy Birthday card throws confetti where it lands', async ( { page : curPagObj } ) => { // What: Confetti Tap Test. Why: Tapping the card is its one interaction, and a tap that drew nothing would go unnoticed. How: This waits for the card's invitation and for its own confetti to settle, taps the card, and checks pieces appear near the tap.


	test.setTimeout( 90000 ); // What: Timeout Call. Why: The card plays its whole opening before its confetti settles. How: This allows a minute and a half.

	await curPagObj.setViewportSize( VIE_SIZ_OBJ ); // What: Viewport Size Call. Why: The tap's point is measured on a known screen. How: This sets the desktop size.

	await curPagObj.goto( '/happy-birthday' ); // What: Card Open Call. Why: The tap is checked on the card itself. How: This opens its page with motion allowed.

	await expect.poll( () => curPagObj.getByText( 'Tap anywhere for more confetti!' ).evaluate( ( tapParEle ) => getComputedStyle( tapParEle ).opacity ), { intervals : [ 250 ], timeout : 60000 } ).toBe( '1' ); // What: Invitation Shown Poll. Why: The card's last shower falls as its invitation to tap appears, so the canvas only stays empty after that. How: This reads the invitation's opacity until it has fully faded in.
	await expect.poll( () => pixCouFun( curPagObj, 100000 ), { intervals : [ 500 ], timeout : 25000 } ).toBe( 0 ); // What: Settled Canvas Poll. Why: Confetti still falling from the opening would pass the check without a tap. How: This reads the whole canvas every half second until it's empty.

	await curPagObj.mouse.click( TAP_XCO_NUM, TAP_YCO_NUM ); // What: Card Tap Call. Why: The tap is what should throw confetti. How: This clicks the card's middle.

	await expect.poll( () => pixCouFun( curPagObj, 200 ), { intervals : [ 50 ], timeout : 2000 } ).toBeGreaterThan( 0 ); // What: Tap Burst Poll. Why: The burst should draw pieces near the tap at once. How: This reads a 400px square around the tap until it holds drawn pixels.


} );



test( 'a tap on the Happy Birthday card under reduced motion throws no confetti', async ( { page : curPagObj } ) => { // What: Reduced Confetti Tap Test. Why: Someone who asked for less motion shouldn't get flying confetti from a tap. How: This opens the card under reduced motion, taps it, and checks no canvas is there to draw on.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Call. Why: The tap is checked with the setting on. How: This asks the page for reduced motion before it loads.

	await curPagObj.setViewportSize( VIE_SIZ_OBJ ); // What: Viewport Size Call. Why: The tap lands at the same point as with motion. How: This sets the desktop size.

	await curPagObj.goto( '/happy-birthday' ); // What: Card Open Call. Why: The tap is checked on the card itself. How: This opens its page.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toBeVisible(); // What: Card Shown Assertion. Why: The tap should land on the rendered card. How: This waits until the greeting shows.

	await curPagObj.mouse.click( TAP_XCO_NUM, TAP_YCO_NUM ); // What: Card Tap Call. Why: The tap is what would throw confetti. How: This clicks the card's middle.

	await expect( curPagObj.locator( CAN_SEL_STR ) ).toHaveCount( 0 ); // What: No Canvas Assertion. Why: With no canvas there's nothing a tap can draw on. How: This checks the card rendered none.


} );

// #endregion Module Init


