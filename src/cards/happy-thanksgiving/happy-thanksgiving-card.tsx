


// #region Imports

import cssModObj from './happy-thanksgiving-card.module.css'; // What: CSS Module Object. Why: The card's layout, lettering, illustrations, and leaves are styled in its own module. How: This maps each class name in happy-thanksgiving-card.module.css to its scoped name.


import { cdnPowFun } from '../../utils/rhythm.ts'; // What: Core-Design-Number Power Function. Why: The turkey's wobble and the leaves' spin sit on the scale as powers of the core design number. How: This returns that power.
import { durMilFun } from '../../utils/rhythm.ts'; // What: Duration Millisecond Function. Why: Every duration in the timeline and the leaves' fall times are steps on the duration scale. How: This returns a step's length in milliseconds.
import { durSecFun } from '../../utils/rhythm.ts'; // What: Duration Second Function. Why: Every duration in the timeline is a step on the duration scale, and GSAP takes seconds. How: This returns a step's length in seconds.
import { gsaEasFun } from '../../ui/gsap-ease.ts'; // What: GSAP Easing Function. Why: GSAP can't read the stylesheet's cubic-bezier curves on its own. How: This registers an easing token as a named GSAP ease.
import { gsap      } from 'gsap';                  // What: GSAP. Why: The card plays as one timeline of entrances. How: This is the animation library that builds and plays it.
import { redMotFun } from '../../utils/motion.ts'; // What: Reduce Motion Function. Why: A visitor who asked for less motion should get the finished card at once. How: This reports whether reduced motion is on.
import { rhyPxlFun } from '../../utils/rhythm.ts'; // What: Rhythm Pixel Function. Why: The entrances' slides and the leaves' sizes and drift are spacing steps. How: This returns a step's size in pixels.
import { staLeaFun } from './leaf-fall.ts';        // What: Start Leaf Function. Why: Leaves fall over the card. How: This starts them and returns the function that stops them.
import { useGSAP   } from '@gsap/react';           // What: Use GSAP. Why: The timeline has to be built after the card renders and undone when it leaves. How: This GSAP hook runs it in a context it reverts on unmount.
import { useRef    } from 'react';                 // What: Use Ref. Why: The timeline animates specific elements. How: Each animated element gets a ref.


import type { JSX       } from 'react';          // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.
import type { LeaSetTyp } from './leaf-fall.ts'; // What: Leaf Settings Type. Why: The card picks the leaves' colors, amount, and ranges. How: This types those settings.

// #endregion Imports



/**
 * happy-thanksgiving-card.tsx = Happy Thanksgiving Card
 *
 * @summary
 * The Happy Thanksgiving card: on a warm autumn gradient, a cornucopia slides
 * in from the left and its fruit and vegetables pop out one by one, a turkey
 * rises beside it and fans out its tail, the Happy Thanksgiving heading rises
 * into view, and a short handwritten message follows, while autumn leaves
 * fall over everything. Once in place the turkey keeps rocking gently. Every
 * duration, distance, and angle is a step on the design scale, and the curves
 * are the stylesheet's easing tokens. Under reduced motion the card opens
 * finished, without falling leaves or the turkey's rocking. Converted from
 * TechGeek.support's original.
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

/**
 * GRA_POS_ARR = Grape Position Array
 *
 * @summary
 * Where the five grapes sit in the cornucopia's drawing, each row a grape's
 * center: xcoNum, its X-Coordinate Number, and ycoNum, its Y-Coordinate
 * Number, both in the drawing's own units.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const GRA_POS_ARR = [ // What: Grape Position Array. Why: The grapes are five identical circles at different spots. How: The cornucopia draws one circle per row.


	{ xcoNum : 26, ycoNum : 80 },
	{ xcoNum : 34, ycoNum : 74 },
	{ xcoNum : 42, ycoNum : 72 },
	{ xcoNum : 30, ycoNum : 70 },
	{ xcoNum : 38, ycoNum : 66 }


];



const LEA_COL_ARR = [ // What: Leaf Color Array. Why: The falling leaves come in a range of autumn browns, golds, and oranges. How: Each fall, a leaf picks one of these at random, each a token the leaf's own color reads from the card's root.


	'var( --tha-cin-col )', // Thanksgiving Cinnamon Color = #D2691E
	'var( --tha-tan-col )', // Thanksgiving Tan Color = #CD853F
	'var( --tha-sie-col )', // Thanksgiving Sienna Color = #A0522D
	'var( --tha-och-col )', // Thanksgiving Ochre Color = #B8860B
	'var( --tha-gol-col )', // Thanksgiving Gold Color = #DAA520
	'var( --tha-bro-col )', // Thanksgiving Brown Color = #8B4513
	'var( --tha-ora-col )', // Thanksgiving Orange Color = #FF8C00
	'var( --tha-ter-col )'  // Thanksgiving Terracotta Color = #E2703A


];



/**
 * TUR_FEA_ARR = Turkey Feather Array
 *
 * @summary
 * The turkey's five tail feathers, fanned from left to right, each row a
 * feather: colStr, its Color String, a token the card's root defines, and
 * rotNum, its Rotation Number, the angle in degrees it's turned around the
 * base of the tail in the drawing's own space. The outer pair is deep red,
 * the next pair gold, and the middle one orange.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const TUR_FEA_ARR = [ // What: Turkey Feather Array. Why: The tail is five identical feathers at different angles and colors. How: The turkey draws one feather per row, in order, so the later ones overlap the earlier.


	{ colStr : 'var( --tha-fea-col )', rotNum : -40 }, // Thanksgiving Feather Color = #8B0000
	{ colStr : 'var( --tha-gol-col )', rotNum : -20 }, // Thanksgiving Gold Color = #DAA520
	{ colStr : 'var( --tha-cin-col )', rotNum : 0   }, // Thanksgiving Cinnamon Color = #D2691E
	{ colStr : 'var( --tha-gol-col )', rotNum : 20  }, // Thanksgiving Gold Color = #DAA520
	{ colStr : 'var( --tha-fea-col )', rotNum : 40  }  // Thanksgiving Feather Color = #8B0000


];

// #endregion Constants



// #region Helpers

// #region leaSetFun

/**
 * leaSetFun = Leaf Settings Function
 *
 * @summary
 * The falling leaves' settings: thirty leaves in the card's autumn colors,
 * each between the rhythm's base and Base Plus 3 steps across, falling the
 * screen's height in the duration scale's Base Plus 13 to Base Plus 15 steps
 * (about 6.1 to 10.7 seconds), drifting up to a Base Plus 7 step to either
 * side and spinning up to the core design number's 20th power in degrees
 * either way over one fall, and waiting up to a Base Plus 13 step before
 * each fall. The count stays literal, since it's an amount rather than a
 * size.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The leaves' colors, count, and ranges.
 *
 * @example
 * ```ts
 * leaSetFun() // => { colStrArr : LEA_COL_ARR, couNum : 30, ... }
 * ```
 *
*/

const leaSetFun = () : LeaSetTyp => ( { // What: Leaf Settings Function. Why: The leaves' ranges sit on the design scale, read at the current root font size. How: This returns the settings.


	colStrArr : LEA_COL_ARR,        // What: Color String Array. Why: The leaves come in the card's autumn colors. How: This hands over the color list.
	couNum    : 30,                 // What: Count Number. Why: Thirty leaves keep the sky busy without hiding the card. How: This sets the count.
	driMaxNum : rhyPxlFun( 'p07' ), // What: Drift Maximum Number. Why: A leaf drifts sideways as it falls. How: This is the Vertical Rhythm Base Plus 7 step, about 104.3px, either way. // Vertical Rhythm Base Plus 7 ~= 104.323px
	durMaxNum : durMilFun( 'p15' ), // What: Duration Maximum Number. Why: The slowest leaves take their time. How: This is the duration scale's Base Plus 15 step. // Duration Animation Base Plus 15 ~= 10,717.0ms
	durMinNum : durMilFun( 'p13' ), // What: Duration Minimum Number. Why: The quickest leaves still float down. How: This is the duration scale's Base Plus 13 step. // Duration Animation Base Plus 13 ~= 6,107.0ms
	sizMaxNum : rhyPxlFun( 'p03' ), // What: Size Maximum Number. Why: The largest leaves read clearly. How: This is the Vertical Rhythm Base Plus 3 step. // Vertical Rhythm Base Plus 3 ~= 33.876px
	sizMinNum : rhyPxlFun( 'bas' ), // What: Size Minimum Number. Why: The smallest leaves look far away. How: This is the Vertical Rhythm Base step. // Vertical Rhythm Base ~= 14.572px
	spiMaxNum : cdnPowFun( 20 ),    // What: Spin Maximum Number. Why: A leaf tumbles as it falls. How: This is the core design number to the 20th power, in degrees, either way. // Core-Design-Number to the Power of 20 ~= 276.993
	waiMaxNum : durMilFun( 'p13' )  // What: Wait Maximum Number. Why: Leaves start at different times. How: This is the duration scale's Base Plus 13 step. // Duration Animation Base Plus 13 ~= 6,107.0ms


} );

// #endregion leaSetFun

// #endregion Helpers



// #region Components

// #region ThaCarCom

/**
 * ThaCarCom = Thanksgiving Card Component
 *
 * @summary
 * The Happy Thanksgiving card, played as one GSAP timeline when it opens,
 * built in useGSAP, so leaving the card or replaying it reverts every tween,
 * and its cleanup stops the falling leaves. The heading, the cornucopia and
 * turkey, and the message stack in the middle of the screen, clear of the
 * card page's floating bar, and the leaves fall over them on a layer of
 * their own. The illustrations and the leaves are decoration, hidden from
 * screen readers, so a screen reader hears just the heading and message.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The card's content and its leaf layer.
 *
 * @example
 * ```tsx
 * ThaCarCom() // => <ThaCarCom />
 * ```
 *
*/

function ThaCarCom () : JSX.Element {


	const carDivRef = useRef< HTMLDivElement >( null );     // What: Card Div Reference. Why: The timeline's cleanup is scoped to the card. How: This holds the card's root.
	const corSvgRef = useRef< SVGSVGElement >( null );      // What: Cornucopia SVG Reference. Why: The cornucopia slides in. How: This holds its drawing.
	const feaGroRef = useRef< SVGGElement >( null );        // What: Feather Group Reference. Why: The tail feathers fan out one by one. How: This holds their group.
	const leaLayRef = useRef< HTMLDivElement >( null );     // What: Leaf Layer Reference. Why: The leaves fall inside it. How: This holds the layer.
	const leaTemRef = useRef< SVGSVGElement >( null );      // What: Leaf Template Reference. Why: Every leaf copies one drawing. How: This holds the hidden template.
	const mesDivRef = useRef< HTMLDivElement >( null );     // What: Message Div Reference. Why: The message rises into view last. How: This holds its block.
	const proGroRef = useRef< SVGGElement >( null );        // What: Produce Group Reference. Why: The fruit and vegetables pop out one by one. How: This holds their group.
	const titHeaRef = useRef< HTMLHeadingElement >( null ); // What: Title Heading Reference. Why: The heading rises into view. How: This holds it.
	const turSvgRef = useRef< SVGSVGElement >( null );      // What: Turkey SVG Reference. Why: The turkey rises in and then rocks. How: This holds its drawing.



	// #region Thanksgiving Timeline

	/**
	 * happy-thanksgiving-card.tsx = Thanksgiving Timeline
	 *
	 * @summary
	 * The card's one timeline, with every start time a step on the duration
	 * scale: the cornucopia slides in from the left at once, overshooting a
	 * little; from Base Plus 4 its eight pieces of produce pop out with a
	 * bounce, a Base Minus 3 step apart; from Base Plus 6 the turkey rises in
	 * and its feathers fan up from their base, a Base Minus 2 step apart; at
	 * Base Plus 8 the heading rises in; and at Base Plus 9 the message
	 * follows and the turkey starts rocking a few degrees back and forth for
	 * as long as the card is open. The leaves start falling as the card
	 * opens. Under reduced motion the timeline jumps straight to its end, and
	 * neither the rocking nor the leaves ever start.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	*/

	useGSAP( () => { // What: Thanksgiving Timeline Hook. Why: The timeline has to run after the card renders and be undone when it leaves. How: This builds and plays it in a GSAP context, returning the leaves' cleanup.


		const bouEasStr = gsaEasFun( 'bou' );                                   // What: Bounce Easing String. Why: The produce pops in with a springy bounce. How: This registers the bounce token and keeps its GSAP name.
		const corOffNum = rhyPxlFun( 'p06' ) * -1;                              // What: Cornucopia Offset Number. Why: The cornucopia slides in from the left. How: This is the Base Plus 6 rhythm step, negated, in pixels. // Vertical Rhythm Base Plus 6 ~= 78.751px
		const decEasStr = gsaEasFun( 'dec' );                                   // What: Decelerate Easing String. Why: Things arriving slow as they land. How: This registers the decelerate token and keeps its GSAP name.
		const entDurNum = durSecFun( 'p06' );                                   // What: Entrance Duration Number. Why: The cornucopia, heading, and message arrive at one unhurried pace. How: This is the Base Plus 6 step, in seconds. // Duration Animation Base Plus 6 ~= 853.0ms
		const feaDurNum = durSecFun( 'p04' );                                   // What: Feather Duration Number. Why: Each feather grows quickly. How: This is the Base Plus 4 step, in seconds. // Duration Animation Base Plus 4 ~= 486.1ms
		const feaGapNum = durSecFun( 'm02' );                                   // What: Feather Gap Number. Why: The feathers fan out one after another. How: This is the Base Minus 2 step between them, in seconds. // Duration Animation Base Minus 2 ~= 89.9ms
		const inoEasStr = gsaEasFun( 'ino' );                                   // What: In-Out Easing String. Why: The turkey rocks smoothly back and forth. How: This registers the in-out token and keeps its GSAP name.
		const mesRisNum = rhyPxlFun( 'p01' );                                   // What: Message Rise Number. Why: The message drifts up a little as it arrives. How: This is the Base Plus 1 rhythm step, in pixels. // Vertical Rhythm Base Plus 1 ~= 19.304px
		const mesStaNum = durSecFun( 'p09' );                                   // What: Message Start Number. Why: The message closes the card after the heading. How: This is the Base Plus 9 step, in seconds from the start. // Duration Animation Base Plus 9 ~= 1,983.0ms
		const oveEasStr = gsaEasFun( 'ove' );                                   // What: Overshoot Easing String. Why: The cornucopia and feathers settle with a little overshoot. How: This registers the gentle overshoot token and keeps its GSAP name.
		const proDurNum = durSecFun( 'p02' );                                   // What: Produce Duration Number. Why: Each piece of produce pops quickly. How: This is the Base Plus 2 step, in seconds. // Duration Animation Base Plus 2 ~= 277.0ms
		const proGapNum = durSecFun( 'm03' );                                   // What: Produce Gap Number. Why: The produce pops one piece after another. How: This is the Base Minus 3 step between them, in seconds. // Duration Animation Base Minus 3 ~= 67.9ms
		const proStaNum = durSecFun( 'p04' );                                   // What: Produce Start Number. Why: The produce pops once the cornucopia is on its way. How: This is the Base Plus 4 step, in seconds from the start. // Duration Animation Base Plus 4 ~= 486.1ms
		const redMotBoo = redMotFun();                                          // What: Reduce Motion Boolean. Why: Under reduced motion the card opens finished and nothing loops. How: This reads the preference once, as the card opens.
		const timLinObj = gsap.timeline( { defaults : { ease : decEasStr } } ); // What: Timeline Object. Why: The whole card plays as one sequence. How: This creates the timeline, its tweens decelerating unless told otherwise.
		const titRisNum = rhyPxlFun( 'p03' );                                   // What: Title Rise Number. Why: The heading rises into place. How: This is the Base Plus 3 rhythm step, in pixels. // Vertical Rhythm Base Plus 3 ~= 33.876px
		const titStaNum = durSecFun( 'p08' );                                   // What: Title Start Number. Why: The heading arrives once the scene is in place. How: This is the Base Plus 8 step, in seconds from the start. // Duration Animation Base Plus 8 ~= 1,497.0ms
		const turDurNum = durSecFun( 'p05' );                                   // What: Turkey Duration Number. Why: The turkey rises a little quicker than the other entrances. How: This is the Base Plus 5 step, in seconds. // Duration Animation Base Plus 5 ~= 643.9ms
		const turRisNum = rhyPxlFun( 'p04' );                                   // What: Turkey Rise Number. Why: The turkey rises into place. How: This is the Base Plus 4 rhythm step, in pixels. // Vertical Rhythm Base Plus 4 ~= 44.876px
		const turStaNum = durSecFun( 'p06' );                                   // What: Turkey Start Number. Why: The turkey joins once the cornucopia has arrived. How: This is the Base Plus 6 step, in seconds from the start. // Duration Animation Base Plus 6 ~= 853.0ms
		const wobAngNum = cdnPowFun( 4 );                                       // What: Wobble Angle Number. Why: The turkey rocks only a few degrees. How: This is the core design number to the 4th power, in degrees, about 3.08.
		const wobDurNum = durSecFun( 'p06' );                                   // What: Wobble Duration Number. Why: Each rock of the turkey takes a calm beat. How: This is the Base Plus 6 step, in seconds. // Duration Animation Base Plus 6 ~= 853.0ms
		const wobTweObj = gsap.to( turSvgRef.current, { duration : wobDurNum, ease : inoEasStr, paused : true, repeat : -1, rotation : wobAngNum, transformOrigin : '50% 100%', yoyo : true } ); // What: Wobble Tween Object. Why: Once in place, the turkey rocks gently for as long as the card is open. How: This tilts it about 3.1 degrees on its feet and back, forever, easing in and out over a Base Plus 6 step, created paused inside the context so leaving the card reverts it. // Duration Animation Base Plus 6 ~= 853.0ms, Core-Design-Number to the Power of 4 ~= 3.080


		timLinObj.fromTo( corSvgRef.current, { autoAlpha : 0, x : corOffNum }, { autoAlpha : 1, duration : entDurNum, ease : oveEasStr, x : 0 }, 0 ); // What: Cornucopia Entrance. Why: The cornucopia opens the card. How: This fades it in as it slides from the left, overshooting a little. // Vertical Rhythm Base Plus 6 ~= -78.751px, Duration Animation Base Plus 6 ~= 853.0ms

		timLinObj.from( proGroRef.current!.children, { duration : proDurNum, ease : bouEasStr, scale : 0, stagger : proGapNum, transformOrigin : '50% 50%' }, proStaNum ); // What: Produce Pop. Why: The cornucopia spills its harvest. How: This grows each piece from nothing with a bounce, one after another. // Duration Animation Base Plus 2 ~= 277.0ms, Duration Animation Base Minus 3 ~= 67.9ms, Duration Animation Base Plus 4 ~= 486.1ms // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.

		timLinObj.fromTo( turSvgRef.current, { autoAlpha : 0, y : turRisNum }, { autoAlpha : 1, duration : turDurNum, y : 0 }, turStaNum ); // What: Turkey Entrance. Why: The turkey joins the cornucopia. How: This fades it in as it rises. // Vertical Rhythm Base Plus 4 ~= 44.876px, Duration Animation Base Plus 5 ~= 643.9ms, Duration Animation Base Plus 6 ~= 853.0ms

		timLinObj.from( feaGroRef.current!.querySelectorAll( 'ellipse' ), { duration : feaDurNum, ease : oveEasStr, scaleY : 0, stagger : feaGapNum, transformOrigin : '50% 100%' }, turStaNum ); // What: Feather Fan. Why: The turkey fans out its tail. How: This grows each feather up from its base, one after another, overshooting a little. // Duration Animation Base Plus 4 ~= 486.1ms, Duration Animation Base Minus 2 ~= 89.9ms, Duration Animation Base Plus 6 ~= 853.0ms // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.

		timLinObj.fromTo( titHeaRef.current, { autoAlpha : 0, y : titRisNum }, { autoAlpha : 1, duration : entDurNum, y : 0 }, titStaNum ); // What: Heading Entrance. Why: The greeting arrives once the scene is set. How: This fades it in as it rises. // Vertical Rhythm Base Plus 3 ~= 33.876px, Duration Animation Base Plus 6 ~= 853.0ms, Duration Animation Base Plus 8 ~= 1,497.0ms
		timLinObj.fromTo( mesDivRef.current, { autoAlpha : 0, y : mesRisNum }, { autoAlpha : 1, duration : entDurNum, y : 0 }, mesStaNum ); // What: Message Entrance. Why: The message closes the card. How: This fades it in as it rises. // Vertical Rhythm Base Plus 1 ~= 19.304px, Duration Animation Base Plus 6 ~= 853.0ms, Duration Animation Base Plus 9 ~= 1,983.0ms



		if ( redMotBoo ) timLinObj.progress( 1 ); // What: Reduced Motion Jump. Why: A visitor who asked for less motion should see the finished card at once. How: This jumps the timeline to its end.

		else timLinObj.call( () => { wobTweObj.play(); }, [], mesStaNum ); // What: Wobble Start Call. Why: The turkey starts rocking once the scene is in place, but never under reduced motion. How: This plays the paused wobble at the Base Plus 9 step. // Duration Animation Base Plus 9 ~= 1,983.0ms



		const stoLeaFun = redMotBoo ? () => {} : staLeaFun( leaLayRef.current!, leaTemRef.current!, cssModObj.leaFalSvg, leaSetFun() ); // What: Stop Leaf Function. Why: The leaves fall from the start, but never under reduced motion, and the cleanup has to stop them. How: This starts them in the leaf layer and keeps their stop function, or a no-op under reduced motion. // What: Non-Null Note. Why: TypeScript can't see that the refs are set. How: useGSAP runs after the render that attaches them.



		return () => stoLeaFun(); // What: Leaf Cleanup Return. Why: The leaves must stop when the card replays or closes. How: This returns the function that calls the stop function, which GSAP runs as it reverts the timeline.


	}, { scope : carDivRef } ); // What: Hook Options. Why: The timeline is built once, when the card opens, and its cleanup is tied to the card. How: This scopes the context to the card's root, with no dependencies.

	// #endregion Thanksgiving Timeline



	return (


		<div
			ref={ carDivRef }

			className={ cssModObj.thaCarDiv }
		>{ /* What: Thanksgiving Card Div Element. Why: The card fills the screen with an autumn sky. How: This holds the content and the leaf layer above it. */ }


			<div className={ cssModObj.carConDiv }>{ /* What: Card Content Div Element. Why: The greeting, illustrations, and message stack in the middle. How: This centers them in a column clear of the floating bar. */ }


				<h1
					ref={ titHeaRef }

					className={ cssModObj.thaTitHea }
				>Happy Thanksgiving</h1>{ /* What: Thanksgiving Title Heading Element. Why: The greeting leads the card. How: This wishes a Happy Thanksgiving in big cream lettering. */ }



				<div className={ cssModObj.illRowDiv }>{ /* What: Illustration Row Div Element. Why: The cornucopia and turkey stand side by side. How: This lines them up along their bottoms. */ }


					<svg
						ref={ corSvgRef }

						className={ cssModObj.corIllSvg }

						height='200'
						viewBox='0 0 260 200'
						width='260'

						aria-hidden='true'
					>{ /* What: Cornucopia Illustration SVG Element. Why: A horn of plenty spills the harvest, decoration a screen reader should skip. How: This draws the horn, its produce, and two leaves, hidden from screen readers. */ }


						<path
							style={{
								fill   : 'var( --tha-hor-col )', // Thanksgiving Horn Color = #C8882A
								stroke : 'var( --tha-out-col )'  // Thanksgiving Outline Color = #8B5E1A
							}}

							d='M30 100 Q60 60 130 80 Q180 90 230 70 Q240 68 245 72 Q250 76 245 82 Q220 100 170 105 Q110 112 60 140 Z'
							strokeWidth='2'
						/>{ /* What: Horn Body Path Element. Why: The horn is a curved, tapering basket. How: This draws it in wicker gold with a brown outline. */ }

						<path
							style={{
								opacity : 'var( --cdn-pow-002-rec )', // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570
								stroke  : 'var( --tha-gol-col )'      // Thanksgiving Gold Color = #DAA520
							}}

							d='M30 100 Q60 75 130 88 Q180 97 230 76'
							fill='none'
							strokeWidth='3'
						/>{ /* What: Horn Shading Path Element. Why: A highlight along the horn rounds it out. How: This draws a faded gold line along its upper curve. */ }


						<g ref={ proGroRef }>{ /* What: Produce Group Element. Why: The produce pops out one piece at a time. How: This holds each piece as its own child, in the order they pop. */ }


							<g>{ /* What: Pumpkin Group Element. Why: The pumpkin pops out whole, stem and all. How: This holds its body, shading, stem, and curl. */ }


								<ellipse
									style={{ fill : 'var( --tha-ter-col )' }} // Thanksgiving Terracotta Color = #E2703A

									cx='52'
									cy='88'
									rx='22'
									ry='18'
								/>{ /* What: Pumpkin Body Ellipse Element. Why: The pumpkin is round and orange. How: This draws its body. */ }

								<ellipse
									style={{
										fill    : 'var( --tha-pum-col )',    // Thanksgiving Pumpkin Color = #D2601A
										opacity : 'var( --cdn-pow-004-rec )' // Core-Design-Number to the Power of 4 Reciprocal ~= 0.325
									}}

									cx='52'
									cy='88'
									rx='14'
									ry='18'
								/>{ /* What: Pumpkin Shading Ellipse Element. Why: A darker middle gives the pumpkin its ribs. How: This draws a faint narrower oval over its body. */ }

								<rect
									style={{ fill : 'var( --tha-umb-col )' }} // Thanksgiving Umber Color = #5C3317

									height='8'
									rx='2'
									width='4'
									x='50'
									y='70'
								/>{ /* What: Pumpkin Stem Rect Element. Why: The pumpkin has a stubby stem. How: This draws a small brown bar on top. */ }

								<path
									style={{ stroke : 'var( --tha-umb-col )' }} // Thanksgiving Umber Color = #5C3317

									d='M54 73 Q62 68 60 76'
									fill='none'
									strokeWidth='1.5'
								/>{ /* What: Pumpkin Curl Path Element. Why: A curling vine finishes the stem. How: This draws a thin brown hook beside it. */ }


							</g>

							<g>{ /* What: Apple Group Element. Why: The apple pops out with its stem. How: This holds its body and stem. */ }


								<circle
									style={{ fill : 'var( --tha-red-col )' }} // Thanksgiving Red Color = #CC2200

									cx='82'
									cy='76'
									r='14'
								/>{ /* What: Apple Body Circle Element. Why: The apple is round and red. How: This draws its body. */ }

								<rect
									style={{ fill : 'var( --tha-umb-col )' }} // Thanksgiving Umber Color = #5C3317

									height='7'
									rx='1.5'
									width='3'
									x='80'
									y='62'
								/>{ /* What: Apple Stem Rect Element. Why: The apple has a stem. How: This draws a thin brown bar on top. */ }


							</g>

							{ GRA_POS_ARR.map( ( graPosObj ) => ( // What: Grape Map Call. Why: The bunch is five grapes, each popping out on its own. How: This draws one circle per row.


								<circle
									key={ `${ graPosObj.xcoNum }-${ graPosObj.ycoNum }` }

									style={{
										fill    : 'var( --tha-gra-col )',    // Thanksgiving Grape Color = #6B2FA0
										opacity : 'var( --cdn-pow-001-rec )' // Core-Design-Number to the Power of 1 Reciprocal ~= 0.755
									}}

									cx={ graPosObj.xcoNum }
									cy={ graPosObj.ycoNum }
									r='7'
								/> // What: Grape Circle Element. Why: Each grape is a small purple circle. How: This draws one, slightly see-through so the bunch overlaps softly.


							))}

							<g>{ /* What: Corn Group Element. Why: The ear of corn pops out with its husk line. How: This holds its ear and line. */ }


								<ellipse
									style={{ fill : 'var( --tha-gol-col )' }} // Thanksgiving Gold Color = #DAA520

									cx='70'
									cy='62'
									rx='9'
									ry='20'
									transform='rotate(-30,70,62)'
								/>{ /* What: Corn Ear Ellipse Element. Why: The corn is a long golden ear, tipped back. How: This draws it tilted. */ }

								<line
									style={{
										opacity : 'var( --cdn-pow-002-rec )', // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570
										stroke  : 'var( --tha-och-col )'      // Thanksgiving Ochre Color = #B8860B
									}}

									strokeWidth='1'
									x1='62'
									x2='78'
									y1='50'
									y2='74'
								/>{ /* What: Corn Husk Line Element. Why: A line down the ear marks its kernels' rows. How: This draws a faint darker gold stroke along it. */ }


							</g>


						</g>


						<ellipse
							style={{
								fill    : 'var( --tha-fol-col )',    // Thanksgiving Foliage Color = #5A7A2A
								opacity : 'var( --cdn-pow-001-rec )' // Core-Design-Number to the Power of 1 Reciprocal ~= 0.755
							}}

							cx='20'
							cy='95'
							rx='12'
							ry='6'
							transform='rotate(20,20,95)'
						/>{ /* What: Lower Leaf Ellipse Element. Why: Green leaves tuck around the produce. How: This draws one below the grapes. */ }

						<ellipse
							style={{
								fill    : 'var( --tha-fol-col )',    // Thanksgiving Foliage Color = #5A7A2A
								opacity : 'var( --cdn-pow-001-rec )' // Core-Design-Number to the Power of 1 Reciprocal ~= 0.755
							}}

							cx='48'
							cy='58'
							rx='10'
							ry='5'
							transform='rotate(-15,48,58)'
						/>{ /* What: Upper Leaf Ellipse Element. Why: Green leaves tuck around the produce. How: This draws one above the pumpkin. */ }


					</svg>



					<svg
						ref={ turSvgRef }

						className={ cssModObj.turIllSvg }

						height='220'
						viewBox='0 0 200 220'
						width='200'

						aria-hidden='true'
					>{ /* What: Turkey Illustration SVG Element. Why: A turkey fans its tail beside the cornucopia, decoration a screen reader should skip. How: This draws the turkey, hidden from screen readers. */ }


						<g ref={ feaGroRef }>{ /* What: Feather Group Element. Why: The feathers fan out one at a time. How: This holds each feather as its own child, in the order they fan. */ }


							{ TUR_FEA_ARR.map( ( turFeaObj ) => ( // What: Feather Map Call. Why: The tail is five feathers. How: This draws one per row.


								<g
									key={ turFeaObj.rotNum }

									transform={ `rotate( ${ turFeaObj.rotNum } 100 160 )` }
								>{ /* What: Feather Turn Group Element. Why: Each feather is turned around the base of the tail, while the feather itself grows up from its own base. How: This turns its feather by the row's angle. */ }


									<ellipse
										style={{ fill : turFeaObj.colStr }}

										cx='100'
										cy='130'
										rx='18'
										ry='55'
									/>{ /* What: Feather Ellipse Element. Why: Each feather is a long oval. How: This draws one in the row's color. */ }


								</g>


							))}


						</g>


						<ellipse
							style={{ fill : 'var( --tha-bro-col )' }} // Thanksgiving Brown Color = #8B4513

							cx='100'
							cy='155'
							rx='42'
							ry='38'
						/>{ /* What: Body Ellipse Element. Why: The turkey's body is round and brown. How: This draws it over the base of the tail. */ }

						<ellipse
							style={{ fill : 'var( --tha-sie-col )' }} // Thanksgiving Sienna Color = #A0522D

							cx='78'
							cy='158'
							rx='20'
							ry='28'
							transform='rotate(-15,78,158)'
						/>{ /* What: Wing Ellipse Element. Why: A lighter wing rests on the body. How: This draws it tilted on the left. */ }

						<ellipse
							style={{ fill : 'var( --tha-bro-col )' }} // Thanksgiving Brown Color = #8B4513

							cx='100'
							cy='118'
							rx='16'
							ry='22'
						/>{ /* What: Neck Ellipse Element. Why: The neck joins the head to the body. How: This draws it above the body. */ }

						<circle
							style={{ fill : 'var( --tha-tan-col )' }} // Thanksgiving Tan Color = #CD853F

							cx='100'
							cy='98'
							r='20'
						/>{ /* What: Head Circle Element. Why: The turkey's head is round and tan. How: This draws it on the neck. */ }

						<circle
							style={{ fill : 'var( --tha-eye-col )' }} // Thanksgiving Eye Color = #1a1a1a

							cx='107'
							cy='93'
							r='4'
						/>{ /* What: Eye Circle Element. Why: The turkey looks to the right. How: This draws a dark eye. */ }

						<circle
							style={{ fill : 'var( --tha-gli-col )' }} // Thanksgiving Glint Color = white

							cx='108.5'
							cy='91.5'
							r='1.2'
						/>{ /* What: Eye Glint Circle Element. Why: A glint brings the eye to life. How: This draws a white dot on it. */ }

						<polygon
							style={{ fill : 'var( --tha-gol-col )' }} // Thanksgiving Gold Color = #DAA520

							points='114,98 124,96 114,102'
						/>{ /* What: Beak Polygon Element. Why: The turkey has a short beak. How: This draws a gold triangle pointing right. */ }

						<ellipse
							style={{ fill : 'var( --tha-red-col )' }} // Thanksgiving Red Color = #CC2200

							cx='112'
							cy='104'
							rx='5'
							ry='8'
						/>{ /* What: Wattle Ellipse Element. Why: A red wattle hangs below the beak. How: This draws it. */ }

						<g
							style={{ stroke : 'var( --tha-gol-col )' }} // Thanksgiving Gold Color = #DAA520

							fill='none'
							strokeLinecap='round'
						>{ /* What: Feet Group Element. Why: Both feet share their gold, round-ended strokes. How: This sets those once for the legs and toes. */ }


							<path
								d='M 88 192 L 82 210 M 112 192 L 118 210'
								strokeWidth='3'
							/>{ /* What: Leg Path Element. Why: The turkey stands on two legs. How: This draws both. */ }

							<path
								d='M 82 210 L 72 214 M 82 210 L 80 218 M 118 210 L 128 214 M 118 210 L 120 218'
								strokeWidth='2.5'
							/>{ /* What: Toe Path Element. Why: Each foot ends in two toes. How: This draws all four, a little thinner than the legs. */ }


						</g>


					</svg>


				</div>



				<div
					ref={ mesDivRef }

					className={ cssModObj.mesBloDiv }
				>{ /* What: Message Block Div Element. Why: The message and its wish read as one handwritten note. How: This holds both, a line apart. */ }


					<p className={ cssModObj.mesTexPar }>May your table overflow with warmth, your heart with gratitude, and your days with the joy of those you hold dear.</p>{ /* What: Message Text Paragraph Element. Why: The card's wish for the recipient. How: This holds the message. */ }

					<p className={ cssModObj.wisLinPar }><span aria-hidden='true'>🍂</span> Wishing you a beautiful Thanksgiving <span aria-hidden='true'>🍂</span></p>{ /* What: Wish Line Paragraph Element. Why: The card signs off with a seasonal wish between two fallen leaves. How: This holds the wish, its leaf emoji hidden from screen readers so they aren't read out. */ }


				</div>


			</div>



			<div
				ref={ leaLayRef }

				className={ cssModObj.leaLayDiv }

				aria-hidden='true'
			>{ /* What: Leaf Layer Div Element. Why: The leaves fall over everything, decoration a screen reader should skip. How: This holds the hidden leaf template and every falling leaf leaf-fall.ts copies from it. */ }


				<svg
					ref={ leaTemRef }

					className={ cssModObj.leaTemSvg }

					viewBox='0 0 40 40'
				>{ /* What: Leaf Template SVG Element. Why: Every falling leaf copies one drawing, tinted its own color. How: This draws the leaf in the current color, hidden. */ }


					<path
						d='M20 2 C10 2 2 10 2 20 C2 30 10 38 20 38 C20 38 20 20 20 2Z'
						fill='currentColor'
					/>{ /* What: Left Half Path Element. Why: The leaf is two halves either side of its midrib. How: This draws the left half in the leaf's color. */ }

					<path
						style={{ opacity : 'var( --cdn-pow-001-rec )' }} // Core-Design-Number to the Power of 1 Reciprocal ~= 0.755

						d='M20 2 C30 2 38 10 38 20 C38 30 30 38 20 38 C20 38 20 20 20 2Z'
						fill='currentColor'
					/>{ /* What: Right Half Path Element. Why: A lighter half makes the leaf look folded. How: This draws the right half, faded. */ }

					<g style={{ stroke : 'var( --tha-umb-col )' }}>{ /* What: Vein Group Element. Why: The leaf's veins share their brown. How: This sets it once for the midrib and side veins. */ }{ /* Thanksgiving Umber Color = #5C3317 */ }


						<line
							style={{ opacity : 'var( --cdn-pow-002-rec )' }} // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570

							strokeWidth='1.2'
							x1='20'
							x2='20'
							y1='2'
							y2='38'
						/>{ /* What: Midrib Line Element. Why: A vein runs down the middle of the leaf. How: This draws it top to bottom. */ }

						<path
							style={{ opacity : 'var( --cdn-pow-003-rec )' }} // Core-Design-Number to the Power of 3 Reciprocal ~= 0.430

							d='M 20 12 L 10 22 M 20 18 L 30 26'
							strokeWidth='0.8'
						/>{ /* What: Side Vein Path Element. Why: Two fainter veins branch off the midrib. How: This draws one to each side. */ }


					</g>


				</svg>


			</div>


		</div>


	);


}

// #endregion ThaCarCom

// #endregion Components



// #region Module Init

gsap.registerPlugin( useGSAP ); // What: Plugin Registration Call. Why: GSAP's React hook has to be registered before the timeline uses it. How: This registers it once, when the card's code loads.

// #endregion Module Init



// #region Exports

export { ThaCarCom }; // What: Named Export. Why: The card catalog loads the card on demand. How: This exports the card's component by name.

// #endregion Exports


