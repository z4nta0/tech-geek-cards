


// #region Imports

import cssModObj from './turkeys-away-card.module.css'; // What: CSS Module Object. Why: The card's set, screen, and lettering are styled in its own module. How: This maps each class name in turkeys-away-card.module.css to its scoped name.


import { cdnPowFun       } from '../../utils/rhythm.ts'; // What: Core-Design-Number Power Function. Why: The cry's starting size sits on the scale as a power of the core design number. How: This returns that power.
import { durSecFun       } from '../../utils/rhythm.ts'; // What: Duration Second Function. Why: Every time in the card's schedule is built from duration scale steps, and GSAP takes seconds. How: This returns a step's length in seconds.
import { gsaEasFun       } from '../../ui/gsap-ease.ts'; // What: GSAP Easing Function. Why: GSAP can't read the stylesheet's cubic-bezier curves on its own. How: This registers an easing token as a named GSAP ease.
import { gsap            } from 'gsap';                  // What: GSAP. Why: The lettering plays as one timeline, which the pixel scene also runs on. How: This is the animation library that builds and plays it.
import { redMotFun       } from '../../utils/motion.ts'; // What: Reduced Motion Function. Why: A visitor who asked for less motion should get the finished card at once. How: This reports whether reduced motion is on.
import { rhyPixFun       } from '../../utils/rhythm.ts'; // What: Rhythm Pixel Function. Why: The greeting's rise is a vertical rhythm step. How: This returns a step's size in pixels.
import { SplitText       } from 'gsap/SplitText';        // What: Split Text. Why: The bulletin and the quote type out one letter at a time. How: This GSAP plugin wraps each letter so it can appear on its own.
import { staSceFun       } from './pixel-scene.ts';      // What: Start Scene Function. Why: The pixel scenes play behind the lettering. How: This starts them on the canvas and returns their stop and tap functions.
import { useGSAP         } from '@gsap/react';           // What: Use GSAP. Why: The timeline has to be built after the card renders and undone when it leaves. How: This GSAP hook runs it in a context it reverts on unmount.
import { useRef          } from 'react';                 // What: Use Reference. Why: The timeline and scene work on specific elements, and taps reach the scene. How: Each of those gets a ref.
import { useSearchParams } from 'react-router';          // What: Use Search Parameters. Why: The greeting can name its recipient. How: This reads the address's ?name= parameter.


import type { JSX        } from 'react';            // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.
import type { MouseEvent } from 'react';            // What: Mouse Event. Why: A tap drops a turkey where it lands. How: This types the click's event.
import type { SceSchTyp  } from './pixel-scene.ts'; // What: Scene Schedule Type. Why: The card hands the scene its schedule. How: This types it.

// #endregion Imports



/**
 * turkeys-away-card.tsx = Turkeys Away Card
 *
 * @summary
 * The Turkeys Away card, a WKRP Thanksgiving newscast in pixel art. Over the
 * Pinedale Shopping Mall, the station's call letters and a flashing LIVE tag
 * appear, the station's helicopter crosses and drops live turkeys into the
 * parking lot, "Oh, the humanity!" pops up, and a news bulletin types out that
 * the mall has just been BOMBED with live turkeys. A burst of static changes
 * the channel to the studio, where the station manager stands with a hand
 * raised beside a dazed turkey, and "Merry Thanksgiving" appears, named for
 * the recipient when the link carries one, before his line, "As God is my
 * witness, I thought turkeys could fly," types out. The card then rests on the
 * studio, where a tap drops another turkey. Every time in the schedule is
 * built from steps on the duration scale, and the pixel scene runs on the
 * timeline's clock. Under reduced motion the card opens on the finished
 * studio. Our own lettering and a station manager drawn as a type, not the
 * show's logo or an actor's likeness, keep it a fan's tribute.
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

const NEW_TEX_STR = 'For those of you who just tuned in, the Pinedale Shopping Mall has just been BOMBED with live turkeys.'; // What: News Text String. Why: The bulletin's line is Johnny Fever's from the episode. How: Screen readers hear it whole while the visible copy types out.
const QUO_TEX_STR = '"As God is my witness, I thought turkeys could fly."';                                                   // What: Quote Text String. Why: The station manager's line closes the episode. How: Screen readers hear it whole while the visible copy types out.

// #endregion Constants



// #region Helpers

// #region schRecFun

/**
 * schRecFun = Schedule Record Function
 *
 * @summary
 * The card's schedule, every time built from steps on the duration scale, in
 * seconds from the card's start: the helicopter starts across after a Base
 * Plus 2 step and takes a Base Plus 12 step (about 4.6 seconds) to cross; six
 * turkeys drop from a Base Plus 8 step on, a Base Plus 4 step apart; the
 * bulletin starts typing a Base Plus 4 step after its bar shows at a Base Plus
 * 12 step, types for a Base Plus 11 step, and holds for a Base Plus 9 step
 * before the static, which lasts a Base Plus 5 step; and the studio's
 * lettering ends a Base Plus 10 step of typing after its greeting and quote
 * box arrive. The pixel scene reads the helicopter's, drops', static's, and
 * studio's times, and the timeline reads the first drop's, the bulletin's, the
 * static's, and the studio's.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The schedule, with the bulletin's and quote's typing times.
 *
 * @example
 * ```ts
 * schRecFun() // => { droArr : [ 1.497, ... ], staNum : 10.56, ... }
 * ```
 *
*/

function schRecFun () : SceSchTyp & { newTypNum : number, quoTypNum : number } {


	const newBarNum = durSecFun( 'p12' );                                                       // What: News Bar Number. Why: The bulletin's bar shows once the drops are done. How: This is a Base Plus 12 step, about 4.6 seconds. // Duration Animation Base Plus 12 ~= 4,610.4ms
	const newTypNum = newBarNum + durSecFun( 'p04' );                                           // What: News Typing Number. Why: The bulletin types once its bar has faded in. How: This is a Base Plus 4 step after the bar. // Duration Animation Base Plus 4 ~= 486.1ms
	const staTimNum = newTypNum + durSecFun( 'p11' ) + durSecFun( 'p09' );                      // What: Static Time Number. Why: The static comes after the bulletin has typed and been read. How: This adds the typing's Base Plus 11 step and a Base Plus 9 hold. // Duration Animation Base Plus 11 ~= 3,480.0ms, Duration Animation Base Plus 9 ~= 1,983.1ms
	const sceTimNum = staTimNum + durSecFun( 'p05' );                                           // What: Scene Time Number. Why: The studio follows a short burst of static. How: This is a Base Plus 5 step after the static starts. // Duration Animation Base Plus 5 ~= 643.9ms
	const quoTypNum = sceTimNum + durSecFun( 'p03' ) + durSecFun( 'p06' ) + durSecFun( 'p04' ); // What: Quote Typing Number. Why: The quote types once the greeting and its box have arrived. How: This adds the greeting's Base Plus 3 wait, the box's Base Plus 6 wait, and its Base Plus 4 fade. // Duration Animation Base Plus 3 ~= 366.9ms, Duration Animation Base Plus 6 ~= 853.0ms, Duration Animation Base Plus 4 ~= 486.1ms



	return { // What: Schedule Return. Why: The scene and the timeline share one schedule. How: This returns every time.


		droArr : Array.from( Array( 6 ).keys(), ( droIndNum ) => durSecFun( 'p08' ) + droIndNum * durSecFun( 'p04' ) ), // What: Drop Array. Why: Six turkeys drop one after another. How: The first leaves at a Base Plus 8 step, each next a Base Plus 4 step later. // Duration Animation Base Plus 8 ~= 1,497.4ms, Duration Animation Base Plus 4 ~= 486.1ms
		finNum : quoTypNum + durSecFun( 'p10' ),                                                                        // What: Finish Number. Why: The card rests once the quote has typed. How: This is a Base Plus 10 step of typing after it starts. // Duration Animation Base Plus 10 ~= 2,627.4ms
		hlaNum : durSecFun( 'p02' ),                                                                                    // What: Helicopter Arrival Number. Why: The helicopter enters just after the card opens. How: This is a Base Plus 2 step. // Duration Animation Base Plus 2 ~= 277.0ms
		hldNum : durSecFun( 'p12' ),                                                                                    // What: Helicopter Duration Number. Why: The helicopter crosses at an unhurried pace. How: This is a Base Plus 12 step. // Duration Animation Base Plus 12 ~= 4,610.4ms
		newTypNum,
		quoTypNum,
		sceNum : sceTimNum, // What: Scene Number. Why: The studio follows the static. How: This is when the studio starts.
		staNum : staTimNum  // What: Static Number. Why: The static ends the mall scene. How: This is when the static starts.


	};


}

// #endregion schRecFun

// #endregion Helpers



// #region Components

// #region TurCarCom

/**
 * TurCarCom = Turkeys Card Component
 *
 * @summary
 * Renders the Turkeys Away card: the screen holding the pixel scene's canvas
 * and the lettering over it, inside a TV set that its stylesheet shows only
 * on a large screen. The greeting reads "Merry Thanksgiving" with the
 * address's ?name= after it when there is one. The bulletin and the quote
 * each keep a whole copy for screen readers beside the visible copy that
 * types out. Its timeline and scene are built in useGSAP, so leaving the card
 * or replaying it reverts every tween and stops the scene. A tap on the
 * screen hands the scene the tap's share of the width.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The card's root element.
 *
 * @example
 * ```tsx
 * TurCarCom() // => <TurCarCom />
 * ```
 *
*/

function TurCarCom () : JSX.Element {


	const canEleRef = useRef< HTMLCanvasElement >( null );                  // What: Canvas Element Reference. Why: The pixel scene draws on the canvas. How: This holds it.
	const humParRef = useRef< HTMLParagraphElement >( null );               // What: Humanity Cry Paragraph Reference. Why: The cry pops in and out. How: This holds it.
	const livDivRef = useRef< HTMLDivElement >( null );                     // What: Live Bar Div Reference. Why: The LIVE tag fades in and leaves with the mall. How: This holds it.
	const logDivRef = useRef< HTMLDivElement >( null );                     // What: Logo Station Div Reference. Why: The logo shows in both scenes, hidden during the static. How: This holds it.
	const newDivRef = useRef< HTMLDivElement >( null );                     // What: News Bulletin Div Reference. Why: The bulletin's bar fades in and leaves with the mall. How: This holds it.
	const newVisRef = useRef< HTMLSpanElement >( null );                    // What: News Visible Reference. Why: The bulletin's visible copy types out. How: This holds the span SplitText splits.
	const quoParRef = useRef< HTMLParagraphElement >( null );               // What: Quote Box Paragraph Reference. Why: The quote's box fades in. How: This holds it.
	const quoVisRef = useRef< HTMLSpanElement >( null );                    // What: Quote Visible Reference. Why: The quote's visible copy types out. How: This holds the span SplitText splits.
	const rooDivRef = useRef< HTMLDivElement >( null );                     // What: Root Div Reference. Why: The scene reads the card's color tokens from its root. How: This holds it.
	const tapFunRef = useRef< ( fraXcoNum : number ) => void >( () => {} ); // What: Tap Function Reference. Why: A tap reaches the scene, which starts after the render. How: This holds the scene's tap function, a no-op until it starts.
	const titHeaRef = useRef< HTMLHeadingElement >( null );                 // What: Title Greeting Heading Reference. Why: The greeting rises into the studio. How: This holds it.

	const [ seaParObj ] = useSearchParams(); // What: Search Parameters Object. Why: The greeting can name its recipient. How: This reads the address's query.

	const namParStr = seaParObj.get( 'name' ); // What: Name Parameter String. Why: A shared link can carry the recipient's name. How: This reads ?name=, or null without one.



	// #region Turkeys Timeline

	/**
	 * turkeys-away-card.tsx = Turkeys Timeline
	 *
	 * @summary
	 * Builds the card's one timeline and starts the pixel scene on its
	 * clock. The logo fades in at once and the LIVE tag a Base Plus 3 step
	 * in; "Oh, the humanity!" pops up a Base Plus 6 step after the first
	 * drop and fades a Base Plus 9 step later; the bulletin's bar fades in
	 * and its line types out letter by letter; at the static, the mall's
	 * lettering goes at once; and in the studio the logo returns, the
	 * greeting rises a little as it fades in, the quote's box fades in, and
	 * the quote types out. Arrivals decelerate and the cry pops with the
	 * gentle overshoot. The scene's clock is the timeline's time, and once
	 * the timeline ends it keeps counting past its end, so the studio's
	 * feathers and stars play on. Under reduced motion the timeline jumps to
	 * its end and the scene draws the finished studio. The cleanup stops the
	 * scene.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	*/

	useGSAP( () => { // What: Turkeys Timeline Hook. Why: The timeline and scene have to start after the card renders and stop when it leaves. How: This builds them in a GSAP context, returning the scene's cleanup.


		const decEasStr = gsaEasFun( 'dec' );                                                              // What: Decelerate Easing String. Why: Things arriving slow as they land. How: This registers the decelerate token and keeps its GSAP name.
		const hidStaObj = { autoAlpha : 0 };                                                               // What: Hidden State Object. Why: Each element arrives from hidden. How: This is the hidden state the fades start from, which the cry builds on.
		const newSplObj = SplitText.create( newVisRef.current, { aria : 'none', type : 'words, chars' } ); // What: News Split Object. Why: The bulletin types out one letter at a time. How: This wraps the visible copy's words and letters, adding no labels, since a hidden copy speaks for it.
		const oveEasStr = gsaEasFun( 'ove' );                                                              // What: Overshoot Easing String. Why: The cry pops in with a little overshoot. How: This registers the gentle overshoot token and keeps its GSAP name.
		const quoSplObj = SplitText.create( quoVisRef.current, { aria : 'none', type : 'words, chars' } ); // What: Quote Split Object. Why: The quote types out one letter at a time. How: This wraps the visible copy's words and letters, adding no labels, since a hidden copy speaks for it.
		const redMotBoo = redMotFun();                                                                     // What: Reduced Motion Boolean. Why: Under reduced motion the card opens finished. How: This reads the preference once, as the card opens.
		const schRecObj = schRecFun();                                                                     // What: Schedule Record Object. Why: The timeline and scene share one schedule. How: This builds it.
		const humStaNum = schRecObj.droArr[ 0 ] + durSecFun( 'p06' );                                      // What: Humanity Start Number. Why: The cry comes as the first turkey tumbles. How: This is a Base Plus 6 step after the first drop. // Duration Animation Base Plus 6 ~= 853.0ms
		const timLinObj = gsap.timeline( { defaults : { ease : decEasStr } } );                            // What: Timeline Object. Why: The lettering plays as one sequence. How: This creates the timeline, its tweens decelerating unless told otherwise.

		let finTimNum = 0; // What: Finish Time Number. Why: The scene's clock runs on past the timeline's end. How: This holds the moment the timeline finished, 0 until then.


		timLinObj.fromTo( logDivRef.current, hidStaObj,                                 { duration : durSecFun( 'p04' ), autoAlpha : 1 },                              0 );                                        // What: Logo Fade. Why: The station's call letters open the broadcast. How: This fades them in at once. // Duration Animation Base Plus 4 ~= 486.1ms
		timLinObj.fromTo( livDivRef.current, hidStaObj,                                 { duration : durSecFun( 'p04' ), autoAlpha : 1 },                              durSecFun( 'p03' ) );                       // What: Live Fade. Why: The tag says this is live from the mall. How: This fades it in a Base Plus 3 step in. // Duration Animation Base Plus 4 ~= 486.1ms, Duration Animation Base Plus 3 ~= 366.9ms
		timLinObj.fromTo( humParRef.current, { ...hidStaObj, scale : cdnPowFun( -2 ) }, { duration : durSecFun( 'p03' ), autoAlpha : 1, ease : oveEasStr, scale : 1 }, humStaNum );                                // What: Humanity Pop. Why: The cry bursts out as the turkeys fall. How: This grows it from about 0.57 of its size as it fades in, overshooting a little. // Core-Design-Number to the Power of 2 Reciprocal ~= 0.570, Duration Animation Base Plus 3 ~= 366.9ms
		timLinObj.fromTo( newDivRef.current, hidStaObj,                                 { duration : durSecFun( 'p04' ), autoAlpha : 1 },                              schRecObj.newTypNum - durSecFun( 'p04' ) ); // What: News Bar Fade. Why: The bulletin's bar arrives before its words. How: This fades it in a Base Plus 4 step before the typing. // Duration Animation Base Plus 4 ~= 486.1ms
		timLinObj.fromTo( logDivRef.current, hidStaObj,                                 { duration : durSecFun( 'p04' ), autoAlpha : 1 },                              schRecObj.sceNum );                         // What: Logo Return. Why: The studio is the same station. How: This fades the logo back in as the studio starts. // Duration Animation Base Plus 4 ~= 486.1ms
		timLinObj.fromTo( titHeaRef.current, { opacity : 0, y : rhyPixFun( 'p01' ) },   { duration : durSecFun( 'p05' ), opacity : 1,   y : 0 },                       schRecObj.sceNum + durSecFun( 'p03' ) );    // What: Greeting Rise. Why: "Merry Thanksgiving" is the studio's headline. How: This fades its opacity in a Base Plus 3 step after the studio starts, rising from a Base Plus 1 step below, leaving it in the page throughout as the card's heading. // Vertical Rhythm Base Plus 1 ~= 19.304px, Duration Animation Base Plus 5 ~= 643.9ms, Duration Animation Base Plus 3 ~= 366.9ms
		timLinObj.fromTo( quoParRef.current, hidStaObj,                                 { duration : durSecFun( 'p04' ), autoAlpha : 1 },                              schRecObj.quoTypNum - durSecFun( 'p04' ) ); // What: Quote Box Fade. Why: The quote's box arrives before its words. How: This fades it in a Base Plus 4 step before the typing. // Duration Animation Base Plus 4 ~= 486.1ms

		timLinObj.to( humParRef.current, { autoAlpha : 0, duration : durSecFun( 'p03' ), ease : gsaEasFun( 'acc' ) }, humStaNum + durSecFun( 'p09' ) );                                  // What: Humanity Fade. Why: The cry gives way to the bulletin. How: This fades it out a Base Plus 9 step after it appears, accelerating as it leaves. // Duration Animation Base Plus 3 ~= 366.9ms, Duration Animation Base Plus 9 ~= 1,983.1ms

		timLinObj.from( newSplObj.chars, { autoAlpha : 0, duration : 0, stagger : durSecFun( 'p11' ) / newSplObj.chars.length }, schRecObj.newTypNum ); // What: News Typing. Why: The bulletin types out like a teleprinter. How: This shows its letters one at a time over a Base Plus 11 step. // Duration Animation Base Plus 11 ~= 3,480.0ms
		timLinObj.from( quoSplObj.chars, { autoAlpha : 0, duration : 0, stagger : durSecFun( 'p10' ) / quoSplObj.chars.length }, schRecObj.quoTypNum ); // What: Quote Typing. Why: The station manager's line types out. How: This shows its letters one at a time over a Base Plus 10 step. // Duration Animation Base Plus 10 ~= 2,627.4ms

		timLinObj.set( [ logDivRef.current, livDivRef.current, newDivRef.current ], hidStaObj, schRecObj.staNum );                                                                       // What: Mall Lettering Clear. Why: The static wipes the mall's broadcast. How: This hides the logo, tag, and bulletin at once as the static starts.

		timLinObj.eventCallback( 'onComplete', () => { finTimNum = performance.now(); } ); // What: Finish Callback Call. Why: The scene's clock runs on past the timeline's end. How: This records when the timeline finished.


		if ( redMotBoo ) timLinObj.progress( 1 ); // What: Reduced Motion Jump. Why: A visitor who asked for less motion should see the finished card at once. How: This jumps the timeline to its end.



		const sceSysObj = staSceFun( canEleRef.current!, { redMotBoo, rooEle : rooDivRef.current!, schObj : schRecObj, timFun : () => finTimNum ? timLinObj.duration() + ( performance.now() - finTimNum ) / 1000 : timLinObj.time() } ); // What: Scene System Object. Why: The pixel scenes play behind the lettering on the timeline's clock. How: This starts them, handing over the timeline's time, or its end plus the time since once it has finished. // What: Non-Null Note. Why: TypeScript can't see that the refs are set. How: useGSAP runs after the render that attaches them.


		tapFunRef.current = sceSysObj.tapFun; // What: Tap Function Assignment. Why: Taps reach the scene once it has started. How: This keeps its tap function.



		return () => sceSysObj.stoFun(); // What: Scene Cleanup Return. Why: The scene must stop when the card replays or closes. How: This returns the function that stops it, which GSAP runs as it reverts the timeline.


	} );

	// #endregion Turkeys Timeline



	return (


		<div
			ref={ rooDivRef }

			className={ cssModObj.turCarDiv }
		>{ /* What: Turkeys Card Div Element. Why: The card fills the screen as a 70s newscast. How: This holds the set and its screen, and the card's color tokens. */ }


			<div className={ cssModObj.telSetDiv }>{ /* What: Television Set Div Element. Why: The screen sits in a 70s set on a large screen. How: This holds the ears and the cabinet. */ }


				<div
					className={ cssModObj.rabEarDiv }

					aria-hidden='true'
				/>{ /* What: Rabbit Ear Div Element. Why: A 70s set has rabbit ears. How: This draws them on a large screen, hidden from screen readers as decoration. */ }



				<div className={ cssModObj.cabBodDiv }>{ /* What: Cabinet Body Div Element. Why: The cabinet holds the screen and the controls. How: This lays them side by side on a large screen. */ }



					<div className={ cssModObj.bezFraDiv }>{ /* What: Bezel Frame Div Element. Why: The screen sits deep in a dark frame. How: This frames it on a large screen. */ }


						<div
							className={ cssModObj.scrBoxDiv }

							onClick={ ( cliEveObj : MouseEvent< HTMLDivElement > ) => { // What: Screen Tap Handler. Why: A tap drops a turkey where it lands, at the same share of the width in any layout. How: This hands the scene the tap's share of the screen's width.


								const boxRecObj = cliEveObj.currentTarget.getBoundingClientRect(); // What: Box Rect Object. Why: The tap's share is measured across the screen. How: This reads the screen's box.


								tapFunRef.current( ( cliEveObj.clientX - boxRecObj.left ) / boxRecObj.width ); // What: Tap Call. Why: The scene drops the turkey. How: This hands it the tap's share of the width.


							} }
						>{ /* What: Screen Box Div Element. Why: The scenes and lettering share one box. How: This holds the canvas and every line of lettering, and takes taps. */ }


							<canvas
								ref={ canEleRef }

								className={ cssModObj.scePixCan }

								aria-hidden='true'
							/>{ /* What: Scene Pixel Canvas Element. Why: The pixel scenes are drawn on it. How: This holds the drawing, hidden from screen readers, since the lettering carries the card's words. */ }


							<div
								ref={ logDivRef }

								className={ cssModObj.logStaDiv }
							>{ /* What: Logo Station Div Element. Why: The station's lettering tops both scenes. How: This holds the call letters and their script. */ }


								<span className={ cssModObj.logWorSpa }>WKRP</span>{ /* What: Logo Word Span Element. Why: The call letters are the station's mark. How: This shows them in the chunky serif. */ }

								<span className={ cssModObj.logCinSpa }>in Cincinnati</span>{ /* What: Logo Cincinnati Span Element. Why: The script signs the call letters. How: This shows it under them. */ }


							</div>


							<div
								ref={ livDivRef }

								className={ cssModObj.livBarDiv }
							>{ /* What: Live Bar Div Element. Why: The broadcast is live from the mall. How: This holds the tag and the mall's name. */ }


								<span className={ cssModObj.livTagSpa }>LIVE</span>{ /* What: Live Tag Span Element. Why: The tag flashes like a live broadcast's. How: This shows LIVE on red. */ }

								<span>Pinedale Shopping Mall</span>{ /* What: Live Place Span Element. Why: The tag says where the broadcast is from. How: This shows the mall's name beside it. */ }


							</div>


							<p
								ref={ humParRef }

								className={ cssModObj.humCryPar }
							>Oh, the humanity!</p>{ /* What: Humanity Cry Paragraph Element. Why: The reporter's cry is the episode's best-known line. How: This shows it as the turkeys fall. */ }


							<div
								ref={ newDivRef }

								className={ cssModObj.newBulDiv }
							>{ /* What: News Bulletin Div Element. Why: The bulletin runs across the screen's bottom. How: This holds its tab and its line. */ }


								<span className={ cssModObj.newLabSpa }>NEWS BULLETIN</span>{ /* What: News Label Span Element. Why: A tab names the bulletin. How: This shows it above the line. */ }


								<p className={ cssModObj.newTexPar }>{ /* What: News Text Paragraph Element. Why: The bulletin types out on its bar. How: This holds the line's visible copy and its hidden copy. */ }


									<span
										ref={ newVisRef }

										aria-hidden='true'
									>For those of you who just tuned in, the Pinedale Shopping Mall has just been <strong className={ cssModObj.bomWorStr }>BOMBED</strong> with live turkeys.</span>{ /* What: News Visible Span Element. Why: Split into letters, the line would be read out one letter at a time. How: This shows the copy the timeline types out, "BOMBED" picked out, hidden from screen readers. */ }

									<span className={ cssModObj.scrReaSpa }>{ NEW_TEX_STR }</span>{ /* What: Screen Reader Span Element. Why: Screen readers should hear the line whole. How: This holds the same line, hidden from view. */ }


								</p>


							</div>


							<h1
								ref={ titHeaRef }

								className={ cssModObj.titGreHea }
							>{ namParStr ? `Merry Thanksgiving, ${ namParStr }!` : 'Merry Thanksgiving!' }</h1>{ /* What: Title Greeting Heading Element. Why: The greeting leads the studio scene. How: This shows "Merry Thanksgiving", naming the recipient when the link carries a name. */ }


							<p
								ref={ quoParRef }

								className={ cssModObj.quoBoxPar }
							>{ /* What: Quote Box Paragraph Element. Why: The station manager's line sits boxed beside him. How: This holds the line's visible copy and its hidden copy. */ }


								<span
									ref={ quoVisRef }

									aria-hidden='true'
								>{ QUO_TEX_STR }</span>{ /* What: Quote Visible Span Element. Why: Split into letters, the line would be read out one letter at a time. How: This shows the copy the timeline types out, hidden from screen readers. */ }

								<span className={ cssModObj.scrReaSpa }>{ QUO_TEX_STR }</span>{ /* What: Screen Reader Span Element. Why: Screen readers should hear the line whole. How: This holds the same line, hidden from view. */ }


							</p>


						</div>


					</div>



					<div
						className={ cssModObj.panSidDiv }

						aria-hidden='true'
					>{ /* What: Panel Side Div Element. Why: The set's knobs and speaker sit beside its screen. How: This holds them on a large screen, hidden from screen readers as decoration. */ }


						<div className={ cssModObj.knoDiaDiv } />{ /* What: Knob Dial Div Element. Why: One knob changes the channel. How: This draws it. */ }

						<div className={ cssModObj.knoDiaDiv } />{ /* What: Knob Dial Div Element. Why: The other knob sets the volume. How: This draws it. */ }

						<div className={ cssModObj.speGriDiv } />{ /* What: Speaker Grille Div Element. Why: The speaker sits behind a grille. How: This draws it. */ }


					</div>


				</div>


			</div>


		</div>


	);


}

// #endregion TurCarCom

// #endregion Components



// #region Module Init

gsap.registerPlugin( SplitText, useGSAP ); // What: Plugin Registration Call. Why: GSAP's plugin and React hook have to be registered before the timeline uses them. How: This registers both once, when the card's code loads.

// #endregion Module Init



// #region Exports

export { TurCarCom }; // What: Named Export. Why: The card catalog loads the card on demand. How: This exports the card's component by name.

// #endregion Exports


