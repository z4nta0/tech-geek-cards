


// #region Imports

import cssModObj from './fourth-of-july-card.module.css'; // What: CSS Module Object. Why: The card's sky, fireworks, flag, and lettering are styled in its own module. How: This maps each class name in fourth-of-july-card.module.css to its scoped name.


import { cdnPowFun } from '../../utils/rhythm.ts'; // What: Core-Design-Number Power Function. Why: The headline's starting scale, the stars' sizes and brightness, and the sparks' spread and shrink sit on the scale as powers of the core design number. How: This returns that power.
import { durMilFun } from '../../utils/rhythm.ts'; // What: Duration Millisecond Function. Why: Every duration and delay in the card is a step on the duration scale. How: This returns a step's length in milliseconds.
import { durSecFun } from '../../utils/rhythm.ts'; // What: Duration Second Function. Why: Every duration in the timeline is a step on the duration scale, and GSAP takes seconds. How: This returns a step's length in seconds.
import { gsaEasFun } from '../../ui/gsap-ease.ts'; // What: GSAP Easing Function. Why: GSAP can't read the stylesheet's cubic-bezier curves on its own. How: This registers an easing token as a named GSAP ease.
import { gsap      } from 'gsap';                  // What: GSAP. Why: The card's entrance, the stars' twinkle, and every firework are GSAP tweens. How: This is the animation library that builds and plays them.
import { ranValFun } from '../../utils/random.ts'; // What: Random Value Function. Why: Pieces are sized, paced, and placed at random within set bounds. How: This returns a random number between two bounds.
import { redMotFun } from '../../utils/motion.ts'; // What: Reduce Motion Function. Why: A visitor who asked for less motion should get the finished card at once, with no fireworks. How: This reports whether reduced motion is on.
import { rhyPxlFun } from '../../utils/rhythm.ts'; // What: Rhythm Pixel Function. Why: The entrance's slides and the sparks' flight are spacing steps. How: This returns a step's size in pixels.
import { useGSAP   } from '@gsap/react';           // What: Use GSAP. Why: The entrance and the fireworks have to start after the card renders and stop when it leaves. How: This GSAP hook runs them in a context it reverts on unmount.
import { useRef    } from 'react';                 // What: Use Ref. Why: The timeline animates specific elements, and the fireworks burst in the sky. How: Each of them gets a ref.
import { useState  } from 'react';                 // What: Use State. Why: The stars are scattered once, when the card opens. How: This keeps the scattered stars across renders.


import type { JSX } from 'react'; // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * fourth-of-july-card.tsx = Fourth Of July Card
 *
 * @summary
 * The Happy 4th of July card: a night sky fading from navy to a dark red
 * glow, scattered with twinkling stars and fireworks bursting at random, over
 * an American flag that slides in, the Happy 4th of July headline springing
 * down into place, and a short wish that rises in below it, between a row of
 * gold stars and a row of red sparkles. Every duration, distance, size, and
 * scale is a step on the design scale, and the curves are the stylesheet's
 * easing tokens. The fireworks are a small pool of elements the card
 * renders once and launches in turn, each burst its own GSAP timeline, and
 * they stop when the card replays or closes. Under reduced motion the card
 * opens finished, with still stars and no fireworks. Converted from
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

type StaRecTyp = { // What: Star Record Type. Why: Each star keeps its own place, size, and brightness. How: This holds the values its span is drawn with.


	lefNum : number, // What: Left Number. Why: Stars are scattered across the sky. How: This holds its distance from the left edge, in percent.
	opaNum : number, // What: Opacity Number. Why: Some stars shine brighter than others. How: This holds its starting opacity.
	sizNum : number, // What: Size Number. Why: Stars come in different sizes. How: This holds its width and height, in rem.
	topNum : number  // What: Top Number. Why: Stars fill the upper part of the sky. How: This holds its distance from the top edge, in percent.


};

// #endregion Types



// #region Constants

const COL_VAR_ARR = [ 'var( --foj-red-col )', 'var( --foj-whi-col )', 'var( --foj-blu-col )', 'var( --foj-gol-col )', 'var( --foj-cor-col )', 'var( --foj-ice-col )' ]; // What: Color Variable Array. Why: The fireworks burst in the flag's colors and gold, which the card's stylesheet defines. How: Each firework and each spark draws one of these token references at random, which its custom property resolves against the card's root. // Fourth-Of-July Red Color = #FF4444, Fourth-Of-July White Color = #FFFFFF, Fourth-Of-July Blue Color = #4488FF, Fourth-Of-July Gold Color = #FFD700, Fourth-Of-July Coral Color = #FF6B6B, Fourth-Of-July Ice Color = #88CCFF



const FIR_POO_NUM = Math.ceil( ( durMilFun( 'p02' ) + durMilFun( 'p08' ) ) / durMilFun( 'p06' ) ); // What: Firework Pool Number. Why: The fireworks reuse a fixed pool of wraps, and a wrap mustn't be reused while its last burst still plays. How: This is how many bursts overlap at most, a firework's longest life, the particle delay plus the longest flight, over the launch interval, rounded up, which is 3. // Duration Animation Base Plus 2 ~= 277.0ms, Duration Animation Base Plus 8 ~= 1,497.0ms, Duration Animation Base Plus 6 ~= 853.0ms
const PAR_COU_NUM = 14;                                                                            // What: Particle Count Number. Why: Each firework bursts into a ring of sparks. How: This is how many sparks it throws.
const STA_COU_NUM = 80;                                                                            // What: Star Count Number. Why: The sky should feel full of stars without crowding the lettering. How: This is how many are scattered across it.



const FLA_HEI_NUM = 100;               // What: Flag Height Number. Why: The flag is drawn in its own drawing space. How: This is its height in that space.
const FLA_WID_NUM = 190;               // What: Flag Width Number. Why: The flag keeps the real flag's 1.9 to 1 proportions. How: This is its width in that space.
const CAN_WID_NUM = FLA_WID_NUM * 0.4; // What: Canton Width Number. Why: The blue canton spans two fifths of the flag. How: This is its width in the flag's drawing space.
const STR_HEI_NUM = FLA_HEI_NUM / 13;  // What: Stripe Height Number. Why: The flag has thirteen stripes. How: This is one stripe's height in the flag's drawing space.
const CAN_HEI_NUM = STR_HEI_NUM * 7;   // What: Canton Height Number. Why: The canton covers the top seven stripes. How: This is its height in the flag's drawing space.



const FLA_STR_STR = Array.from( Array( 6 ).keys(), ( strIndNum ) => `M0 ${ ( ( strIndNum * 2 + 1 ) * STR_HEI_NUM ).toFixed( 3 ) }h${ FLA_WID_NUM }v${ STR_HEI_NUM.toFixed( 3 ) }H0z` ).join( '' ); // What: Flag Stripes String. Why: The six white stripes lie between the seven red ones. How: This joins one rectangle per white stripe, every other stripe from the second, into a single path.

// #endregion Constants



// #region Helpers

const ranColFun = () : string => COL_VAR_ARR[ Math.floor( Math.random() * COL_VAR_ARR.length ) ]; // What: Random Color Function. Why: Every firework and spark takes a color from the palette. How: This returns one of its token references at random.



const staArrFun = () : StaRecTyp[] => Array.from( { length : STA_COU_NUM }, () => ( { // What: Star Array Function. Why: The stars are scattered once, when the card opens. How: This builds each star's record from random values within its ranges.


	lefNum : ranValFun( 0, 100 ),                           // What: Left Number. Why: Stars spread across the whole sky. How: This picks 0% to 100% across.
	opaNum : ranValFun( cdnPowFun( -3 ), 1 ),               // What: Opacity Number. Why: Stars shine at different strengths. How: This picks from the Power of 3 Reciprocal to fully opaque. // Core-Design-Number to the Power of 3 Reciprocal ~= 0.430
	sizNum : ranValFun( cdnPowFun( -9 ), cdnPowFun( -5 ) ), // What: Size Number. Why: Stars come in different sizes. How: This picks from the Vertical Rhythm Base Minus 10 step to the Minus 6 step, in rem. // Vertical Rhythm Base Minus 10 ~= 0.876px, Vertical Rhythm Base Minus 6 ~= 2.696px
	topNum : ranValFun( 0, 60 )                             // What: Top Number. Why: Stars stay in the upper sky, above the horizon's glow. How: This picks 0% to 60% down, a literal position in the sky.


} ) );



// #region staPatFun

/**
 * staPatFun = Star Path Function
 *
 * @summary
 * One five-pointed star of the flag's canton, as a closed subpath in the
 * flag's drawing space, centered on the given point. Its ten corners
 * alternate between the outer points and the inner notches, starting from
 * the top point, at about the real flag's star size for a flag 100 units
 * tall. Every number here is in the flag's own drawing space, so none is a
 * CSS length.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param xcoNum - X-Coordinate Number: The star's center from the flag's left
 *                 edge.
 * @param ycoNum - Y-Coordinate Number: The star's center from the flag's top
 *                 edge.
 *
 * @returns The star's subpath.
 *
 * @example
 * ```ts
 * staPatFun(6.333, 5.385) // => 'M6.333 2.305L7.027 4.430...Z'
 * ```
 *
*/

const staPatFun = ( xcoNum : number, ycoNum : number ) : string => { // What: Star Path Function. Why: The canton holds fifty stars. How: This draws one at the given center.


	const corPoiArr = Array.from( Array( 10 ).keys(), ( corIndNum ) => { // What: Corner Point Array. Why: A five-pointed star has ten corners. How: This places each one around the center, alternating the outer and inner radius.


		const angRadNum = ( corIndNum * 36 - 90 ) * Math.PI / 180; // What: Angle Radian Number. Why: The corners sit every 36 degrees, starting straight up. How: This converts the corner's angle to radians.
		const radValNum = corIndNum % 2 === 0 ? 3.08 : 1.18;       // What: Radius Value Number. Why: Points reach out and notches tuck in. How: This picks the point radius or the notch radius, in the flag's drawing space.



		return `${ ( xcoNum + Math.cos( angRadNum ) * radValNum ).toFixed( 3 ) } ${ ( ycoNum + Math.sin( angRadNum ) * radValNum ).toFixed( 3 ) }`; // What: Corner Point Return. Why: The path lists each corner as a pair of coordinates. How: This returns the corner's x and y, rounded to three places.


	} );



	return `M${ corPoiArr.join( 'L' ) }Z`; // What: Star Path Return. Why: The star is one closed shape. How: This moves to the first corner, draws a line through the rest, and closes it.


};

// #endregion staPatFun



const FLA_STA_STR = Array.from( Array( 50 ).keys(), ( staIndNum ) => { // What: Flag Stars String. Why: The canton holds fifty stars in nine rows, six and five in turn. How: This finds each star's row and column and joins their subpaths into a single path, built once when the card's code loads.


	const paiIndNum = staIndNum % 11;                                               // What: Pair Index Number. Why: Every pair of rows holds eleven stars, six then five. How: This is the star's place within its pair.
	const colIndNum = paiIndNum < 6 ? paiIndNum * 2 : ( paiIndNum - 6 ) * 2 + 1;    // What: Column Index Number. Why: The six-star rows sit on even columns and the five-star rows between them. How: This picks the star's place among the canton's eleven columns.
	const rowIndNum = Math.floor( staIndNum / 11 ) * 2 + ( paiIndNum < 6 ? 0 : 1 ); // What: Row Index Number. Why: The rows alternate six and five. How: This counts the pairs before the star and adds one when it falls in its pair's second row.



	return staPatFun( ( colIndNum + 1 ) * CAN_WID_NUM / 12, ( rowIndNum + 1 ) * CAN_HEI_NUM / 10 ); // What: Star Path Return. Why: The stars sit evenly spaced inside the canton. How: This draws the star at its column's twelfth of the canton's width and its row's tenth of its height.


} ).join( '' );



// #region staFirFun

/**
 * staFirFun = Start Fireworks Function
 *
 * @summary
 * Launches a firework into the sky at once and another every Base Plus 6
 * step of the duration scale, about 853ms, until stopped. The fireworks are
 * a fixed pool of wraps the card renders, each holding a shell, a ring, and
 * fourteen sparks, reused in turn, so launching one never adds or removes
 * an element, which made WebKit repaint the headline's glow on every
 * launch. A launch moves the next wrap to a random spot in the sky's middle,
 * between 15% and 85% across and 10% and 55% down, colors its shell and
 * ring and each spark at random from the palette, and plays its timeline:
 * the shell fades out, the ring grows and fades after the ring delay, and
 * the sparks fly out after the particle delay, each aimed evenly around the
 * circle give or take the jitter, shrinking and fading as they go. Launches
 * run on GSAP's ticker, so none pile up while the tab is hidden. It returns
 * the function that stops the launches and kills every timeline.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param firDivEle - Firework Div Element: The layer holding the pool of
 *                    firework wraps.
 *
 * @returns The function that stops the fireworks.
 *
 * @example
 * ```ts
 * staFirFun(firDivEle) // => () => void
 * ```
 *
*/

const staFirFun = ( firDivEle : HTMLElement ) : () => void => { // What: Start Fireworks Function. Why: Fireworks burst over the card until it closes. How: This launches the pool's wraps in turn on a loop and returns the function that stops it.


	const accEasStr = gsaEasFun( 'acc' ); // What: Accelerate Easing String. Why: The shell fades out faster as it goes. How: This registers the accelerate token and keeps its GSAP name.
	const decEasStr = gsaEasFun( 'dec' ); // What: Decelerate Easing String. Why: The ring and sparks burst fast and slow as they spread. How: This registers the decelerate token and keeps its GSAP name.
	const disMaxNum = rhyPxlFun( 'p08' ); // What: Distance Maximum Number. Why: The farthest sparks fly well out from the burst. How: This is the Vertical Rhythm Base Plus 8 step, in pixels. // Vertical Rhythm Base Plus 8 ~= 138.199px
	const disMinNum = rhyPxlFun( 'p05' ); // What: Distance Minimum Number. Why: The nearest sparks still clear the ring. How: This is the Vertical Rhythm Base Plus 5 step, in pixels. // Vertical Rhythm Base Plus 5 ~= 59.447px
	const fliMaxNum = durSecFun( 'p08' ); // What: Flight Maximum Number. Why: The slowest sparks linger. How: This is the duration scale's Base Plus 8 step, in seconds. // Duration Animation Base Plus 8 ~= 1,497.0ms
	const fliMinNum = durSecFun( 'p06' ); // What: Flight Minimum Number. Why: The quickest sparks burn out fast. How: This is the duration scale's Base Plus 6 step, in seconds. // Duration Animation Base Plus 6 ~= 853.0ms
	const intSecNum = durSecFun( 'p06' ); // What: Interval Second Number. Why: A new firework bursts a little less than once a second. How: This is the duration scale's Base Plus 6 step, in seconds. // Duration Animation Base Plus 6 ~= 853.0ms
	const parDelNum = durSecFun( 'p02' ); // What: Particle Delay Number. Why: The sparks fly once the shell has burst. How: This is the duration scale's Base Plus 2 step, in seconds. // Duration Animation Base Plus 2 ~= 277.0ms
	const parJitNum = cdnPowFun( 8 );     // What: Particle Jitter Number. Why: Evenly spaced sparks look mechanical. How: This is the core design number to the power of 8, the most each spark's angle strays, in degrees. // Core-Design-Number to the Power of 8 ~= 9.484
	const parScaNum = cdnPowFun( -4 );    // What: Particle Scale Number. Why: Sparks shrink as they burn out. How: This is the Power of 4 Reciprocal, the size they end at. // Core-Design-Number to the Power of 4 Reciprocal ~= 0.325
	const rinDelNum = durSecFun( 'p01' ); // What: Ring Delay Number. Why: The ring flashes just after the shell bursts. How: This is the duration scale's Base Plus 1 step, in seconds. // Duration Animation Base Plus 1 ~= 209.1ms
	const rinDurNum = durSecFun( 'p04' ); // What: Ring Duration Number. Why: The ring's flash is quick. How: This is the duration scale's Base Plus 4 step, in seconds. // Duration Animation Base Plus 4 ~= 486.1ms
	const sheDurNum = durSecFun( 'p02' ); // What: Shell Duration Number. Why: The shell burns out fast. How: This is the duration scale's Base Plus 2 step, in seconds. // Duration Animation Base Plus 2 ~= 277.0ms

	const timLinArr : ( gsap.core.Timeline | null )[] = Array( FIR_POO_NUM ).fill( null );                 // What: Timeline Array. Why: Stopping has to end every firework still bursting, and a reused wrap's last burst has to end before its next. How: This holds each wrap's latest timeline, null before its first.
	const wraDivArr : HTMLElement[]                   = Array.from( firDivEle.children ) as HTMLElement[]; // What: Wrap Div Array. Why: The pool's wraps are reused in turn. How: This lists the firework layer's children. // What: Type Assertion Note. Why: An element's children are typed as plain elements. How: Every wrap the card renders is a div.

	let lauCalObj : gsap.core.Tween | null = null; // What: Launch Call Object. Why: Stopping has to cancel the next launch. How: This holds the pending delayed call, null before the first.

	let wraIndNum = 0; // What: Wrap Index Number. Why: The wraps take turns. How: This holds the next wrap's place in the pool.



	// #region lauFirFun

	/**
	 * lauFirFun = Launch Firework Function
	 *
	 * @summary
	 * Plays the pool's next wrap as a new firework: it ends that wrap's last
	 * timeline, builds a new one that moves the wrap to its random spot,
	 * fades the shell, bursts the ring, and flies each spark out along its
	 * own angle and distance over its own flight, recolors the wrap and its
	 * sparks, moves the turn on to the next wrap, and schedules the next
	 * launch on GSAP's ticker. The from values of the shell, ring, and sparks
	 * reset them at the burst point, so a reused wrap starts fresh.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param void - This function takes no parameters.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * lauFirFun() // => void
	 * ```
	 *
	*/

	const lauFirFun = () : void => { // What: Launch Firework Function. Why: The sky bursts with a new firework every interval. How: This plays the next wrap in the pool and schedules the next launch.


		const timLinObj = gsap.timeline( { defaults : { ease : decEasStr } } ); // What: Timeline Object. Why: Each firework plays as one sequence. How: This creates its timeline, decelerating unless told otherwise.
		const wraDivEle = wraDivArr[ wraIndNum ];                               // What: Wrap Div Element. Why: This launch plays the wrap whose turn it is. How: This takes it from the pool.
		const wraXcoNum = ranValFun( 0.15, 0.85 ) * firDivEle.clientWidth;      // What: Wrap X-Coordinate Number. Why: Fireworks burst across the sky, clear of its edges. How: This picks a spot between 15% and 85% across, a literal position in the sky, in pixels.
		const wraYcoNum = ranValFun( 0.1, 0.55 ) * firDivEle.clientHeight;      // What: Wrap Y-Coordinate Number. Why: Fireworks burst in the upper middle of the sky. How: This picks a spot between 10% and 55% down, a literal position in the sky, in pixels.

		const [ sheDivEle, rinDivEle, ...parDivArr ] = Array.from( wraDivEle.children ) as HTMLElement[]; // What: Shell, Ring, And Particle Div Elements. Why: The timeline animates each piece. How: This takes the wrap's children in the order the card renders them, shell, ring, then sparks. // What: Type Assertion Note. Why: An element's children are typed as plain elements. How: Every piece the card renders is a div.


		timLinArr[ wraIndNum ]?.kill(); // What: Last Timeline Kill Call. Why: A reused wrap's last burst must not keep playing over its new one. How: This kills the wrap's previous timeline, if any.


		timLinObj.set( wraDivEle, { x : wraXcoNum, y : wraYcoNum }, 0 ); // What: Wrap Placement. Why: The firework bursts at its picked spot. How: This moves the wrap there by transform, so placing it needs no layout.

		timLinObj.fromTo( sheDivEle, { opacity : 1            }, { duration : sheDurNum, opacity : 0, ease : accEasStr }, 0 );         // What: Shell Fade. Why: The shell burns out as it bursts. How: This shows it and fades it from the start.
		timLinObj.fromTo( rinDivEle, { opacity : 1, scale : 0 }, { duration : rinDurNum, opacity : 0, scale : 1        }, rinDelNum ); // What: Ring Burst. Why: The burst flashes outward. How: After the ring delay, this grows the ring from nothing as it fades.


		for ( const [ parIndNum, parDivEle ] of parDivArr.entries() ) { // What: Particle Loop. Why: Every spark flies its own way. How: This colors each one and adds its flight to the timeline.


			const angRadNum = ( 360 / PAR_COU_NUM * parIndNum + ranValFun( parJitNum * -1, parJitNum ) ) * Math.PI / 180; // What: Angle Radian Number. Why: The sparks spread evenly around the circle, each straying a little. How: This is the spark's share of the circle plus a random jitter, in radians.
			const disPxlNum = ranValFun( disMinNum, disMaxNum );                                                          // What: Distance Pixel Number. Why: Sparks fly different distances. How: This picks one within the range.
			const fliSecNum = ranValFun( fliMinNum, fliMaxNum );                                                          // What: Flight Second Number. Why: Sparks burn out at different times. How: This picks a duration within the range.
			const xcoPxlNum = Math.cos( angRadNum ) * disPxlNum;                                                          // What: X-Coordinate Pixel Number. Why: The spark ends along its angle. How: This is its distance's horizontal share.
			const ycoPxlNum = Math.sin( angRadNum ) * disPxlNum;                                                          // What: Y-Coordinate Pixel Number. Why: The spark ends along its angle. How: This is its distance's vertical share.


			parDivEle.style.setProperty( '--foj-par-col', ranColFun() ); // What: Particle Color Assignment. Why: The sparks burst in mixed colors. How: This sets the custom property the spark reads to a random palette color.


			timLinObj.fromTo( parDivEle, { opacity : 1, scale : 1, x : 0, y : 0 }, { duration : fliSecNum, opacity : 0, scale : parScaNum, x : xcoPxlNum, y : ycoPxlNum }, parDelNum ); // What: Particle Flight. Why: The sparks fly out, shrink, and burn out. How: This shows the spark at the burst point, then after the particle delay moves it to its end point over its flight.


		}


		wraDivEle.style.setProperty( '--foj-fir-col', ranColFun() ); // What: Firework Color Assignment. Why: The shell and ring share one color. How: This sets the custom property they read to a random palette color.


		timLinArr[ wraIndNum ] = timLinObj; // What: Timeline Record Assignment. Why: Stopping and the wrap's next turn have to find this timeline. How: This keeps it at the wrap's place.

		wraIndNum = ( wraIndNum + 1 ) % FIR_POO_NUM; // What: Turn Assignment. Why: The next launch plays the next wrap. How: This moves the turn on, wrapping back to the first.


		lauCalObj = gsap.delayedCall( intSecNum, lauFirFun ); // What: Next Launch Call. Why: The fireworks keep coming. How: This schedules the next launch on GSAP's ticker, which pauses with a hidden tab.


	};

	// #endregion lauFirFun



	lauFirFun(); // What: First Launch Call. Why: The sky shouldn't wait an interval for its first firework. How: This launches one at once.



	return () => { // What: Stop Fireworks Return. Why: The card stops the fireworks when it replays or closes. How: This returns the function that cancels the next launch and kills every wrap's timeline.


		lauCalObj?.kill(); // What: Launch Cancel Call. Why: No firework may launch after the card is gone. How: This kills the pending delayed call.


		for ( const timLinObj of timLinArr ) timLinObj?.kill(); // What: Timeline Kill Loop. Why: No firework may keep bursting after the card is gone. How: This kills each wrap's latest timeline, if it has one.


	};


};

// #endregion staFirFun

// #endregion Helpers



// #region Components

// #region FojCarCom

/**
 * FojCarCom = Fourth-Of-July Card Component
 *
 * @summary
 * The Fourth of July card. Its stars are scattered once, when the card
 * opens. One GSAP timeline, built in useGSAP, fades the card in over the
 * Base Plus 7 step of the duration scale, about 1.13s; after the Base Plus 3
 * step the headline springs down into place from a smaller scale; after the
 * Base Plus 6 step the flag slides in from the left; and once the card has
 * faded in, the wish rises in. The stars twinkle and the fireworks start at
 * once, and both stop when the card replays or closes, since the context
 * reverts the twinkles and the hook's cleanup stops the fireworks. Under
 * reduced motion the timeline jumps to its end, and neither the twinkle nor
 * the fireworks start.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The card's sky, flag, and lettering.
 *
 * @example
 * ```tsx
 * FojCarCom() // => <FojCarCom />
 * ```
 *
*/

function FojCarCom () : JSX.Element {


	const carDivRef = useRef< HTMLDivElement >( null );       // What: Card Div Reference. Why: The card fades in, and the timeline's cleanup is scoped to it. How: This holds the card's root.
	const firLayRef = useRef< HTMLDivElement >( null );       // What: Firework Layer Reference. Why: The fireworks burst in it. How: This holds the layer of firework wraps.
	const flaImaRef = useRef< SVGSVGElement >( null );        // What: Flag Image Reference. Why: The flag slides in. How: This holds its SVG.
	const greTitRef = useRef< HTMLHeadingElement >( null );   // What: Greeting Title Reference. Why: The headline springs into place. How: This holds the heading.
	const staLayRef = useRef< HTMLDivElement >( null );       // What: Star Layer Reference. Why: The stars twinkle. How: This holds the layer of stars.
	const wisMesRef = useRef< HTMLParagraphElement >( null ); // What: Wish Message Reference. Why: The wish rises in. How: This holds the paragraph.

	const [ staRecArr ] = useState( staArrFun ); // What: Star Record Array. Why: The stars stay where they were scattered while the card plays. How: This runs staArrFun on the first render and keeps its stars.



	// #region Fourth Of July Timeline

	/**
	 * fourth-of-july-card.tsx = Fourth Of July Timeline
	 *
	 * @summary
	 * The card's entrance, as one timeline: the card fades in from the start,
	 * the headline drops from a Base Plus 5 spacing step above and grows from
	 * the Power of 1 Reciprocal scale on the bounce curve, the flag slides in
	 * from a Base Plus 4 step to the left, and the wish rises from a Base
	 * Plus 3 step below, each over the Base Plus 7 duration step and every
	 * other one decelerating. Then every star twinkles between its own
	 * brightness and a random one from the Power of 8 Reciprocal to fully
	 * opaque, forever, after a random delay up to the Base Plus 9 duration
	 * step, each swing taking from the Base Plus 6 to the Plus 10 step on the
	 * in-out curve, and the fireworks start. Under reduced motion the
	 * timeline jumps to its end, before the twinkle and fireworks begin.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	*/

	useGSAP( () => { // What: Fourth Of July Timeline Hook. Why: The entrance, twinkle, and fireworks have to start after the card renders and stop when it leaves. How: This builds and plays them in a GSAP context, returning the fireworks' cleanup.


		const bouEasStr = gsaEasFun( 'bou' );                                                         // What: Bounce Easing String. Why: The headline lands with a celebratory overshoot. How: This registers the bounce token and keeps its GSAP name.
		const decEasStr = gsaEasFun( 'dec' );                                                         // What: Decelerate Easing String. Why: Things arriving slow as they land. How: This registers the decelerate token and keeps its GSAP name.
		const entDurNum = durSecFun( 'p07' );                                                         // What: Entrance Duration Number. Why: Every entrance plays at the same unhurried pace, and the wish starts once the card has faded in. How: This is the duration scale's Base Plus 7 step, in seconds. // Duration Animation Base Plus 7 ~= 1,130.0ms
		const flaDelNum = durSecFun( 'p06' );                                                         // What: Flag Delay Number. Why: The flag follows the headline. How: This is the duration scale's Base Plus 6 step, in seconds. // Duration Animation Base Plus 6 ~= 853.0ms
		const flaShiNum = rhyPxlFun( 'p04' ) * -1;                                                    // What: Flag Shift Number. Why: The flag slides in from the left. How: This is the Vertical Rhythm Base Plus 4 step, negated. // Vertical Rhythm Base Plus 4 ~= -44.876px
		const greDelNum = durSecFun( 'p03' );                                                         // What: Greeting Delay Number. Why: The headline arrives just after the card starts fading in. How: This is the duration scale's Base Plus 3 step, in seconds. // Duration Animation Base Plus 3 ~= 366.9ms
		const greScaNum = cdnPowFun( -1 );                                                            // What: Greeting Scale Number. Why: The headline grows as it drops. How: This is the Power of 1 Reciprocal, the scale it starts from. // Core-Design-Number to the Power of 1 Reciprocal ~= 0.755
		const greShiNum = rhyPxlFun( 'p05' ) * -1;                                                    // What: Greeting Shift Number. Why: The headline drops in from above. How: This is the Vertical Rhythm Base Plus 5 step, negated. // Vertical Rhythm Base Plus 5 ~= -59.447px
		const timLinObj = gsap.timeline( { defaults : { duration : entDurNum, ease : decEasStr } } ); // What: Timeline Object. Why: The entrance plays as one sequence. How: This creates the timeline, its tweens taking the entrance duration and decelerating unless told otherwise.
		const wisShiNum = rhyPxlFun( 'p03' );                                                         // What: Wish Shift Number. Why: The wish rises in from below. How: This is the Vertical Rhythm Base Plus 3 step. // Vertical Rhythm Base Plus 3 ~= 33.876px


		timLinObj.from( carDivRef.current, { opacity : 0                                                                     }, 0 );         // What: Card Fade. Why: The card opens out of the dark. How: This fades it in from the start.
		timLinObj.from( greTitRef.current, { opacity : 0, ease : bouEasStr, force3D : true, scale : greScaNum, y : greShiNum }, greDelNum ); // What: Headline Spring. Why: The greeting arrives with a celebratory bounce. How: After the greeting delay, this drops it into place and grows it to full size on the bounce curve. // What: Kept Layer Note. Why: WebKit repainted the headline's wide glow whenever the heading left its own layer or something under it changed, stalling frames for up to 250ms. How: force3D keeps the heading on its own layer after the spring ends, so its glow is drawn once.
		timLinObj.from( flaImaRef.current, { opacity : 0, x : flaShiNum                                                      }, flaDelNum ); // What: Flag Slide. Why: The flag sweeps in from the side. How: After the flag delay, this slides it in from the left.
		timLinObj.from( wisMesRef.current, { opacity : 0, y : wisShiNum                                                      }, entDurNum ); // What: Wish Rise. Why: The wish follows the headline. How: Once the card has faded in, this raises the wish in from below.



		if ( redMotFun() ) { timLinObj.progress( 1 ); return; } // What: Reduced Motion Check. Why: A visitor who asked for less motion should see the finished card at once, with still stars and no fireworks. How: This jumps the timeline to its end and stops before the twinkle and fireworks start.



		const delMaxNum = durSecFun( 'p09' );                        // What: Delay Maximum Number. Why: The stars start twinkling out of step. How: This is the duration scale's Base Plus 9 step, the longest wait, in seconds. // Duration Animation Base Plus 9 ~= 1,983.0ms
		const durMaxNum = durSecFun( 'p10' );                        // What: Duration Maximum Number. Why: The slowest stars swing over a few seconds. How: This is the duration scale's Base Plus 10 step, in seconds. // Duration Animation Base Plus 10 ~= 2,627.0ms
		const durMinNum = durSecFun( 'p06' );                        // What: Duration Minimum Number. Why: The quickest stars still twinkle softly. How: This is the duration scale's Base Plus 6 step, in seconds. // Duration Animation Base Plus 6 ~= 853.0ms
		const inoEasStr = gsaEasFun( 'ino' );                        // What: In-Out Easing String. Why: Stars brighten and dim gently at both ends. How: This registers the in-out token and keeps its GSAP name.
		const opaMinNum = cdnPowFun( -8 );                           // What: Opacity Minimum Number. Why: A twinkling star dims almost out. How: This is the Power of 8 Reciprocal. // Core-Design-Number to the Power of 8 Reciprocal ~= 0.105
		const staEleArr = Array.from( staLayRef.current!.children ); // What: Star Element Array. Why: Every star twinkles. How: This lists the star layer's children. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.


		for ( const staSpaEle of staEleArr ) { // What: Star Twinkle Loop. Why: The stars twinkle out of step with each other. How: This gives each star its own random delay, pace, and brightness.


			const delSecNum = ranValFun( 0, delMaxNum );         // What: Delay Second Number. Why: Each star starts twinkling at its own moment. How: This picks a wait up to the maximum.
			const durSecNum = ranValFun( durMinNum, durMaxNum ); // What: Duration Second Number. Why: Each star twinkles at its own pace. How: This picks a swing's length within the range.
			const opaValNum = ranValFun( opaMinNum, 1 );         // What: Opacity Value Number. Why: Each star swings to its own brightness. How: This picks one from the minimum to fully opaque.


			gsap.to( staSpaEle, { delay : delSecNum, duration : durSecNum, ease : inoEasStr, opacity : opaValNum, repeat : -1, yoyo : true } ); // What: Star Twinkle Tween. Why: The star keeps twinkling while the card is open. How: This swings its opacity to the picked brightness and back forever, reverted with the context.


		}



		return staFirFun( firLayRef.current! ); // What: Fireworks Start Return. Why: The fireworks must stop when the card replays or closes. How: This starts them and returns their stop function, which GSAP runs as it reverts the context. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.


	}, { scope : carDivRef } ); // What: Hook Options. Why: The timeline is built once, when the card opens, and its cleanup is tied to the card. How: This scopes the context to the card's root, with no dependencies.

	// #endregion Fourth Of July Timeline



	return (


		<div
			ref={ carDivRef }

			className={ cssModObj.fojCarDiv }
		>{ /* What: Fourth-Of-July Card Div Element. Why: The card fills the screen with a night sky. How: This holds the star and firework layers under the greeting. */ }


			<div
				ref={ staLayRef }

				className={ cssModObj.staLayDiv }

				aria-hidden='true'
			>{ /* What: Star Layer Div Element. Why: The stars are decoration a screen reader should skip. How: This holds the scattered stars behind everything else. */ }


				{ staRecArr.map( ( staRecObj, staIndNum ) => ( // What: Star Map Call. Why: Every scattered star needs a span. How: This renders one per star, keyed by its index.


					<span
						key={ staIndNum }

						className={ cssModObj.staDotSpa }

						style={{
							height  : `${ staRecObj.sizNum }rem`,
							left    : `${ staRecObj.lefNum }%`,
							opacity : staRecObj.opaNum,
							top     : `${ staRecObj.topNum }%`,
							width   : `${ staRecObj.sizNum }rem`
						}}
					/> // What: Star Dot Span Element. Why: Each star is a small white dot. How: This places and sizes it from its record, at its starting brightness.


				))}


			</div>


			<div
				ref={ firLayRef }

				className={ cssModObj.firLayDiv }

				aria-hidden='true'
			>{ /* What: Firework Layer Div Element. Why: The fireworks are decoration a screen reader should skip. How: This holds the pool of firework wraps the card launches in turn. */ }


				{ Array.from( Array( FIR_POO_NUM ).keys(), ( wraIndNum ) => ( // What: Wrap Map Call. Why: The fireworks reuse a fixed pool of wraps. How: This renders one per pool place, keyed by its index.


					<div
						key={ wraIndNum }

						className={ cssModObj.firWraDiv }
					>{ /* What: Firework Wrap Div Element. Why: A firework's pieces burst from one point. How: This holds the shell, ring, and sparks, in the order the launch reads them. */ }


						<div className={ cssModObj.firSheDiv } />{ /* What: Firework Shell Div Element. Why: The shell glows where the firework bursts. How: This is the first piece, which the launch fades out. */ }

						<div className={ cssModObj.firRinDiv } />{ /* What: Firework Ring Div Element. Why: The burst flashes as a growing ring. How: This is the second piece, which the launch grows and fades. */ }

						{ Array.from( Array( PAR_COU_NUM ).keys(), ( parIndNum ) => ( // What: Particle Map Call. Why: Each firework bursts into sparks. How: This renders one spark per particle, keyed by its index, after the shell and ring.


							<div
								key={ parIndNum }

								className={ cssModObj.firParDiv }
							/> // What: Firework Particle Div Element. Why: Each spark is a small glowing dot. How: This is one of the pieces after the ring, which the launch flies out.


						))}


					</div>


				))}


			</div>


			<div className={ cssModObj.greConDiv }>{ /* What: Greeting Content Div Element. Why: The flag and lettering sit together in the middle of the sky. How: This centers them in a column above the star and firework layers. */ }


				<svg
					ref={ flaImaRef }

					className={ cssModObj.flaImaSvg }

					height={ FLA_HEI_NUM } // What: Intrinsic Height. Why: The flag's box should keep its proportions before the stylesheet sizes it. How: This is its height in the drawing space.
					viewBox={ `0 0 ${ FLA_WID_NUM } ${ FLA_HEI_NUM }` }
					width={ FLA_WID_NUM } // What: Intrinsic Width. Why: The flag's box should keep its proportions before the stylesheet sizes it. How: This is its width in the drawing space.

					aria-hidden='true'
				>{ /* What: Flag Image SVG Element. Why: The American flag leads the card, and it's decoration a screen reader should skip. How: This draws the stripes, canton, and stars in the flag's own drawing space, its size set by the stylesheet. */ }


					<rect
						style={{ fill : 'var( --foj-fie-col )' }} // Fourth-Of-July Field Color = #B22234

						height={ FLA_HEI_NUM }
						width={ FLA_WID_NUM }
					/>{ /* What: Red Field Rect Element. Why: The flag's seven red stripes fill everything the white ones don't. How: This paints the whole flag red. */ }

					<path
						style={{ fill : 'var( --foj-whi-col )' }} // Fourth-Of-July White Color = #FFFFFF

						d={ FLA_STR_STR }
					/>{ /* What: White Stripes Path Element. Why: Six white stripes lie between the red. How: This draws them all from the prebuilt path. */ }

					<rect
						style={{ fill : 'var( --foj-can-col )' }} // Fourth-Of-July Canton Color = #3C3B6E

						height={ CAN_HEI_NUM }
						width={ CAN_WID_NUM }
					/>{ /* What: Canton Rect Element. Why: The blue canton holds the stars in the upper left. How: This paints it over the top seven stripes. */ }

					<path
						style={{ fill : 'var( --foj-whi-col )' }} // Fourth-Of-July White Color = #FFFFFF

						d={ FLA_STA_STR }
					/>{ /* What: Canton Stars Path Element. Why: Fifty white stars fill the canton. How: This draws them all from the prebuilt path. */ }


				</svg>

				<h1
					ref={ greTitRef }

					className={ cssModObj.greTitHea }
				><span aria-hidden='true'>🎆</span>&nbsp;Happy 4th of July!&nbsp;<span aria-hidden='true'>🎆</span></h1>{ /* What: Greeting Title Heading Element. Why: The greeting leads the card. How: This wishes a Happy 4th of July between two firework emoji, which screen readers skip, each held to its neighboring word by a no-break space so neither wraps onto a line alone on a phone. */ }

				<div
					className={ cssModObj.staRowDiv }

					aria-hidden='true'
				>★ ★ ★ ★ ★</div>{ /* What: Star Row Div Element. Why: A row of gold stars sets the headline off from the wish, and it's decoration a screen reader should skip. How: This spaces five stars across the column. */ }

				<p
					ref={ wisMesRef }

					className={ cssModObj.wisMesPar }
				>Wishing you a day filled with freedom, joy, and the warmth of good company.<br /><span className={ cssModObj.motLinSpa }>Land of the free, home of the brave.</span></p>{ /* What: Wish Message Paragraph Element. Why: The card's wish follows the greeting. How: This holds the wish and, on its own line, the anthem's closing words in gold italics. */ }

				<div
					className={ cssModObj.twiRowDiv }

					aria-hidden='true'
				>✦ ✦ ✦ ✦ ✦</div>{ /* What: Twinkle Row Div Element. Why: A row of red sparkles closes the card, and it's decoration a screen reader should skip. How: This spaces five sparkles across the column. */ }


			</div>


		</div>


	);


}

// #endregion FojCarCom

// #endregion Components



// #region Module Init

gsap.registerPlugin( useGSAP ); // What: Plugin Registration Call. Why: GSAP's React hook has to be registered before the card uses it. How: This registers it once, when the card's code loads.

// #endregion Module Init



// #region Exports

export { FojCarCom }; // What: Named Export. Why: The card catalog loads the card on demand. How: This exports the card's component by name.

// #endregion Exports


