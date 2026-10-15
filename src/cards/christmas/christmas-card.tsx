


// #region Imports

import cssModObj from './christmas-card.module.css'; // What: CSS Module Object. Why: The card's scenes, lettering, and snowflakes are styled in its own module. How: This maps each class name in christmas-card.module.css to its scoped name.
import snoManUrl from './snowman.webp';              // What: Snowman URL. Why: A snowman waves from the snowy scene's corner. How: This is the optimized image's address, fingerprinted by Vite.


import { cdnPowFun          } from '../../utils/rhythm.ts';   // What: Core-Design-Number Power Function. Why: The glitch's skew sits on the scale as a power of the core design number. How: This returns that power.
import { CustomEase         } from 'gsap/CustomEase';         // What: Custom Ease. Why: GSAP can't read the stylesheet's cubic-bezier curves on its own. How: This registers each easing token as a named GSAP ease.
import { durMilFun          } from '../../utils/rhythm.ts';   // What: Duration Millisecond Function. Why: Every duration in the timeline is a step on the duration scale. How: This returns a step's length in milliseconds.
import { gsap               } from 'gsap';                    // What: GSAP. Why: The card plays as one long timeline of wipes, text effects, and glitches. How: This is the animation library that builds and plays it.
import { motEasFun          } from '../../utils/motion.ts';   // What: Motion Easing Function. Why: The timeline's curves should match the stylesheet's. How: This reads an easing token's curve.
import { redMotFun          } from '../../utils/motion.ts';   // What: Reduce Motion Function. Why: A visitor who asked for less motion should get the final scene at once. How: This reports whether reduced motion is on.
import { rhyPxlFun          } from '../../utils/rhythm.ts';   // What: Rhythm Pixel Function. Why: The lettering's slides and the glitch's shift are spacing steps. How: This returns a step's size in pixels.
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'; // What: Scramble Text Plugin. Why: The hacked heading types itself out through random characters. How: This GSAP plugin animates text that way.
import { SplitText          } from 'gsap/SplitText';          // What: Split Text. Why: The messages fade in one letter at a time. How: This GSAP plugin wraps each letter so it can animate on its own.
import { staSnoFun          } from './snowfall.ts';           // What: Start Snowfall Function. Why: Snow falls over the last scene. How: This starts it and returns the function that stops it.
import { useGSAP            } from '@gsap/react';             // What: Use GSAP. Why: The timeline has to be built after the card renders and undone when it leaves. How: This GSAP hook runs it in a context it reverts on unmount.
import { useRef             } from 'react';                   // What: Use Ref. Why: The timeline animates specific elements. How: Each animated element gets a ref.
import { useSearchParams    } from 'react-router';            // What: Use Search Parameters. Why: The greeting can name its recipient. How: This reads the address's ?name= parameter.
import { useState           } from 'react';                   // What: Use State. Why: The wipe's grid is measured once, when the card opens. How: This keeps the measured columns and rows.


import type { JSX       } from 'react';         // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.
import type { SnoSetTyp } from './snowfall.ts'; // What: Snowfall Settings Type. Why: The card picks the snow's amount and speed for the screen. How: This types those settings.

// #endregion Imports



/**
 * christmas-card.tsx = Christmas Card
 *
 * @summary
 * The Merry Christmas card, in two versions. The listed one opens on a snowy
 * cabin with snow falling, where the greeting, named for its recipient through
 * ?name=, and the sign-off, signed by its sender through ?from= or by Tech
 * Geek, fade in letter by letter. The unlisted prank turns into that greeting:
 * a grid of dark squares wipes away to a fake hacked screen, a pirate flag
 * with a heading that scrambles into You've Just Been Hacked, a glitch, and a
 * message fading in letter by letter that admits it's a joke, before the
 * squares wipe back over it and away again to the snowy scene, signed by Mr.
 * Awesome unless the link says otherwise. Every duration, distance, and angle
 * is a step on the design scale, and the curves are the stylesheet's easing
 * tokens. Under reduced motion either version opens straight on the finished
 * snowy scene, without snow. Converted from TechGeek.support's original.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Components
 *  - Module Init
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const HAC_MES_STR = 'Just kidding! But it just goes to show you that you should never trust a QR code! Christmas present incoming...'; // What: Hacked Message String. Why: The prank's message is shown letter by letter but read whole. How: The visible copy fades in by letter while a hidden copy gives screen readers the full sentence.
const HAC_TIT_STR = "You've Just Been Hacked!!"; // What: Hacked Title String. Why: The prank's heading scrambles into this. How: The scramble animates the empty heading to it, and the heading's label reads it out.
const PAU_POS_STR = '+=1';                       // What: Pause Position String. Why: Each scene holds for a second before the next starts. How: This GSAP position starts a step one second after the one before ends, a literal since pacing stays off the scale.
const SNO_HEI_NUM = 521;                         // What: Snow Height Number. Why: On a short screen, fast flakes cross it too quickly. How: Below this height in pixels, the snow falls slower.
const SNO_WID_NUM = 1024;                        // What: Snow Width Number. Why: On a narrow screen, a full snowfall looks crowded. How: At the desktop breakpoint and below, half as many flakes fall.
const SQU_COU_NUM = 450;                         // What: Square Count Number. Why: The wipe looks pixelated at about this many squares on any screen. How: The grid's columns and rows are picked so their product lands near it.

// #endregion Constants



// #region Helpers

const durSecFun = ( durSteStr : string ) : number => durMilFun( durSteStr ) / 1000; // What: Duration Second Function. Why: GSAP takes durations in seconds, while the duration scale is in milliseconds. How: This converts a step's length to seconds.



// #region gliTimFun

/**
 * gliTimFun = Glitch Timeline Function
 *
 * @summary
 * Adds the glitch to the timeline: the elements skew hard to the right and
 * snap back, flicker out and in, jump left and back, and stretch tall for an
 * instant, all within about a third of a second. Several elements glitch
 * together, in step. Every duration is a step on the duration scale below the
 * named interface steps, the skew a power of the core design number, and the
 * shift a spacing step; only the stretch's 1.1 stays literal, since no step
 * lands within 10% of it. The skew and stretch use the in-out curve and the
 * flicker and jump the decelerate curve.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param timLinObj - Timeline Object: The card's timeline.
 * @param tarEleArr - Target Element Array: The elements that glitch together.
 * @param decEasStr - Decelerate Easing String: The decelerate curve's GSAP
 *                    name.
 * @param inoEasStr - In-Out Easing String: The in-out curve's GSAP name.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * gliTimFun(timLinObj, tarEleArr, decEasStr, inoEasStr) // => void
 * ```
 *
*/

const gliTimFun = ( timLinObj : gsap.core.Timeline, tarEleArr : HTMLElement[], decEasStr : string, inoEasStr : string ) : void => { // What: Glitch Timeline Function. Why: The hacked heading glitches twice, the second time with its message. How: This adds the eight glitch steps to the timeline.


	const fliDurNum = durSecFun( 'm05' );      // What: Flicker Duration Number. Why: Each flicker and jump is barely a frame or two. How: This is the duration scale's Base Minus 5 step, about 38.7ms, in seconds. // Duration Animation Base Minus 5 ~= 38.7ms
	const skeAngNum = cdnPowFun( 15 );         // What: Skew Angle Number. Why: The skew tears the letters sideways. How: This is the core design number to the power of 15, about 67.9 degrees. // Core-Design-Number to the Power of 15 ~= 67.897
	const skeDurNum = durSecFun( 'm01' );      // What: Skew Duration Number. Why: The skew is the glitch's longest step. How: This is the duration scale's Base Minus 1 step, about 119.2ms, in seconds. // Duration Animation Base Minus 1 ~= 119.2ms
	const shiPxlNum = rhyPxlFun( 'p01' ) * -1; // What: Shift Pixel Number. Why: The jump throws the letters left. How: This is the Spacing Horizontal Base Plus 1 step, about 19.3px, negated. // Vertical Rhythm Base Plus 1 ~= -19.304px
	const strDurNum = durSecFun( 'm07' );      // What: Stretch Duration Number. Why: The stretch is the glitch's quickest step. How: This is the duration scale's Base Minus 7 step, about 22.0ms, in seconds. // Duration Animation Base Minus 7 ~= 22.0ms


	timLinObj.to( tarEleArr, { duration : skeDurNum, ease : inoEasStr, skewX   : skeAngNum } ); // What: Skew Step. Why: The glitch starts by tearing the letters sideways. How: This skews them to the right.
	timLinObj.to( tarEleArr, { duration : fliDurNum, ease : inoEasStr, skewX   : 0         } ); // What: Unskew Step. Why: The tear snaps back. How: This returns the skew to 0.
	timLinObj.to( tarEleArr, { duration : fliDurNum, ease : decEasStr, opacity : 0         } ); // What: Flicker Out Step. Why: The letters cut out for an instant. How: This fades them to transparent.
	timLinObj.to( tarEleArr, { duration : fliDurNum, ease : decEasStr, opacity : 1         } ); // What: Flicker In Step. Why: The letters come back. How: This fades them in again.
	timLinObj.to( tarEleArr, { duration : fliDurNum, ease : decEasStr, x       : shiPxlNum } ); // What: Jump Step. Why: The letters jolt sideways. How: This shifts them left.
	timLinObj.to( tarEleArr, { duration : fliDurNum, ease : decEasStr, x       : 0         } ); // What: Return Step. Why: The jolt snaps back. How: This returns them to their place.
	timLinObj.to( tarEleArr, { duration : strDurNum, ease : inoEasStr, scaleY  : 1.1       } ); // What: Stretch Step. Why: The letters stretch tall for an instant. How: This scales them 10% taller, a literal since no step lands within 10%.
	timLinObj.to( tarEleArr, { duration : fliDurNum, ease : inoEasStr, scaleY  : 1         } ); // What: Unstretch Step. Why: The glitch ends with the letters back to normal. How: This returns their height.


};

// #endregion gliTimFun



type GsfRetTyp = { squColNum : number, squRowNum : number }; // What: Grid-Size-Function Return Type. Why: The wipe's grid has columns and rows. How: This names both counts.

// #region griSizFun

/**
 * griSizFun = Grid Size Function
 *
 * @summary
 * The wipe's columns and rows for the screen the card opens on, picked so the
 * squares are as close to square as the screen allows and number about
 * SQU_COU_NUM. Every cell holds a square and the grid stretches to fill the
 * screen exactly, so the wipe always covers it, gap free, whatever its shape.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The grid's column and row counts.
 *
 * @example
 * ```ts
 * griSizFun() // => { squColNum : 28, squRowNum : 16 } at 1,920 by 1,080
 * ```
 *
*/

const griSizFun = () : GsfRetTyp => { // What: Grid Size Function. Why: The wipe has to cover any screen shape without gaps. How: This sizes a square from the screen's area and counts how many fit across and down.


	const squSidNum = Math.sqrt( innerWidth * innerHeight / SQU_COU_NUM ); // What: Square Side Number. Why: The squares share the screen's area. How: This is the side of a square whose area is the screen's divided by the count.



	return { // What: Grid Size Return. Why: The card lays the grid out from both counts. How: This rounds how many squares fit across and down, at least one each.


		squColNum : Math.max( 1, Math.round( innerWidth / squSidNum ) ), // What: Square Column Number. Why: The grid needs its column count. How: This rounds the screen's width over the side.
		squRowNum : Math.max( 1, Math.round( innerHeight / squSidNum ) ) // What: Square Row Number. Why: The grid needs its row count. How: This rounds the screen's height over the side.


	};


};

// #endregion griSizFun



// #region gsaEasFun

/**
 * gsaEasFun = GSAP Easing Function
 *
 * @summary
 * Registers one of the stylesheet's --mot-*-eas curves as a named GSAP ease,
 * since GSAP can't read a CSS cubic-bezier, and returns the name the
 * timeline uses. The curve is read through motEasFun, so the timeline always
 * eases the way the stylesheet says; the standard family's plain ease keyword
 * becomes its cubic-bezier equivalent. Registering a name again replaces it,
 * so calling this on every replay is harmless.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param easFamStr - Easing Family String: The family's 3-letter name, e.g.
 *                    'dec' or 'ino'.
 *
 * @returns The ease's GSAP name.
 * @see {@link easNamStr}
 *
 * @example
 * ```ts
 * gsaEasFun('dec') // => 'mot-dec-eas'
 * ```
 *
*/

const gsaEasFun = ( easFamStr : string ) : string => { // What: GSAP Easing Function. Why: The timeline's curves come from the stylesheet. How: This registers the family's curve with CustomEase and returns its name.


	const easNamStr = `mot-${ easFamStr }-eas`;                                                           // What: Easing Name String. Why: The GSAP name matches the token it comes from. How: This names it after the token.
	const easValStr = motEasFun( easFamStr );                                                             // What: Easing Value String. Why: The curve is the stylesheet's own. How: This reads the token's value.
	const bezValStr = ( easValStr === 'ease' ? '.25, .1, .25, 1' : easValStr ).replace( /[^\d.,]/g, '' ); // What: Bezier Value String. Why: CustomEase takes a cubic-bezier's four numbers. How: This swaps the ease keyword for its own four, then keeps only the digits, dots, and commas.


	CustomEase.create( easNamStr, bezValStr ); // What: Ease Registration Call. Why: The timeline refers to the curve by name. How: This registers it with GSAP.



	return easNamStr;


};

// #endregion gsaEasFun



// #region snoSetFun

/**
 * snoSetFun = Snowfall Settings Function
 *
 * @summary
 * The snow's settings for the screen as it is when the snowy scene appears:
 * half as many flakes at the desktop breakpoint and below, where a full
 * snowfall looks crowded, and slower flakes on a short screen, where fast
 * ones cross it too quickly. Flakes range from 1 to 8 pixels across. Every
 * number here tunes the snow's look rather than the layout, so all stay
 * literal.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The snow's count, size range, and speed range.
 *
 * @example
 * ```ts
 * snoSetFun() // => { couNum : 120, sizMaxNum : 8, ... } on a large screen
 * ```
 *
*/

const snoSetFun = () : SnoSetTyp => ( { // What: Snowfall Settings Function. Why: The amount and speed of snow suit the screen. How: This returns the settings for the current window size.


	couNum    : innerWidth <= SNO_WID_NUM ? 60 : 120, // What: Count Number. Why: A narrow screen gets half the flakes. How: This picks 60 at the breakpoint and below, 120 above.
	sizMaxNum : 8,                                    // What: Size Maximum Number. Why: The largest flakes are 8 pixels across. How: This sets the range's top.
	sizMinNum : 1,                                    // What: Size Minimum Number. Why: The smallest flakes are a single pixel. How: This sets the range's bottom.
	speMaxNum : innerHeight < SNO_HEI_NUM ? 2 : 3,    // What: Speed Maximum Number. Why: A short screen gets slower flakes. How: This picks 2 pixels per 60th of a second below the height, 3 otherwise.
	speMinNum : 1                                     // What: Speed Minimum Number. Why: The slowest flakes drift down a pixel per 60th of a second. How: This sets the range's bottom.


} );

// #endregion snoSetFun

// #endregion Helpers



// #region Components

type CccProTyp = { prkBoo? : boolean }; // What: Christmas-Card-Component Props Type. Why: The card plays as the full prank or as the snowy scene alone. How: This names the optional prank flag.

// #region ChrCarCom

/**
 * ChrCarCom = Christmas Card Component
 *
 * @summary
 * The Christmas card, in two versions: the listed Merry Christmas card, which
 * opens straight on the snowy scene, and the unlisted prank, which first
 * plays the wipe's grid of squares over the hacked scene. Either plays as one
 * GSAP timeline when the card opens, built in useGSAP, so leaving the card or
 * replaying it reverts every tween and letter split, and its cleanup stops
 * the snow. The prank's grid is measured once, when the card opens, and
 * stretches to fill the screen if the window is resized later. The greeting
 * adds the recipient's name from ?name=, and the sign-off is signed with
 * ?from=, or by default Tech Geek on the listed card and Mr. Awesome on the
 * prank.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.prkBoo - Prank Boolean: Whether the card opens on the hacked
 *                       prank, false by default for the snowy scene alone.
 *
 * @returns The card's scenes and the wipe's grid.
 *
 * @example
 * ```tsx
 * ChrCarCom({ prkBoo }) // => <ChrCarCom />
 * ```
 *
*/

function ChrCarCom ( { prkBoo = false } : CccProTyp ) : JSX.Element {


	const carDivRef = useRef< HTMLDivElement >( null );       // What: Card Div Reference. Why: The timeline's selectors and cleanup are scoped to the card. How: This holds the card's root.
	const hacMesRef = useRef< HTMLParagraphElement >( null ); // What: Hacked Message Reference. Why: The message fades in by letter and glitches. How: This holds the paragraph.
	const hacTitRef = useRef< HTMLHeadingElement >( null );   // What: Hacked Title Reference. Why: The heading scrambles and glitches. How: This holds the heading.
	const hacVisRef = useRef< HTMLSpanElement >( null );      // What: Hacked Visible Reference. Why: The message's visible copy fades in by letter. How: This holds the span SplitText splits.
	const pixConRef = useRef< HTMLDivElement >( null );       // What: Pixel Container Reference. Why: The wipe animates every square. How: This holds their grid.
	const snoSceRef = useRef< HTMLElement >( null );          // What: Snowy Scene Reference. Why: The scene is shown under the wipe and holds the snow. How: This holds the section.
	const snoTitRef = useRef< HTMLHeadingElement >( null );   // What: Snowy Title Reference. Why: The greeting fades in by letter. How: This holds the heading.
	const snoVisRef = useRef< HTMLSpanElement >( null );      // What: Snowy Visible Reference. Why: The sign-off's visible copy fades in by letter. How: This holds the span SplitText splits.

	const [ { squColNum, squRowNum } ] = useState( griSizFun ); // What: Square Column And Row Numbers. Why: The grid is measured once, when the card opens, so the wipe's squares never change mid-play. How: This runs griSizFun on the first render and keeps both counts.
	const [ seaParObj ]                = useSearchParams();     // What: Search Parameters Object. Why: The greeting can name its recipient. How: This reads the address's query.

	const froParStr = seaParObj.get( 'from' );                               // What: From Parameter String. Why: A shared link can carry the sender's name. How: This reads ?from=, or null without one.
	const namParStr = seaParObj.get( 'name' );                               // What: Name Parameter String. Why: A shared link can carry the recipient's name. How: This reads ?name=, or null without one.
	const sigNamStr = froParStr || ( prkBoo ? 'Mr. Awesome' : 'Tech Geek' ); // What: Signature Name String. Why: The card is signed by its sender. How: This takes the link's sender, or the version's own default.



	// #region Christmas Timeline

	/**
	 * christmas-card.tsx = Christmas Timeline
	 *
	 * @summary
	 * The card's one timeline, in order: the squares wipe away to the hacked
	 * scene; after a second's pause the heading scrambles in and glitches;
	 * the message fades in by letter; heading and message glitch together;
	 * after a pause the squares wipe back; after another the snowy scene is
	 * shown under them, the snow starts, and they wipe away; and after a
	 * last pause the greeting and sign-off fade in by letter. The squares
	 * fade in random order, the letters slide in from the right, and the
	 * long fades use the duration scale's Base Plus 11 step, about 3.48s.
	 * Under reduced motion the timeline jumps straight to its end, and the
	 * snow never starts.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	*/

	useGSAP( () => { // What: Christmas Timeline Hook. Why: The timeline has to run after the card renders and be undone when it leaves. How: This builds and plays it in a GSAP context, returning the snow's cleanup.


		const decEasStr = gsaEasFun( 'dec' );                                                              // What: Decelerate Easing String. Why: Things arriving slow as they land. How: This registers the decelerate token and keeps its GSAP name.
		const fadDurNum = durSecFun( 'p11' );                                                              // What: Fade Duration Number. Why: The scramble and each letter's fade are long, expressive motion. How: This is the duration scale's Base Plus 11 step, about 3.48s, in seconds. // Duration Animation Base Plus 11 ~= 3,480.0ms
		const sigSplObj = SplitText.create( snoVisRef.current, { aria : 'none', type : 'words, chars' } ); // What: Signature Split Object. Why: The sign-off fades in one letter at a time. How: This wraps the visible copy's words and letters, adding no labels, since a hidden copy speaks for it.
		const snoSplObj = SplitText.create( snoTitRef.current, { type : 'words, chars' } );                // What: Snowy Split Object. Why: The greeting fades in one letter at a time. How: This wraps its words and letters, labeling the heading with its full text.
		const splShiNum = rhyPxlFun( 'm01' );                                                              // What: Split Shift Number. Why: Each letter slides in from just right of its place. How: This is the Spacing Horizontal Base Minus 1 step, 11px. // Vertical Rhythm Base Minus 1 = 11px
		const splStaNum = durSecFun( 'm04' );                                                              // What: Split Stagger Number. Why: The letters arrive one after another. How: This is the duration scale's Base Minus 4 step, about 51.3ms, in seconds, between each letter's start. // Duration Animation Base Minus 4 ~= 51.3ms
		const splFroObj = { autoAlpha : 0, duration : fadDurNum, stagger : splStaNum, x : splShiNum };     // What: Split From Object. Why: Both messages fade in the same way. How: Each letter starts hidden and shifted right, fading in over the long fade.
		const timLinObj = gsap.timeline( { defaults : { ease : decEasStr } } );                            // What: Timeline Object. Why: The whole card plays as one sequence. How: This creates the timeline, its tweens decelerating unless told otherwise.

		let stoSnoFun = () => {}; // What: Stop Snowfall Function. Why: The cleanup has to stop the snow if it started. How: This holds the stop function staSnoFun returns, a no-op until then.


		const begSnoFun = () => { if ( !redMotFun() ) stoSnoFun = staSnoFun( snoSceRef.current!, cssModObj.snoFlaDiv, snoSetFun() ); }; // What: Begin Snowfall Function. Why: Both versions start the snow, but never under reduced motion. How: This starts it in the snowy scene and keeps its stop function. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: The timeline only runs after the render that attaches it.


		if ( prkBoo ) { // What: Prank Opening Check. Why: Only the prank version opens on the fake hack. How: This adds the wipes, the hacked scene, and its glitches before the snowy scene.


			const hacSplObj = SplitText.create( hacVisRef.current, { aria : 'none', type : 'words, chars' } ); // What: Hacked Split Object. Why: The message fades in one letter at a time. How: This wraps the visible copy's words and letters, adding no labels, since a hidden copy speaks for it.
			const inoEasStr = gsaEasFun( 'ino' );                                                              // What: In-Out Easing String. Why: The glitch's skew and stretch start and end slowly. How: This registers the in-out token and keeps its GSAP name.
			const squDurNum = durSecFun( 'm14' );                                                              // What: Square Duration Number. Why: Each square fades in a blink, one after another. How: This is the duration scale's Base Minus 14 step, about 3.08ms, in seconds. // Duration Animation Base Minus 14 ~= 3.080ms
			const squEleArr = Array.from( pixConRef.current!.children );                                       // What: Square Element Array. Why: The wipe animates every square. How: This lists the grid's children. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.

			const squWipObj : gsap.TweenVars = { duration : squDurNum, stagger : { each : squDurNum, ease : decEasStr, from : 'random' } }; // What: Square Wipe Object. Why: All three wipes play the same way. How: Each square fades in a Base Minus 14 step, starting one such step after the last, in random order.


			timLinObj.to( squEleArr, { ...squWipObj, opacity : 0 } ); // What: Opening Wipe. Why: The card opens on the hacked scene. How: This fades the squares out.

			timLinObj.to( hacTitRef.current, { duration : fadDurNum, scrambleText : HAC_TIT_STR }, PAU_POS_STR ); // What: Heading Scramble. Why: The hack announces itself. How: After a pause, this types the heading out through random characters.

			gliTimFun( timLinObj, [ hacTitRef.current! ], decEasStr, inoEasStr ); // What: Heading Glitch Call. Why: The heading glitches once it's written. How: This adds the glitch for the heading alone. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.

			timLinObj.from( hacSplObj.chars, splFroObj ); // What: Message Fade. Why: The joke gives itself away. How: This fades the message in by letter.

			gliTimFun( timLinObj, [ hacTitRef.current!, hacMesRef.current! ], decEasStr, inoEasStr ); // What: Scene Glitch Call. Why: Heading and message glitch together before the scene ends. How: This adds the glitch for both at once. // What: Non-Null Note. Why: TypeScript can't see that the refs are set. How: useGSAP runs after the render that attaches them.

			timLinObj.to( squEleArr, { ...squWipObj, opacity : 1 }, PAU_POS_STR ); // What: Closing Wipe. Why: The hacked scene ends. How: After a pause, this fades the squares back in.

			timLinObj.set( snoSceRef.current, { opacity : 1 }, PAU_POS_STR ); // What: Snowy Scene Reveal. Why: The real greeting waits under the squares. How: After a pause, this shows the snowy scene while they still cover it.

			timLinObj.call( begSnoFun ); // What: Snowfall Start Call. Why: The snow should already be falling when the squares lift. How: This starts it while they still cover the scene.

			timLinObj.to( squEleArr, { ...squWipObj, opacity : 0 } ); // What: Final Wipe. Why: The snowy scene is revealed. How: This fades the squares out again.


		}

		else timLinObj.call( begSnoFun ); // What: Snowfall Start Call. Why: Without the prank, the card opens straight on the snowy scene. How: This starts the snow at once.



		timLinObj.from( [ ...snoSplObj.chars, ...sigSplObj.chars ], splFroObj, PAU_POS_STR ); // What: Greeting Fade. Why: The greeting and sign-off arrive last. How: After a pause, this fades them in by letter.



		if ( redMotFun() ) timLinObj.progress( 1 ); // What: Reduced Motion Jump. Why: A visitor who asked for less motion should see the finished card at once. How: This jumps the timeline to its end.



		return () => stoSnoFun(); // What: Snowfall Cleanup Return. Why: The snow must stop when the card replays or closes. How: This returns the function that calls the stop function, which GSAP runs as it reverts the timeline.


	}, { scope : carDivRef } ); // What: Hook Options. Why: The timeline is built once, when the card opens, and its cleanup is tied to the card. How: This scopes the context to the card's root, with no dependencies.

	// #endregion Christmas Timeline



	return (


		<div
			ref={ carDivRef }

			className={ cssModObj.chrCarDiv }
		>{ /* What: Christmas Card Div Element. Why: The card fills the screen, its scenes stacked in it. How: This holds the wipe's grid and both scenes. */ }


			{ prkBoo && ( // What: Prank Grid Check. Why: Only the prank wipes between scenes. How: This renders the wipe's grid for the prank alone.


				<div
					ref={ pixConRef }

					className={ cssModObj.pixConDiv }

					style={{
						gridTemplateColumns : `repeat( ${ squColNum }, 1fr )`,
						gridTemplateRows    : `repeat( ${ squRowNum }, 1fr )`
					}}

					aria-hidden='true'
				>{ /* What: Pixel Container Div Element. Why: The wipe covers everything, and it's decoration a screen reader should skip. How: This lays the squares out in the measured columns and rows, each stretching so the grid fills the screen exactly. */ }


					{ Array.from( Array( squColNum * squRowNum ).keys(), ( squIndNum ) => ( // What: Square Map Call. Why: Every cell of the grid needs a square. How: This renders one per cell, keyed by its index.


						<div
							key={ squIndNum }

							className={ cssModObj.pixSquDiv }
						/> // What: Pixel Square Div Element. Why: Each square is one pixel of the wipe. How: This draws a dark cell the timeline fades.


					))}


				</div>


			) }


			{ prkBoo && ( // What: Prank Scene Check. Why: Only the prank opens on the fake hack. How: This renders the hacked scene for the prank alone.


				<section className={ cssModObj.hacSceSec }>{ /* What: Hacked Scene Section Element. Why: The card opens as a fake hacked screen. How: This holds the scrambled heading and the message over the pirate flag. */ }


					<h2
						ref={ hacTitRef }

						className={ cssModObj.hacTitHea }

						aria-label={ HAC_TIT_STR }
					></h2>{ /* What: Hacked Title Heading Element. Why: The hack announces itself. How: This starts empty and scrambles into the heading, its label reading the finished words while the letters are still random. */ }

					<p
						ref={ hacMesRef }

						className={ cssModObj.hacMesPar }
					>{ /* What: Hacked Message Paragraph Element. Why: The joke gives itself away. How: This holds the message's visible copy, which fades in by letter, and its hidden copy, glitching both together. */ }


						<span
							ref={ hacVisRef }

							aria-hidden='true'
						>{ HAC_MES_STR }</span>{ /* What: Hacked Visible Span Element. Why: Split into letters, the message would be read out one letter at a time. How: This shows the copy the timeline fades in, hidden from screen readers. */ }

						<span className={ cssModObj.scrReaSpa }>{ HAC_MES_STR }</span>{ /* What: Screen Reader Span Element. Why: Screen readers should hear the message whole. How: This holds the same message, hidden from view. */ }


					</p>


				</section>


			) }


			<section
				ref={ snoSceRef }

				className={` ${ cssModObj.snoSceSec }   ${ prkBoo ? '' : cssModObj.snoSceSecOpen } `}
			>{ /* What: Snowy Scene Section Element. Why: The real greeting is a snowy cabin with snow falling. How: This holds the greeting, the snowman, and the sign-off, and the snow falls inside it. */ }


				<h1
					ref={ snoTitRef }

					className={ cssModObj.snoTitHea }
				>Merry Christmas{ namParStr ? `, ${ namParStr }` : '' }!</h1>{ /* What: Snowy Title Heading Element. Why: The greeting leads the scene. How: This wishes a Merry Christmas, adding the recipient's name when the link carries one. */ }

				<img
					className={ cssModObj.snoManIma }

					height='217' // What: Intrinsic Height. Why: The page shouldn't shift while the image loads. How: This is the snowman's height in pixels.
					src={ snoManUrl }
					width='180' // What: Intrinsic Width. Why: The page shouldn't shift while the image loads. How: This is the snowman's width in pixels.

					alt='A cartoon snowman with his stick arms raised'
				/>{ /* What: Snowman Image Element. Why: A snowman waves from the corner. How: This shows the snowman, tilted, in the lower left. */ }

				<p className={ cssModObj.snoSigPar }>{ /* What: Snowy Signature Paragraph Element. Why: The card is signed like a real one. How: This signs it in the lower right, its From in the festive font, with a visible copy that fades in by letter and a hidden copy. */ }


					<span
						ref={ snoVisRef }

						aria-hidden='true'
					><span className={ cssModObj.snoFroSpa }>From,</span> { sigNamStr }</span>{ /* What: Snowy Visible Span Element. Why: Split into letters, the sign-off would be read out one letter at a time. How: This shows the copy the timeline fades in, hidden from screen readers. */ }

					<span className={ cssModObj.scrReaSpa }>From, { sigNamStr }</span>{ /* What: Screen Reader Span Element. Why: Screen readers should hear the sign-off whole. How: This holds the same sign-off, hidden from view. */ }


				</p>


			</section>


		</div>


	);


}

// #endregion ChrCarCom

// #endregion Components



// #region Module Init

gsap.registerPlugin( CustomEase, ScrambleTextPlugin, SplitText, useGSAP ); // What: Plugin Registration Call. Why: GSAP's plugins and React hook have to be registered before the timeline uses them. How: This registers all four once, when the card's code loads.

// #endregion Module Init



// #region Exports

export { ChrCarCom }; // What: Named Export. Why: The card catalog loads the card on demand. How: This exports the card's component by name.

// #endregion Exports


