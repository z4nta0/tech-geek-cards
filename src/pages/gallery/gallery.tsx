


// #region Imports

import cssModObj from './gallery.module.css'; // What: CSS Module Object. Why: The Gallery's hero, controls, and grid are styled in its own module. How: This maps each class name in gallery.module.css to its hashed module class.


import { CAR_REC_ARR  } from '../../ui/cards.ts';                      // What: Card Record Array. Why: The Gallery lists every listed card. How: The page filters it.
import { CarTilCom    } from '../../ui/card-tile.tsx';                 // What: Card Tile Component. Why: Each card shows as a tile. How: The page renders one per matching card.
import { ConCirCom    } from '../../ui/confetti-circuit.tsx';          // What: Confetti Circuit Component. Why: The hero carries the site's motif. How: The page sets it behind the hero.
import { HOL_NAM_ARR  } from '../../ui/card-data.ts';                  // What: Holiday Name Array. Why: The filter offers every holiday after the occasions. How: The page renders a button for each.
import { Link         } from 'react-router';                           // What: Link. Why: The custom card note moves to the Contact page without a full page load. How: This renders that link.
import { OCC_NAM_ARR  } from '../../ui/card-data.ts';                  // What: Occasion Name Array. Why: The filter offers every occasion. How: The page renders a button for each.
import { ShaDiaCom    } from '../../ui/share-dialog.tsx';              // What: Share Dialog Component. Why: A card can be shared straight from its tile. How: The page mounts it when a tile's "Share" is pressed.
import { usePagDesFun } from 'techgeek-design/ui/page-description.ts'; // What: Use Page Description Function. Why: The Gallery's search description differs from the Home page's. How: The page calls it to swap the one description tag's text while it shows.
import { useRef       } from 'react';                                  // What: Use Reference. Why: "Show All Cards" hands focus to the search field. How: This holds the field.
import { useState     } from 'react';                                  // What: Use State. Why: The page remembers the search, the chosen occasion, and the card being shared. How: This holds each of them.


import type { CarRecTyp } from '../../ui/cards.ts';     // What: Card Record Type. Why: The page holds the card being shared. How: This types that state.
import type { HolNamTyp } from '../../ui/card-data.ts'; // What: Holiday Name Type. Why: The chosen filter may be a holiday. How: This types that state.
import type { JSX       } from 'react';                 // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.
import type { OccNamTyp } from '../../ui/card-data.ts'; // What: Occasion Name Type. Why: The chosen filter may be an occasion. How: This types that state.

// #endregion Imports



/**
 * gallery.tsx = Gallery
 *
 * @summary
 * The page listing the listed cards: a hero, a search field and occasion
 * filter buttons, a line saying how many cards match, the matching cards as
 * tiles, and a note inviting a custom card. The grid is exempt from even rows,
 * as TechGeek.dev's Work grid is, since its cards change with the search and
 * the filter and grow as cards are added: full rows read as three, two, or one
 * columns, and a short last row sits centered. Any card can be shared from its
 * tile through the share dialog.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region GalPagCom

/**
 * GalPagCom = Gallery Page Component
 *
 * @summary
 * Renders the Gallery and its title and canonical link, and swaps in its
 * search description. A card matches when it's listed, belongs to the chosen
 * occasion (any, for "All"), and holds every word of the search in its title,
 * occasion, or description, ignoring case. The occasion buttons report which
 * one is chosen through aria-pressed. The count line is a live region, so a
 * screen reader hears how many cards match as the search changes. With no
 * matches, the grid gives way to a message and a button that clears the
 * search and the filter. A tile's "Share" mounts the share dialog for its
 * card, keyed by the card, and the dialog's close callback unmounts it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The page's head tags, its wrapper div, and the share dialog when
 *          it's open.
 *
 * @example
 * ```tsx
 * GalPagCom() // => <GalPagCom />
 * ```
 *
*/

function GalPagCom () : JSX.Element {


	const seaInpRef = useRef< HTMLInputElement >( null ); // What: Search Input Reference. Why: "Show All Cards" disappears as the grid comes back, so focus needs somewhere to go. How: This holds the search field, which takes it.

	const [ actOccStr, setActOccStr ] = useState< HolNamTyp | OccNamTyp | 'All' >( 'All' ); // What: Active Occasion String And Setter. Why: The filter shows one occasion, one holiday, or every card. How: This starts on "All".
	const [ resChoBoo, setResChoBoo ] = useState( false );                                  // What: Result Chosen Boolean And Setter. Why: The results fade in only after a visitor's first choice, not on the page's own arrival. How: This starts false and turns true at the first search, filter, or "Show All Cards", which fades the results in once even when they stay the same.
	const [ seaTexStr, setSeaTexStr ] = useState( '' );                                     // What: Search Text String And Setter. Why: The search field narrows the cards as a visitor types. How: This holds the field's text.
	const [ shaCarObj, setShaCarObj ] = useState< CarRecTyp | null >( null );               // What: Share Card Object And Setter. Why: The share dialog shows the card whose "Share" was pressed. How: This starts with no card, so no dialog.



	usePagDesFun( 'Browse animated greeting cards for birthdays, holidays, and family days, then send your favorite one to a friend for free.' ); // What: Page Description Call. Why: Search listings should describe the Gallery, not repeat the Home page. How: This swaps the one description tag's text for the page's own while it shows.



	const seaWorArr = seaTexStr.toLowerCase().split( /\s+/ ).filter( Boolean ); // What: Search Word Array. Why: Every word of the search should match, in any order. How: This lowercases the search and splits it into its words, dropping empty ones.


	const shoCarArr = CAR_REC_ARR.filter( ( carRecObj ) => { // What: Shown Card Array. Why: The grid shows only the cards that match. How: This keeps each listed card that fits the chosen occasion or holiday and holds every search word.


		const carTexStr = `${ carRecObj.titStr } ${ carRecObj.occStr } ${ carRecObj.holStr ?? '' } ${ carRecObj.desStr }`.toLowerCase(); // What: Card Text String. Why: A search word may appear in the title, the occasion, the holiday, or the description. How: This joins and lowercases all four, a card with no holiday adding an empty word.

		const lisCarBoo = carRecObj.lisBoo;                                                         // What: Listed Card Boolean. Why: An unlisted card is reached only by its own link. How: This is true when the card is listed.
		const occMatBoo = [ 'All', carRecObj.occStr, carRecObj.holStr ].includes( actOccStr );      // What: Occasion Match Boolean. Why: The filter narrows the cards to one occasion or holiday. How: This is true on "All", or when the card's occasion or holiday is the chosen one.
		const seaMatBoo = seaWorArr.every( ( seaWorStr ) => carTexStr.includes( seaWorStr ) );      // What: Search Match Boolean. Why: Every word typed should narrow the cards. How: This is true when the card's text holds each word.

		const carMatBoo = lisCarBoo && occMatBoo && seaMatBoo; // What: Card Match Boolean. Why: A card shows only when it's listed and matches both the filter and the search. How: This combines the three checks.



		return carMatBoo; // What: Card Match Return. Why: The filter keeps the cards that match. How: This hands back the combined check.


	} );


	const resKeyStr = shoCarArr.map( ( carRecObj ) => carRecObj.sluStr ).join( ' ' ); // What: Result Key String. Why: After the first choice, the results should fade in only when the cards shown change, not on every keystroke that leaves them the same. How: This joins the shown cards' addresses, which the count and the grid are keyed by.



	const cleFilFun = () => { // What: Clear Filters Function. Why: A search with no matches needs a quick way back. How: This empties the search, chooses "All", and focuses the search field.


		setSeaTexStr( '' ); // What: Search Clear Call. Why: The search no longer narrows the cards. How: This empties the field.

		setActOccStr( 'All' ); // What: Occasion Reset Call. Why: The filter no longer narrows the cards. How: This chooses "All".

		setResChoBoo( true ); // What: Result Chosen Setter Call. Why: The returning cards are the result of the press. How: This turns on the results' arriving fade.

		seaInpRef.current?.focus(); // What: Search Focus Call. Why: The pressed button leaves with the empty message, and focus must never fall to the page. How: This moves focus to the cleared search field, where a visitor would try again.


	};



	return (


		<>{ /* What: Gallery Fragment. Why: The page's head tags, its content, and the share dialog render side by side. How: This groups them without adding an element. */ }


			<title>Greeting Card Gallery | TechGeek.cards</title>{ /* What: Page Title Element. Why: A visitor's tab and history should name the Gallery. How: React 19 moves this title into the document head while the page is shown. */ }

			<link
				href='https://techgeek.cards/gallery'
				rel='canonical'
			/>{ /* What: Canonical Link Element. Why: Search engines should treat every address that reaches the Gallery as one page. How: React 19 moves this link into the head while the page is shown. */ }



			<div className={ cssModObj.pagEntDiv }>{ /* What: Page Enter Div Element. Why: The page fades up into view as it opens. How: This wraps every section and plays the shared entrance. */ }


				<section className={ cssModObj.galHerSec }>{ /* What: Gallery Hero Section Element. Why: The page opens on its heading over the site's motif. How: This holds the motif and the hero's text, its bottom edge cut in scallops like a stamp's. */ }


					<ConCirCom patOpaStr='var( --cdn-pow-007-rec )' />{ /* What: Confetti Circuit Component. Why: The hero carries the site's motif behind its content. How: This draws the pattern at about 14% strength. */ }{ /* Core-Design-Number to the Power of 7 Reciprocal ~= 0.140 */ }



					<div className={ cssModObj.herInnDiv }>{ /* What: Hero Inner Div Element. Why: The hero's text sits in the site's centered column. How: This caps, centers, and stacks it. */ }


						<p className={ cssModObj.secEyePar }>The Gallery</p>{ /* What: Section Eyebrow Paragraph Element. Why: A small label names the page. How: This shows it in berry mono capitals. */ }

						<h1 className={ cssModObj.herTitHea }>Find the right card</h1>{ /* What: Hero Title Heading Element. Why: The heading says what the page is for. How: This shows the page's h1. */ }

						<p className={ cssModObj.herLeaPar }>{ /* What: Hero Lead Paragraph Element. Why: A line says how to use the page. How: This explains searching, filtering, and sending. */ }
							Search by name or occasion, open any card to watch it play, and share it in a couple of taps.
						</p>


					</div>


				</section>



				<section className={ cssModObj.galLisSec }>{ /* What: Gallery List Section Element. Why: The controls and the cards are the page's content. How: This holds the page's controls and cards, such as the search, and its closing note. */ }


					<div className={ cssModObj.secInnDiv }>{ /* What: Section Inner Div Element. Why: The section's content sits in the site's centered column. How: This caps and centers it with the side gutter. */ }


						<div className={ cssModObj.conBarDiv }>{ /* What: Controls Bar Div Element. Why: The search and the filter sit together above the cards. How: This sets them in a row, wrapping onto two lines at about 1,140px wide and below. */ }


							<div className={ cssModObj.seaFieDiv }>{ /* What: Search Field Div Element. Why: The search's label and field read as one unit. How: This stacks them. */ }


								<label
									className={ cssModObj.seaLabLab }

									htmlFor='galSeaInp'
								>Search cards</label>{ /* What: Search Label Label Element. Why: The search field needs a visible label. How: This labels `galSeaInp`. */ }

								<input
									ref={ seaInpRef }

									id='galSeaInp'

									className={ cssModObj.seaTexInp }

									autoComplete='off'
									placeholder='Try "birthday" or "spooky"'
									type='search'
									value={ seaTexStr }

									onChange={ ( chaEveObj ) => { // What: Search Change Handler. Why: Typing narrows the cards, and the new result should be seen arriving. How: This stores the text and turns on the results' arriving fade.


										setSeaTexStr( chaEveObj.target.value ); // What: Search Text Setter Call. Why: The search narrows the cards. How: This stores the text.

										setResChoBoo( true ); // What: Result Chosen Setter Call. Why: From now on each new result should fade in. How: This turns on the results' arriving fade.


									} }
								/>{ /* What: Search Text Input Element. Why: A visitor can narrow the cards by typing. How: This filters the grid as they type. */ }


							</div>

							<div
								className={ cssModObj.occFilDiv }

								aria-label='Occasion'
								role='group'
							>{ /* What: Occasion Filter Div Element. Why: A visitor can narrow the cards to one occasion or holiday. How: This groups the occasion and holiday buttons under one name, in a row wrapping onto two lines at about 900px wide and below, three at about 520px, and four at about 370px. */ }


								{ [ 'All' as const, ...OCC_NAM_ARR, ...HOL_NAM_ARR ].map( ( occNamStr ) => ( // What: Occasion Button Map Call. Why: Every occasion and holiday, after "All", gets a button. How: This renders one per occasion, then one per holiday. // What: Type Assertion Note. Why: A plain `'All'` would widen the array to string, losing the occasion type the state needs. How: as const keeps it the literal `'All'`.


									<button
										key={ occNamStr }

										className={ cssModObj.occFilBut }

										type='button'

										aria-pressed={ actOccStr === occNamStr }

										onClick={ () => { // What: Occasion Click Handler. Why: Choosing an occasion or holiday narrows the cards, and the new result should be seen arriving. How: This chooses the occasion and turns on the results' arriving fade.


											setActOccStr( occNamStr ); // What: Occasion Setter Call. Why: The filter narrows the cards to this occasion or holiday. How: This chooses it.

											setResChoBoo( true ); // What: Result Chosen Setter Call. Why: From now on each new result should fade in. How: This turns on the results' arriving fade.


										} }
									>{ occNamStr }</button> // What: Occasion Filter Button Element. Why: Each button chooses its occasion or holiday. How: This chooses it, reporting whether it's the chosen one through aria-pressed.


								))}


							</div>


						</div>


						<p
							className={ cssModObj.resCouPar }

							role='status'
						>{ /* What: Result Count Paragraph Element. Why: A visitor, and a screen reader, should know how many cards match. How: This live region shows the count, announcing each change. */ }


							<span
								key={ resKeyStr } // What: Count Key. Why: A new count should fade in with its result. How: A new key remounts the span inside the live region, replaying its entrance while the region itself stays.

								className={` ${ cssModObj.resCouSpa }   ${ resChoBoo ? cssModObj.resCouSpaArriving : '' } `}
							>{ `${ shoCarArr.length } ${ shoCarArr.length === 1 ? 'card' : 'cards' }` }</span>{ /* What: Result Count Span Element. Why: The count changes with the result. How: This shows the number of matching cards, fading each new count in once a visitor has changed the result. */ }


						</p>

						<h2 className={ cssModObj.galHidHea }>Cards</h2>{ /* What: Gallery Hidden Heading Element. Why: The tiles' titles are h3s, and the page's headings should step down in order from its h1. How: This names the Cards section with an h2 that only screen readers and the outline see. */ }



						{ shoCarArr.length > 0 ? ( // What: Results Check. Why: The grid only makes sense with cards to show. How: This renders the grid when any card matches, or the empty message when none does.


							<div
								key={ resKeyStr } // What: Grid Key. Why: A new result should fade in as a whole. How: A new key remounts the grid, replaying its entrance.

								className={` ${ cssModObj.galGriDiv }   ${ resChoBoo ? cssModObj.galGriDivArriving : '' } `}
							>{ /* What: Gallery Grid Div Element. Why: The cards line up in columns, with a short last row centered. How: This wraps the tiles in centered rows, three across, two at 1,024px and below, and one at 640px and below. */ }


								{ shoCarArr.map( ( carRecObj, carIndNum ) => ( // What: Card Map Call. Why: Every matching card gets a tile. How: This renders one per card, with its place in the list.


									<CarTilCom
										key={ carRecObj.sluStr }

										carRecObj={ carRecObj }
										eagLoaBoo={ carIndNum < 9 } // What: Eager Loading Choice. Why: The grid's first three rows of three can be in view as the page opens, as on a monitor turned upright, while later tiles start further down. How: This loads the first nine tiles' previews at once and the rest lazily.

										onShaCarFun={ setShaCarObj }
									/> // What: Card Tile Component. Why: Each card shows as a tile. How: This renders the card's tile, its "Share" opening the dialog for it.


								))}


							</div>


						) : ( // What: Empty Results Branch. Why: A search with no matches needs a way back. How: This renders the empty message instead of the grid.


							<div className={` ${ cssModObj.empResDiv }   ${ resChoBoo ? cssModObj.empResDivArriving : '' } `}>{ /* What: Empty Results Div Element. Why: A search with no matches should say so kindly. How: This centers the message and the button. */ }


								<p className={ cssModObj.empResPar }>No cards match that search yet.</p>{ /* What: Empty Results Paragraph Element. Why: The visitor should know why the grid is empty. How: This says nothing matched. */ }

								<button
									className={ cssModObj.butSecBut }

									type='button'

									onClick={ cleFilFun }
								>Show All Cards</button>{ /* What: Button Secondary Button Element. Why: The way back is one press. How: This clears the search and the filter and hands focus to the search field. */ }


							</div>


						) }



						<p className={ cssModObj.cusNotPar }>{ /* What: Custom Note Paragraph Element. Why: A visitor who doesn't see their occasion can ask for one. How: This invites a custom card, linking to the Contact page. */ }
							Don't see your occasion? <Link className={ cssModObj.cusNotAnc } to='/contact'>Request a custom card</Link>.
						</p>


					</div>


				</section>


			</div>



			{ shaCarObj && ( // What: Share Dialog Check. Why: The dialog only exists while a card is being shared. How: This mounts it once a tile's "Share" is pressed.


				<ShaDiaCom
					key={ shaCarObj.sluStr } // What: Dialog Remount Key. Why: A different card shared while one dialog is still mounted should get a fresh dialog, with its own empty name field and status. How: This keys the dialog by the card's address, so React remounts it whenever the card changes.

					carRecObj={ shaCarObj }

					onDiaCloFun={ () => setShaCarObj( null ) }
				/> // What: Share Dialog Component. Why: The visitor sends the card from here. How: This opens the dialog for the card, keyed by it so each card starts fresh, unmounting it once it closes.


			) }


		</>


	);


}

// #endregion GalPagCom

// #endregion Components



// #region Exports

export { GalPagCom }; // What: Named Export. Why: The router's Gallery route renders the Gallery. How: This exports GalPagCom.

// #endregion Exports


