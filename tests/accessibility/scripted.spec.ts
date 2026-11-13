


// #region Imports

import { EMP_STA_ARR } from '../support/gallery.ts'; // What: Empty State Array. Why: A search no card matches swaps the Gallery's grid for its empty message, a state a visitor reaches. How: This lists the Gallery states after that search, one per width.
import { expect      } from '@playwright/test';      // What: Expect. Why: Each check passes only with no problems found. How: This asserts each problem list is empty.
import { FIL_STA_ARR } from '../support/gallery.ts'; // What: Filtered State Array. Why: A chosen occasion narrows the Gallery's grid and count, a state a visitor reaches. How: This lists the Gallery states with "Family" chosen, one per width.
import { INV_STA_ARR } from '../support/contact.ts'; // What: Invalid State Array. Why: The Contact form after a refused empty send is a state a visitor reaches. How: This lists the Contact states after that send, one per width.
import { opeStaFun   } from '../support/states.ts';  // What: Open State Function. Why: Each check opens and settles its state first. How: This loads it and waits for it.
import { PHO_STA_ARR } from '../support/family.ts';  // What: Photo State Array. Why: A Family card's photo opened full size is a state a visitor reaches. How: This lists the Mother's Day states with its first photo open, one per width.
import { RES_STA_ARR } from '../support/contact.ts'; // What: Result State Array. Why: The Contact form's thank-you and error are states a visitor reaches too. How: This lists the Contact states with the form sent, one per result and width.
import { STA_REC_ARR } from '../support/states.ts';  // What: State Record Array. Why: Every page state is checked. How: This lists them.
import { test        } from '@playwright/test';      // What: Test. Why: Each check of each state is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The helpers that drive the page take a Playwright page, while those that run inside it take none. How: This types the driving helpers' page parameters.

// #endregion Imports



/**
 * scripted.spec.ts = Scripted Spec
 *
 * @summary
 * The accessibility checks axe-core can't make, run on every page state in
 * whichever engine the project runs. Names: every link and button in the
 * accessibility tree has a name, no name carries a decorative glyph such as an
 * arrow, and every shown link that opens a new tab says so in its name.
 * Keyboard: no element uses a positive tabindex, and a Tab walk from where
 * focus rests once the state has opened reaches its end without getting
 * trapped, never moves backwards through the document, and lands only on stops
 * that are on screen, not covered by anything else, and visibly changed by
 * focus. Reflow: at 320px wide, WCAG's narrowest reflow width, nothing scrolls
 * sideways. Motion: with reduced motion requested, nothing animates or
 * transitions for longer than 1ms from the moment the page starts loading, and
 * nothing is left running or waiting once the state has opened. A failing
 * names, keyboard, or motion check lists the problems it found, most of them
 * by element.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type StoInfTyp = { // What: Stop Information Type. Why: The keyboard walk judges each stop outside the page. How: This describes what the page reports about one stop.


	covBoo : boolean, // What: Covered Boolean. Why: A stop hidden behind another element can't be seen while focused. How: This is true when something else sits on top of the stop's center.
	desStr : string,  // What: Description String. Why: A problem should name the element a person would recognize. How: This joins the stop's tag with its label, ID, or text.
	indBoo : boolean, // What: Indicator Boolean. Why: A keyboard user has to see where focus is. How: This is true when focusing the stop changes how it looks.
	ordNum : number,  // What: Order Number. Why: Focus order is compared with document order. How: This is the stop's position among every element in the page.
	visBoo : boolean  // What: Visible Boolean. Why: A stop off screen leaves a keyboard user lost. How: This is true when the stop has a size and overlaps the viewport.


};

// #endregion Types



// #region Constants

const GLY_DEC_REG = /[←↑→↓·•]|\p{Extended_Pictographic}/u; // What: Glyph Decorative Regular Expression. Why: A decorative glyph inside a name is read aloud as noise, such as right arrow. How: This matches the arrows and dots a decorative glyph would add to a name, plus any emoji or pictograph.
const REF_WID_NUM = 320;                                   // What: Reflow Width Number. Why: WCAG's reflow criterion asks for no sideways scrolling at 320 CSS pixels, the width of 1,280px at 400% zoom. How: This is the viewport width the reflow check opens each state at.
const TAB_HIN_REG = /in a new tab\)/;                      // What: Tab Hint Regular Expression. Why: A link that opens a new tab has to say so in its announced name. How: This matches the note's closing words, such as "(opens in a new tab)".
const TAB_MAX_NUM = 80;                                    // What: Tab Maximum Number. Why: A keyboard trap would otherwise keep the walk going forever. How: This caps the walk at far more Tab presses than the site has stops.

// #endregion Constants



// #region Helpers

// #region motRecFun

/**
 * motRecFun = Motion Recorder Function
 *
 * @summary
 * Readies a page to record its motion, before any of its own script runs, on
 * the window's __motRecArr, where a check reads it back. Every CSS animation
 * that starts, every CSS transition that begins, and every animation a script
 * starts through Element.animate is recorded as one line naming the element
 * by its tag and first class, what moves, and how long it lasts after its
 * delay, but only when the duration and delay together pass 1ms. Under
 * reduced motion every variant turns its motion off, which fires no event at
 * all, or shortens it to .01ms for a handler that waits on its end, so the
 * list should stay empty. A CSS duration or delay is read from the element's
 * computed lists at the animation name's or transition property's place in
 * them, and a script's from its timing options.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to ready.
 *
 * @returns A promise that settles once the recorder is in place, with no
 *          value.
 *
 * @example
 * ```ts
 * motRecFun(page) // => Promise<void>
 * ```
 *
*/

async function motRecFun ( curPagObj : Page ) : Promise< void > {


	await curPagObj.addInitScript( () => { // What: Motion Recorder Script. Why: A finite entrance has ended by the time the state settles, so the motion has to be caught as it starts. How: This listens for every animation and transition from before the page's own script runs, and records each one that lasts longer than 1ms.


		const winRecObj = window as unknown as { __motRecArr : string[] }; // What: Window Record Object. Why: The record is kept where the test can read it back. How: This views the window with its motion list. // What: Type Assertion Note. Why: The window has no such field in its type. How: The as names the one this script adds.


		winRecObj.__motRecArr = []; // What: Motion List Assignment. Why: Each page starts with nothing recorded. How: This sets an empty list.


		const entRecFun = ( tarCurEle : Element, pseEleStr : string, namValStr : string, durMilNum : number, delMilNum : number ) => { // What: Entry Record Function. Why: Each kind of motion is recorded the same way. How: This adds a line naming the element, what moves, its duration, and its delay, when the two together pass 1ms.


			if ( durMilNum + delMilNum > 1 ) winRecObj.__motRecArr.push( `${ tarCurEle.tagName.toLowerCase() }${ tarCurEle.classList.length ? `.${ tarCurEle.classList[ 0 ] }` : '' }${ pseEleStr } plays ${ namValStr } for ${ durMilNum.toLocaleString( 'en-US' ) }ms after a ${ delMilNum.toLocaleString( 'en-US' ) }ms delay` ); // What: Lasting Motion Check. Why: A .01ms variant only exists so an end event fires, and isn't motion anyone sees. How: This records the motion only when its duration and delay together pass 1ms.


		};



		const timMilFun = ( timValStr : string ) => ( timValStr.trim().endsWith( 'ms' ) ? parseFloat( timValStr ) : parseFloat( timValStr ) * 1000 ) || 0; // What: Time Milliseconds Function. Why: A computed duration or delay reads in seconds or milliseconds. How: This turns one into milliseconds, or 0 when it can't be read.



		const lisMilFun = ( lisValStr : string, indValNum : number ) => { // What: List Milliseconds Function. Why: An element running several animations or transitions lists their timings in matching comma lists. How: This reads the time at one place in the list, repeating the list when it's shorter, as CSS does.


			const lisValArr = lisValStr.split( ',' ); // What: List Value Array. Why: Each animation or transition has its own entry. How: This splits the computed list at its commas.



			return timMilFun( lisValArr[ indValNum % lisValArr.length ] ); // What: List Time Return. Why: The caller needs the entry at the motion's place. How: This converts that entry, wrapping around a shorter list.


		};



		document.addEventListener( 'animationstart', ( aniEveObj ) => { // What: Animation Start Listener. Why: A CSS animation that ignores reduced motion fires this as it begins. How: This listens on the document in the capture phase, so every element's animation reaches it, and records the animation with its computed timing.


			const aniTarEle = aniEveObj.target as Element;                                                             // What: Animation Target Element. Why: The record names the element that moves. How: This reads the event's target. // What: Type Assertion Note. Why: An event's target is typed as a plain event target. How: An animation event always fires on an element.
			const styCurObj = getComputedStyle( aniTarEle, aniEveObj.pseudoElement || null );                          // What: Style Current Object. Why: The animation's timing is in the element's computed style. How: This reads it, from the pseudo-element when the animation runs on one.
			const namIndNum = Math.max( styCurObj.animationName.split( ', ' ).indexOf( aniEveObj.animationName ), 0 ); // What: Name Index Number. Why: The duration and delay lists follow the order of the names. How: This finds the animation's place in the name list, or the first place when it isn't there.


			entRecFun( aniTarEle, aniEveObj.pseudoElement, aniEveObj.animationName, lisMilFun( styCurObj.animationDuration, namIndNum ), lisMilFun( styCurObj.animationDelay, namIndNum ) ); // What: Animation Record Call. Why: The animation is recorded when it lasts. How: This passes its element, name, duration, and delay.


		}, true ); // What: Capture Phase Flag. Why: The recorder has to see an animation's start ahead of the handlers on the page's elements that could stop the event. How: This registers the animation listener for the capture phase.



		document.addEventListener( 'transitionrun', ( traEveObj ) => { // What: Transition Run Listener. Why: A CSS transition that ignores reduced motion fires this as soon as it's created, before any delay. How: This listens on the document in the capture phase and records the transition with its computed timing.


			const traTarEle = traEveObj.target as Element; // What: Transition Target Element. Why: The record names the element that moves. How: This reads the event's target. // What: Type Assertion Note. Why: An event's target is typed as a plain event target. How: A transition event always fires on an element.
			const styCurObj = getComputedStyle( traTarEle, traEveObj.pseudoElement || null );                                                                                                // What: Style Current Object. Why: The transition's timing is in the element's computed style. How: This reads it, from the pseudo-element when the transition runs on one.
			const proIndNum = Math.max( styCurObj.transitionProperty.split( ', ' ).findIndex( ( proValStr ) => proValStr === 'all' || traEveObj.propertyName.startsWith( proValStr ) ), 0 ); // What: Property Index Number. Why: The duration and delay lists follow the order of the properties. How: This finds the first listed property that is all, the property itself, or a shorthand it starts with, or the first place when none is.


			entRecFun( traTarEle, traEveObj.pseudoElement, traEveObj.propertyName, lisMilFun( styCurObj.transitionDuration, proIndNum ), lisMilFun( styCurObj.transitionDelay, proIndNum ) ); // What: Transition Record Call. Why: The transition is recorded when it lasts. How: This passes its element, property, duration, and delay.


		}, true ); // What: Capture Phase Flag. Why: The recorder has to see a transition's run ahead of the handlers on the page's elements that could stop the event. How: This registers the transition listener for the capture phase.



		const oriAniFun = Element.prototype.animate; // What: Original Animate Function. Why: A script's own animations fire no CSS event, so the browser's animate is wrapped. How: This keeps the real one to call through to.


		Element.prototype.animate = function ( keyFraObj, timOptObj ) { // What: Animate Wrapper Function. Why: Motion a script drives has to honor reduced motion too. How: This records each script animation with its timing options, then starts it as normal.


			const aniDelNum = typeof timOptObj === 'number' ? 0 : Number( timOptObj?.delay ) || 0;            // What: Animation Delay Number. Why: A delay alone still holds a change back. How: This reads the options' delay, which a bare number never sets, or 0.
			const aniDurNum = typeof timOptObj === 'number' ? timOptObj : Number( timOptObj?.duration ) || 0; // What: Animation Duration Number. Why: The duration is the motion's length. How: This reads a bare number as the duration, otherwise the options' duration, or 0 for none or auto.


			entRecFun( this, '', 'a script animation', aniDurNum, aniDelNum ); // What: Script Animation Record Call. Why: The animation is recorded when it lasts. How: This passes the element animated, a generic label, its duration, and its delay.



			return oriAniFun.call( this, keyFraObj, timOptObj ); // What: Animation Start Return. Why: The page's own animation still has to run and hand back its animation. How: This calls the real animate with the same arguments.


		};


	} );


}

// #endregion motRecFun



// #region namProFun

/**
 * namProFun = Name Problems Function
 *
 * @summary
 * Reads the page's accessibility tree, the same tree a screen reader reads,
 * and returns a problem for every link or button with no name, for every one
 * whose name contains a decorative glyph that should have been hidden, and
 * for every shown link that opens a new tab without saying so in its name.
 * Elements hidden from assistive technology don't appear in the tree, so the
 * decorative elements hidden from it are never counted. A tree with no link or
 * button at all is a problem too, since every page shows at least the bar's
 * brand link.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to read.
 *
 * @returns A promise that resolves with every naming problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * namProFun(page) // => [ '- button has no name' ]
 * ```
 *
*/

async function namProFun ( curPagObj : Page ) : Promise< string[] > {


	const ariSnaStr = await curPagObj.locator( 'body' ).ariaSnapshot();    // What: ARIA Snapshot String. Why: The accessibility tree shows each control's role and announced name. How: This reads the body's tree as text, one node per line.
	const conLinArr = ariSnaStr.match( /- (link|button)\b[^\n]*/g ) || []; // What: Control Line Array. Why: Only links and buttons are checked here. How: This keeps every tree line for one of those roles.

	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	if ( !conLinArr.length ) proLisArr.push( 'the accessibility tree lists no link or button' ); // What: Empty Tree Check. Why: A snapshot that yields no controls, such as after a change to its format, would pass without checking any name, while every state shows at least the bar's brand link. How: This records a problem when no link or button line is found.



	for ( const conLinStr of conLinArr ) { // What: Control Line Loop. Why: Each link and button is judged on its own. How: This reads each line's name and records what's wrong with it.


		const conNamStr = ( conLinStr.match( /"([^"]*)"/ ) || [] )[ 1 ] || ''; // What: Control Name String. Why: The announced name sits in quotes after the role. How: This takes the quoted text, or an empty name when there's none.


		if ( !conNamStr.trim() ) proLisArr.push( `${ conLinStr } has no name` ); // What: Missing Name Check. Why: A control with no name is announced as just its role. How: This records the line when its name is empty.

		else if ( GLY_DEC_REG.test( conNamStr ) ) proLisArr.push( `${ conLinStr } has a decorative glyph in its name` ); // What: Glyph Name Check. Why: A decorative arrow in a name is read aloud. How: This records the line when its name contains one.


	}



	const tabLinArr = await curPagObj.locator( 'a[target="_blank"]' ).all(); // What: Tab Link Array. Why: A link that opens a new tab has to say so in its name. How: This lists every link with a blank target.


	for ( const tabLinObj of tabLinArr ) { // What: Tab Link Loop. Why: Each new tab link is judged on its own. How: This reads each shown link's announced name and records one that doesn't mention the new tab.


		if ( !await tabLinObj.isVisible() ) continue; // What: Hidden Link Guard. Why: A link out of sight, such as one in the closed phone menu, isn't announced. How: This skips it.



		const tabSnaStr = ( await tabLinObj.ariaSnapshot() ).split( '\n' )[ 0 ]; // What: Tab Snapshot String. Why: The link's own tree line holds its role and announced name. How: This reads the link's tree and keeps its first line.


		if ( tabSnaStr.startsWith( '- link' ) && !TAB_HIN_REG.test( tabSnaStr ) ) proLisArr.push( `${ tabSnaStr } opens a new tab without saying so` ); // What: Tab Hint Check. Why: A screen reader user should know before a new tab opens. How: This records a link whose tree line names it without the note.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion namProFun



// #region scrSetFun

/**
 * scrSetFun = Scroll Settled Function
 *
 * @summary
 * Runs inside the page and resolves once the page has stopped scrolling,
 * meaning its scroll position hasn't changed for 15 frames in a row (about a
 * quarter of a second), or after 2 seconds at most. WebKit scrolls a focused
 * text field into view a few frames after focusing it rather than at once,
 * so measuring a stop straight after the Tab press would find it still off
 * screen. Passed to Playwright's evaluate, so it can't read anything from
 * this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns A promise that settles once scrolling has stopped, with no value.
 *
 * @example
 * ```ts
 * page.evaluate(scrSetFun) // => Promise<void>
 * ```
 *
*/

function scrSetFun () : Promise< void > {


	return new Promise( ( resSetFun ) => { // What: Settle Promise Return. Why: The walk waits on the page's frames. How: This resolves from inside a frame loop once scrolling has stopped.


		const staTimNum = performance.now(); // What: Start Time Number. Why: A page that never stops scrolling shouldn't hang the walk. How: This records when the wait began.

		let preScrNum = scrollY; // What: Previous Scroll Number. Why: Each frame is compared with the one before. How: This holds the last frame's scroll position.
		let staFraNum = 0;       // What: Stable Frame Number. Why: Scrolling has settled only after several unchanged frames. How: This counts them in a row.


		const fraCheFun = () => { // What: Frame Check Function. Why: Scrolling is judged once per frame. How: This counts unchanged frames and resolves after 15 of them or 2 seconds.


			staFraNum = scrollY === preScrNum ? staFraNum + 1 : 0; // What: Stable Frame Update. Why: Any movement restarts the count. How: This adds one for an unchanged frame and resets it otherwise.

			preScrNum = scrollY; // What: Previous Scroll Update. Why: The next frame is compared with this one. How: This stores this frame's position.



			if ( staFraNum >= 15 || performance.now() - staTimNum > 2000 ) { resSetFun(); return; } // What: Settled Guard. Why: The wait ends once scrolling has stopped, or after 2 seconds. How: This resolves the promise and stops the loop.



			requestAnimationFrame( fraCheFun ); // What: Next Frame Call. Why: Scrolling is checked again next frame. How: This schedules the check.


		};


		requestAnimationFrame( fraCheFun ); // What: First Frame Call. Why: The loop starts on the next frame. How: This schedules the first check.


	} );


}

// #endregion scrSetFun



// #region stoInfFun

/**
 * stoInfFun = Stop Information Function
 *
 * @summary
 * Runs inside the page after each Tab press and describes the focused stop, or
 * returns null once focus has left the page: onto the body, to nothing, or out
 * of the document entirely. (Firefox does none of these after its last stop,
 * which {@link keyProFun} handles.) The focus indicator is judged by blurring
 * the stop for a moment and comparing the styles a focus indicator usually
 * changes (outline, shadow, border, background, color, and underline), then
 * focusing it again so the walk continues from it. Coverage is judged by
 * asking which element sits at the stop's center: anything other than the stop
 * or one of its own descendants means the stop is hidden behind it. Passed to
 * Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The stop's description, or null when the walk has ended.
 *
 * @example
 * ```ts
 * page.evaluate(stoInfFun) // => { covBoo, desStr, indBoo, ordNum, visBoo }
 * ```
 *
*/

function stoInfFun () : StoInfTyp | null {


	const actCurEle = document.activeElement as HTMLElement | null; // What: Active Current Element. Why: The stop is whatever holds focus after the press. How: This reads the focused element. // What: Type Assertion Note. Why: activeElement types as Element, which has no blur or focus. How: Every element that can hold focus on this site is an HTMLElement.

	const actBodBoo = actCurEle === document.body; // What: Active Body Boolean. Why: Focus resting on the body means no stop holds it. How: This compares the focused element with the body.
	const actMisBoo = !actCurEle;                  // What: Active Missing Boolean. Why: Some engines report no focused element at all once focus leaves. How: This is true when there is none.
	const docBluBoo = !document.hasFocus();        // What: Document Blurred Boolean. Why: Focus can leave for the browser's own interface. How: This is true when the document no longer has focus.

	const walDonBoo = actMisBoo || actBodBoo || docBluBoo; // What: Walk Done Boolean. Why: Any of the three means the walk has left the page. How: This combines them.


	if ( walDonBoo ) return null; // What: Walk End Guard. Why: Focus on the body, nowhere, or outside the document means the walk has left the page. How: This returns null to end the walk.



	const sigStyFun = () => { // What: Signature Style Function. Why: A focus indicator is a change in the outline, shadow, border, background, color, or underline between focused and unfocused. How: This reads the stop's styles as one string to compare.


		const styCurObj = getComputedStyle( actCurEle ); // What: Style Current Object. Why: The stop's styles are compared as they're drawn now. How: This reads its computed styles.



		return [ styCurObj.outlineStyle, styCurObj.outlineWidth, styCurObj.outlineColor, styCurObj.boxShadow, styCurObj.borderColor, styCurObj.backgroundColor, styCurObj.color, styCurObj.textDecorationLine ].join( '|' ); // What: Signature Return. Why: Two looks compare as one string. How: This joins every style a focus indicator usually changes.


	};


	const focSigStr = sigStyFun(); // What: Focused Signature String. Why: The stop's look while focused is the first half of the comparison. How: This reads it before anything changes.


	actCurEle.blur(); // What: Stop Blur Call. Why: The unfocused look is the other half of the comparison. How: This removes focus for a moment.


	const bluSigStr = sigStyFun(); // What: Blurred Signature String. Why: The stop's unfocused look completes the comparison. How: This reads the same styles after the blur.


	actCurEle.focus(); // What: Stop Refocus Call. Why: The walk continues from this stop. How: This puts focus back where the Tab press left it.


	const recCurObj = actCurEle.getBoundingClientRect();                                                                       // What: Rect Current Object. Why: A focused stop has to be on screen and uncovered. How: This measures the stop.
	const topCurEle = document.elementFromPoint( recCurObj.left + recCurObj.width / 2, recCurObj.top + recCurObj.height / 2 ); // What: Top Current Element. Why: Whatever is drawn on top at the stop's center is what a person sees there. How: This asks the page which element sits at that point.



	const ariLabStr = actCurEle.getAttribute( 'aria-label' ); // What: ARIA Label String. Why: A stop's own label names it best. How: This reads its aria-label, or null.
	const eleIdeStr = actCurEle.id;                           // What: Element Identifier String. Why: A form field without a label is still recognizable by its ID. How: This reads the stop's ID, empty when it has none.
	const eleTexStr = actCurEle.textContent;                  // What: Element Text String. Why: A link or button is usually named by its text. How: This reads the stop's text.

	const stoLabStr = ariLabStr || eleIdeStr || eleTexStr || ''; // What: Stop Label String. Why: A problem should name the stop the way a person would recognize it. How: This takes the label, then the ID, then the text, then nothing.


	const botBelBoo = recCurObj.bottom > 0;        // What: Bottom Below Boolean. Why: A stop entirely above the viewport is off screen. How: This is true when its bottom edge sits below the viewport's top.
	const heiPosBoo = recCurObj.height > 0;        // What: Height Positive Boolean. Why: A stop with no height can't be seen. How: This is true when it has some height.
	const lefInsBoo = recCurObj.left < innerWidth; // What: Left Inside Boolean. Why: A stop entirely right of the viewport is off screen. How: This is true when its left edge sits inside the viewport's width.
	const rigInsBoo = recCurObj.right > 0;         // What: Right Inside Boolean. Why: A stop entirely left of the viewport is off screen. How: This is true when its right edge sits past the viewport's left.
	const topAboBoo = recCurObj.top < innerHeight; // What: Top Above Boolean. Why: A stop entirely below the viewport is off screen. How: This is true when its top edge sits above the viewport's bottom.
	const widPosBoo = recCurObj.width > 0;         // What: Width Positive Boolean. Why: A stop with no width can't be seen. How: This is true when it has some width.

	const visStoBoo = botBelBoo && heiPosBoo && lefInsBoo && rigInsBoo && topAboBoo && widPosBoo; // What: Visible Stop Boolean. Why: A focused stop has to be on screen. How: This is true when it has a size and overlaps the viewport.



	return { // What: Stop Information Return. Why: The walk judges each stop outside the page. How: This hands back the stop's coverage, description, indicator, position, and visibility.


		covBoo : !!topCurEle && !actCurEle.contains( topCurEle ),                               // What: Covered Boolean. Why: The stop is hidden when something else is on top of it. How: This is true when the top element at its center is neither the stop nor inside it.
		desStr : `${ actCurEle.tagName.toLowerCase() } "${ stoLabStr.trim().slice( 0, 40 ) }"`, // What: Description String. Why: A problem should name the element a person would recognize. How: This joins the tag with the first 40 characters of its label, ID, or text.
		indBoo : focSigStr !== bluSigStr,                                                       // What: Indicator Boolean. Why: A keyboard user has to see where focus is. How: This is true when focusing the stop changes how it looks.
		ordNum : Array.prototype.indexOf.call( document.querySelectorAll( '*' ), actCurEle ),   // What: Order Number. Why: Focus order is compared with document order. How: This is the stop's position among every element in the page.
		visBoo : visStoBoo                                                                      // What: Visible Boolean. Why: A stop off screen leaves a keyboard user lost. How: This reads whether the stop has a size and overlaps the viewport.


	};


}

// #endregion stoInfFun



// #region tabStoFun

/**
 * tabStoFun = Tab Stops Function
 *
 * @summary
 * Runs inside the page once the Tab walk ends and lists every element a Tab
 * press should reach: links with an address, buttons, and form fields, plus
 * anything else given a tabindex of 0 or more, leaving out what's disabled,
 * inert, or not drawn, and, while a modal dialog is open, what sits outside
 * it, since the browser keeps Tab inside the dialog without marking the page
 * behind it inert. Each one is described the way {@link stoInfFun} describes a
 * stop, with its position among every element in the page. Passed to
 * Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The description and position of every element Tab should reach.
 *
 * @example
 * ```ts
 * page.evaluate(tabStoFun) // => [ { desStr, ordNum }, ... ]
 * ```
 *
*/

function tabStoFun () : Pick< StoInfTyp, 'desStr' | 'ordNum' >[] {


	const allEleArr = [ ...document.querySelectorAll( '*' ) ];  // What: All Element Array. Why: A stop's position is its place among every element, as the walk reads it. How: This lists every element in document order.
	const modDiaEle = document.querySelector( 'dialog:modal' ); // What: Modal Dialog Element. Why: An open modal dialog keeps Tab inside itself. How: This finds the open one, or null when none is.



	return [ ...document.querySelectorAll< HTMLElement >( 'a[href], button, input, select, textarea, [tabindex]' ) ].filter( ( tabCurEle ) => tabCurEle.tabIndex >= 0 && !tabCurEle.matches( ':disabled' ) && !tabCurEle.closest( '[inert]' ) && ( !modDiaEle || modDiaEle.contains( tabCurEle ) ) && tabCurEle.checkVisibility( { visibilityProperty : true } ) ).map( ( tabCurEle ) => ( { desStr : `${ tabCurEle.tagName.toLowerCase() } "${ ( tabCurEle.getAttribute( 'aria-label' ) || tabCurEle.id || tabCurEle.textContent || '' ).trim().slice( 0, 40 ) }"`, ordNum : allEleArr.indexOf( tabCurEle ) } ) ); // What: Tab Stops Return. Why: The walk compares the stops it reached with every one it should have. How: This keeps the focusable elements that are enabled, outside any inert layer, and drawn, and describes each by its tag and its label, ID, or text, with its position.


}

// #endregion tabStoFun



// #region keyProFun

/**
 * keyProFun = Keyboard Problems Function
 *
 * @summary
 * Walks the page with the Tab key from wherever focus rests once the state has
 * opened, the top of the page unless the state's action moved focus, counting
 * the focused control as the first stop when it shows the keyboard's ring, and
 * returns every problem: any element with a positive tabindex, which overrides
 * the document order, and every stop that comes earlier in the document than
 * the stop before it, sits off screen, is covered by something else, or looks
 * the same focused and unfocused. The walk ends when focus leaves the page,
 * comes back to the first stop, or stays on the same stop after a press, which
 * is how Firefox leaves its last stop; one that hasn't ended within
 * TAB_MAX_NUM presses counts as a keyboard trap, and one that ends before
 * reaching any stop is a problem too. Since a trap that cycles back to the
 * first stop or holds focus on one stop ends the walk the same way, every
 * element from the first stop on that {@link tabStoFun} says Tab should reach
 * but the walk never did is a problem as well. WebKit only tabs to links with
 * Alt held, the way Safari does by default, so the walk presses Alt+Tab there.
 * It expects reduced motion already requested, so the page jumps to each stop
 * instead of gliding and focus styles appear at once, and each press waits for
 * scrolling to settle, so every stop is measured where and how it ends up.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to walk.
 * @param engNamStr - Engine Name String: The browser the project runs in.
 *
 * @returns A promise that resolves with every keyboard problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * keyProFun(page, 'webkit') // => [ 'input "email" has no visible ...' ]
 * ```
 *
*/

async function keyProFun ( curPagObj : Page, engNamStr : string ) : Promise< string[] > {


	const posTabNum = await curPagObj.locator( '[tabindex]' ).evaluateAll( ( tabEleArr ) => tabEleArr.filter( ( tabCurEle ) => Number( tabCurEle.getAttribute( 'tabindex' ) ) > 0 ).length ); // What: Positive Tab-Index Number. Why: A positive tabindex pulls an element ahead of the document order. How: This counts every element carrying one.
	const reaOrdSet = new Set< number >();                                                                     // What: Reached Order Set. Why: A trap leaves some stops unreached, which the walk can only tell by remembering where it has been. How: This holds the position of every stop the walk reaches.
	const staFocBoo = await curPagObj.evaluate( () => !!document.activeElement?.matches( ':focus-visible' ) ); // What: Start Focus Boolean. Why: A state opened by keyboard, such as a photo dialog, can hand focus to a control that is already a stop, and a dialog with one control holds or drops focus on the next press, so that control would never be measured. How: This is true when the focused element shows the keyboard's focus ring before the walk starts.
	const tabKeyStr = engNamStr === 'webkit' ? 'Alt+Tab' : 'Tab';                                              // What: Tab Key String. Why: WebKit skips links on a plain Tab, the way Safari does by default. How: This picks Alt+Tab there and Tab everywhere else.

	const proLisArr : string[] = posTabNum ? [ `${ posTabNum } element(s) use a positive tabindex` ] : []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This starts with the positive tabindex count, when there is one, and collects the rest during the walk.

	let firOrdNum = -1; // What: First Order Number. Why: Focus coming back to the first stop means the walk went all the way around, and the stops before it were never part of the walk. How: This holds the first stop's position among every element, -1 until a stop is reached.
	let preOrdNum = -1; // What: Previous Order Number. Why: Each stop must come later in the document than the last. How: This holds the previous stop's position among every element.


	for ( let tabCouNum = 0; tabCouNum < TAB_MAX_NUM; tabCouNum++ ) { // What: Tab Walk Loop. Why: Every stop is checked in the order a keyboard user meets it. How: This presses Tab once per pass, up to the cap, the first pass measuring a keyboard-focused start instead.


		if ( tabCouNum || !staFocBoo ) await curPagObj.keyboard.press( tabKeyStr ); // What: Tab Press Call. Why: Each pass moves focus to the next stop, while a start that's already a keyboard stop is measured where it is. How: This presses the engine's Tab key, skipping the first press when the walk starts on a keyboard-focused control.



		await curPagObj.evaluate( scrSetFun ); // What: Scroll Settled Wait. Why: Some engines scroll a focused field into view a few frames late. How: This waits until the page has stopped scrolling.


		const stoInfObj = await curPagObj.evaluate( stoInfFun );                                          // What: Stop Information Object. Why: The stop is described and measured inside the page. How: This runs stoInfFun there.
		const walEndBoo = !stoInfObj || stoInfObj.ordNum === firOrdNum || stoInfObj.ordNum === preOrdNum; // What: Walk Ended Boolean. Why: Focus leaving the page, coming back around, or staying put ends the walk. How: This checks each in turn, the later two only once a stop exists, so the chain stays inline. // What: Firefox Walk End Note. Why: Firefox moves focus out to its own interface after the last stop but still reports that stop as focused. How: Focus staying on the same stop after a press is read as the walk leaving the page.


		if ( walEndBoo && firOrdNum < 0 ) return [ ...proLisArr, 'the Tab walk reached no stop' ]; // What: Empty Walk Guard. Why: A walk that ends before its first stop has checked nothing. How: This returns the problems with one more, ending the walk.



		if ( walEndBoo ) return [ ...proLisArr, ...( await curPagObj.evaluate( tabStoFun ) ).filter( ( tabStoObj ) => tabStoObj.ordNum >= firOrdNum && !reaOrdSet.has( tabStoObj.ordNum ) ).map( ( tabStoObj ) => `${ tabStoObj.desStr } is never reached by Tab` ) ]; // What: Walk End Guard. Why: A walk that ends has found every problem the stop checks look for, but a trap that wraps around or holds focus on one stop ends it too, leaving later stops unreached. How: This returns the problems, ending the walk, with one more for every element from the first stop on that Tab should reach but never did.



		if ( firOrdNum < 0 ) firOrdNum = stoInfObj.ordNum; // What: First Stop Record. Why: The walk ends if focus comes back to it. How: This remembers the first stop's position.



		reaOrdSet.add( stoInfObj.ordNum ); // What: Reached Stop Record. Why: The stops reached are compared with every one Tab should reach once the walk ends. How: This adds this stop's position.



		if ( stoInfObj.ordNum <= preOrdNum ) proLisArr.push( `${ stoInfObj.desStr } comes before the previous stop in the document` ); // What: Order Check. Why: Focus should move forward through the page. How: This records a stop that jumps backwards.



		if ( !stoInfObj.visBoo ) proLisArr.push( `${ stoInfObj.desStr } is focused but not on screen` ); // What: On Screen Check. Why: A keyboard user can't act on what they can't see. How: This records a stop with no size or outside the viewport.

		else if ( stoInfObj.covBoo ) proLisArr.push( `${ stoInfObj.desStr } is focused but covered by another element` ); // What: Covered Check. Why: A stop hidden behind something else can't be seen either. How: This records an on-screen stop with another element on top of it.



		if ( !stoInfObj.indBoo ) proLisArr.push( `${ stoInfObj.desStr } has no visible focus indicator` ); // What: Indicator Check. Why: A keyboard user has to see where focus is. How: This records a stop that looks the same focused and unfocused.



		preOrdNum = stoInfObj.ordNum; // What: Previous Order Update. Why: The next stop is compared with this one. How: This stores this stop's position.


	}



	proLisArr.push( `focus never left the page within ${ TAB_MAX_NUM } presses, a likely keyboard trap` ); // What: Trap Record Call. Why: A keyboard user must always be able to Tab away. How: The loop returns as soon as the walk ends, so reaching this line means it never did.



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion keyProFun

// #endregion Helpers



// #region Module Init

for ( const staRecObj of [ ...STA_REC_ARR, ...RES_STA_ARR, ...INV_STA_ARR, ...FIL_STA_ARR, ...EMP_STA_ARR, ...PHO_STA_ARR ] ) { // What: State Test Loop. Why: Every check runs on every page state, the Contact form's results and refused send, the Gallery's narrowed grids, and a Family card's open photo included. How: This declares each check once per state, the shared states first, then the reachable ones each control leads to.


	test( `${ staRecObj.ideStr } names every link and button cleanly`, async ( { page : curPagObj } ) => { // What: Names Test. Why: Every link and button must be announced by a clean name. How: This opens the state and checks its accessibility tree.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The tree should be read with the state settled. How: This loads and settles it.

		expect( await namProFun( curPagObj ) ).toEqual( [] ); // What: No Name Problems Assertion. Why: The state passes only with clean names. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } walks cleanly with the keyboard`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Keyboard Test. Why: Everything has to be usable without a mouse. How: This opens the state under reduced motion and walks it with Tab.


		test.slow(); // What: Slow Test Mark. Why: A full walk measures every stop and can run past the default 30 second timeout when the machine is busy. How: This triples this test's timeout.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: A smooth scroll or a focus transition still running would be measured halfway. How: This makes the page match prefers-reduced-motion, which turns both off.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The walk should start from the state settled. How: This loads and settles it.

		expect( await keyProFun( curPagObj, engNamStr ) ).toEqual( [] ); // What: No Keyboard Problems Assertion. Why: The state passes only when every stop is reachable, in order, on screen, uncovered, and visibly focused. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } reflows at ${ REF_WID_NUM }px without scrolling sideways`, async ( { page : curPagObj } ) => { // What: Reflow Test. Why: Zoomed-in visitors read in one column without scrolling sideways. How: This opens the state at the reflow width and compares the page's scroll width with its visible width.


		await opeStaFun( curPagObj, { ...staRecObj, widNum : REF_WID_NUM } ); // What: Narrow State Open Call. Why: Reflow is judged at WCAG's narrowest width. How: This opens the state with its width replaced by the reflow width.

		expect( await curPagObj.evaluate( () => document.documentElement.scrollWidth - document.documentElement.clientWidth ) ).toBeLessThanOrEqual( 0 ); // What: No Sideways Scroll Assertion. Why: The page passes only when nothing reaches past the viewport's width. How: This subtracts the visible width from the scrollable width, which stays at zero without sideways scrolling.


	} );



	test( `${ staRecObj.ideStr } plays no motion under reduced motion`, async ( { page : curPagObj } ) => { // What: Reduced Motion Test. Why: Visitors who ask for less motion shouldn't see the page animate. How: This requests reduced motion, records every lasting animation and transition from the start of the load, opens the state, and lists anything that played or is still waiting to.


		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

		await motRecFun( curPagObj ); // What: Motion Recorder Call. Why: An entrance or the state's own action, such as the menu's slide, ends before the state settles, so it has to be caught as it starts. How: This records every lasting animation and transition from before the page's own script runs.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: Entrance animations and the state's own action are the motion being checked. How: This loads the state and runs its action.

		expect( await curPagObj.evaluate( () => ( window as unknown as { __motRecArr : string[] } ).__motRecArr ) ).toEqual( [] ); // What: No Motion Played Assertion. Why: The state passes only when nothing animated or transitioned for longer than 1ms while it opened. How: This compares the recorded motion with an empty list, so a failure prints each one. // What: Type Assertion Note. Why: The window has no such field in its type. How: motRecFun's script set it.
		expect( await curPagObj.evaluate( () => document.getAnimations().filter( ( aniCurObj ) => ( Number( aniCurObj.effect?.getTiming().duration ) || 0 ) > 1 ).map( ( aniCurObj ) => ( aniCurObj as CSSAnimation ).animationName || ( aniCurObj as CSSTransition ).transitionProperty || 'script animation' ) ) ).toEqual( [] ); // What: No Motion Left Assertion. Why: A CSS animation whose delay hasn't run out fires no start event yet, so the recorder can't see it. How: This lists every animation or transition the page still holds that lasts longer than 1ms, which should be none. // What: Type Assertion Note. Why: getAnimations returns plain Animation objects, which don't type their CSS names. How: Each one is read as a CSS animation, then a CSS transition, falling back to a generic label when neither name exists.


	} );


}

// #endregion Module Init


