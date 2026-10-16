


// #region Imports

import cssModObj from './happy-birthday-card.module.css'; // What: CSS Module Object. Why: The card's sky, balloons, lettering, and cake are styled in its own module. How: This maps each class name in happy-birthday-card.module.css to its scoped name.


import { cdnPowFun       } from '../../utils/rhythm.ts'; // What: Core-Design-Number Power Function. Why: The cake's starting size sits on the scale as a power of the core design number. How: This returns that power.
import { durSecFun       } from '../../utils/rhythm.ts'; // What: Duration Second Function. Why: Every duration in the timeline is a step on the duration scale, and GSAP takes seconds. How: This returns a step's length in seconds.
import { gsaEasFun       } from '../../ui/gsap-ease.ts'; // What: GSAP Easing Function. Why: GSAP can't read the stylesheet's cubic-bezier curves on its own. How: This registers an easing token as a named GSAP ease.
import { gsap            } from 'gsap';                  // What: GSAP. Why: The greeting and cake pop in as one timeline. How: This is the animation library that builds and plays it.
import { PAR_TOK_ARR     } from './confetti.ts';         // What: Party Token Array. Why: The balloons share the confetti's palette. How: Each balloon takes one of its color tokens in turn.
import { redMotFun       } from '../../utils/motion.ts'; // What: Reduce Motion Function. Why: A visitor who asked for less motion should get the finished card at once. How: This reports whether reduced motion is on.
import { rhyPxlFun       } from '../../utils/rhythm.ts'; // What: Rhythm Pixel Function. Why: The lettering's and cake's rises are spacing steps. How: This returns a step's size in pixels.
import { staBalFun       } from './balloons.ts';         // What: Start Balloons Function. Why: Balloons float up behind the greeting. How: This starts them and returns the function that stops them.
import { staConFun       } from './confetti.ts';         // What: Start Confetti Function. Why: Confetti bursts when the card opens and wherever it's tapped. How: This readies the canvas and returns its burst and stop functions.
import { useGSAP         } from '@gsap/react';           // What: Use GSAP. Why: The timeline has to be built after the card renders and undone when it leaves. How: This GSAP hook runs it in a context it reverts on unmount.
import { useRef          } from 'react';                 // What: Use Ref. Why: The timeline, balloons, and confetti work on specific elements. How: Each of those elements gets a ref.
import { useSearchParams } from 'react-router';          // What: Use Search Parameters. Why: The greeting can name its recipient. How: This reads the address's ?name= parameter.
import { useState        } from 'react';                 // What: Use State. Why: Whether motion is reduced is read once, when the card opens. How: This keeps that answer for the card's life.


import type { ConSysTyp  } from './confetti.ts'; // What: Confetti System Type. Why: The card keeps the confetti's functions for taps. How: This types them.
import type { JSX        } from 'react';         // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.
import type { MouseEvent } from 'react';         // What: Mouse Event. Why: A tap throws confetti where it lands. How: This types the click's event.

// #endregion Imports



/**
 * happy-birthday-card.tsx = Happy Birthday Card
 *
 * @summary
 * The Happy Birthday card: a starry purple night where balloons float up
 * behind the greeting, named for its recipient through ?name=, a wish, and a
 * cake with three flickering candles. When it opens, confetti bursts from the
 * greeting as its lines pop in one after another, the wish fades in, the cake
 * bounces up, and a second shower falls from the top as an invitation to tap
 * appears; every tap throws more confetti where it lands. Every duration and
 * distance is a step on the design scale, and the curves are the
 * stylesheet's easing tokens. Under reduced motion it opens on the finished
 * card, with the balloons at rest, the candles still, and no confetti or
 * invitation. Converted from TechGeek.support's original.
 *
 * Sections:
 *  - Constants
 *  - Components
 *  - Module Init
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

/**
 * CAD_ROW_ARR = Candle Row Array
 *
 * @summary
 * The cake's three candles, left to right. Every row holds the candle's
 * color (colStr), the extra flicker class its flame takes so the three
 * flicker out of step (empty for the first, which keeps the base timing),
 * as modStr, and its left edge in the cake's drawing (xcoNum); each flame is
 * centered 4 units right of it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const CAD_ROW_ARR = [ // What: Candle Row Array. Why: The cake carries three candles, each with its own flame. How: The cake renders one candle and flame per row.


	{ colStr : 'var( --bir-pin-col )', modStr : '',                        xcoNum : 41 }, // Birthday Pink Color = #FF6FCF
	{ colStr : 'var( --bir-blu-col )', modStr : cssModObj.cakFlaGroSecond, xcoNum : 66 }, // Birthday Blue Color = #4D96FF
	{ colStr : 'var( --bir-gre-col )', modStr : cssModObj.cakFlaGroThird,  xcoNum : 91 }  // Birthday Green Color = #6BCB77


];



const ICI_BOT_ARR = [ 30, 50, 70, 90, 110 ]; // What: Icing Bottom Array. Why: The bottom tier's edge is trimmed with dollops of icing. How: The cake draws one dollop at each of these points along the tier's top, in its own drawing units.
const ICI_TOP_ARR = [ 38, 58, 78, 98 ];      // What: Icing Top Array. Why: The top tier's edge is trimmed with dollops of icing. How: The cake draws one dollop at each of these points along the tier's top, in its own drawing units.
const OPE_COU_NUM = 60;                      // What: Opening Count Number. Why: The card opens with a big burst. How: This many pieces burst from the greeting.



/**
 * SPR_ROW_ARR = Sprinkle Row Array
 *
 * @summary
 * The sprinkles scattered over the cake's bottom tier. Every row holds the
 * sprinkle's tilt in degrees (angNum), its color (colStr), and its corner in
 * the cake's drawing (xcoNum and ycoNum), all the drawing's own values.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const SPR_ROW_ARR = [ // What: Sprinkle Row Array. Why: Colored sprinkles dot the cake. How: The cake renders one tilted strip per row.


	{ angNum : 0,  colStr : 'var( --bir-pur-col )', xcoNum : 40, ycoNum : 80 }, // Birthday Purple Color = #A78BFA
	{ angNum : 30, colStr : 'var( --bir-red-col )', xcoNum : 60, ycoNum : 74 }, // Birthday Red Color = #FF6B6B
	{ angNum : 60, colStr : 'var( --bir-blu-col )', xcoNum : 80, ycoNum : 82 }, // Birthday Blue Color = #4D96FF
	{ angNum : 90, colStr : 'var( --bir-yel-col )', xcoNum : 50, ycoNum : 90 }, // Birthday Yellow Color = #FFD93D
	{ angNum : 45, colStr : 'var( --bir-gre-col )', xcoNum : 90, ycoNum : 76 }, // Birthday Green Color = #6BCB77
	{ angNum : 20, colStr : 'var( --bir-pin-col )', xcoNum : 35, ycoNum : 88 }, // Birthday Pink Color = #FF6FCF
	{ angNum : 70, colStr : 'var( --bir-ora-col )', xcoNum : 75, ycoNum : 68 }  // Birthday Orange Color = #FF9A3C


];



/**
 * STA_OPA_ARR = Star Opacity Array
 *
 * @summary
 * The stars' five brightness levels, every fifth star taking the same one.
 * Every row is a reciprocal power of the core design number, the nearest to
 * the original's 0.15, 0.22, 0.29, 0.36, and 0.43.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const STA_OPA_ARR = [ // What: Star Opacity Array. Why: The stars twinkle at different brightnesses. How: Each star takes the level at its index's remainder by five.


	'var( --cdn-pow-007-rec )', // Core-Design-Number to the Power of 7 Reciprocal ~= 0.140
	'var( --cdn-pow-005-rec )', // Core-Design-Number to the Power of 5 Reciprocal ~= 0.245
	'var( --cdn-pow-004-rec )', // Core-Design-Number to the Power of 4 Reciprocal ~= 0.325
	'var( --cdn-pow-004-rec )', // Core-Design-Number to the Power of 4 Reciprocal ~= 0.325
	'var( --cdn-pow-003-rec )'  // Core-Design-Number to the Power of 3 Reciprocal ~= 0.430


];



/**
 * STA_DOT_ARR = Star Dot Array
 *
 * @summary
 * The 38 stars scattered over the sky. Each is placed by the original's own
 * scatter, stepping 137.5 units across and 93.7 down a 440 by 540 sky and
 * wrapping, now as percentages of the card so the stars cover any screen.
 * Every fifth star is a big one. Every row holds whether it's big (bigBoo),
 * its distance from the left as a percentage (lefStr), its opacity (opaStr),
 * and its distance from the top as a percentage (topStr).
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const STA_DOT_ARR = Array.from( Array( 38 ).keys(), ( dotIndNum ) => ( { // What: Star Dot Array. Why: The sky is scattered with stars. How: This places each one by the original's scatter, as percentages of the card.


	bigBoo : dotIndNum % 5 === 0,                          // What: Big Boolean. Why: A few stars shine larger. How: Every fifth star is big.
	lefStr : `${ ( dotIndNum * 137.5 ) % 440 / 4.4 }%`,    // What: Left String. Why: The stars spread across the sky. How: This steps 137.5 units across a 440-unit sky, wrapping, as a percentage.
	opaStr : STA_OPA_ARR[ dotIndNum % 5 ],                 // What: Opacity String. Why: The stars shine at different brightnesses. How: This takes the level for the index's remainder by five.
	topStr : `${ ( dotIndNum * 93.7 + 20 ) % 540 / 5.4 }%` // What: Top String. Why: The stars spread down the sky. How: This steps 93.7 units down a 540-unit sky from 20, wrapping, as a percentage.


} ) );



const TAP_COU_NUM = 35; // What: Tap Count Number. Why: Each tap throws a smaller burst. How: This many pieces burst where the tap lands.
const TOP_COU_NUM = 30; // What: Top Count Number. Why: A last shower falls from above as the invitation appears. How: This many pieces burst from just above the top edge.

// #endregion Constants



// #region Components

// #region BirCarCom

/**
 * BirCarCom = Birthday Card Component
 *
 * @summary
 * The Happy Birthday card. It plays as one GSAP timeline when the card opens,
 * built in useGSAP, which also starts the balloons and the confetti, so
 * leaving the card or replaying it reverts every tween and its cleanup stops
 * both loops. The greeting adds the recipient's name from ?name= on a line of
 * its own. Whether motion is reduced is read once, when the card opens: under
 * reduced motion the timeline is never built, the balloons rest, and no
 * confetti or tap invitation appears. Every tap on the card throws a burst of
 * confetti where it lands.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The card's sky, balloons, greeting, cake, and confetti canvas.
 *
 * @example
 * ```tsx
 * BirCarCom() // => <BirCarCom />
 * ```
 *
*/

function BirCarCom () : JSX.Element {


	const balSkyRef = useRef< HTMLDivElement >( null );       // What: Balloon Sky Reference. Why: The balloons are moved as the sky's children. How: This holds their container.
	const cakSvgRef = useRef< SVGSVGElement >( null );        // What: Cake SVG Reference. Why: The cake bounces up. How: This holds its drawing.
	const carDivRef = useRef< HTMLDivElement >( null );       // What: Card Div Reference. Why: The timeline is scoped to the card, and taps are placed against it. How: This holds the card's root.
	const conCanRef = useRef< HTMLCanvasElement >( null );    // What: Confetti Canvas Reference. Why: The confetti is drawn on it. How: This holds the canvas.
	const conSysRef = useRef< ConSysTyp | null >( null );     // What: Confetti System Reference. Why: Taps throw bursts while the confetti runs. How: This holds its functions, null when it isn't running.
	const subParRef = useRef< HTMLParagraphElement >( null ); // What: Subtitle Paragraph Reference. Why: The wish fades in. How: This holds the paragraph.
	const tapParRef = useRef< HTMLParagraphElement >( null ); // What: Tap Paragraph Reference. Why: The invitation to tap fades in last. How: This holds the paragraph.
	const titHeaRef = useRef< HTMLHeadingElement >( null );   // What: Title Heading Reference. Why: The opening burst starts from the greeting's middle. How: This holds the heading.
	const titMaiRef = useRef< HTMLSpanElement >( null );      // What: Title Main Reference. Why: The greeting's Birthday line pops in. How: This holds its span.
	const titNamRef = useRef< HTMLSpanElement >( null );      // What: Title Name Reference. Why: The recipient's name pops in with the Birthday line. How: This holds its span, null without a name.
	const titTopRef = useRef< HTMLSpanElement >( null );      // What: Title Top Reference. Why: The greeting's Happy line pops in first. How: This holds its span.

	const [ redMotBoo ] = useState( redMotFun ); // What: Reduce Motion Boolean. Why: The card plays or rests for its whole life, even if the setting changes while it's open. How: This reads the setting once, on the first render.
	const [ seaParObj ] = useSearchParams();     // What: Search Parameters Object. Why: The greeting can name its recipient. How: This reads the address's query.

	const namParStr = seaParObj.get( 'name' ); // What: Name Parameter String. Why: A shared link can carry the recipient's name. How: This reads ?name=, or null without one.



	// #region Birthday Timeline

	/**
	 * happy-birthday-card.tsx = Birthday Timeline
	 *
	 * @summary
	 * Starts the balloons, then, unless motion is reduced, the confetti and
	 * the card's one timeline, in order: a burst from the greeting's middle;
	 * the Happy line pops up from a Base Plus 3 step below; the Birthday and
	 * name lines pop in, overlapping it by a Base Plus 1 step; the wish fades
	 * in; the cake bounces up from a Base Plus 4 step below at about 0.57 of
	 * its size; and after a pause the invitation fades in as a shower falls
	 * from the top. The pops and the cake use the bounce curve, the fades
	 * the decelerate curve. Under reduced motion the balloons rest and the
	 * elements simply stay in place. The cleanup stops the balloons and the
	 * confetti.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	*/

	useGSAP( () => { // What: Birthday Timeline Hook. Why: The timeline and loops have to start after the card renders and stop when it leaves. How: This starts them in a GSAP context, returning their cleanup.


		const stoBalFun = staBalFun( balSkyRef.current!, !redMotBoo ); // What: Stop Balloons Function. Why: The balloons have to stop when the card leaves. How: This starts them, rising or at rest, and keeps their stop function. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.



		if ( redMotBoo ) return stoBalFun; // What: Reduced Motion Guard. Why: A visitor who asked for less motion sees the finished card with nothing moving. How: This skips the confetti and the timeline, returning the balloons' cleanup.



		const bouEasStr = gsaEasFun( 'bou' );                                                                     // What: Bounce Easing String. Why: The greeting and cake pop in with a springy overshoot, a celebration's flourish. How: This registers the bounce token and keeps its GSAP name.
		const conSysObj = staConFun( conCanRef.current! );                                                        // What: Confetti System Object. Why: The timeline and taps throw bursts. How: This readies the confetti on its canvas. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: The canvas renders whenever motion isn't reduced, and useGSAP runs after that render.
		const decEasStr = gsaEasFun( 'dec' );                                                                     // What: Decelerate Easing String. Why: The fades slow as they land. How: This registers the decelerate token and keeps its GSAP name.
		const ovePosStr = `-=${ durSecFun( 'p01' ) }`;                                                            // What: Overlap Position String. Why: The Birthday line starts as the Happy line lands. How: This GSAP position starts a step one Base Plus 1 step, about 209ms, before the last ends. // Duration Animation Base Plus 1 ~= 209.1ms
		const sliPosStr = `-=${ durSecFun( 'm02' ) }`;                                                            // What: Slight Position String. Why: The wish and cake follow close on the step before. How: This GSAP position starts a step one Base Minus 2 step, about 90ms, before the last ends. // Duration Animation Base Minus 2 ~= 89.9ms
		const timLinObj = gsap.timeline( { defaults : { ease : decEasStr } } );                                   // What: Timeline Object. Why: The greeting plays as one sequence. How: This creates the timeline, its tweens decelerating unless told otherwise.
		const titLinArr = [ titMaiRef.current, titNamRef.current ].filter( ( titSpaEle ) => titSpaEle !== null ); // What: Title Line Array. Why: The Birthday line and the name, when there is one, pop in together. How: This lists both spans, leaving out the name's when it isn't rendered.


		conSysRef.current = conSysObj; // What: Confetti System Assignment. Why: Taps throw bursts through the same confetti. How: This keeps its functions for the tap handler.



		timLinObj.call( () => { // What: Opening Burst Call. Why: The card opens with a burst from the greeting. How: This throws a big burst from the heading's middle, measured against the card.


			const carRecObj = carDivRef.current!.getBoundingClientRect(); // What: Card Rect Object. Why: The canvas covers the card, so points are measured from its corner. How: This reads the card's box. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: The timeline only runs after the render that attaches it.
			const titRecObj = titHeaRef.current!.getBoundingClientRect(); // What: Title Rect Object. Why: The burst starts at the greeting. How: This reads the heading's box. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: The timeline only runs after the render that attaches it.


			conSysObj.burFun( titRecObj.left + titRecObj.width / 2 - carRecObj.left, titRecObj.top + titRecObj.height / 2 - carRecObj.top, OPE_COU_NUM ); // What: Opening Burst. Why: Confetti bursts as the greeting appears. How: This throws the opening count from the heading's middle.


		} );

		timLinObj.from( titTopRef.current, { autoAlpha : 0, duration : durSecFun( 'p05' ), ease : bouEasStr, scale : 0, y : rhyPxlFun( 'p03' ) } ); // What: Happy Line Pop. Why: The greeting starts with Happy. How: This grows the line from nothing as it rises from a Base Plus 3 step below. // Duration Animation Base Plus 5 ~= 643.9ms, Vertical Rhythm Base Plus 3 ~= 33.876px

		timLinObj.from( titLinArr, { autoAlpha : 0, duration : durSecFun( 'p04' ), ease : bouEasStr, scale : 0 }, ovePosStr ); // What: Birthday Line Pop. Why: Birthday and the name follow close behind. How: This grows them from nothing, overlapping the Happy line. // Duration Animation Base Plus 4 ~= 486.1ms

		timLinObj.from( subParRef.current, { autoAlpha : 0, duration : durSecFun( 'p04' ) }, sliPosStr ); // What: Wish Fade. Why: The wish arrives once the greeting has. How: This fades it in. // Duration Animation Base Plus 4 ~= 486.1ms

		timLinObj.from( cakSvgRef.current, { autoAlpha : 0, duration : durSecFun( 'p05' ), ease : bouEasStr, scale : cdnPowFun( -2 ), y : rhyPxlFun( 'p04' ) }, sliPosStr ); // What: Cake Bounce. Why: The cake bounces up last. How: This grows it from about 0.57 of its size as it rises from a Base Plus 4 step below. // Duration Animation Base Plus 5 ~= 643.9ms, Core-Design-Number to the Power of -2 ~= 0.570, Vertical Rhythm Base Plus 4 ~= 44.876px

		timLinObj.from( tapParRef.current, { autoAlpha : 0, duration : durSecFun( 'p03' ) }, `+=${ durSecFun( 'p04' ) }` ); // What: Invitation Fade. Why: Once the card has settled, it invites a tap. How: After a Base Plus 4 step's pause, this fades the invitation in. // Duration Animation Base Plus 3 ~= 366.9ms, Duration Animation Base Plus 4 ~= 486.1ms

		timLinObj.call( () => conSysObj.burFun( Math.random() * conCanRef.current!.clientWidth, rhyPxlFun( 'm01' ) * -1, TOP_COU_NUM ), [], '<' ); // What: Top Shower Call. Why: A last shower falls as the invitation appears. How: This throws the top count from a random spot just above the top edge, a Base Minus 1 step up, as the invitation starts. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: The canvas renders whenever motion isn't reduced, and the timeline only runs after that render. // Vertical Rhythm Base Minus 1 = -11px



		return () => { // What: Loop Cleanup Return. Why: The balloons and confetti must stop when the card replays or closes. How: This returns the function that stops both and forgets the confetti, which GSAP runs as it reverts the timeline.


			stoBalFun(); // What: Balloons Stop Call. Why: The balloons' loop must not outlive the card. How: This stops it.


			conSysObj.stoFun(); // What: Confetti Stop Call. Why: The confetti's loop must not outlive the card. How: This stops it.

			conSysRef.current = null; // What: Confetti System Clear. Why: A tap after the cleanup shouldn't reach stopped confetti. How: This forgets its functions.


		};


	}, { scope : carDivRef } ); // What: Hook Options. Why: The timeline is built once, when the card opens, and its cleanup is tied to the card. How: This scopes the context to the card's root, with no dependencies.

	// #endregion Birthday Timeline



	const tapCelFun = ( cliEveObj : MouseEvent< HTMLDivElement > ) : void => { // What: Tap Celebrate Function. Why: Every tap on the card throws more confetti where it lands. How: This measures the tap against the card and throws a burst there, doing nothing while the confetti isn't running.


		const carRecObj = cliEveObj.currentTarget.getBoundingClientRect(); // What: Card Rect Object. Why: The canvas covers the card, so the tap is measured from its corner. How: This reads the card's box.


		conSysRef.current?.burFun( cliEveObj.clientX - carRecObj.left, cliEveObj.clientY - carRecObj.top, TAP_COU_NUM ); // What: Tap Burst Call. Why: The confetti bursts where the tap lands. How: This throws the tap count from the tap's point.


	};



	return (


		<div
			ref={ carDivRef }

			className={ cssModObj.birCarDiv }

			onClick={ tapCelFun }
		>{ /* What: Birthday Card Div Element. Why: The card fills the screen, its layers stacked in it, and catches taps. How: This holds the stars, the balloons, the greeting, and the confetti canvas, in painting order. */ }


			<div
				className={ cssModObj.staSkyDiv }

				aria-hidden='true'
			>{ /* What: Star Sky Div Element. Why: The night sky is scattered with stars, decoration a screen reader should skip. How: This holds the stars, covering the card. */ }


				{ STA_DOT_ARR.map( ( staDotObj, dotIndNum ) => ( // What: Star Map Call. Why: Every star in the scatter needs a dot. How: This renders one per row, keyed by its index.


					<span
						key={ dotIndNum }

						className={` ${ cssModObj.staDotSpa }   ${ staDotObj.bigBoo ? cssModObj.staDotSpaBig : '' } `}

						style={{
							left    : staDotObj.lefStr,
							opacity : staDotObj.opaStr,
							top     : staDotObj.topStr
						}}
					/> // What: Star Dot Span Element. Why: Each star is a small white dot. How: This places it by its row, at its brightness.


				))}


			</div>


			<div
				ref={ balSkyRef }

				className={ cssModObj.balSkyDiv }

				aria-hidden='true'
			>{ /* What: Balloon Sky Div Element. Why: Balloons float up behind the greeting, decoration a screen reader should skip. How: This holds the balloons, covering the card, for balloons.ts to move. */ }


				{ Array.from( Array( 7 ).keys(), ( balIndNum ) => ( // What: Balloon Map Call. Why: Seven balloons rise across the card. How: This renders one per index, each in the next party color.


					<svg
						key={ balIndNum }

						className={ cssModObj.balFloSvg }

						viewBox='-18 -21 36 64'
					>{ /* What: Balloon Float SVG Element. Why: Each balloon is a small drawing that rises. How: This draws the body, its shine, and its string around the body's center. */ }


						<ellipse
							style={{ fill : `var( ${ PAR_TOK_ARR[ balIndNum % PAR_TOK_ARR.length ] } )` }}

							rx='17.5'
							ry='20.7'
						/>{ /* What: Balloon Body Ellipse Element. Why: The balloon is an oval. How: This fills it in the balloon's party color. */ }

						<ellipse
							className={ cssModObj.balShiEll }

							style={{ fill : 'var( --bir-whi-col )' }} // Birthday White Color = #FFFFFF

							cx='-4.6'
							cy='-5.5'
							rx='4.6'
							ry='3.7'
						/>{ /* What: Balloon Shine Ellipse Element. Why: A glint makes the balloon look round and glossy. How: This draws a faint white spot up and to the left. */ }

						<line
							className={ cssModObj.balStrLin }

							style={{ stroke : `var( ${ PAR_TOK_ARR[ balIndNum % PAR_TOK_ARR.length ] } )` }}

							strokeWidth='0.8'
							x1='0'
							x2='0'
							y1='20.7'
							y2='42.7'
						/>{ /* What: Balloon String Line Element. Why: The balloon trails a string. How: This draws a faint line down from the body in its color. */ }


					</svg>


				))}


			</div>



			<div className={ cssModObj.birMesDiv }>{ /* What: Birthday Message Div Element. Why: The greeting, wish, cake, and invitation stack in the middle of the card. How: This centers them above the floating bar. */ }


				<h1
					ref={ titHeaRef }

					className={ cssModObj.birTitHea }
				>{ /* What: Birthday Title Heading Element. Why: The greeting leads the card. How: This wishes a Happy Birthday over two or three lines, adding the recipient's name on its own line when the link carries one. */ }


					<span
						ref={ titTopRef }

						className={ cssModObj.titTopSpa }
					><span aria-hidden='true'>🎉</span> Happy</span>{ /* What: Title Top Span Element. Why: The greeting starts with Happy, after a party popper. How: This sets the line in white with a warm glow, the popper hidden from screen readers. */ }

					{ ' ' }

					<span
						ref={ titMaiRef }

						className={ cssModObj.titMaiSpa }
					>Birthday{ namParStr ? ',' : '!' }</span>{ /* What: Title Main Span Element. Why: Birthday is the greeting's biggest line. How: This sets it in a rainbow, ending in a comma before a name or an exclamation mark without one. */ }

					{ namParStr && ( // What: Name Line Check. Why: A shared link can name the recipient. How: This renders the name on its own line only when the link carries one.


						<>{ /* What: Name Line Fragment. Why: The name needs a space before it for screen readers, as well as its own line. How: This groups the space and the line. */ }


							{ ' ' }

							<span
								ref={ titNamRef }

								className={ cssModObj.titMaiSpa }
							>{ namParStr }!</span>{ /* What: Title Main Span Element. Why: The recipient's name is as big as Birthday. How: This sets the name and an exclamation mark in the same rainbow. */ }


						</>


					) }


				</h1>

				<p
					ref={ subParRef }

					className={ cssModObj.birSubPar }
				>Hope your day is filled with joy, laughter,<br />and everything you love! <span aria-hidden='true'>🎁✨</span></p>{ /* What: Birthday Subtitle Paragraph Element. Why: A wish follows the greeting. How: This sets it in the decorative font over two lines, its gift and sparkles hidden from screen readers. */ }



				<svg
					ref={ cakSvgRef }

					className={ cssModObj.birCakSvg }

					viewBox='0 0 140 110'

					aria-hidden='true'
				>{ /* What: Birthday Cake SVG Element. Why: A two-tier cake with candles is the card's centerpiece, decoration a screen reader should skip. How: This draws its shadow, tiers, icing, candles, flames, and sprinkles. */ }


					<ellipse
						className={ cssModObj.cakShaEll }

						style={{ fill : 'var( --bir-sha-col )' }} // Birthday Shadow Color = #3A1A6E

						cx='70'
						cy='100'
						rx='55'
						ry='8'
					/>{ /* What: Cake Shadow Ellipse Element. Why: The cake should sit on something. How: This draws a soft dark oval under it. */ }

					<rect
						style={{ fill : 'var( --bir-red-col )' }} // Birthday Red Color = #FF6B6B

						height='34'
						rx='6'
						width='100'
						x='20'
						y='68'
					/>{ /* What: Bottom Tier Rect Element. Why: The cake's base is a wide coral tier. How: This draws it with rounded corners. */ }

					<rect
						className={ cssModObj.cakHigRec }

						style={{ fill : 'var( --bir-boh-col )' }} // Birthday Bottom-Highlight Color = #FF9A9A

						height='10'
						width='100'
						x='20'
						y='68'
					/>{ /* What: Cake Highlight Rect Element. Why: The bottom tier's top catches the light. How: This draws a faint pale band along it. */ }

					{ ICI_BOT_ARR.map( ( iciXcoNum ) => ( // What: Bottom Icing Map Call. Why: The bottom tier's edge is trimmed with icing. How: This renders a dollop at each point, keyed by its position.


						<ellipse
							key={ iciXcoNum }

							style={{ fill : 'var( --bir-whi-col )' }} // Birthday White Color = #FFFFFF

							cx={ iciXcoNum }
							cy='68'
							rx='6'
							ry='4'
						/> // What: Icing Dollop Ellipse Element. Why: Each dollop is a small white oval. How: This draws it on the tier's edge.


					))}

					<rect
						style={{ fill : 'var( --bir-yel-col )' }} // Birthday Yellow Color = #FFD93D

						height='28'
						rx='6'
						width='80'
						x='30'
						y='44'
					/>{ /* What: Top Tier Rect Element. Why: A narrower yellow tier sits on top. How: This draws it with rounded corners. */ }

					<rect
						className={` ${ cssModObj.cakHigRec }   ${ cssModObj.cakHigRecTop } `}

						style={{ fill : 'var( --bir-toh-col )' }} // Birthday Top-Highlight Color = #FFE97D

						height='10'
						width='80'
						x='30'
						y='44'
					/>{ /* What: Cake Highlight Rect Element. Why: The top tier's top catches the light. How: This draws a pale band along it, a little stronger than the bottom tier's. */ }

					{ ICI_TOP_ARR.map( ( iciXcoNum ) => ( // What: Top Icing Map Call. Why: The top tier's edge is trimmed with icing. How: This renders a dollop at each point, keyed by its position.


						<ellipse
							key={ iciXcoNum }

							style={{ fill : 'var( --bir-whi-col )' }} // Birthday White Color = #FFFFFF

							cx={ iciXcoNum }
							cy='44'
							rx='5'
							ry='3.5'
						/> // What: Icing Dollop Ellipse Element. Why: Each dollop is a small white oval. How: This draws it on the tier's edge.


					))}


					{ CAD_ROW_ARR.map( ( cadRowObj ) => ( // What: Candle Map Call. Why: Three candles stand on the cake, each lit. How: This renders each candle and its flame, keyed by its position.


						<g key={ cadRowObj.xcoNum }>{ /* What: Candle Group Element. Why: A candle and its flame belong together. How: This groups them. */ }


							<rect
								style={{ fill : cadRowObj.colStr }}

								height='18'
								rx='3'
								width='8'
								x={ cadRowObj.xcoNum }
								y='26'
							/>{ /* What: Candle Rect Element. Why: Each candle is a small colored stick. How: This draws it in its row's color. */ }

							<g className={` ${ cssModObj.cakFlaGro }   ${ cadRowObj.modStr } `}>{ /* What: Cake Flame Group Element. Why: Each flame flickers, out of step with the others. How: This groups the flame's three layers so they flicker together from its base. */ }


								<ellipse
									style={{ fill : 'var( --bir-yel-col )' }} // Birthday Yellow Color = #FFD93D

									cx={ cadRowObj.xcoNum + 4 }
									cy='22'
									rx='3.5'
									ry='5'
								/>{ /* What: Flame Outer Ellipse Element. Why: The flame glows yellow. How: This draws its outer oval. */ }

								<ellipse
									className={ cssModObj.flaMidEll }

									style={{ fill : 'var( --bir-red-col )' }} // Birthday Red Color = #FF6B6B

									cx={ cadRowObj.xcoNum + 4 }
									cy='23'
									rx='2'
									ry='3'
								/>{ /* What: Flame Middle Ellipse Element. Why: The flame burns redder inside. How: This draws a smaller, softer red oval. */ }

								<ellipse
									style={{ fill : 'var( --bir-whi-col )' }} // Birthday White Color = #FFFFFF

									cx={ cadRowObj.xcoNum + 4 }
									cy='21.5'
									rx='1'
									ry='1.5'
								/>{ /* What: Flame Core Ellipse Element. Why: The flame's hottest point is white. How: This draws a tiny white oval at its heart. */ }


							</g>


						</g>


					))}


					{ SPR_ROW_ARR.map( ( sprRowObj ) => ( // What: Sprinkle Map Call. Why: Sprinkles dot the bottom tier. How: This renders one tilted strip per row, keyed by its position.


						<rect
							key={ `${ sprRowObj.xcoNum }-${ sprRowObj.ycoNum }` }

							style={{ fill : sprRowObj.colStr }}

							height='2.5'
							rx='1'
							transform={ `rotate( ${ sprRowObj.angNum }, ${ sprRowObj.xcoNum }, ${ sprRowObj.ycoNum } )` }
							width='5'
							x={ sprRowObj.xcoNum }
							y={ sprRowObj.ycoNum }
						/> // What: Sprinkle Rect Element. Why: Each sprinkle is a tiny colored strip. How: This draws it at its row's spot, tilted about its corner.


					))}


				</svg>



				{ !redMotBoo && ( // What: Invitation Check. Why: Only moving confetti can answer a tap, so the invitation is left out under reduced motion. How: This renders the invitation only when motion isn't reduced.


					<p
						ref={ tapParRef }

						className={ cssModObj.birTapPar }
					>Tap anywhere for more confetti! <span aria-hidden='true'>🎊</span></p> // What: Birthday Tap Paragraph Element. Why: A visitor may not guess the card answers taps. How: This invites one in quiet white under the cake, its confetti ball hidden from screen readers.


				) }


			</div>



			{ !redMotBoo && ( // What: Confetti Canvas Check. Why: Confetti never flies under reduced motion. How: This renders the canvas only when motion isn't reduced.


				<canvas
					ref={ conCanRef }

					className={ cssModObj.birConCan }

					aria-hidden='true'
				/> // What: Birthday Confetti Canvas Element. Why: The confetti is drawn over everything, decoration a screen reader should skip. How: This covers the card for confetti.ts to draw on.


			) }


		</div>


	);


}

// #endregion BirCarCom

// #endregion Components



// #region Module Init

gsap.registerPlugin( useGSAP ); // What: Plugin Registration Call. Why: GSAP's React hook has to be registered before the timeline uses it. How: This registers it once, when the card's code loads.

// #endregion Module Init



// #region Exports

export { BirCarCom }; // What: Named Export. Why: The card catalog loads the card on demand. How: This exports the card's component by name.

// #endregion Exports


