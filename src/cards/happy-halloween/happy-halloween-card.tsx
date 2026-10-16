


// #region Imports

import cssModObj from './happy-halloween-card.module.css'; // What: CSS Module Object. Why: The card's night sky, figures, and lettering are styled in its own module. How: This maps each class name in happy-halloween-card.module.css to its scoped name.


import { cdnPowFun } from '../../utils/rhythm.ts'; // What: Core-Design-Number Power Function. Why: The card's angles, scales, and opacities sit on the scale as powers of the core design number. How: This returns that power.
import { durSecFun } from '../../utils/rhythm.ts'; // What: Duration Second Function. Why: Every duration in the timeline is a step on the duration scale, and GSAP takes seconds. How: This returns a step's length in seconds.
import { gsaEasFun } from '../../ui/gsap-ease.ts'; // What: GSAP Easing Function. Why: GSAP can't read the stylesheet's cubic-bezier curves on its own. How: This registers an easing token as a named GSAP ease.
import { gsap      } from 'gsap';                  // What: GSAP. Why: Every figure on the card floats, flies, or flickers. How: This is the animation library that plays it all.
import { redMotFun } from '../../utils/motion.ts'; // What: Reduce Motion Function. Why: A visitor who asked for less motion should get the still scene at once. How: This reports whether reduced motion is on.
import { rhyPxlFun } from '../../utils/rhythm.ts'; // What: Rhythm Pixel Function. Why: The figures' drops, bobs, and flight paths are rhythm steps. How: This returns a step's size in pixels.
import { SplitText } from 'gsap/SplitText';        // What: Split Text. Why: The greeting drops in one letter at a time. How: This GSAP plugin wraps each letter so it can animate on its own.
import { useGSAP   } from '@gsap/react';           // What: Use GSAP. Why: Each figure's motion has to start after the card renders and stop when it leaves. How: This GSAP hook runs it in a context it reverts on unmount.
import { useRef    } from 'react';                 // What: Use Ref. Why: The motion animates specific elements. How: Each animated element gets a ref.
import { useState  } from 'react';                 // What: Use State. Why: The stars are scattered once, when the card opens. How: This keeps their places.


import type { JSX } from 'react'; // What: JSX. Why: Each component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * happy-halloween-card.tsx = Happy Halloween Card
 *
 * @summary
 * The Happy Halloween card: a purple night with twinkling stars and a floating
 * moon, where the greeting drops in letter by letter and then shimmers between
 * orange and candle yellow above a wish for a frightfully fun night. Three
 * ghosts rise and bob over the hills, bats flap across the sky on random
 * paths, jack-o'-lanterns and candles flicker along the ground, and lightning
 * flashes now and then. Every figure runs its own GSAP motion, built in
 * useGSAP so leaving the card or replaying it stops it all; every duration,
 * distance, angle, scale, and opacity is a step on the design scale, and the
 * curves are the stylesheet's easing tokens. Under reduced motion the card
 * opens on the still scene, with no bats and no lightning. Converted from
 * TechGeek.support's original.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Components
 *  - Module Init
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type ArtRowTyp = { claStr : string, delNum : number }; // What: Art Row Type. Why: Each ghost, jack-o'-lantern, and candle has its own place and its own start. How: This holds the figure's class, which places and sizes it, and its delay in seconds.

// #endregion Types



// #region Constants

const GLO_COL_STR = '#FFE066';          // What: Glow Color String. Why: The greeting shimmers toward the same candle yellow as the wish and the flames. How: The heading's letters tween their color to it.
const PUM_LOB_ARR = [ 26, 34, 42, 50 ]; // What: Pumpkin Lobe Array. Why: A jack-o'-lantern's body is four overlapping lobes. How: This lists each lobe's center across the drawing, in its own coordinates.



/**
 * BAT_DEL_ARR = Bat Delay Array
 *
 * @summary
 * The delay, in seconds, before each of the four bats first flies, so they
 * cross the sky one after another rather than as a flock. Every row is a
 * step on the duration scale.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const BAT_DEL_ARR = [ // What: Bat Delay Array. Why: The bats take off one at a time. How: The card renders one bat per row, passing its delay.


	durSecFun( 'p04' ), // Duration Animation Base Plus 4 ~= 486.1ms
	durSecFun( 'p09' ), // Duration Animation Base Plus 9 ~= 1,983.0ms
	durSecFun( 'p12' ), // Duration Animation Base Plus 12 ~= 4,610.0ms
	durSecFun( 'p13' )  // Duration Animation Base Plus 13 ~= 6,107.0ms


];



/**
 * CAN_ROW_ARR = Candle Row Array
 *
 * @summary
 * The four candles along the ground, each an ArtRowTyp: claStr, the modifier
 * class that places the candle across the hills, and delNum, the delay in
 * seconds before its flame starts to flicker, so the flames never flicker in
 * step. Every delay is a step on the duration scale.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const CAN_ROW_ARR : ArtRowTyp[] = [ // What: Candle Row Array. Why: The candles stand at their own places and flicker out of step. How: The card renders one candle per row.


	{ claStr : cssModObj.canFlaSvgFir, delNum : durSecFun( 'm02' ) }, // Duration Animation Base Minus 2 ~= 89.9ms
	{ claStr : cssModObj.canFlaSvgSec, delNum : durSecFun( 'p04' ) }, // Duration Animation Base Plus 4 ~= 486.1ms
	{ claStr : cssModObj.canFlaSvgThi, delNum : durSecFun( 'p06' ) }, // Duration Animation Base Plus 6 ~= 853.0ms
	{ claStr : cssModObj.canFlaSvgFou, delNum : durSecFun( 'p02' ) }  // Duration Animation Base Plus 2 ~= 277.0ms


];



/**
 * GHO_ROW_ARR = Ghost Row Array
 *
 * @summary
 * The three ghosts over the hills, each an ArtRowTyp: claStr, the modifier
 * class that places and sizes the ghost, and delNum, the delay in seconds
 * before it rises, so they appear one at a time. Every delay is a step on the
 * duration scale.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const GHO_ROW_ARR : ArtRowTyp[] = [ // What: Ghost Row Array. Why: The ghosts rise at their own places, one after another. How: The card renders one ghost per row.


	{ claStr : cssModObj.ghoFloSvgLef, delNum : 0                  }, // What: Left Ghost Row. Why: The left ghost rises first. How: It starts with no delay.
	{ claStr : cssModObj.ghoFloSvgRig, delNum : durSecFun( 'p06' ) }, // Duration Animation Base Plus 6 ~= 853.0ms
	{ claStr : cssModObj.ghoFloSvgMid, delNum : durSecFun( 'p08' ) }  // Duration Animation Base Plus 8 ~= 1,497.0ms


];



/**
 * PUM_ROW_ARR = Pumpkin Row Array
 *
 * @summary
 * The four jack-o'-lanterns along the ground, each an ArtRowTyp: claStr, the
 * modifier class that places and sizes it, and delNum, the delay in seconds
 * before its candle and glow start to flicker, so they never flicker in step.
 * Every delay is a step on the duration scale.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const PUM_ROW_ARR : ArtRowTyp[] = [ // What: Pumpkin Row Array. Why: The jack-o'-lanterns sit at their own places and flicker out of step. How: The card renders one jack-o'-lantern per row.


	{ claStr : cssModObj.pumLanSvgFir, delNum : 0                  }, // What: First Pumpkin Row. Why: The leftmost jack-o'-lantern flickers first. How: It starts with no delay.
	{ claStr : cssModObj.pumLanSvgSec, delNum : durSecFun( 'p02' ) }, // Duration Animation Base Plus 2 ~= 277.0ms
	{ claStr : cssModObj.pumLanSvgThi, delNum : durSecFun( 'p05' ) }, // Duration Animation Base Plus 5 ~= 643.9ms
	{ claStr : cssModObj.pumLanSvgFou, delNum : durSecFun( 'p01' ) }  // Duration Animation Base Plus 1 ~= 209.1ms


];

// #endregion Constants



// #region Helpers

type StaRowTyp = { lefNum : number, sizNum : number, topNum : number }; // What: Star Row Type. Why: Each star sits at its own spot at its own size. How: This holds its left and top offsets, in percent of the sky, and its width, in rem.

// #region staArrFun

/**
 * staArrFun = Star Array Function
 *
 * @summary
 * Scatters the night's thirty stars at random across the whole width of the
 * sky and its upper 55%, so they stay clear of the hills, each a dot between
 * the vertical rhythm's Base Minus 10 and Base Minus 4 steps across. The card
 * calls it once, when it opens, so the stars keep their places for as long
 * as it's open.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns Every star's place and size.
 *
 * @example
 * ```ts
 * staArrFun() // => [ { lefNum : 42.1, sizNum : 0.31, topNum : 12.7 }, ... ]
 * ```
 *
*/

const staArrFun = () : StaRowTyp[] => Array.from( Array( 30 ).keys(), () => ( { // What: Star Array Function. Why: The sky needs thirty stars, scattered differently every time the card opens. How: This builds one row per star, each at a random spot and size.


	lefNum : Math.random() * 100,                                   // What: Left Number. Why: Stars fill the whole width. How: This picks 0% to 100% from the left.
	sizNum : gsap.utils.random( cdnPowFun( -9 ), cdnPowFun( -3 ) ), // What: Size Number. Why: Stars come in different sizes. How: This picks a width between the vertical rhythm's Base Minus 10 and Base Minus 4 steps, in rem. // Vertical Rhythm Base Minus 10 ~= 0.876px, Vertical Rhythm Base Minus 4 ~= 4.732px
	topNum : Math.random() * 55                                     // What: Top Number. Why: Stars stay above the ghosts and hills. How: This picks 0% to 55% from the top, a literal since it places the stars rather than spacing them.


} ) );

// #endregion staArrFun

// #endregion Helpers



// #region Components

type BfcProTyp = { delNum : number }; // What: Bat-Fly-Component Props Type. Why: Each bat takes off at its own time. How: This names its delay, in seconds.

// #region BatFlyCom

/**
 * BatFlyCom = Bat Fly Component
 *
 * @summary
 * One bat flapping across the sky, again and again. After its delay it fades
 * in just past the left edge and flies straight across to just past the
 * right, rising or falling a little on the way, bobbing as it goes, and fades
 * out at the far side; after a pause it flies again at a new height. Its
 * wings flap the whole time, one a beat behind the other. The flight's
 * length and the pause between flights are picked once, at random, so each
 * bat keeps its own pace, while each flight's height is picked anew. Under
 * reduced motion the bat never flies and stays hidden.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.delNum - Delay Number: The delay, in seconds, before the bat
 *                       first flies.
 *
 * @returns The bat.
 *
 * @example
 * ```tsx
 * BatFlyCom({ delNum }) // => <BatFlyCom />
 * ```
 *
*/

function BatFlyCom ( { delNum } : BfcProTyp ) : JSX.Element {


	const batDivRef = useRef< HTMLDivElement >( null ); // What: Bat Div Reference. Why: The bat flies across the sky. How: This holds the div that moves.
	const batSvgRef = useRef< SVGSVGElement >( null );  // What: Bat SVG Reference. Why: The bat bobs as it flies. How: This holds the drawing inside the moving div.
	const lefWinRef = useRef< SVGPathElement >( null ); // What: Left Wing Reference. Why: The wings flap. How: This holds the left wing.
	const rigWinRef = useRef< SVGPathElement >( null ); // What: Right Wing Reference. Why: The wings flap. How: This holds the right wing.



	useGSAP( () => { // What: Bat Motion Hook. Why: The bat flies only after it renders, and stops when the card leaves. How: This builds its flight, bob, and flaps in a GSAP context.


		if ( redMotFun() ) return; // What: Reduced Motion Guard. Why: A visitor who asked for less motion sees no bats. How: This builds nothing, leaving the bat hidden.



		const batWidNum = rhyPxlFun( 'p06' );                                                                              // What: Bat Width Number. Why: The bat starts and ends just past the edges, and drifts up or down by about as much. How: This is the bat's own width, the Vertical Rhythm Base Plus 6 step. // Vertical Rhythm Base Plus 6 ~= 78.751px
		const bobAmpNum = rhyPxlFun( 'p01' );                                                                              // What: Bob Amplitude Number. Why: The bat bobs up and down as it flies. How: This is how far it swings each way. // Vertical Rhythm Base Plus 1 ~= 19.304px
		const bobDurNum = durSecFun( 'p06' );                                                                              // What: Bob Duration Number. Why: Each swing of the bob takes a moment. How: This is one swing's length. // Duration Animation Base Plus 6 ~= 853.0ms
		const decEasStr = gsaEasFun( 'dec' );                                                                              // What: Decelerate Easing String. Why: The bat's fades settle as they finish. How: This registers the decelerate token and keeps its GSAP name.
		const fadDurNum = durSecFun( 'p02' );                                                                              // What: Fade Duration Number. Why: The bat fades in and out at the edges. How: This is each fade's length. // Duration Animation Base Plus 2 ~= 277.0ms
		const fadPosStr = `-=${ durSecFun( 'p03' ) }`;                                                                     // What: Fade Position String. Why: The bat fades out before it reaches the far edge. How: This GSAP position starts the fade before the flight ends. // Duration Animation Base Plus 3 ~= 366.9ms
		const flyDurNum = gsap.utils.random( durSecFun( 'p11' ), durSecFun( 'p13' ) );                                     // What: Fly Duration Number. Why: Each bat crosses at its own pace. How: This picks the flight's length once, between the two steps. // Duration Animation Base Plus 11 ~= 3,480.0ms, Duration Animation Base Plus 13 ~= 6,107.0ms
		const higMaxNum = rhyPxlFun( 'p10' );                                                                              // What: Height Maximum Number. Why: Bats fly in the upper sky. How: This is the lowest a flight starts, from the top. // Vertical Rhythm Base Plus 10 ~= 242.522px
		const higMinNum = rhyPxlFun( 'p04' );                                                                              // What: Height Minimum Number. Why: Bats stay off the very top edge. How: This is the highest a flight starts, from the top. // Vertical Rhythm Base Plus 4 ~= 44.876px
		const inoEasStr = gsaEasFun( 'ino' );                                                                              // What: In-Out Easing String. Why: The bob and the flaps turn smoothly at each end. How: This registers the in-out token and keeps its GSAP name.
		const repDelNum = gsap.utils.random( durSecFun( 'p07' ), durSecFun( 'p11' ) );                                     // What: Repeat Delay Number. Why: Each bat rests for its own while between flights. How: This picks the pause once, between the two steps. // Duration Animation Base Plus 7 ~= 1,130.0ms, Duration Animation Base Plus 11 ~= 3,480.0ms
		const winDurNum = durSecFun( 'bas' );                                                                              // What: Wing Duration Number. Why: The wings beat quickly. How: This is one beat's length. // Duration Animation Base ~= 157.8ms
		const winEacNum = durSecFun( 'm02' );                                                                              // What: Wing Each Number. Why: The right wing beats a moment behind the left. How: This is the offset between them. // Duration Animation Base Minus 2 ~= 89.9ms
		const winScaNum = 1 / cdnPowFun( 4 );                                                                              // What: Wing Scale Number. Why: A flap folds the wing nearly flat. How: This squashes it to about a third of its height. // Core-Design-Number to the Power of 4 Reciprocal ~= 0.325
		const batTimObj = gsap.timeline( { delay : delNum, repeat : -1, repeatDelay : repDelNum, repeatRefresh : true } ); // What: Bat Timeline Object. Why: The bat flies again and again, at a new height each time. How: This repeats the flight forever after its delay, pausing between flights and picking each flight's heights afresh.
		const bobTopNum = bobAmpNum * -1;                                                                                  // What: Bob Top Number. Why: The bob swings above and below the flight path. How: This is the swing's top, the amplitude upward.
		const finXcoFun = () : number => innerWidth + batWidNum;                                                           // What: Finish X-Coordinate Function. Why: The flight ends just past the right edge, wherever that is now. How: This reads the window's width at each flight's start, past it by the bat's width.
		const ranTopFun = () : number => gsap.utils.random( higMinNum, higMaxNum );                                        // What: Random Top Function. Why: Each flight crosses at its own height. How: This picks a height between the two steps.
		const staXcoNum = batWidNum * -1;                                                                                  // What: Start X-Coordinate Number. Why: The flight starts just past the left edge, out of sight. How: This is the bat's width to the left of the edge.
		const ranDriFun = () : string => `+=${ gsap.utils.random( staXcoNum, batWidNum ) }`;                               // What: Random Drift Function. Why: Each flight rises or falls a little. How: This picks a drift up to about a bat's width either way, relative to where the flight starts.


		batTimObj.to( batDivRef.current, { autoAlpha : 1, duration : fadDurNum, ease : decEasStr } ); // What: Fade In Step. Why: The bat appears as it sets off. How: This fades it in just past the left edge.

		batTimObj.fromTo( batDivRef.current, { x : staXcoNum, y : ranTopFun }, { duration : flyDurNum, ease : 'none', x : finXcoFun, y : ranDriFun } ); // What: Flight Step. Why: The bat crosses the sky at a steady pace. How: This flies it from the left edge to past the right, linearly, drifting up or down from its starting height.

		batTimObj.to( batDivRef.current, { autoAlpha : 0, duration : fadDurNum, ease : decEasStr }, fadPosStr ); // What: Fade Out Step. Why: The bat vanishes as it leaves. How: This fades it out just before the flight ends.


		gsap.fromTo( batSvgRef.current, { y : bobTopNum }, { duration : bobDurNum, ease : inoEasStr, repeat : -1, y : bobAmpNum, yoyo : true } ); // What: Bob Tween. Why: A bat's flight dips and rises. How: This swings the drawing up and down forever, independent of the flight.


		gsap.to( [ lefWinRef.current, rigWinRef.current ], { duration : winDurNum, ease : inoEasStr, scaleY : winScaNum, stagger : { each : winEacNum, repeat : -1, yoyo : true }, transformOrigin : 'center bottom' } ); // What: Flap Tween. Why: The wings beat. How: This folds each wing down toward its base and back forever, the right a beat behind the left.


	} );



	return (


		<div
			ref={ batDivRef }

			className={ cssModObj.batFlyDiv }

			aria-hidden='true'
		>{ /* What: Bat Fly Div Element. Why: The bat crosses the sky, and it's decoration a screen reader should skip. How: This holds the drawing and carries the flight. */ }


			<svg
				ref={ batSvgRef }

				className={ cssModObj.batBodSvg }

				viewBox='0 0 80 40'
			>{ /* What: Bat Body SVG Element. Why: The bat is drawn small and crisp at any size. How: This holds the wings, body, ears, and eyes, and carries the bob. */ }


				<path
					ref={ lefWinRef }

					d='M38,20 Q20,0 0,10 Q15,20 38,24 Z'
					fill='#1A0533'
				/>{ /* What: Left Wing Path Element. Why: The bat flaps. How: This draws the left wing, which folds down to flap. */ }

				<path
					ref={ rigWinRef }

					d='M42,20 Q60,0 80,10 Q65,20 42,24 Z'
					fill='#1A0533'
				/>{ /* What: Right Wing Path Element. Why: The bat flaps. How: This draws the right wing, which folds a beat after the left. */ }

				<ellipse
					cx='40'
					cy='22'
					fill='#2D0D52'
					rx='8'
					ry='6'
				/>{ /* What: Bat Body Ellipse Element. Why: The wings meet at a small round body. How: This draws it in a lighter purple than the wings. */ }

				<polygon
					fill='#2D0D52'
					points='35,17 32,10 38,16'
				/>{ /* What: Bat Ear Polygon Element. Why: Pointed ears read as a bat. How: This draws the left ear. */ }

				<polygon
					fill='#2D0D52'
					points='45,17 48,10 42,16'
				/>{ /* What: Bat Ear Polygon Element. Why: Pointed ears read as a bat. How: This draws the right ear. */ }

				<circle
					cx='37'
					cy='21'
					fill='#FF9F00'
					r='2'
				/>{ /* What: Bat Eye Circle Element. Why: Glowing eyes make the bat spooky. How: This draws the left eye in orange. */ }

				<circle
					cx='43'
					cy='21'
					fill='#FF9F00'
					r='2'
				/>{ /* What: Bat Eye Circle Element. Why: Glowing eyes make the bat spooky. How: This draws the right eye in orange. */ }


			</svg>


		</div>


	);


}

// #endregion BatFlyCom



// #region CanFlaCom

/**
 * CanFlaCom = Candle Flame Component
 *
 * @summary
 * One candle standing on the hills, its flame flickering by squashing short
 * and wide and stretching back from its base, over and over, after its delay.
 * Under reduced motion the flame burns still.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.claStr - Class String: The modifier class that places the
 *                       candle, from {@link CAN_ROW_ARR}.
 * @param props.delNum - Delay Number: The delay, in seconds, before the flame
 *                       starts to flicker.
 *
 * @returns The candle.
 *
 * @example
 * ```tsx
 * CanFlaCom({ claStr, delNum }) // => <CanFlaCom />
 * ```
 *
*/

function CanFlaCom ( { claStr, delNum } : ArtRowTyp ) : JSX.Element {


	const flaEllRef = useRef< SVGEllipseElement >( null ); // What: Flame Ellipse Reference. Why: The flame flickers. How: This holds the outer flame.



	useGSAP( () => { // What: Candle Motion Hook. Why: The flame flickers only after it renders, and stops when the card leaves. How: This builds the flicker in a GSAP context.


		if ( redMotFun() ) return; // What: Reduced Motion Guard. Why: A visitor who asked for less motion sees a still flame. How: This builds nothing.



		const decEasStr = gsaEasFun( 'dec' ); // What: Decelerate Easing String. Why: Each flicker settles as it lands. How: This registers the decelerate token and keeps its GSAP name.
		const flaDurNum = durSecFun( 'm02' ); // What: Flame Duration Number. Why: A candle flickers fast. How: This is one flicker's length. // Duration Animation Base Minus 2 ~= 89.9ms
		const flaHeiNum = 1 / cdnPowFun( 2 ); // What: Flame Height Number. Why: A flicker squashes the flame short. How: This scales its height to about half. // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570
		const flaWidNum = cdnPowFun( 1 );     // What: Flame Width Number. Why: A flicker spreads the flame wide. How: This scales its width up by about a third. // Core-Design-Number to the Power of 1 ~= 1.325


		gsap.to( flaEllRef.current, { delay : delNum, duration : flaDurNum, ease : decEasStr, repeat : -1, scaleX : flaWidNum, scaleY : flaHeiNum, transformOrigin : 'center bottom', yoyo : true } ); // What: Flicker Tween. Why: The candle flame dances. How: This squashes and stretches it from its base forever after its delay.


	} );



	return (


		<svg
			className={` ${ cssModObj.canFlaSvg }   ${ claStr } `}

			viewBox='0 0 30 70'

			aria-hidden='true'
		>{ /* What: Candle Flame SVG Element. Why: The candle is decoration a screen reader should skip. How: This draws the candle at its place on the hills. */ }


			<rect
				fill='#E8C46A'
				height='35'
				rx='3'
				width='12'
				x='9'
				y='30'
			/>{ /* What: Candle Wax Rect Element. Why: The candle needs a body. How: This draws the wax column in pale gold. */ }

			<rect
				style={{ opacity : 'var( --cdn-pow-002-rec )' }} // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570

				fill='#F5D98F'
				height='20'
				rx='1'
				width='3'
				x='11'
				y='32'
			/>{ /* What: Candle Shine Rect Element. Why: A thin highlight rounds the wax. How: This draws a lighter stripe down its left side. */ }

			<line
				stroke='#333333'
				strokeWidth='1.5'
				x1='15'
				x2='15'
				y1='30'
				y2='22'
			/>{ /* What: Candle Wick Line Element. Why: The flame burns from a wick. How: This draws a short dark line above the wax. */ }

			<ellipse
				ref={ flaEllRef }

				cx='15'
				cy='16'
				fill={ GLO_COL_STR }
				rx='5'
				ry='9'
			/>{ /* What: Candle Flame Ellipse Element. Why: The candle is lit. How: This draws the outer flame in candle yellow, which the flicker squashes and stretches. */ }

			<ellipse
				style={{ opacity : 'var( --cdn-pow-001-rec )' }} // Core-Design-Number to the Power of 1 Reciprocal ~= 0.755

				cx='15'
				cy='18'
				fill='#FFF5A0'
				rx='3'
				ry='5'
			/>{ /* What: Candle Core Ellipse Element. Why: A flame burns hottest at its heart. How: This draws a paler core inside the flame. */ }

			<path
				d='M9,38 Q7,44 9,48'
				fill='none'
				stroke='#E8C46A'
				strokeLinecap='round'
				strokeWidth='3'
			/>{ /* What: Candle Drip Path Element. Why: Melted wax makes the candle look lit for a while. How: This draws a drip down its left side. */ }


		</svg>


	);


}

// #endregion CanFlaCom



// #region GhoFloCom

/**
 * GhoFloCom = Ghost Float Component
 *
 * @summary
 * One ghost over the hills. After its delay it rises into view, fading in,
 * then bobs up and down forever, while it rocks gently side to side on its
 * own slower beat. Under reduced motion it's simply there, still.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.claStr - Class String: The modifier class that places and
 *                       sizes the ghost, from {@link GHO_ROW_ARR}.
 * @param props.delNum - Delay Number: The delay, in seconds, before the ghost
 *                       rises.
 *
 * @returns The ghost.
 *
 * @example
 * ```tsx
 * GhoFloCom({ claStr, delNum }) // => <GhoFloCom />
 * ```
 *
*/

function GhoFloCom ( { claStr, delNum } : ArtRowTyp ) : JSX.Element {


	const ghoSvgRef = useRef< SVGSVGElement >( null ); // What: Ghost SVG Reference. Why: The ghost rises, bobs, and rocks. How: This holds its drawing.



	useGSAP( () => { // What: Ghost Motion Hook. Why: The ghost moves only after it renders, and stops when the card leaves. How: This builds its rise, bob, and rock in a GSAP context.


		if ( redMotFun() ) return; // What: Reduced Motion Guard. Why: A visitor who asked for less motion sees a still ghost. How: This builds nothing, leaving it in place.



		const bobDurNum = durSecFun( 'p08' );                  // What: Bob Duration Number. Why: A ghost bobs slowly. How: This is each rise or fall's length. // Duration Animation Base Plus 8 ~= 1,497.0ms
		const bobShiNum = rhyPxlFun( 'p01' ) * -1;             // What: Bob Shift Number. Why: The ghost floats up from its place and back. How: This is how far it rises. // Vertical Rhythm Base Plus 1 ~= -19.304px
		const decEasStr = gsaEasFun( 'dec' );                  // What: Decelerate Easing String. Why: The ghost slows as it arrives. How: This registers the decelerate token and keeps its GSAP name.
		const entDurNum = durSecFun( 'p08' );                  // What: Entrance Duration Number. Why: The ghost rises into view slowly. How: This is the rise's length. // Duration Animation Base Plus 8 ~= 1,497.0ms
		const entShiNum = rhyPxlFun( 'p04' );                  // What: Entrance Shift Number. Why: The ghost rises from below its place. How: This is how far below it starts. // Vertical Rhythm Base Plus 4 ~= 44.876px
		const ghoTimObj = gsap.timeline( { delay : delNum } ); // What: Ghost Timeline Object. Why: The bob starts once the ghost has risen. How: This plays the rise, then the bob, after the ghost's delay.
		const inoEasStr = gsaEasFun( 'ino' );                  // What: In-Out Easing String. Why: The bob and rock turn smoothly at each end. How: This registers the in-out token and keeps its GSAP name.
		const rotAngNum = cdnPowFun( 5 );                      // What: Rotation Angle Number. Why: The ghost rocks a little to one side. How: This is the tilt, about 4 degrees. // Core-Design-Number to the Power of 5 ~= 4.080
		const rotDurNum = durSecFun( 'p09' );                  // What: Rotation Duration Number. Why: The rock runs slower than the bob, so the two never line up. How: This is each tilt's length. // Duration Animation Base Plus 9 ~= 1,983.0ms


		ghoTimObj.fromTo( ghoSvgRef.current, { autoAlpha : 0, y : entShiNum }, { autoAlpha : 1, duration : entDurNum, ease : decEasStr, y : 0 } ); // What: Rise Step. Why: The ghost appears over the hills. How: This fades it in as it rises to its place.

		ghoTimObj.to( ghoSvgRef.current, { duration : bobDurNum, ease : inoEasStr, repeat : -1, y : bobShiNum, yoyo : true } ); // What: Bob Step. Why: A ghost hovers. How: This floats it up and back forever once it has risen.


		gsap.to( ghoSvgRef.current, { delay : delNum, duration : rotDurNum, ease : inoEasStr, repeat : -1, rotation : rotAngNum, yoyo : true } ); // What: Rock Tween. Why: The ghost sways as it hovers. How: This tilts it and back forever, starting as it rises.


	} );



	return (


		<svg
			ref={ ghoSvgRef }

			className={` ${ cssModObj.ghoFloSvg }   ${ claStr } `}

			viewBox='0 0 60 80'

			aria-hidden='true'
		>{ /* What: Ghost Float SVG Element. Why: The ghost is decoration a screen reader should skip. How: This draws it at its place over the hills and carries its motion. */ }


			<path
				d='M5,40 Q5,5 30,5 Q55,5 55,40 L55,75 Q47,68 38,75 Q30,68 22,75 Q13,68 5,75 Z'
				fill='#FFFFFF'
			/>{ /* What: Ghost Body Path Element. Why: A ghost is a sheet with a wavy hem. How: This draws the white body. */ }

			<ellipse
				cx='21'
				cy='36'
				fill='#5B2D8E'
				rx='6'
				ry='7'
			/>{ /* What: Ghost Eye Ellipse Element. Why: The ghost looks out at the viewer. How: This draws the left eye in purple. */ }

			<ellipse
				cx='39'
				cy='36'
				fill='#5B2D8E'
				rx='6'
				ry='7'
			/>{ /* What: Ghost Eye Ellipse Element. Why: The ghost looks out at the viewer. How: This draws the right eye in purple. */ }

			<circle
				cx='23'
				cy='34'
				fill='#FFFFFF'
				r='2'
			/>{ /* What: Ghost Glint Circle Element. Why: A glint makes the eyes friendly. How: This draws a white spot in the left eye. */ }

			<circle
				cx='41'
				cy='34'
				fill='#FFFFFF'
				r='2'
			/>{ /* What: Ghost Glint Circle Element. Why: A glint makes the eyes friendly. How: This draws a white spot in the right eye. */ }

			<path
				d='M20,50 Q30,60 40,50'
				fill='none'
				stroke='#5B2D8E'
				strokeLinecap='round'
				strokeWidth='2.5'
			/>{ /* What: Ghost Smile Path Element. Why: The ghost is friendly, not frightening. How: This draws a purple smile. */ }


		</svg>


	);


}

// #endregion GhoFloCom



// #region PumLanCom

/**
 * PumLanCom = Pumpkin Lantern Component
 *
 * @summary
 * One jack-o'-lantern on the hills, a candle burning on top. After its delay
 * the candle's flame flickers, squashing short and wide from its base, and
 * the orange glow behind the pumpkin pulses larger and dimmer, each on its
 * own beat. Under reduced motion both hold still.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.claStr - Class String: The modifier class that places and
 *                       sizes the jack-o'-lantern, from {@link PUM_ROW_ARR}.
 * @param props.delNum - Delay Number: The delay, in seconds, before the flame
 *                       and glow start to flicker.
 *
 * @returns The jack-o'-lantern.
 *
 * @example
 * ```tsx
 * PumLanCom({ claStr, delNum }) // => <PumLanCom />
 * ```
 *
*/

function PumLanCom ( { claStr, delNum } : ArtRowTyp ) : JSX.Element {


	const flaEllRef = useRef< SVGEllipseElement >( null ); // What: Flame Ellipse Reference. Why: The candle on top flickers. How: This holds its outer flame.
	const gloCirRef = useRef< SVGCircleElement >( null );  // What: Glow Circle Reference. Why: The glow behind the pumpkin pulses. How: This holds the glow.



	useGSAP( () => { // What: Pumpkin Motion Hook. Why: The flame and glow flicker only after they render, and stop when the card leaves. How: This builds both in a GSAP context.


		if ( redMotFun() ) return; // What: Reduced Motion Guard. Why: A visitor who asked for less motion sees a still jack-o'-lantern. How: This builds nothing.



		const decEasStr = gsaEasFun( 'dec' ); // What: Decelerate Easing String. Why: Each flicker settles as it lands. How: This registers the decelerate token and keeps its GSAP name.
		const flaDurNum = durSecFun( 'm01' ); // What: Flame Duration Number. Why: A candle flickers fast. How: This is one flicker's length. // Duration Animation Base Minus 1 ~= 119.2ms
		const flaHeiNum = 1 / cdnPowFun( 2 ); // What: Flame Height Number. Why: A flicker squashes the flame short. How: This scales its height to a little over half. // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570
		const flaWidNum = cdnPowFun( 1 );     // What: Flame Width Number. Why: A flicker spreads the flame wide. How: This scales its width up by about a third. // Core-Design-Number to the Power of 1 ~= 1.325
		const gloDurNum = durSecFun( 'bas' ); // What: Glow Duration Number. Why: The glow pulses on a slightly slower beat than the flame. How: This is one pulse's length. // Duration Animation Base ~= 157.8ms
		const gloOpaNum = 1 / cdnPowFun( 5 ); // What: Glow Opacity Number. Why: The glow dims as it spreads. How: This is its dimmest opacity. // Core-Design-Number to the Power of 5 Reciprocal ~= 0.245
		const gloScaNum = cdnPowFun( 1 );     // What: Glow Scale Number. Why: The glow spreads as it pulses. How: This grows it by about a third. // Core-Design-Number to the Power of 1 ~= 1.325


		gsap.to( flaEllRef.current, { delay : delNum, duration : flaDurNum, ease : decEasStr, repeat : -1, scaleX : flaWidNum, scaleY : flaHeiNum, transformOrigin : 'center bottom', yoyo : true } ); // What: Flicker Tween. Why: The candle flame dances. How: This squashes and stretches it from its base forever after its delay.


		gsap.to( gloCirRef.current, { delay : delNum, duration : gloDurNum, ease : decEasStr, opacity : gloOpaNum, repeat : -1, scale : gloScaNum, transformOrigin : 'center center', yoyo : true } ); // What: Pulse Tween. Why: The pumpkin's glow wavers with the candle inside. How: This grows and dims the glow from its center and back forever after its delay.


	} );



	return (


		<svg
			className={` ${ cssModObj.pumLanSvg }   ${ claStr } `}

			viewBox='0 0 80 88'

			aria-hidden='true'
		>{ /* What: Pumpkin Lantern SVG Element. Why: The jack-o'-lantern is decoration a screen reader should skip. How: This draws it at its place on the hills, in a 40-unit drawing scaled by its class. */ }


			<circle
				ref={ gloCirRef }

				style={{ opacity : 'var( --cdn-pow-004-rec )' }} // Core-Design-Number to the Power of 4 Reciprocal ~= 0.325

				cx='40'
				cy='44'
				fill='#FF8C00'
				r='18'
			/>{ /* What: Pumpkin Glow Circle Element. Why: A lit jack-o'-lantern glows. How: This draws a soft orange disc behind the pumpkin, which the pulse grows and dims. */ }

			<rect
				fill='#3D7A1E'
				height='12'
				rx='3'
				width='8'
				x='36'
				y='2'
			/>{ /* What: Pumpkin Stem Rect Element. Why: A pumpkin has a stem. How: This draws a short green stem on top. */ }

			{ PUM_LOB_ARR.map( ( lobXcoNum ) => ( // What: Lobe Map Call. Why: The pumpkin's body is four overlapping lobes. How: This draws one per center, keyed by it.


				<ellipse
					key={ lobXcoNum }

					cx={ lobXcoNum }
					cy='44'
					fill='#E85D04'
					rx='12.8'
					ry='18'
				/> // What: Pumpkin Lobe Ellipse Element. Why: Overlapping lobes give the pumpkin its ribbed shape. How: This draws one orange lobe.


			))}

			<polygon
				fill='#1A0533'
				points='22,38 30,34 38,38'
			/>{ /* What: Pumpkin Eye Polygon Element. Why: A jack-o'-lantern has a carved face. How: This cuts the left eye. */ }

			<polygon
				fill='#1A0533'
				points='42,38 50,34 58,38'
			/>{ /* What: Pumpkin Eye Polygon Element. Why: A jack-o'-lantern has a carved face. How: This cuts the right eye. */ }

			<polygon
				fill='#1A0533'
				points='36,42 44,42 40,46'
			/>{ /* What: Pumpkin Nose Polygon Element. Why: A jack-o'-lantern has a carved face. How: This cuts the nose. */ }

			<path
				d='M 20 50 Q 40 60 60 50'
				fill='none'
				stroke='#1A0533'
				strokeLinecap='round'
				strokeWidth='3'
			/>{ /* What: Pumpkin Smile Path Element. Why: A jack-o'-lantern grins. How: This carves a wide smile. */ }

			<ellipse
				ref={ flaEllRef }

				cx='40'
				cy='7.2'
				fill={ GLO_COL_STR }
				rx='5'
				ry='9'
			/>{ /* What: Pumpkin Flame Ellipse Element. Why: A candle burns on top. How: This draws its outer flame in candle yellow, which the flicker squashes and stretches. */ }

			<ellipse
				style={{ opacity : 'var( --cdn-pow-001-rec )' }} // Core-Design-Number to the Power of 1 Reciprocal ~= 0.755

				cx='40'
				cy='8.8'
				fill='#FFF5A0'
				rx='3'
				ry='5'
			/>{ /* What: Pumpkin Core Ellipse Element. Why: A flame burns hottest at its heart. How: This draws a paler core inside the flame. */ }


		</svg>


	);


}

// #endregion PumLanCom



// #region HalCarCom

/**
 * HalCarCom = Halloween Card Component
 *
 * @summary
 * The Happy Halloween card. It renders the night scene, its stars scattered
 * once when it opens, and plays the motion that belongs to the scene as a
 * whole: the greeting dropping in, its shimmer, the moon's float, the stars'
 * twinkle, and the lightning, all built in useGSAP so leaving the card or
 * replaying it reverts every tween and the letter split and cancels the next
 * flash. The ghosts, bats, jack-o'-lanterns, and candles run their own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The card's scene.
 *
 * @example
 * ```tsx
 * HalCarCom() // => <HalCarCom />
 * ```
 *
*/

function HalCarCom () : JSX.Element {


	const carDivRef = useRef< HTMLDivElement >( null );     // What: Card Div Reference. Why: The motion and its cleanup are scoped to the card. How: This holds the card's root.
	const ligFlaRef = useRef< HTMLDivElement >( null );     // What: Lightning Flash Reference. Why: The sky flashes. How: This holds the overlay.
	const mooFloRef = useRef< SVGSVGElement >( null );      // What: Moon Float Reference. Why: The moon floats. How: This holds its drawing.
	const staSkyRef = useRef< HTMLDivElement >( null );     // What: Star Sky Reference. Why: The stars twinkle. How: This holds their container.
	const titHalRef = useRef< HTMLHeadingElement >( null ); // What: Title Halloween Reference. Why: The greeting drops in by letter and shimmers. How: This holds the heading.
	const titShaRef = useRef< HTMLSpanElement >( null );    // What: Title Shadow Reference. Why: The greeting's glow and shadow fade in once its letters land. How: This holds the shadow copy behind the heading.

	const [ staRowArr ] = useState( staArrFun ); // What: Star Row Array. Why: The stars are scattered once, when the card opens, so they never jump on a later render. How: This runs staArrFun on the first render and keeps its rows.



	// #region Halloween Timeline

	/**
	 * happy-halloween-card.tsx = Halloween Timeline
	 *
	 * @summary
	 * The scene's own motion, started together when the card opens. The
	 * greeting's letters drop in one after another from above, tilted either
	 * way, and spring upright into place, and once the last has landed the
	 * greeting's glow and shadow fade in under them; from about a second and
	 * a half in, the letters shimmer to candle yellow and back in a wave that
	 * never stops. The
	 * moon floats up and down, each star twinkles at its own pace, and the
	 * sky flashes with a double strike of lightning after a few seconds and
	 * then every few seconds more, at random. Under reduced motion none of it
	 * starts: the greeting stands whole, and the sky stays dark.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	*/

	useGSAP( () => { // What: Halloween Timeline Hook. Why: The scene's motion has to start after the card renders and stop when it leaves. How: This builds it in a GSAP context, returning the lightning's cleanup.


		if ( redMotFun() ) return; // What: Reduced Motion Guard. Why: A visitor who asked for less motion should see the still scene. How: This builds nothing.



		const bouEasStr = gsaEasFun( 'bou' ); // What: Bounce Easing String. Why: The letters spring into place. How: This registers the bounce token and keeps its GSAP name.
		const decEasStr = gsaEasFun( 'dec' ); // What: Decelerate Easing String. Why: Each flash and the shadow's fade settle as they finish. How: This registers the decelerate token and keeps its GSAP name.
		const inoEasStr = gsaEasFun( 'ino' ); // What: In-Out Easing String. Why: The shimmer, float, and twinkle turn smoothly at each end. How: This registers the in-out token and keeps its GSAP name.



		// #region Title Animation

		const gloDelNum = durSecFun( 'p08' );                                               // What: Glow Delay Number. Why: The shimmer starts as the last letters land. How: This is its delay. // Duration Animation Base Plus 8 ~= 1,497.0ms
		const gloDurNum = durSecFun( 'p07' );                                               // What: Glow Duration Number. Why: Each letter shimmers slowly. How: This is each change's length. // Duration Animation Base Plus 7 ~= 1,130.0ms
		const gloEacNum = durSecFun( 'm02' );                                               // What: Glow Each Number. Why: The shimmer runs along the letters as a wave. How: This is the offset from one letter to the next. // Duration Animation Base Minus 2 ~= 89.9ms
		const titAngNum = cdnPowFun( 9 );                                                   // What: Title Angle Number. Why: The letters fall tilted. How: This is the tilt, about 12.6 degrees. // Core-Design-Number to the Power of 9 ~= 12.563
		const titDelNum = durSecFun( 'p03' );                                               // What: Title Delay Number. Why: The scene settles a moment before the greeting arrives. How: This is the drop's delay. // Duration Animation Base Plus 3 ~= 366.9ms
		const titDurNum = durSecFun( 'p05' );                                               // What: Title Duration Number. Why: Each letter drops quickly. How: This is each drop's length. // Duration Animation Base Plus 5 ~= 643.9ms
		const titShiNum = rhyPxlFun( 'p05' ) * -1;                                          // What: Title Shift Number. Why: The letters drop from above. How: This is how far above their places they start. // Vertical Rhythm Base Plus 5 ~= -59.447px
		const titSplObj = SplitText.create( titHalRef.current, { type : 'words, chars' } ); // What: Title Split Object. Why: The greeting drops in one letter at a time. How: This wraps its words and letters, labeling the heading with its full text.
		const titStaNum = durSecFun( 'm03' );                                               // What: Title Stagger Number. Why: The letters drop one after another. How: This is the offset between each letter's start. // Duration Animation Base Minus 3 ~= 67.9ms
		const gloStaObj = { each : gloEacNum, repeat : -1, yoyo : true };                   // What: Glow Stagger Object. Why: Each letter shimmers forever on its own offset. How: This repeats each letter's change back and forth, one offset after the last.
		const titRotFun = gsap.utils.wrap( [ titAngNum * -1, titAngNum ] );                 // What: Title Rotation Function. Why: The letters tilt alternately left and right. How: This hands each letter the next tilt in turn.
		const titTimObj = gsap.timeline( { delay : titDelNum } );                           // What: Title Timeline Object. Why: The glow and shadow wait until every letter has landed. How: This plays the drop, then the shadow copy's fade.


		SplitText.create( titShaRef.current, { aria : 'none', type : 'words, chars' } ); // What: Shadow Split Call. Why: The shadow copy has to line up with the split heading letter for letter, and splitting drops the kerning between letters. How: This wraps the copy's words and letters the same way, adding no labels, since the copy is hidden from screen readers.


		titTimObj.from( titSplObj.chars, { autoAlpha : 0, duration : titDurNum, ease : bouEasStr, rotation : titRotFun, stagger : titStaNum, y : titShiNum } ); // What: Drop Step. Why: The greeting arrives with a playful spring. How: This drops each letter in from above, tilted, fading in and springing upright.

		titTimObj.from( titShaRef.current, { autoAlpha : 0, duration : titDurNum, ease : decEasStr } ); // What: Shadow Step. Why: A glow drawn around falling letters would trail behind them, and redrawing it every frame is too slow for WebKit. How: Once every letter has landed, this fades in the still shadow copy, whose glow is drawn once.


		gsap.to( titSplObj.chars, { color : GLO_COL_STR, delay : gloDelNum, duration : gloDurNum, ease : inoEasStr, stagger : gloStaObj } ); // What: Shimmer Tween. Why: The greeting flickers like candlelight. How: This shifts each letter to candle yellow and back forever, in a wave.

		// #endregion Title Animation



		// #region Moon Float

		const mooDurNum = durSecFun( 'p11' );      // What: Moon Duration Number. Why: The moon drifts slowly. How: This is each rise or fall's length. // Duration Animation Base Plus 11 ~= 3,480.0ms
		const mooShiNum = rhyPxlFun( 'm01' ) * -1; // What: Moon Shift Number. Why: The moon floats up from its place and back. How: This is how far it rises. // Vertical Rhythm Base Minus 1 = -11px


		gsap.to( mooFloRef.current, { duration : mooDurNum, ease : inoEasStr, repeat : -1, y : mooShiNum, yoyo : true } ); // What: Float Tween. Why: The moon drifts in the sky. How: This floats it up and back forever.

		// #endregion Moon Float



		// #region Star Twinkle

		const twiMaxNum = durSecFun( 'p10' ); // What: Twinkle Maximum Number. Why: Stars twinkle at their own paces and start at their own times. How: This is the longest twinkle and the latest start. // Duration Animation Base Plus 10 ~= 2,627.0ms
		const twiMinNum = durSecFun( 'p06' ); // What: Twinkle Minimum Number. Why: Even the quickest star twinkles gently. How: This is the shortest twinkle. // Duration Animation Base Plus 6 ~= 853.0ms
		const twiOpaNum = 1 / cdnPowFun( 8 ); // What: Twinkle Opacity Number. Why: A twinkling star nearly vanishes. How: This is its dimmest opacity. // Core-Design-Number to the Power of 8 Reciprocal ~= 0.105


		for ( const staDivEle of Array.from( staSkyRef.current!.children ) ) { // What: Star Twinkle Loop. Why: Every star twinkles. How: This starts each one's twinkle at a random pace and time. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.


			const staDelNum = gsap.utils.random( 0, twiMaxNum );         // What: Star Delay Number. Why: The stars shouldn't twinkle in step. How: This picks when this one starts.
			const staDurNum = gsap.utils.random( twiMinNum, twiMaxNum ); // What: Star Duration Number. Why: Each star twinkles at its own pace. How: This picks how long each dimming takes.


			gsap.to( staDivEle, { delay : staDelNum, duration : staDurNum, ease : inoEasStr, opacity : twiOpaNum, repeat : -1, yoyo : true } ); // What: Twinkle Tween. Why: The stars twinkle. How: This dims the star and brightens it back forever.


		}

		// #endregion Star Twinkle



		// #region Lightning Flash

		const gapMaxNum = durSecFun( 'p15' );                                                  // What: Gap Maximum Number. Why: Lightning strikes at random. How: This is the longest wait between strikes. // Duration Animation Base Plus 15 ~= 10,717.0ms
		const gapMinNum = durSecFun( 'p11' );                                                  // What: Gap Minimum Number. Why: Lightning shouldn't strike too often. How: This is the shortest wait between strikes. // Duration Animation Base Plus 11 ~= 3,480.0ms
		const ligBriNum = 1 / cdnPowFun( 2 );                                                  // What: Lightning Bright Number. Why: The first strike lights the sky brightly. How: This is its opacity. // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570
		const ligDimNum = 1 / cdnPowFun( 4 );                                                  // What: Lightning Dim Number. Why: The second strike is fainter. How: This is its opacity. // Core-Design-Number to the Power of 4 Reciprocal ~= 0.325
		const ligEndNum = durSecFun( 'm01' );                                                  // What: Lightning End Number. Why: The second strike lingers a little as it fades. How: This is the last fade's length. // Duration Animation Base Minus 1 ~= 119.2ms
		const ligFadNum = durSecFun( 'm03' );                                                  // What: Lightning Fade Number. Why: The first strike fades fast. How: This is the first fade's length. // Duration Animation Base Minus 3 ~= 67.9ms
		const ligFirNum = durSecFun( 'm04' );                                                  // What: Lightning First Number. Why: A strike flares in an instant. How: This is the first flare's length. // Duration Animation Base Minus 4 ~= 51.3ms
		const ligSecNum = durSecFun( 'm05' );                                                  // What: Lightning Second Number. Why: The second strike flares even faster. How: This is the second flare's length. // Duration Animation Base Minus 5 ~= 38.7ms
		const ligStaNum = durSecFun( 'p10' );                                                  // What: Lightning Start Number. Why: The first strike waits until the greeting has landed. How: This is its delay. // Duration Animation Base Plus 10 ~= 2,627.0ms
		const ligTimObj = gsap.timeline( { defaults : { ease : decEasStr }, paused : true } ); // What: Lightning Timeline Object. Why: Every strike flashes the same way. How: This holds one double flash, paused until a strike plays it.

		let ligDelObj : gsap.core.Tween | null = null; // What: Lightning Delay Object. Why: The cleanup has to cancel the next strike. How: This holds the pending delayed call.


		ligTimObj.to( ligFlaRef.current, { duration : ligFirNum, opacity : ligBriNum } ); // What: First Flare Step. Why: Lightning strikes. How: This flashes the sky brightly.
		ligTimObj.to( ligFlaRef.current, { duration : ligFadNum, opacity : 0         } ); // What: First Fade Step. Why: The flash vanishes. How: This fades it out.
		ligTimObj.to( ligFlaRef.current, { duration : ligSecNum, opacity : ligDimNum } ); // What: Second Flare Step. Why: Lightning often strikes twice. How: This flashes the sky again, fainter.
		ligTimObj.to( ligFlaRef.current, { duration : ligEndNum, opacity : 0         } ); // What: Last Fade Step. Why: The sky goes dark again. How: This fades the flash out.



		// #region flaLigFun

		/**
		 * flaLigFun = Flash Lightning Function
		 *
		 * @summary
		 * Plays one strike and schedules the next at a random wait between
		 * gapMinNum and gapMaxNum, keeping the pending call in ligDelObj so
		 * the cleanup can cancel it. The delayed calls run on GSAP's ticker,
		 * so a background tab doesn't pile strikes up.
		 *
		 * @author z4nta0 <https://github.com/z4nta0>
		 *
		 * @param void - This function takes no parameters.
		 *
		 * @returns This function does not return anything.
		 *
		 * @example
		 * ```ts
		 * flaLigFun() // => void
		 * ```
		 *
		*/

		const flaLigFun = () : void => { // What: Flash Lightning Function. Why: Lightning strikes again and again, at random. How: This plays a strike and schedules the next.


			ligTimObj.restart(); // What: Strike Play Call. Why: The sky flashes. How: This plays the double flash from its start.


			ligDelObj = gsap.delayedCall( gsap.utils.random( gapMinNum, gapMaxNum ), flaLigFun ); // What: Next Strike Assignment. Why: Lightning strikes again later. How: This schedules the next strike after a random wait and keeps the call.


		};

		// #endregion flaLigFun



		ligDelObj = gsap.delayedCall( ligStaNum, flaLigFun ); // What: First Strike Assignment. Why: The first strike comes a few seconds in. How: This schedules it and keeps the call.

		// #endregion Lightning Flash



		return () => ligDelObj?.kill(); // What: Lightning Cleanup Return. Why: No strike should be scheduled after the card replays or closes. How: This returns the function that cancels the pending call, which GSAP runs as it reverts the context.


	}, { scope : carDivRef } ); // What: Hook Options. Why: The motion is built once, when the card opens, and its cleanup is tied to the card. How: This scopes the context to the card's root, with no dependencies.

	// #endregion Halloween Timeline



	return (


		<div
			ref={ carDivRef }

			className={ cssModObj.halCarDiv }
		>{ /* What: Halloween Card Div Element. Why: The card fills the screen with a night scene. How: This holds the sky, the figures, the greeting, and the lightning, layered in the order they're drawn. */ }


			<div
				ref={ staSkyRef }

				className={ cssModObj.staSkyDiv }

				aria-hidden='true'
			>{ /* What: Star Sky Div Element. Why: The stars are decoration a screen reader should skip. How: This holds the stars across the whole card. */ }


				{ staRowArr.map( ( staRowObj, staIndNum ) => ( // What: Star Map Call. Why: Every star needs an element. How: This renders one per row, keyed by its index.


					<div
						key={ staIndNum }

						className={ cssModObj.staTwiDiv }

						style={{
							height : `${ staRowObj.sizNum }rem`,
							left   : `${ staRowObj.lefNum }%`,
							top    : `${ staRowObj.topNum }%`,
							width  : `${ staRowObj.sizNum }rem`
						}}
					/> // What: Star Twinkle Div Element. Why: Each star is a small white dot. How: This places and sizes it from its row.


				))}


			</div>



			<svg
				ref={ mooFloRef }

				className={ cssModObj.mooFloSvg }

				viewBox='0 0 120 120'

				aria-hidden='true'
			>{ /* What: Moon Float SVG Element. Why: A glowing moon hangs in the corner, and it's decoration a screen reader should skip. How: This draws it in the top right and carries its float. */ }


				<defs>{ /* What: Moon Definitions Element. Why: The moon's fill and glow are defined once. How: This holds the gradient and the filter. */ }


					<radialGradient
						id='mooFilRad'

						cx='40%'
						cy='40%'
					>{ /* What: Moon Fill Radialgradient Element. Why: The moon is lit from its upper left. How: This shades from pale yellow there to gold at the rim. */ }


						<stop
							offset='0%'
							stopColor='#FFF9C4'
						/>{ /* What: Moon Light Stop Element. Why: The lit side is palest. How: This starts the gradient in pale yellow. */ }

						<stop
							offset='100%'
							stopColor='#F0C040'
						/>{ /* What: Moon Rim Stop Element. Why: The rim is deepest. How: This ends the gradient in gold. */ }


					</radialGradient>


					<filter id='mooGloFil'>{ /* What: Moon Glow Filter Element. Why: The moon's halo is soft. How: This blurs its halo circle and lays the sharp circle back over the blur. */ }


						<feGaussianBlur
							result='blur'
							stdDeviation='6'
						/>{ /* What: Moon Glow Blur Element. Why: A halo has no hard edge. How: This blurs the halo circle. */ }

						<feMerge>{ /* What: Moon Glow Merge Element. Why: The halo keeps a core under its blur. How: This stacks the blur and the circle itself. */ }


							<feMergeNode in='blur' />{ /* What: Moon Blur Node Element. Why: The blur sits underneath. How: This draws it first. */ }

							<feMergeNode in='SourceGraphic' />{ /* What: Moon Source Node Element. Why: The circle sits on top. How: This draws it over the blur. */ }


						</feMerge>


					</filter>


				</defs>



				<circle
					style={{ opacity : 'var( --cdn-pow-006-rec )' }} // Core-Design-Number to the Power of 6 Reciprocal ~= 0.185

					cx='60'
					cy='60'
					fill='#F0C040'
					filter='url(#mooGloFil)'
					r='44'
				/>{ /* What: Moon Halo Circle Element. Why: The moon glows against the night. How: This draws a faint, blurred gold disc a little larger than the moon. */ }

				<circle
					cx='60'
					cy='60'
					fill='url(#mooFilRad)'
					r='38'
				/>{ /* What: Moon Face Circle Element. Why: The moon is a lit disc. How: This draws it with the shaded fill. */ }

				<circle
					style={{ opacity : 'var( --cdn-pow-002-rec )' }} // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570

					cx='48'
					cy='50'
					fill='#E6B820'
					r='6'
				/>{ /* What: Moon Crater Circle Element. Why: Craters make the disc read as the moon. How: This draws the largest crater, upper left. */ }

				<circle
					style={{ opacity : 'var( --cdn-pow-003-rec )' }} // Core-Design-Number to the Power of 3 Reciprocal ~= 0.430

					cx='70'
					cy='70'
					fill='#E6B820'
					r='4'
				/>{ /* What: Moon Crater Circle Element. Why: Craters make the disc read as the moon. How: This draws a smaller crater, lower right. */ }

				<circle
					style={{ opacity : 'var( --cdn-pow-004-rec )' }} // Core-Design-Number to the Power of 4 Reciprocal ~= 0.325

					cx='74'
					cy='44'
					fill='#E6B820'
					r='3'
				/>{ /* What: Moon Crater Circle Element. Why: Craters make the disc read as the moon. How: This draws the faintest crater, upper right. */ }


			</svg>



			{ GHO_ROW_ARR.map( ( ghoRowObj ) => ( // What: Ghost Map Call. Why: Three ghosts haunt the hills. How: This renders one per row, keyed by its class.


				<GhoFloCom
					key={ ghoRowObj.claStr }

					claStr={ ghoRowObj.claStr }
					delNum={ ghoRowObj.delNum }
				/> // What: Ghost Float Component. Why: Each ghost rises and hovers. How: This draws one at its place, rising after its delay.


			))}



			<svg
				className={ cssModObj.groHilSvg }

				preserveAspectRatio='none'
				viewBox='0 0 1440 120'

				aria-hidden='true'
			>{ /* What: Ground Hill SVG Element. Why: Rolling hills ground the scene, and they're decoration a screen reader should skip. How: This stretches the hills across the card's bottom edge. */ }


				<path
					d='M0,60 Q200,20 400,55 Q600,90 800,50 Q1000,10 1200,55 Q1350,80 1440,50 L1440,120 L0,120 Z'
					fill='#0F0020'
				/>{ /* What: Ground Hill Path Element. Why: The hills are a dark silhouette. How: This draws their wavy top and fills below it. */ }


			</svg>



			{ PUM_ROW_ARR.map( ( pumRowObj ) => ( // What: Pumpkin Map Call. Why: Jack-o'-lanterns line the hills. How: This renders one per row, keyed by its class.


				<PumLanCom
					key={ pumRowObj.claStr }

					claStr={ pumRowObj.claStr }
					delNum={ pumRowObj.delNum }
				/> // What: Pumpkin Lantern Component. Why: Each jack-o'-lantern flickers. How: This draws one at its place, flickering after its delay.


			))}



			{ CAN_ROW_ARR.map( ( canRowObj ) => ( // What: Candle Map Call. Why: Candles stand among the pumpkins. How: This renders one per row, keyed by its class.


				<CanFlaCom
					key={ canRowObj.claStr }

					claStr={ canRowObj.claStr }
					delNum={ canRowObj.delNum }
				/> // What: Candle Flame Component. Why: Each candle flickers. How: This draws one at its place, flickering after its delay.


			))}



			<div className={ cssModObj.titCenDiv }>{ /* What: Title Center Div Element. Why: The greeting sits in the middle of the night. How: This centers the heading and the wish over the scene. */ }


				<div className={ cssModObj.titStaDiv }>{ /* What: Title Stack Div Element. Why: The greeting's glow and shadow are a still copy sitting exactly under its letters. How: This stacks the copy and the heading in one grid cell. */ }


					<span
						ref={ titShaRef }

						className={ cssModObj.titShaSpa }

						aria-hidden='true'
					><span className={ cssModObj.titLinSpa }>Happy</span>{ /* What: Title Line Span Element. Why: The copy matches the heading's two lines. How: This sets Happy on the first. */ } <span className={ cssModObj.titLinSpa }>Halloween!</span>{ /* What: Title Line Span Element. Why: The copy matches the heading's two lines. How: This sets Halloween on the second. */ }</span>{ /* What: Title Shadow Span Element. Why: The greeting glows and casts a dark shadow, and a filter on the heading itself would be redrawn every frame its letters move or shimmer. How: This holds a copy of the greeting under the heading, hidden from screen readers, whose glow and shadow are drawn once. */ }

					<h1
						ref={ titHalRef }

						className={ cssModObj.titHalHea }
					><span className={ cssModObj.titLinSpa }>Happy</span>{ /* What: Title Line Span Element. Why: The greeting reads as two lines. How: This sets Happy on the first. */ } <span className={ cssModObj.titLinSpa }>Halloween!</span>{ /* What: Title Line Span Element. Why: The greeting reads as two lines. How: This sets Halloween on the second. */ }</h1>{ /* What: Title Halloween Heading Element. Why: The greeting leads the card. How: This wishes a Happy Halloween, its letters dropping in and shimmering. */ }


				</div>


				<p className={ cssModObj.wisMesPar }><span aria-hidden='true'>👻</span> Wishing you a frightfully fun night! <span aria-hidden='true'>🎃</span></p>{ /* What: Wish Message Paragraph Element. Why: The card adds a wish under the greeting. How: This shows it between a ghost and a jack-o'-lantern, which screen readers skip. */ }


			</div>



			{ BAT_DEL_ARR.map( ( batDelNum, batIndNum ) => ( // What: Bat Map Call. Why: Bats cross the sky one after another. How: This renders one per delay, keyed by its index.


				<BatFlyCom
					key={ batIndNum }

					delNum={ batDelNum }
				/> // What: Bat Fly Component. Why: Each bat flaps across the sky. How: This draws one that takes off after its delay.


			))}



			<div
				ref={ ligFlaRef }

				className={ cssModObj.ligFlaDiv }

				aria-hidden='true'
			/>{ /* What: Lightning Flash Div Element. Why: Lightning lights up the whole scene, and it's decoration a screen reader should skip. How: This covers the card in pale blue, transparent until a strike flashes it. */ }


		</div>


	);


}

// #endregion HalCarCom

// #endregion Components



// #region Module Init

gsap.registerPlugin( SplitText, useGSAP ); // What: Plugin Registration Call. Why: GSAP's plugin and React hook have to be registered before the motion uses them. How: This registers both once, when the card's code loads.

// #endregion Module Init



// #region Exports

export { HalCarCom }; // What: Named Export. Why: The card catalog loads the card on demand. How: This exports the card's component by name.

// #endregion Exports


