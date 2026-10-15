


// #region Imports

import cssModObj from './family-card.module.css'; // What: CSS Module Object. Why: The Family cards' stage, lettering, heart, and photo grid are styled in one module. How: This maps each class name in family-card.module.css to its scoped name.


import { cdnPowFun   } from '../utils/rhythm.ts'; // What: Core-Design-Number Power Function. Why: The greeting grows by a power of the core design number. How: This returns that power.
import { durSecFun   } from '../utils/rhythm.ts'; // What: Duration Second Function. Why: Every duration in the timeline is a step on the duration scale, and GSAP takes seconds. How: This returns a step's length in seconds.
import { gsaEasFun   } from './gsap-ease.ts';     // What: GSAP Easing Function. Why: GSAP can't read the stylesheet's cubic-bezier curves on its own. How: This registers an easing token as a named GSAP ease.
import { gsap        } from 'gsap';               // What: GSAP. Why: The card plays as one long timeline of typed lines, heart reveals, and the photo grid. How: This is the animation library that builds and plays it.
import { redMotFun   } from '../utils/motion.ts'; // What: Reduce Motion Function. Why: A visitor who asked for less motion should get the finished photo grid at once. How: This reports whether reduced motion is on.
import { rhyPxlFun   } from '../utils/rhythm.ts'; // What: Rhythm Pixel Function. Why: The grown greeting keeps a margin from the screen's edges. How: This returns a step's size in pixels.
import { TextPlugin  } from 'gsap/TextPlugin';    // What: Text Plugin. Why: Each line types itself out a letter at a time. How: This GSAP plugin animates an element's text that way.
import { useEffect   } from 'react';              // What: Use Effect. Why: The screen should stay awake while the card plays, and an open photo closes on Escape through its dialog. How: This holds the wake lock's request and release.
import { useGSAP     } from '@gsap/react';        // What: Use GSAP. Why: The timeline has to be built after the card renders and undone when it leaves. How: This GSAP hook runs it in a context it reverts on unmount.
import { useRef      } from 'react';              // What: Use Ref. Why: The timeline animates specific elements. How: Each animated element gets a ref.
import { useState    } from 'react';              // What: Use State. Why: A tapped photo opens full size. How: This holds which photo is open.


import type { JSX } from 'react'; // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * family-card.tsx = Family Card
 *
 * @summary
 * The engine behind the three Family cards (Mother's Day, Father's Day, and
 * the Father's Day prank), which differ only in their words, photos,
 * colors, and font. Each card hands it a record of ten scenes, twelve photos,
 * the order the photo grid shows them in, the closing lines, and how far the
 * greeting grows, plus a class from its own module that sets its colors and
 * font. In each scene a line types itself out with its key words underlined,
 * shrinks away, and a heart opens over that scene's photo and closes again.
 * Then the closing line types and erases itself, the greeting types and grows,
 * and the photo grid wipes in, each photo opening full size when tapped. The
 * heart is a CSS mask scaled over the photo, so it works the same on a
 * phone held upright or sideways. Every duration is a step on the duration
 * scale, and the curves are the stylesheet's easing tokens. Under reduced
 * motion the card opens straight on the finished greeting and photo grid.
 * Built from TechGeek.support's three hand-written copies of one card.
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

type PhoRecTyp = { // What: Photo Record Type. Why: Every photo is shown with a description for screen readers. How: This holds the photo's address and alt text.


	altStr : string, // What: Alternative String. Why: A screen reader describes the photo. How: The photo's alt text reads it.
	imaStr : string  // What: Image String. Why: The photo has to be loaded. How: This is its fingerprinted address.


};



type SceRecTyp = { // What: Scene Record Type. Why: Each scene types one line and underlines its key words. How: This holds the line's three parts; the scene opens its heart over the photo at its own place in the photo list.


	aftStr : string, // What: After String. Why: The line goes on after its key words. How: This is typed after them.
	befStr : string, // What: Before String. Why: The line leads up to its key words. How: This is typed first.
	higStr : string  // What: Highlight String. Why: Each line has key words that get underlined. How: This is typed between the other two parts.


};



type FamCarTyp = { // What: Family Card Type. Why: The three Family cards share every step and differ only in their content. How: This holds everything one card supplies.


	behStr    : string,      // What: Behalf String. Why: The card closes with a line on everyone's behalf. How: This is typed and erased before the greeting.
	finPowArr : number[],    // What: Final Power Array. Why: The greeting grows at the end, by less on a smaller screen. How: This holds the power of the core design number it grows by above 1,024px, at 1,024px and below, at 768px and below, and at 640px and below.
	greStr    : string,      // What: Greeting String. Why: The card ends on its greeting. How: This is typed last and is the card's heading.
	griIndArr : number[],    // What: Grid Index Array. Why: The photo grid shows the photos in its own order. How: This lists each cell's photo index, left to right and top to bottom.
	phoRecArr : PhoRecTyp[], // What: Photo Record Array. Why: The scenes and the grid share one set of photos. How: This holds all twelve, the ten scenes' photos first, in scene order.
	sceRecArr : SceRecTyp[]  // What: Scene Record Array. Why: The card plays its scenes in order. How: This holds all ten.


};

// #endregion Types



// #region Constants

const BRE_WID_ARR = [ 1024, 768, 640 ]; // What: Breakpoint Width Array. Why: The greeting grows less on a smaller screen. How: These are the design package's desktop, tablet, and phone breakpoints, matched to the card's final power steps after the first.

// #endregion Constants



// #region Helpers

const finPowFun = ( finPowArr : number[] ) : number => finPowArr[ BRE_WID_ARR.filter( ( breWidNum ) => innerWidth <= breWidNum ).length ]; // What: Final Power Function. Why: The greeting grows by the step that fits the screen. How: This counts how many breakpoints the window is at or below and picks that step.

// #endregion Helpers



// #region Components

type FccProTyp = { famCarObj : FamCarTyp, theClaStr : string }; // What: Family-Card-Component Props Type. Why: The engine plays one card's content in that card's colors and font. How: This names the card's record and its theme class.

// #region FamCarCom

/**
 * FamCarCom = Family Card Component
 *
 * @summary
 * Plays one Family card. The timeline is built once in useGSAP, so a replay
 * or leaving the card reverts every tween. While it plays, the screen is kept
 * awake through the wake lock, released once the photo grid is in and when
 * the card closes, wherever the browser allows it. The typed lines are
 * hidden from screen readers, which read the whole message instead from a
 * visually hidden copy, ending on the greeting as the card's heading. A
 * tapped photo opens full size in a dialog, which a tap or Escape closes.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.famCarObj - Family Card Object: {@link FamCarTyp}
 * @param props.theClaStr - Theme Class String: The card's own class, which
 *                          sets its background, text color, and font.
 *
 * @returns The card's typed lines, heart stage, and photo grid.
 *
 * @example
 * ```tsx
 * FamCarCom({ famCarObj, theClaStr }) // => <FamCarCom />
 * ```
 *
*/

function FamCarCom ( { famCarObj, theClaStr } : FccProTyp ) : JSX.Element {


	const aftSpaRef = useRef< HTMLSpanElement >( null );         // What: After Span Reference. Why: The line's last part types itself out. How: This holds its span.
	const befSpaRef = useRef< HTMLSpanElement >( null );         // What: Before Span Reference. Why: The line's first part types itself out. How: This holds its span.
	const curSpaRef = useRef< HTMLSpanElement >( null );         // What: Cursor Span Reference. Why: The cursor fades once the greeting is typed. How: This holds its span.
	const expDiaRef = useRef< HTMLDialogElement >( null );       // What: Expanded Dialog Reference. Why: A tapped photo opens in a modal dialog. How: This holds the dialog.
	const famDivRef = useRef< HTMLDivElement >( null );          // What: Family Div Reference. Why: The timeline is scoped to the card. How: This holds the card's root.
	const greSpaRef = useRef< HTMLSpanElement >( null );         // What: Greeting Span Reference. Why: The greeting types itself out and grows. How: This holds its span.
	const griDivRef = useRef< HTMLDivElement >( null );          // What: Grid Div Reference. Why: The photo grid wipes in at the end. How: This holds the grid.
	const higSpaRef = useRef< HTMLSpanElement >( null );         // What: Highlight Span Reference. Why: The line's key words type out and get underlined. How: This holds their span.
	const phoDivRef = useRef< HTMLDivElement >( null );          // What: Photo Div Reference. Why: The heart opens over each scene's photo. How: This holds the masked photo stage.
	const tapParRef = useRef< HTMLParagraphElement >( null );    // What: Tap Paragraph Reference. Why: The tap hint appears with the grid. How: This holds its paragraph.
	const texDivRef = useRef< HTMLDivElement >( null );          // What: Text Div Reference. Why: Each line fades in and shrinks away as a whole. How: This holds the lettering.
	const wakLocRef = useRef< WakeLockSentinel | null >( null ); // What: Wake Lock Reference. Why: The screen should stay on while the card plays. How: This holds the lock, null until granted.

	const [ expIndNum, setExpIndNum ] = useState< number | null >( null ); // What: Expanded Index Number And Setter. Why: Only one photo opens full size at a time. How: This holds the open photo's index, or null.



	useEffect( () => { // What: Wake Lock Effect. Why: A long card shouldn't let the screen dim halfway through. How: This asks for the lock as the card opens and releases it as the card closes.


		navigator.wakeLock?.request( 'screen' ).then( ( wakLocObj ) => { wakLocRef.current = wakLocObj; } ).catch( () => {} ); // What: Wake Lock Request. Why: Not every browser grants a lock, and a refusal shouldn't stop the card. How: This keeps the lock when granted and ignores a refusal.



		return () => { // What: Wake Lock Cleanup. Why: The screen can sleep again once the card closes. How: This releases the lock and forgets it.


			wakLocRef.current?.release(); // What: Lock Release Call. Why: The browser holds the screen on until the lock is released. How: This releases it if one was granted.

			wakLocRef.current = null; // What: Lock Forget Assignment. Why: A released lock shouldn't be released twice. How: This clears the reference.


		};


	}, [] ); // What: Effect Dependency Array. Why: The lock is held once per showing of the card. How: The card page remounts the card for a replay.



	useEffect( () => { // What: Expanded Dialog Effect. Why: Choosing a photo opens the dialog as a modal, which traps focus and closes on Escape. How: This opens it whenever a photo is chosen.


		if ( expIndNum !== null && expDiaRef.current && !expDiaRef.current.open ) expDiaRef.current.showModal(); // What: Show Modal Call. Why: The dialog is in the page but closed until a photo is chosen. How: This opens it as a modal.


	}, [ expIndNum ] ); // What: Effect Dependency Array. Why: The dialog opens each time a photo is chosen. How: expIndNum changes on every choice.



	// #region Family Timeline

	/**
	 * family-card.tsx = Family Timeline
	 *
	 * @summary
	 * The card's one timeline. For each scene: the lettering fades in, the
	 * line types its three parts at a letter every Base Minus 3 step (about
	 * 67.9ms), its key words are underlined, and after a Base Plus 8 hold
	 * (about 1.5s) the lettering shrinks away while the scene's photo is set
	 * under the heart, which opens to cover the screen, holds, and closes.
	 * Then the closing line types and erases itself, the greeting types, the
	 * cursor fades, and the greeting grows by its final step as the photo
	 * grid wipes in, each photo uncovering left to right in random order.
	 * Once the grid is in, the wake lock is released. Under reduced motion
	 * the timeline jumps to its end.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	*/

	useGSAP( () => { // What: Family Timeline Hook. Why: The timeline has to run after the card renders and be undone when it leaves. How: This builds and plays it in a GSAP context.


		const accEasStr = gsaEasFun( 'acc' );                                          // What: Accelerate Easing String. Why: Most of the card's motion speeds up as it goes, as the original's did. How: This registers the accelerate token and keeps its GSAP name.
		const chaDurNum = durSecFun( 'm03' );                                          // What: Character Duration Number. Why: The lines type at a steady pace. How: This is one letter's time, the duration scale's Base Minus 3 step, in seconds. // Duration Animation Base Minus 3 ~= 67.9ms
		const decEasStr = gsaEasFun( 'dec' );                                          // What: Decelerate Easing String. Why: The photos settle as they uncover. How: This registers the decelerate token and keeps its GSAP name.
		const fadDurNum = durSecFun( 'p07' );                                          // What: Fade Duration Number. Why: The lettering, the heart, and the cursor move at one unhurried pace. How: This is the duration scale's Base Plus 7 step, in seconds. // Duration Animation Base Plus 7 ~= 1,130.0ms
		const finScaFun = () : number => Math.min( cdnPowFun( finPowFun( famCarObj.finPowArr ) ), ( innerWidth - 2 * rhyPxlFun( 'p01' ) ) / greSpaRef.current!.offsetWidth, ( innerHeight - 2 * rhyPxlFun( 'p06' ) ) / greSpaRef.current!.offsetHeight ); // What: Final Scale Function. Why: The greeting grows less on a smaller screen, and never past the screen's edges or under the floating bar. How: This raises the core design number to the screen's final power, capped at what fits between Base Plus 1 side margins and Base Plus 6 margins top and bottom, about the bar's height, measured when the growth starts, once the greeting is typed. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.
		const griImaArr = Array.from( griDivRef.current!.querySelectorAll( 'img' ) );  // What: Grid Image Array. Why: Each photo in the grid uncovers on its own. How: This lists the grid's photos. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.
		const holDurNum = durSecFun( 'p08' );                                          // What: Hold Duration Number. Why: Each line and each photo stays up long enough to take in. How: This is the duration scale's Base Plus 8 step, in seconds. // Duration Animation Base Plus 8 ~= 1,497.0ms
		const inoEasStr = gsaEasFun( 'ino' );                                          // What: In-Out Easing String. Why: The underline draws in smoothly, and the grid's photos start in an even spread. How: This registers the in-out token and keeps its GSAP name.
		const oveEasStr = gsaEasFun( 'ove' );                                          // What: Overshoot Easing String. Why: The greeting grows with a little flourish. How: This registers the overshoot token and keeps its GSAP name.
		const phoImaArr = Array.from( phoDivRef.current!.children );                   // What: Photo Image Array. Why: Each scene shows one photo under the heart. How: This lists the stage's photos, one per scene. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.
		const shoDurNum = durSecFun( 'm02' );                                          // What: Show Duration Number. Why: The grid appears almost at once, and its photos start just apart. How: This is the duration scale's Base Minus 2 step, in seconds. // Duration Animation Base Minus 2 ~= 89.9ms
		const timLinObj = gsap.timeline( { defaults : { ease : accEasStr } } );        // What: Timeline Object. Why: The whole card plays as one sequence. How: This creates the timeline, its tweens accelerating unless told otherwise.
		const typSpaArr = [ befSpaRef.current, higSpaRef.current, aftSpaRef.current ]; // What: Typed Span Array. Why: Each line types in three parts. How: This lists their spans in order.
		const undDurNum = durSecFun( 'p02' );                                          // What: Underline Duration Number. Why: The underline draws quickly but visibly. How: This is the duration scale's Base Plus 2 step, in seconds. // Duration Animation Base Plus 2 ~= 277.0ms


		gsap.set( griImaArr, { clipPath : 'inset( 0 100% 0 0 )' } ); // What: Grid Photo Cover. Why: The grid's photos start hidden, ready to uncover. How: This clips each one away from the right.


		for ( const [ sceIndNum, sceRecObj ] of famCarObj.sceRecArr.entries() ) { // What: Scene Loop. Why: Every scene plays the same way with its own line and photo. How: This adds one scene's steps per pass, with its place picking its photo.


			const parStrArr = [ sceRecObj.befStr, sceRecObj.higStr, sceRecObj.aftStr ]; // What: Part String Array. Why: The line types in three parts. How: This lists the parts in order.


			timLinObj.set( typSpaArr, { text : '' } ); // What: Line Clear. Why: Each line starts empty. How: This clears all three parts.

			timLinObj.set( higSpaRef.current, { '--fam-und-sca' : 0 } ); // What: Underline Reset. Why: Each line's underline starts undrawn. How: This sets its scale back to 0.

			timLinObj.set( texDivRef.current, { scale : 1 } ); // What: Lettering Reset. Why: The last line shrank away. How: This restores its size.

			timLinObj.to( texDivRef.current, { autoAlpha : 1, duration : fadDurNum } ); // What: Lettering Fade In. Why: Each line arrives softly. How: This fades the lettering in.


			parStrArr.forEach( ( parStr, parIndNum ) => { // What: Part Typing Loop. Why: The line types one part after another. How: This adds a typing step per part.


				const typDurNum = parStr.length * chaDurNum; // What: Typing Duration Number. Why: Each part types at the same steady pace. How: This is a letter's time per letter.


				timLinObj.to( typSpaArr[ parIndNum ], { duration : typDurNum, ease : 'none', text : parStr } ); // What: Part Typing Step. Why: The part appears letter by letter. How: This types it evenly over its duration.


			} );


			timLinObj.to( higSpaRef.current, { '--fam-und-sca' : 1, duration : undDurNum, ease : inoEasStr } ); // What: Underline Draw. Why: The key words stand out. How: This draws the underline from the left.

			timLinObj.to( texDivRef.current, { autoAlpha : 0, delay : holDurNum, duration : fadDurNum, scale : 0 } ); // What: Lettering Shrink. Why: The line gives way to its photo. How: After the hold, this shrinks and fades the lettering away.

			timLinObj.set( phoImaArr[ sceIndNum ], { autoAlpha : 1 }, '<' ); // What: Photo Show. Why: The scene's photo waits under the closed heart. How: This shows it as the lettering starts to go.

			timLinObj.to( phoDivRef.current, { '--fam-hea-sca' : 1, duration : fadDurNum } ); // What: Heart Open. Why: The photo is revealed through a heart. How: This grows the heart until it covers the screen.

			timLinObj.to( phoDivRef.current, { '--fam-hea-sca' : 0, delay : holDurNum, duration : fadDurNum } ); // What: Heart Close. Why: The photo gives way to the next line. How: After the hold, this shrinks the heart back to nothing.

			timLinObj.set( phoImaArr[ sceIndNum ], { autoAlpha : 0 } ); // What: Photo Hide. Why: The next scene shows its own photo. How: This hides this one.


		}


		timLinObj.set( typSpaArr, { text : '' } ); // What: Closing Clear. Why: The closing line starts empty. How: This clears all three parts.

		timLinObj.set( texDivRef.current, { scale : 1 } ); // What: Closing Lettering Reset. Why: The last line shrank away. How: This restores its size.

		timLinObj.to( texDivRef.current, { autoAlpha : 1, duration : fadDurNum } ); // What: Closing Fade In. Why: The closing line arrives softly. How: This fades the lettering in.

		timLinObj.to( befSpaRef.current, { // What: Behalf Typing. Why: The card speaks for everyone before it closes. How: This types the line, holds it, and erases it again.


			duration    : famCarObj.behStr.length * chaDurNum, // What: Duration. Why: The line types at the same steady pace. How: This is a letter's time per letter.
			ease        : 'none',                              // What: Ease. Why: Typing is even. How: This keeps the pace constant.
			repeat      : 1,                                   // What: Repeat. Why: The line is erased after it's typed. How: This plays the typing once more.
			repeatDelay : holDurNum,                           // What: Repeat Delay. Why: The line stays up long enough to read. How: This holds it before erasing.
			text        : famCarObj.behStr,                    // What: Text. Why: This is the closing line. How: This types it.
			yoyo        : true                                 // What: Yoyo. Why: Erasing reads as typing backward. How: This plays the repeat in reverse.


		} );

		timLinObj.to( texDivRef.current, { autoAlpha : 0, duration : fadDurNum } ); // What: Behalf Fade Out. Why: The greeting arrives on its own. How: This fades the empty lettering out.

		timLinObj.to( texDivRef.current, { autoAlpha : 1, duration : fadDurNum } ); // What: Greeting Fade In. Why: The greeting gets its own entrance. How: This fades the lettering back in.

		timLinObj.to( greSpaRef.current, { // What: Greeting Typing. Why: The card ends on its greeting. How: This types it at the same steady pace.


			duration : famCarObj.greStr.length * chaDurNum, // What: Duration. Why: The greeting types at the same steady pace. How: This is a letter's time per letter.
			ease     : 'none',                              // What: Ease. Why: Typing is even. How: This keeps the pace constant.
			text     : famCarObj.greStr                     // What: Text. Why: This is the greeting. How: This types it.


		} );

		timLinObj.to( curSpaRef.current, { autoAlpha : 0, duration : fadDurNum } ); // What: Cursor Fade. Why: Nothing more is typed. How: This fades the cursor out.

		timLinObj.to( greSpaRef.current, { duration : fadDurNum, ease : oveEasStr, scale : finScaFun } ); // What: Greeting Growth. Why: The greeting fills the screen with a flourish. How: This grows it by its final scale, which GSAP reads from the function when the growth starts.

		timLinObj.to( griDivRef.current, { autoAlpha : 1, duration : shoDurNum }, '<' ); // What: Grid Show. Why: The photo grid appears behind the growing greeting. How: This shows it almost at once.

		timLinObj.to( tapParRef.current, { autoAlpha : 1, duration : fadDurNum }, '<' ); // What: Tap Hint Show. Why: The visitor should know the photos open. How: This fades the hint in with the grid.

		timLinObj.to( griImaArr, { // What: Grid Wipe. Why: The photos fill in one after another. How: This uncovers each from left to right, in random order.


			clipPath : 'inset( 0 0% 0 0 )',                                    // What: Clip Path. Why: The photo ends fully uncovered. How: This clears the clip from the right.
			duration : holDurNum,                                              // What: Duration. Why: Each photo uncovers at an easy pace. How: This uses the hold step.
			ease     : decEasStr,                                              // What: Ease. Why: The photo settles as it uncovers. How: This decelerates.
			stagger  : { each : shoDurNum, ease : inoEasStr, from : 'random' } // What: Stagger. Why: The photos start one after another, in no set order. How: Each starts a Base Minus 2 step after the last, in random order, spread in-out.


		} );

		timLinObj.call( () => { // What: Wake Lock Release Call. Why: Once the grid is in, the screen can sleep as usual. How: This releases the lock and forgets it.


			wakLocRef.current?.release(); // What: Lock Release Call. Why: The browser holds the screen on until the lock is released. How: This releases it if one was granted.

			wakLocRef.current = null; // What: Lock Forget Assignment. Why: A released lock shouldn't be released twice. How: This clears the reference.


		} );



		timLinObj.pause(); // What: Font Wait Pause. Why: The lines shouldn't type in a fallback font, and the greeting's fit is measured in the real one. How: This holds the timeline until the card's font has loaded.

		document.fonts.load( `1em ${ getComputedStyle( greSpaRef.current! ).fontFamily }`, famCarObj.greStr ).finally( () => redMotFun() ? timLinObj.progress( 1 ) : timLinObj.play() ); // What: Font Loaded Start. Why: The card starts once its font is ready, and a visitor who asked for less motion should see the finished card at once. How: This loads the font for the greeting's letters, then plays the timeline, or jumps it to its end under reduced motion. // What: Non-Null Note. Why: TypeScript can't see that the ref is set. How: useGSAP runs after the render that attaches it.


	}, { scope : famDivRef } ); // What: Hook Options. Why: The timeline is built once, when the card opens, and its cleanup is tied to the card. How: This scopes the context to the card's root, with no dependencies.

	// #endregion Family Timeline



	return (


		<div
			ref={ famDivRef }

			className={` ${ cssModObj.famCarDiv }   ${ theClaStr } `}
		>{ /* What: Family Card Div Element. Why: The card fills the screen in its own colors, its layers stacked in one cell. How: This holds the photo grid, the heart stage, the lettering, the screen-reader copy, and the photo dialog. */ }


			<div
				ref={ griDivRef }

				className={ cssModObj.famGriDiv }
			>{ /* What: Family Grid Div Element. Why: The card ends on all its photos at once. How: This lays them out in a mosaic, hidden until the timeline shows it. */ }


				{ famCarObj.griIndArr.map( ( phoIndNum, celIndNum ) => ( // What: Grid Cell Map Call. Why: Every cell of the mosaic shows one photo. How: This renders a button per cell, keyed by its place.


					<button
						key={ celIndNum }

						className={ cssModObj.famCelBut }

						type='button'

						aria-label={ `View photo: ${ famCarObj.phoRecArr[ phoIndNum ].altStr }` }

						onClick={ () => setExpIndNum( phoIndNum ) }
					>{ /* What: Family Cell Button Element. Why: Each photo can be opened full size. How: This holds the photo filling its cell, named for screen readers by its description, and opens it when tapped. */ }


						<img
							className={ cssModObj.famCelIma }

							height='941' // What: Intrinsic Height. Why: The photo shouldn't shift while it loads. How: This is every Family photo's height in pixels.
							loading='lazy'
							src={ famCarObj.phoRecArr[ phoIndNum ].imaStr }
							width='1672' // What: Intrinsic Width. Why: The photo shouldn't shift while it loads. How: This is every Family photo's width in pixels.

							alt=''
						/>{ /* What: Family Cell Image Element. Why: The photo fills its cell. How: This shows it with an empty alt, since its button names it. */ }


					</button>


				))}


			</div>


			<div
				ref={ phoDivRef }

				className={ cssModObj.famPhoDiv }

				aria-hidden='true'
			>{ /* What: Family Photo Div Element. Why: Each scene's photo is revealed through a growing heart. How: This stacks every scene's photo under the heart-shaped mask, each hidden until its scene. */ }


				{ famCarObj.phoRecArr.slice( 0, famCarObj.sceRecArr.length ).map( ( phoRecObj, sceIndNum ) => ( // What: Scene Photo Map Call. Why: Each scene has its own photo ready under the heart. How: This renders the first photo of the list for each scene, keyed by its place.


					<img
						key={ sceIndNum }

						className={ cssModObj.famSceIma }

						height='941' // What: Intrinsic Height. Why: The photo shouldn't shift while it loads. How: This is every Family photo's height in pixels.
						src={ phoRecObj.imaStr }
						width='1672' // What: Intrinsic Width. Why: The photo shouldn't shift while it loads. How: This is every Family photo's width in pixels.

						alt=''
					/> // What: Family Scene Image Element. Why: The heart opens over the scene's photo. How: This fills the screen with it, hidden from screen readers since the copy below speaks for the card.


				))}


			</div>


			<div
				ref={ texDivRef }

				className={ cssModObj.famTexDiv }

				aria-hidden='true'
			>{ /* What: Family Text Div Element. Why: The lines type out over the card. How: This centers the lettering, hidden from screen readers, which read the whole message from the copy below. */ }


				<p className={ cssModObj.famTexPar }>{ /* What: Family Text Paragraph Element. Why: Each line and the greeting type in one place. How: This holds the three line parts, the greeting, and the cursor. */ }


					<span ref={ befSpaRef }></span>{ /* What: Before Span Element. Why: The line's first part types here. How: This starts empty. */ }

					<span
						ref={ higSpaRef }

						className={ cssModObj.famHigSpa }
					></span>{ /* What: Family Highlight Span Element. Why: The line's key words type here and get underlined. How: This starts empty, its underline undrawn. */ }

					<span ref={ aftSpaRef }></span>{ /* What: After Span Element. Why: The line's last part types here. How: This starts empty. */ }

					<span
						ref={ greSpaRef }

						className={ cssModObj.famGreSpa }
					></span>{ /* What: Family Greeting Span Element. Why: The greeting types here and grows. How: This starts empty, set apart so it can scale as a whole. */ }

					<span
						ref={ curSpaRef }

						className={ cssModObj.famCurSpa }
					></span>{ /* What: Family Cursor Span Element. Why: A cursor shows where the typing is. How: This draws a bar after the text, fading once the greeting is typed. */ }


				</p>

				<p
					ref={ tapParRef }

					className={ cssModObj.famTapPar }
				>Tap a photo to see it full size.</p>{ /* What: Family Tap Paragraph Element. Why: The grid's photos open when tapped, which isn't obvious. How: This hint appears with the grid. */ }


			</div>


			<div className={ cssModObj.scrReaDiv }>{ /* What: Screen Reader Div Element. Why: The typed lines are hidden from screen readers, which should still hear the whole message. How: This holds every line and the greeting, hidden from view. */ }


				{ famCarObj.sceRecArr.map( ( sceRecObj, sceIndNum ) => ( // What: Scene Line Map Call. Why: Each scene's line is part of the message. How: This renders one paragraph per line, keyed by its place.


					<p key={ sceIndNum }>{ `${ sceRecObj.befStr }${ sceRecObj.higStr }${ sceRecObj.aftStr }` }</p> // What: Scene Line Paragraph Element. Why: The line is read whole. How: This joins its three parts.


				))}


				<p>{ famCarObj.behStr }</p>{ /* What: Behalf Paragraph Element. Why: The closing line is part of the message. How: This holds it. */ }

				<h1>{ famCarObj.greStr }</h1>{ /* What: Greeting Heading Element. Why: The greeting is the card's heading. How: This holds it for screen readers and search engines. */ }


			</div>


			<dialog
				ref={ expDiaRef }

				className={ cssModObj.famExpDia }

				aria-label='Photo'

				onClose={ () => setExpIndNum( null ) } // What: Dialog Close Handler. Why: Escape or a tap closes the photo, and the card should forget it. How: This clears the open photo.
			>{ /* What: Family Expanded Dialog Element. Why: A tapped photo should fill the screen. How: This shows the chosen photo as a modal, which Escape closes. */ }


				{ expIndNum !== null && ( // What: Expanded Photo Check. Why: The dialog only has a photo while one is chosen. How: This renders the button holding it.


					<button
						className={ cssModObj.famExpBut }

						type='button'

						aria-label='Close photo'

						onClick={ () => expDiaRef.current?.close() }
					>{ /* What: Family Expanded Button Element. Why: Tapping the full-size photo closes it. How: This holds the photo and closes the dialog when pressed. */ }


						<img
							className={ cssModObj.famExpIma }

							height='941' // What: Intrinsic Height. Why: The photo shouldn't shift while it loads. How: This is every Family photo's height in pixels.
							src={ famCarObj.phoRecArr[ expIndNum ].imaStr }
							width='1672' // What: Intrinsic Width. Why: The photo shouldn't shift while it loads. How: This is every Family photo's width in pixels.

							alt={ famCarObj.phoRecArr[ expIndNum ].altStr }
						/>{ /* What: Family Expanded Image Element. Why: The photo should be seen whole. How: This fits it to the screen, described for screen readers. */ }


					</button>


				) }


			</dialog>


		</div>


	);


}

// #endregion FamCarCom

// #endregion Components



// #region Module Init

gsap.registerPlugin( TextPlugin, useGSAP ); // What: Plugin Registration Call. Why: GSAP's text plugin and React hook have to be registered before the timeline uses them. How: This registers both once, when the engine's code loads.

// #endregion Module Init



// #region Exports

export { FamCarCom, type FamCarTyp, type PhoRecTyp, type SceRecTyp }; // What: Named Exports. Why: Each Family card supplies its content to the engine. How: This exports the engine and the types a card's record is built from.

// #endregion Exports


