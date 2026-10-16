


// #region Imports

import cssModObj from './home.module.css'; // What: CSS Module Object. Why: Home's hero, steps, featured cards, and banner are styled in its own module. How: This maps each class name in home.module.css to its hashed module class.


import { CAR_REC_ARR } from '../../ui/cards.ts';             // What: Card Record Array. Why: The hero and the featured cards show cards from the catalog. How: The page picks from it.
import { CarTilCom   } from '../../ui/card-tile.tsx';        // What: Card Tile Component. Why: The featured cards show as tiles. How: The page renders one per featured card.
import { ConCirCom   } from '../../ui/confetti-circuit.tsx'; // What: Confetti Circuit Component. Why: The hero and the banner carry the site's motif. How: The page sets it behind them.
import { Link        } from 'react-router';                  // What: Link. Why: The hero, the featured section, and the banner move to other pages without a full page load. How: This renders those links.
import { ShaDiaCom   } from '../../ui/share-dialog.tsx';     // What: Share Dialog Component. Why: A featured card can be shared straight from Home. How: The page mounts it when a tile's Share is pressed.
import { useState    } from 'react';                         // What: Use State. Why: The featured pick stays put while the page is open, and the page remembers which card is being shared. How: This holds both.


import type { CarRecTyp } from '../../ui/cards.ts'; // What: Card Record Type. Why: The page holds the card being shared. How: This types that state.
import type { JSX       } from 'react';             // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * home.tsx = Home
 *
 * @summary
 * The home page: a hero whose cards fan out of an open envelope beside the
 * site's pitch, the three steps of sending a card, four cards from the
 * Gallery picked at random on each visit, and a postcard banner inviting a
 * custom card. Any featured card can be shared from its tile through the
 * share dialog.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const HER_CAR_ARR = [ 'happy-halloween', 'happy-birthday', 'mothers-day' ].map( ( carSluStr ) => CAR_REC_ARR.find( ( carRecObj ) => carRecObj.sluStr === carSluStr )! ); // What: Hero Card Array. Why: The envelope holds three cards with different colors, so the fan reads as variety. How: This looks up the three cards by their slugs, left to right. // What: Non-Null Note. Why: find's return type allows undefined. How: Each slug is a row in the catalog, so every lookup finds its card.



const STE_REC_ARR = [ // What: Step Record Array. Why: How It Works walks through the same three steps every visit. How: Each row holds a step's title and description.


	{ titStr : 'Pick a card',    desStr : 'Browse the Gallery for a birthday, a holiday, or a day for the family.' }, // What: Pick Step Row. Why: Sending starts with choosing. How: This points to the Gallery.
	{ titStr : 'Make it theirs', desStr : "Add their name to the cards that take one, and it's part of the card as it opens." }, // What: Personalize Step Row. Why: A name makes a card feel made for them. How: This explains the name field.
	{ titStr : 'Send the link',  desStr : 'Copy the link or share it from your phone. It plays right in their browser, with nothing to install.' } // What: Send Step Row. Why: The last step is getting it to them. How: This explains the link and the share sheet.


];

// #endregion Constants



// #region Helpers

// #region ranPicFun

/**
 * ranPicFun = Random Pick Function
 *
 * @summary
 * Picks a given number of items from a list at random, in a random order,
 * never repeating one. It shuffles a copy of the list with the Fisher-Yates
 * method, so every item is equally likely to land in every position, and
 * keeps the first ones. The list itself is left untouched. Copied from
 * TechGeek.dev's Home.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param souRecArr - Source Record Array: The list to pick from, which stays
 *                    unchanged.
 * @param picCouNum - Pick Count Number: How many items to pick, or every item
 *                    when the list holds fewer.
 *
 * @returns The picked items in their shuffled order.
 *
 * @example
 * ```ts
 * ranPicFun(CAR_REC_ARR, 4) // => four card records in a random order
 * ```
 *
*/

function ranPicFun< T > ( souRecArr : readonly T[], picCouNum : number ) : T[] {


	const shuRecArr = [ ...souRecArr ]; // What: Shuffled Record Array. Why: The source list has to keep its own order. How: This copies it, so the shuffle works on the copy.


	for ( let curIndNum = shuRecArr.length - 1; curIndNum > 0; curIndNum-- ) { // What: Fisher-Yates Loop. Why: Every order should be equally likely. How: This walks down the copy, swapping each item with a random one at or before it.


		const swaIndNum = Math.floor( Math.random() * ( curIndNum + 1 ) ); // What: Swap Index Number. Why: The item trades places with a random earlier one, or stays put. How: This picks a whole number from 0 to the current index.


		[ shuRecArr[ curIndNum ], shuRecArr[ swaIndNum ] ] = [ shuRecArr[ swaIndNum ], shuRecArr[ curIndNum ] ]; // What: Item Swap. Why: The shuffle moves each item into its random place. How: This swaps the two items through array destructuring.


	}



	return shuRecArr.slice( 0, picCouNum ); // What: Picked Records. Why: Only the requested number of items is wanted. How: This keeps the first picCouNum items of the shuffled copy.


}

// #endregion ranPicFun

// #endregion Helpers



// #region Components

// #region HomPagCom

/**
 * HomPagCom = Home Page Component
 *
 * @summary
 * Renders the home page and its canonical link. The page's title and
 * description are index.html's own, so crawlers that never run the script
 * read them too. Four listed cards are picked at random once, when the page
 * mounts, and stay put while it's open, four so the featured grid's rows
 * always stay even. A featured tile's Share mounts the share dialog for its
 * card, keyed by the card, and the dialog's close callback unmounts it. The
 * envelope drawing is decoration, hidden from screen readers.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The page's canonical link, its wrapper div, and the share dialog
 *          when it's open.
 *
 * @example
 * ```tsx
 * HomPagCom() // => <HomPagCom />
 * ```
 *
*/

function HomPagCom () : JSX.Element {


	const [ feaCarArr                ] = useState( () => ranPicFun( CAR_REC_ARR.filter( ( carRecObj ) => carRecObj.lisBoo ), 4 ) ); // What: Featured Card Array. Why: Home shows a taste of the Gallery that changes from visit to visit, four cards so the grid's rows always stay even. How: This picks four listed cards at random once, when the page mounts, and keeps them while it stays open.
	const [ shaCarObj, setShaCarObj ] = useState< CarRecTyp | null >( null );                                                       // What: Share Card Object And Setter. Why: The share dialog shows the card whose Share was pressed. How: This starts with no card, so no dialog.



	return (


		<>{ /* What: Home Fragment. Why: The page's canonical link, its content, and the share dialog render side by side. How: This groups them without adding an element. */ }


			<link
				href='https://techgeek.cards/'
				rel='canonical'
			/>{ /* What: Canonical Link Element. Why: Search engines should treat every address that reaches Home as one page. How: React 19 moves this link into the head while the page is shown. */ }



			<div className={ cssModObj.pagEntDiv }>{ /* What: Page Enter Div Element. Why: The page fades up into view as it opens. How: This wraps every section and plays the shared entrance. */ }


				<section className={ cssModObj.homHerSec }>{ /* What: Home Hero Section Element. Why: The page opens on the site's pitch and a playful picture of what it offers. How: This holds the motif, the text, and the envelope, its bottom edge cut in scallops like a stamp's. */ }


					<ConCirCom patOpaStr='var( --cdn-pow-007-rec )' />{ /* What: Confetti Circuit Component. Why: The hero carries the site's motif behind its content. How: This draws the pattern at about 14% strength. */ }{ /* Core-Design-Number to the Power of 7 Reciprocal ~= 0.140 */ }



					<div className={ cssModObj.herInnDiv }>{ /* What: Hero Inner Div Element. Why: The text and the envelope sit side by side on wide screens and stack on phones. How: This lays them out in a centered, capped grid. */ }


						<div className={ cssModObj.herTexDiv }>{ /* What: Hero Text Div Element. Why: The pitch reads as one column. How: This stacks the eyebrow, heading, lead, and buttons. */ }


							<p className={ cssModObj.herEyePar }>{ /* What: Hero Eyebrow Paragraph Element. Why: A small label says what the site is before the heading does. How: This shows a berry dot and the label in mono capitals. */ }
								<span
									className={ cssModObj.herDotSpa }

									aria-hidden='true'
								/>{ /* What: Hero Dot Span Element. Why: A dot of confetti leads the label. How: This draws a small berry circle, hidden from screen readers. */ }
								Hand-coded greeting cards
							</p>

							<h1 className={ cssModObj.herTitHea }>Cards that <span className={ cssModObj.herAccSpa }>come alive</span>.</h1>{ /* What: Hero Title Heading Element. Why: The heading says what makes these cards different. How: This shows the page's h1, its last words underlined in a berry squiggle. */ }

							<p className={ cssModObj.herLeaPar }>{ /* What: Hero Lead Paragraph Element. Why: A short paragraph says what a visitor can do here. How: This sums up the cards and the three steps. */ }
								Animated, interactive greeting cards for birthdays, holidays, and the people who matter. Pick one, add their name (if applicable), and send the link.
							</p>

							<div className={ cssModObj.herActDiv }>{ /* What: Hero Actions Div Element. Why: The two ways onward sit side by side. How: This sets the buttons in a row that wraps. */ }


								<Link
									className={ cssModObj.butPriAnc }

									to='/gallery'
								>Browse the Gallery</Link>{ /* What: Browse Gallery Link. Why: Browsing is the site's main action. How: This routes to the Gallery as an orange button. */ }



								<a
									className={ cssModObj.butSecAnc }

									href='#how-it-works'
								>How It Works</a>{ /* What: Button Secondary Anchor Element. Why: A first-time visitor may want to know how sending works. How: This jumps to the steps below as an outlined button. */ }


							</div>


						</div>



						<div
							className={ cssModObj.envStaDiv }

							aria-hidden='true'
						>{ /* What: Envelope Stage Div Element. Why: Cards fanning out of an open envelope show what the site does at a glance. How: This holds the envelope's back, flap, cards, front, stamp, and confetti, hidden from screen readers as decoration. */ }


							<div className={ cssModObj.envFlaDiv } />{ /* What: Envelope Flap Div Element. Why: The open flap stands up behind the cards. How: This draws a triangle above the envelope's back. */ }

							<div className={ cssModObj.envBacDiv } />{ /* What: Envelope Back Div Element. Why: The envelope's inside shows behind the cards. How: This draws the berry-lined back panel. */ }

							{ HER_CAR_ARR.map( ( carRecObj ) => ( // What: Hero Card Map Call. Why: Each of the three cards rises out of the envelope. How: This renders one image per card, left to right.


								<img
									key={ carRecObj.sluStr }

									className={ cssModObj.envCarIma }

									height='675' // What: Intrinsic Height. Why: The hero shouldn't shift while the cards load. How: This is the preview file's real height in pixels.
									src={ carRecObj.imaStr }
									width='1200' // What: Intrinsic Width. Why: The hero shouldn't shift while the cards load. How: This is the preview file's real width in pixels.

									alt=''
								/> // What: Envelope Card Image Element. Why: A still of each card sits in the fan. How: This shows the card's preview in a white border, its alt left empty since the stage is decoration.


							))}



							<div className={ cssModObj.envFroDiv }>{ /* What: Envelope Front Div Element. Why: The envelope's front pocket holds the cards' lower edges. How: This draws the front with a V cut into its top, carrying the stamp. */ }


								<div className={ cssModObj.staWraDiv }>{ /* What: Stamp Wrap Div Element. Why: The stamp casts a shadow along its perforated edge. How: This draws the shadow and tips the stamp. */ }


									<div className={ cssModObj.staFraDiv }>{ /* What: Stamp Frame Div Element. Why: A postage stamp says the card is ready to send. How: This draws a perforated white stamp around a berry heart. */ }


										<svg
											className={ cssModObj.staHeaSvg }

											viewBox='0 0 24 24'
										>{ /* What: Stamp Heart SVG Element. Why: The stamp's picture is a heart. How: This draws a berry heart filling the stamp. */ }


											<path d='M 12 21 C 5 15.5 2 12 2 8.5 C 2 5.5 4.3 3.5 7 3.5 C 9 3.5 10.8 4.6 12 6.4 C 13.2 4.6 15 3.5 17 3.5 C 19.7 3.5 22 5.5 22 8.5 C 22 12 19 15.5 12 21 Z' />{ /* What: Heart Path Element. Why: The heart is the stamp's picture. How: This draws its outline, filled berry. */ }


										</svg>


									</div>


								</div>


							</div>



							{ [ 1, 2, 3, 4, 5, 6 ].map( ( pieIndNum ) => ( // What: Confetti Piece Map Call. Why: Confetti bursts out with the cards. How: This renders six pieces, each placed, shaped, and colored by its position in the module.


								<span
									key={ pieIndNum }

									className={ cssModObj.conPieSpa }
								/> // What: Confetti Piece Span Element. Why: Each piece of confetti is its own small shape. How: This renders an empty span the module shapes and places.


							))}


						</div>


					</div>


				</section>



				<section
					id='how-it-works' // What: How It Works Identifier. Why: The hero's How It Works button jumps here, and the address can be shared as /#how-it-works. How: It keeps its plain, readable name, since a navigation target's id appears in the address.

					className={ cssModObj.homHiwSec }
				>{ /* What: Home How-It-Works Section Element. Why: A first-time visitor learns how sending a card works. How: This holds the heading and the three steps. */ }


					<div className={ cssModObj.secInnDiv }>{ /* What: Section Inner Div Element. Why: The section's content sits in the site's centered column. How: This caps and centers it with the side gutter. */ }


						<p className={ cssModObj.secEyePar }>How it works</p>{ /* What: Section Eyebrow Paragraph Element. Why: A small label names the section. How: This shows it in berry mono capitals. */ }

						<h2 className={ cssModObj.secTitHea }>Pick it. Personalize it. Send it.</h2>{ /* What: Section Title Heading Element. Why: The heading sums up the three steps. How: This shows the section's h2. */ }


						<ol className={ cssModObj.steLisOrd }>{ /* What: Step List Ordered Element. Why: The steps happen in order. How: This lays the three steps out in a row, stacking on phones. */ }


							{ STE_REC_ARR.map( ( steRecObj, steIndNum ) => ( // What: Step Map Call. Why: Every step gets a card. How: This renders one list item per step.


								<li
									key={ steRecObj.titStr }

									className={ cssModObj.steIteIte }
								>{ /* What: Step Item Item Element. Why: Each step is a small card. How: This holds the step's number, title, and description, lifting on hover. */ }


									<span
										className={ cssModObj.steNumSpa }

										aria-hidden='true'
									>{ `0${ steIndNum + 1 }` }</span>{ /* What: Step Number Span Element. Why: A numbered confetti dot marks each step. How: This shows the step's number in a colored circle, hidden from screen readers since the list already numbers it. */ }

									<h3 className={ cssModObj.steTitHea }>{ steRecObj.titStr }</h3>{ /* What: Step Title Heading Element. Why: Each step has a short name. How: This shows it as an h3. */ }

									<p className={ cssModObj.steDesPar }>{ steRecObj.desStr }</p>{ /* What: Step Description Paragraph Element. Why: A line explains each step. How: This shows the step's description. */ }


								</li>


							))}


						</ol>


					</div>


				</section>



				<section className={ cssModObj.homFeaSec }>{ /* What: Home Featured Section Element. Why: A taste of the Gallery invites a visitor in. How: This holds the section's header and four random cards. */ }


					<div className={ cssModObj.secInnDiv }>{ /* What: Section Inner Div Element. Why: The section's content sits in the site's centered column. How: This caps and centers it with the side gutter. */ }


						<div className={ cssModObj.feaHeaDiv }>{ /* What: Featured Header Div Element. Why: The heading and the link to every card sit on one line on wide screens. How: This spreads them apart, wrapping on phones. */ }


							<div>{ /* What: Featured Heading Div Element. Why: The eyebrow and heading read as one block beside the link. How: This stacks them. */ }


								<p className={ cssModObj.secEyePar }>From the gallery</p>{ /* What: Section Eyebrow Paragraph Element. Why: A small label names the section. How: This shows it in berry mono capitals. */ }

								<h2 className={ cssModObj.secTitHea }>A few favorites</h2>{ /* What: Section Title Heading Element. Why: The heading introduces the featured cards. How: This shows the section's h2. */ }


							</div>



							<Link
								className={ cssModObj.allCarAnc }

								to='/gallery'
							>See all cards <span className={ cssModObj.allArrSpa } aria-hidden='true'>→</span></Link>{ /* What: See All Cards Link. Why: Four cards are only a taste. How: This routes to the Gallery, its arrow nudging on hover and hidden from screen readers, which would otherwise read it out. */ }


						</div>


						<div className={ cssModObj.feaGriDiv }>{ /* What: Featured Grid Div Element. Why: The featured cards sit in an even grid. How: This lays them out four, two, or one across. */ }


							{ feaCarArr.map( ( carRecObj ) => ( // What: Featured Card Map Call. Why: Every featured card gets a tile. How: This renders one per picked card.


								<CarTilCom
									key={ carRecObj.sluStr }

									carRecObj={ carRecObj }

									onShaCarFun={ setShaCarObj }
								/> // What: Card Tile Component. Why: Each featured card shows as a tile. How: This renders the card's tile, its Share opening the dialog for it.


							))}


						</div>


					</div>


				</section>



				<section className={ cssModObj.homComSec }>{ /* What: Home Commission Section Element. Why: A visitor may want a card made just for them. How: This holds the postcard banner. */ }


					<div className={ cssModObj.secInnDiv }>{ /* What: Section Inner Div Element. Why: The section's content sits in the site's centered column. How: This caps and centers it with the side gutter. */ }


						<div className={ cssModObj.posShaDiv }>{ /* What: Postcard Shadow Div Element. Why: The postcard's shadow has to follow its perforated edge. How: This casts a drop shadow from the masked card inside it. */ }


							<div className={ cssModObj.posCarDiv }>{ /* What: Postcard Card Div Element. Why: The invitation reads as a postcard, the site's mail motif. How: This draws a white card with a perforated edge, its motif faint behind the text. */ }


								<ConCirCom patOpaStr='var( --cdn-pow-009-rec )' />{ /* What: Confetti Circuit Component. Why: The postcard carries the site's motif. How: This draws the pattern faintly behind its text. */ }{ /* Core-Design-Number to the Power of 9 Reciprocal ~= 0.080 */ }



								<div className={ cssModObj.posTexDiv }>{ /* What: Postcard Text Div Element. Why: The invitation reads as one column beside the postmark. How: This stacks the eyebrow, heading, paragraph, and button. */ }


									<p className={ cssModObj.secEyePar }>Made to order</p>{ /* What: Section Eyebrow Paragraph Element. Why: A small label names the banner. How: This shows it in berry mono capitals. */ }

									<h2 className={ cssModObj.posTitHea }>Have an occasion in mind?</h2>{ /* What: Postcard Title Heading Element. Why: The heading asks the question the banner answers. How: This shows the banner's h2. */ }

									<p className={ cssModObj.posTexPar }>{ /* What: Postcard Text Paragraph Element. Why: A short line says what a custom card can be. How: This describes the service. */ }
										I build one-of-a-kind cards for anniversaries, graduations, retirements, or any day worth celebrating, with your words and your people in them.
									</p>



									<Link
										className={` ${ cssModObj.butPriAnc }   ${ cssModObj.butPriAncPostcard } `}

										to='/contact'
									>Request a Custom Card</Link>{ /* What: Request Custom Card Link. Why: Asking for a custom card starts with a message. How: This routes to the Contact page as an orange button, its text a step smaller on phones so the long label doesn't wrap the button tall. */ }


								</div>

								<svg
									className={ cssModObj.posMarSvg }

									fill='none'
									viewBox='0 0 160 120'

									aria-hidden='true'
								>{ /* What: Postcard Mark SVG Element. Why: A postmark and its wavy cancel lines finish the postcard look. How: This draws two rings and three waves, hidden from screen readers as decoration. */ }


									<circle
										cx='56'
										cy='60'
										r='42'
										stroke='currentColor'
										strokeWidth='2'
									/>{ /* What: Postmark Outer Circle Element. Why: A postmark is a ring. How: This draws its outer ring. */ }

									<circle
										cx='56'
										cy='60'
										r='32'
										stroke='currentColor'
										strokeDasharray='4 5'
										strokeWidth='1.5'
									/>{ /* What: Postmark Inner Circle Element. Why: A postmark's inner ring is broken. How: This draws a dashed ring inside the first. */ }

									<path
										d='M 70 40 Q 85 30 100 40 T 130 40 T 160 40 M 70 60 Q 85 50 100 60 T 130 60 T 160 60 M 70 80 Q 85 70 100 80 T 130 80 T 160 80'
										stroke='currentColor'
										strokeWidth='2'
									/>{ /* What: Cancel Lines Path Element. Why: Wavy cancel lines run from a postmark. How: This draws three waves to its right. */ }


								</svg>


							</div>


						</div>


					</div>


				</section>


			</div>



			{ shaCarObj && ( // What: Share Dialog Check. Why: The dialog only exists while a card is being shared. How: This mounts it once a tile's Share is pressed.


				<ShaDiaCom
					key={ shaCarObj.sluStr } // What: Dialog Remount Key. Why: A different card shared while one dialog is still mounted should get a fresh dialog, with its own empty name field and status. How: This keys the dialog by the card's address, so React remounts it whenever the card changes.

					carRecObj={ shaCarObj }

					onDiaCloFun={ () => setShaCarObj( null ) }
				/> // What: Share Dialog Component. Why: The visitor sends the card from here. How: This opens the dialog for the card, keyed by it so each card starts fresh, unmounting it once it closes.


			) }


		</>


	);


}

// #endregion HomPagCom

// #endregion Components



// #region Exports

export { HomPagCom }; // What: Named Exports. Why: The router's root route renders the home page. How: This exports HomPagCom.

// #endregion Exports


