


// #region Imports

import { expect      } from '@playwright/test';     // What: Expect. Why: Each state passes only when every control responds. How: This asserts each problem list is empty.
import { opeStaFun   } from '../support/states.ts'; // What: Open State Function. Why: Each check opens and settles its state first. How: This loads it and waits for it.
import { STA_REC_ARR } from '../support/states.ts'; // What: State Record Array. Why: Every page state is checked. How: This lists them.
import { test        } from '@playwright/test';     // What: Test. Why: Each check of each state is its own test. How: This declares them.


import type { ElementHandle } from '@playwright/test'; // What: Element Handle. Why: Each control is probed through a handle to its element. How: This types the control list.
import type { Page          } from '@playwright/test'; // What: Page. Why: Every helper drives a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * feedback.spec.ts = Feedback Spec
 *
 * @summary
 * Checks the interaction feedback rule on every page state, in whichever
 * engine the project runs. Every visible link and button has to look
 * different while hovered than at rest, look different again while pressed,
 * and transition its focus ring's outline, and the first keyboard stop has to
 * draw that ring at full width once it has eased in. Under reduced motion
 * every control keeps its hover change but transitions nothing. Real clicks
 * are blocked during the checks, so pressing a link or the menu's links
 * never navigates or closes anything mid-check.
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

const SET_WAI_NUM = 400; // What: Settle Wait Number. Why: Each look is read once its transition has finished, and the longest transition on a link or button, or anything inside one, runs about 277ms (the bar links' underline, the menu toggle's bars, and the card tiles' tilt). How: This is the pause, in milliseconds, after each hover, press, or focus, leaving over 100ms of margin for a slow frame or a short delay.

// #endregion Constants



// #region Helpers

// #region cliBloFun

/**
 * cliBloFun = Click Block Function
 *
 * @summary
 * Runs inside the page and cancels every click before anything handles it, so
 * pressing a control during a check never follows a link, opens an email, or
 * closes the menu. It listens on the document in the capture phase, ahead of
 * React's own listener on the app's root, and both prevents the click's
 * default and stops it from going any further. Passed to Playwright's
 * evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * page.evaluate(cliBloFun) // => void
 * ```
 *
*/

function cliBloFun () : void {


	document.addEventListener( 'click', ( cliEveObj ) => { // What: Click Block Listener. Why: A press during a check shouldn't do anything. How: This cancels every click in the capture phase, before the page or React sees it.


		cliEveObj.preventDefault(); // What: Default Prevention Call. Why: A link shouldn't navigate mid-check. How: This cancels the click's default.

		cliEveObj.stopPropagation(); // What: Propagation Stop Call. Why: React's handlers, such as a menu link closing the menu, shouldn't run either. How: This keeps the click from reaching the app's root.


	}, true ); // What: Capture Phase Flag. Why: The block has to run before anything else sees the click. How: This registers the listener for the capture phase.


}

// #endregion cliBloFun



// #region conLisFun

/**
 * conLisFun = Control List Function
 *
 * @summary
 * Collects every control a visitor can reach on the page as it stands: each
 * link and button that's visible, not taken out of the tab order with tabindex
 * -1, not inside inert content, and, while a modal dialog is open (the share
 * dialog), inside that dialog, since the browser makes the page behind it
 * unreachable without marking it inert. Handles are taken once, so nothing
 * that changes while the checks scroll can shift the list.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to collect from.
 *
 * @returns Every reachable control.
 * @see {@link conHanArr}
 *
 * @example
 * ```ts
 * conLisFun(page) // => [ ElementHandle, ... ]
 * ```
 *
*/

async function conLisFun ( curPagObj : Page ) : Promise< ElementHandle< Element >[] > {


	const conHanArr : ElementHandle< Element >[] = []; // What: Control Handle Array. Why: The reachable controls are gathered one by one. How: This collects them.


	for ( const conCurObj of await curPagObj.$$( 'a, button' ) ) { // What: Control Loop. Why: Every link and button is judged on its own. How: This keeps each one a visitor can reach.


		const conReaBoo = await conCurObj.evaluate( ( conCurEle ) => { // What: Control Reachable Boolean. Why: A control outside the tab order, inside inert content, or behind an open modal dialog can't be reached. How: This checks all three inside the page, keeping only the dialog's own controls while one is open.


			const diaInsBoo = !document.querySelector( 'dialog:modal' ) || !!conCurEle.closest( 'dialog:modal' ); // What: Dialog Inside Boolean. Why: An open modal dialog leaves only its own controls reachable. How: This is true when no modal dialog is open, or the control sits inside the open one.
			const ineOutBoo = !conCurEle.closest( '[inert]' );                                                    // What: Inert Outside Boolean. Why: Inert content can't be reached. How: This is true when the control sits outside any inert element.
			const tabOrdBoo = conCurEle.getAttribute( 'tabindex' ) !== '-1';                                      // What: Tab Order Boolean. Why: A control taken out of the tab order can't be reached by keyboard. How: This is true unless the control carries tabindex -1.

			const reaConBoo = diaInsBoo && ineOutBoo && tabOrdBoo; // What: Reachable Control Boolean. Why: A control counts only when all three hold. How: This combines them.



			return reaConBoo; // What: Reachable Control Return. Why: The loop keeps only reachable controls. How: This hands the answer back out of the page.


		} );


		if ( conReaBoo && await conCurObj.isVisible() ) conHanArr.push( conCurObj ); // What: Reachable Control Record. Why: Only controls a visitor can see and reach are checked. How: This keeps the control when it's both.


	}



	return conHanArr; // What: Control Handle Return. Why: The checks probe each control in turn. How: This hands back every reachable control's handle.


}

// #endregion conLisFun



// #region sigEleFun

/**
 * sigEleFun = Signature Element Function
 *
 * @summary
 * Runs inside the page and describes how a control looks right now, as one
 * string of the styles feedback usually changes (color, background, border
 * color, transform, the separate scale, translate, and rotate properties,
 * which this site's tiles and buttons use, and opacity) for the control and
 * every element inside it, so a change to its icon lines or its label counts
 * as the control's own. Passed to Playwright's evaluate, so it can't read
 * anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param eleCurEle - Element Current Element: The control to describe.
 *
 * @returns The control's look, as one string to compare.
 *
 * @example
 * ```ts
 * handle.evaluate(sigEleFun) // => 'rgb(...),rgba(...),...,none,1|...'
 * ```
 *
*/

function sigEleFun ( eleCurEle : Element ) : string {


	const sigStyFun = ( sigCurEle : Element ) => { // What: Signature Style Function. Why: Each element's look is read the same way. How: This joins one element's feedback styles into one string.


		const styCurObj = getComputedStyle( sigCurEle ); // What: Style Current Object. Why: The element's styles are read as they're drawn now. How: This reads its computed styles.



		return [ styCurObj.color, styCurObj.backgroundColor, styCurObj.borderColor, styCurObj.transform, styCurObj.scale, styCurObj.translate, styCurObj.rotate, styCurObj.opacity ].join( ',' ); // What: Element Signature Return. Why: One element's look compares as one string. How: This joins its feedback styles.


	};



	return [ eleCurEle, ...eleCurEle.querySelectorAll( '*' ) ].map( sigStyFun ).join( '|' ); // What: Signature Return. Why: Two looks compare as one string. How: This joins the signatures of the control and everything inside it.


}

// #endregion sigEleFun



// #region feeProFun

/**
 * feeProFun = Feedback Problems Function
 *
 * @summary
 * Probes every reachable control and returns a problem for each one that
 * gives no feedback. Each control is scrolled into view, read at rest with
 * the pointer away, read again while hovered, and again while the mouse
 * button is held on it, every look read once its transition has settled. A
 * control that looks the same at rest and hovered, or hovered and pressed,
 * is a problem. Normally its transition list must include the focus ring's
 * outline-width, so the ring eases in; under reduced motion every one of its
 * transition durations must be zero instead. The caller blocks real clicks
 * first, so releasing the mouse does nothing.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns Every feedback problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * feeProFun(page, false) // => [ 'a "Home" looks the same pressed' ]
 * ```
 *
*/

async function feeProFun ( curPagObj : Page, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	for ( const conCurObj of await conLisFun( curPagObj ) ) { // What: Control Probe Loop. Why: Every reachable control has to respond. How: This reads each one at rest, hovered, and pressed.


		const conDesStr = await conCurObj.evaluate( ( conCurEle ) => `${ conCurEle.tagName.toLowerCase() } "${ ( conCurEle.getAttribute( 'aria-label' ) || conCurEle.textContent || '' ).trim().slice( 0, 30 ) }"` ); // What: Control Description String. Why: A problem should name the control a person would recognize. How: This joins its tag with its label or text.


		await conCurObj.scrollIntoViewIfNeeded(); // What: Control Scroll Call. Why: A control has to be on screen to hover or press. How: This scrolls it into view.

		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The resting look is read with nothing hovered. How: This moves the pointer to the corner of the bar.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Rest Settle Wait. Why: Any earlier hover has to finish fading. How: This pauses for the settle time.


		const resSigStr = await conCurObj.evaluate( sigEleFun ); // What: Rest Signature String. Why: The resting look is what hover is compared with. How: This reads it.


		await conCurObj.hover(); // What: Control Hover Call. Why: Hover feedback is the first thing checked. How: This moves the pointer onto the control.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Hover Settle Wait. Why: The hover look is read once it has eased in. How: This pauses for the settle time.


		const hovSigStr = await conCurObj.evaluate( sigEleFun ); // What: Hover Signature String. Why: The hovered look is compared with rest and with pressed. How: This reads it.


		await curPagObj.mouse.down(); // What: Mouse Down Call. Why: A press shows while the button is held. How: This holds the mouse button down on the control.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Press Settle Wait. Why: The pressed look is read once it has eased in. How: This pauses for the settle time.


		const preSigStr = await conCurObj.evaluate( sigEleFun );                                                         // What: Press Signature String. Why: The pressed look is compared with hovered. How: This reads it.
		const traLisStr = await conCurObj.evaluate( ( conCurEle ) => getComputedStyle( conCurEle ).transitionProperty ); // What: Transition List String. Why: The focus ring's ease depends on the control listing its outline. How: This reads the control's transitioned properties.
		const traDurStr = await conCurObj.evaluate( ( conCurEle ) => getComputedStyle( conCurEle ).transitionDuration ); // What: Transition Duration String. Why: Reduced motion should leave nothing moving. How: This reads the control's transition durations.


		await curPagObj.mouse.up(); // What: Mouse Up Call. Why: The press has to end before the next control. How: This releases the button, whose click the caller has blocked.



		if ( resSigStr === hovSigStr ) proLisArr.push( `${ conDesStr } looks the same hovered` ); // What: Hover Check. Why: A hovered control has to respond. How: This records one that doesn't change.



		if ( hovSigStr === preSigStr ) proLisArr.push( `${ conDesStr } looks the same pressed` ); // What: Press Check. Why: A press has to register before anything happens. How: This records one that doesn't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ conDesStr } still transitions under reduced motion (${ traDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a control with any duration above zero.

		else if ( !redMotBoo && !traLisStr.includes( 'outline-width' ) ) proLisArr.push( `${ conDesStr } doesn't transition its focus ring` ); // What: Focus Ease Check. Why: The focus ring should ease in rather than snap. How: This records a control whose transition list leaves out the outline.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion feeProFun

// #endregion Helpers



// #region Module Init

for ( const staRecObj of STA_REC_ARR ) { // What: State Test Loop. Why: Every page state is checked. How: This declares each check once per state.


	test( `${ staRecObj.ideStr } gives every control hover, press, and focus feedback`, async ( { page : curPagObj } ) => { // What: Feedback Test. Why: Every interaction should visibly register. How: This opens the state, blocks clicks, and probes every control.


		test.slow(); // What: Slow Test Mark. Why: Probing every control's hover, press, and focus waits through each look's transition, which runs past the default 30 second timeout on the pages with the most controls. How: This triples this test's timeout.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The controls are probed with the state settled. How: This loads and settles it.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing a control shouldn't navigate or close anything. How: This cancels every click from here on.


		expect( await feeProFun( curPagObj, false ) ).toEqual( [] ); // What: No Feedback Problems Assertion. Why: The state passes only when every control responds. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } eases its focus ring in to full width`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Focus Ring Test. Why: A keyboard user has to see where focus lands. How: This tabs to the first stop and reads its ring once it has eased in.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The walk starts from the state settled. How: This loads and settles it.

		await curPagObj.keyboard.press( engNamStr === 'webkit' ? 'Alt+Tab' : 'Tab' ); // What: First Tab Press Call. Why: The ring shows only for keyboard focus. How: This tabs to the first stop, holding Alt in WebKit, which otherwise skips links the way Safari does.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Ring Settle Wait. Why: The ring is read once it has grown in. How: This pauses for the settle time.


		expect( await curPagObj.evaluate( () => getComputedStyle( document.activeElement as Element ).outlineWidth ) ).toBe( '2px' ); // What: Full Ring Assertion. Why: The ring has to reach its full width. How: This reads the focused stop's outline width, which the large border width token snaps to 2px. // What: Type Assertion Note. Why: activeElement types as possibly null. How: The Tab press just put focus on a stop.


	} );



	test( `${ staRecObj.ideStr } keeps feedback without motion under reduced motion`, async ( { page : curPagObj } ) => { // What: Reduced Motion Feedback Test. Why: Visitors who ask for less motion still need to see their actions register. How: This probes every control with reduced motion on.


		test.slow(); // What: Slow Test Mark. Why: Probing every control's hover, press, and focus waits through each look's transition, which runs past the default 30 second timeout on the pages with the most controls. How: This triples this test's timeout.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The controls are probed with the state settled. How: This loads and settles it.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing a control shouldn't navigate or close anything. How: This cancels every click from here on.


		expect( await feeProFun( curPagObj, true ) ).toEqual( [] ); // What: No Reduced Motion Problems Assertion. Why: Every control has to respond without moving. How: This compares the problems with an empty list, so a failure prints each one.


	} );


}

// #endregion Module Init


