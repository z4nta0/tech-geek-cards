



// #region Imports

import cssModObj from './gallery.module.css'; // What: CSS Module Object. Why: The Gallery's hero, controls, and grid are styled in its own module. How: This maps each class name in gallery.module.css to its hashed module class.


import { CAR_REC_ARR  } from '../../ui/cards.ts';                      // What: Card Record Array. Why: The Gallery lists every listed card. How: The page filters it.
import { CarTilCom    } from '../../ui/card-tile.tsx';                 // What: Card Tile Component. Why: Each card shows as a tile. How: The page renders one per matching card.
import { ConCirCom    } from '../../ui/confetti-circuit.tsx';          // What: Confetti Circuit Component. Why: The hero carries the site's motif. How: The page sets it behind the hero.
import { Link         } from 'react-router';                           // What: Link. Why: The custom card note moves to the Contact page without a full page load. How: This renders that link.
import { OCC_NAM_ARR  } from '../../ui/cards.ts';                      // What: Occasion Name Array. Why: The filter offers every occasion. How: The page renders a button for each.
import { ShaDiaCom    } from '../../ui/share-dialog.tsx';              // What: Share Dialog Component. Why: A card can be shared straight from its tile. How: The page mounts it when a tile's Share is pressed.
import { usePagDesFun } from 'techgeek-design/ui/page-description.ts'; // What: Use Page Description Function. Why: The Gallery's search description differs from the home page's. How: The page calls it to swap the one description tag's text while it shows.
import { useState     } from 'react';                                  // What: Use State. Why: The page remembers the search, the chosen occasion, and the card being shared. How: This holds each of them.


import type { CarRecTyp } from '../../ui/cards.ts'; // What: Card Record Type. Why: The page holds the card being shared. How: This types that state.
import type { JSX       } from 'react';             // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.
import type { OccNamTyp } from '../../ui/cards.ts'; // What: Occasion Name Type. Why: The chosen filter is an occasion or All. How: This types that state.

// #endregion Imports



/**
 * gallery.tsx = Gallery
 *
 * @summary
 * The page listing every card: a hero, a search field and occasion filter
 * buttons, a line saying how many cards match, the matching cards as tiles,
 * and a note inviting a custom card. The grid is exempt from even rows, as
 * TechGeek.dev's Work grid is, since its cards change with the search and the
 * filter and grow as cards are added: full rows read as three, two, or one
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
 * occasion (any, for All), and holds every word of the search in its title,
 * occasion, or description, ignoring case. The occasion buttons report which
 * one is chosen through aria-pressed. The count line is a live region, so a
 * screen reader hears how many cards match as the search changes. With no
 * matches, the grid gives way to a message and a button that clears the
 * search and the filter. A tile's Share mounts the share dialog for its
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


	const [ actOccStr, setActOccStr ] = useState< OccNamTyp | 'All' >( 'All' ); // What: Active Occasion String And Setter. Why: The filter shows one occasion or every card. How: This starts on All.
	const [ seaTexStr, setSeaTexStr ] = useState( '' );                         // What: Search Text String And Setter. Why: The search field narrows the cards as a visitor types. How: This holds the field's text.
	const [ shaCarObj, setShaCarObj ] = useState< CarRecTyp | null >( null );   // What: Share Card Object And Setter. Why: The share dialog shows the card whose Share was pressed. How: This starts with no card, so no dialog.



	usePagDesFun( 'Browse animated greeting cards for birthdays, holidays, and family days, then add a name and send the link.' ); // What: Page Description Call. Why: Search listings should describe the Gallery, not repeat the home page. How: This swaps the one description tag's text for the page's own while it shows.



	const seaWorArr = seaTexStr.toLowerCase().split( /\s+/ ).filter( Boolean ); // What: Search Word Array. Why: Every word of the search should match, in any order. How: This lowercases the search and splits it into its words, dropping empty ones.


	const shoCarArr = CAR_REC_ARR.filter( ( carRecObj ) => { // What: Shown Card Array. Why: The grid shows only the cards that match. How: This keeps each listed card that fits the chosen occasion and holds every search word.


		const carTexStr = `${ carRecObj.titStr } ${ carRecObj.occStr } ${ carRecObj.desStr }`.toLowerCase(); // What: Card Text String. Why: A search word may appear in the title, the occasion, or the description. How: This joins and lowercases all three.

		const occMatBoo = actOccStr === 'All' || carRecObj.occStr === actOccStr;               // What: Occasion Match Boolean. Why: The filter narrows the cards to one occasion. How: This is true on All, or when the card's occasion is the chosen one.
		const seaMatBoo = seaWorArr.every( ( seaWorStr ) => carTexStr.includes( seaWorStr ) ); // What: Search Match Boolean. Why: Every word typed should narrow the cards. How: This is true when the card's text holds each word.



		return carRecObj.lisBoo && occMatBoo && seaMatBoo; // What: Card Match Return. Why: A card shows only when it's listed and matches both. How: This combines the three checks.


	} );



	const cleFilFun = () => { // What: Clear Filters Function. Why: A search with no matches needs a quick way back. How: This empties the search and chooses All.


		setSeaTexStr( '' ); // What: Search Clear Call. Why: The search no longer narrows the cards. How: This empties the field.

		setActOccStr( 'All' ); // What: Occasion Reset Call. Why: The filter no longer narrows the cards. How: This chooses All.


	};



	return (


		<>{ /* What: Gallery Fragment. Why: The page's head tags, its content, and the share dialog render side by side. How: This groups them without adding an element. */ }


			<title>Greeting Card Gallery | TechGeek.cards</title>{ /* What: Page Title Element. Why: A visitor's tab and history should name the Gallery. How: React 19 moves this title into the document head while the page is shown. */ }

			<link
				href='https://techgeek.cards/gallery'
				rel='canonical'
			/>{ /* What: Canonical Link Element. Why: Search engines should treat every address that reaches the Gallery as one page. How: React 19 moves this link into the head while the page is shown. */ }



			<div className={ cssModObj.pagEntDiv }>{ /* What: Page Enter Div Element. Why: The page fades up into view as it opens. How: This wraps every section and plays the shared entrance. */ }



				<section className={ cssModObj.herSec }>{ /* What: Hero Section Element. Why: The page opens on its heading over the site's motif. How: This holds the motif and the hero's text, its bottom edge cut in scallops like a stamp's. */ }



					<ConCirCom patOpaStr='var( --cdn-pow-007-rec )' />{ /* What: Confetti Circuit Component. Why: The hero carries the site's motif behind its content. How: This draws the pattern at about 14% strength. */ }{ /* Core-Design-Number to the Power of 7 Reciprocal ~= 0.140 */ }



					<div className={ cssModObj.herInnDiv }>{ /* What: Hero Inner Div Element. Why: The hero's text sits in the site's centered column. How: This caps, centers, and stacks it. */ }


						<p className={ cssModObj.secEyePar }>The gallery</p>{ /* What: Section Eyebrow Paragraph Element. Why: A small label names the page. How: This shows it in berry mono capitals. */ }

						<h1 className={ cssModObj.herTitHea }>Find the right card</h1>{ /* What: Hero Title Heading Element. Why: The heading says what the page is for. How: This shows the page's h1. */ }

						<p className={ cssModObj.herLeaPar }>{ /* What: Hero Lead Paragraph Element. Why: A line says how to use the page. How: This explains searching, filtering, and sending. */ }
							Search by name or occasion, open any card to watch it play, and share it in a couple of taps.
						</p>


					</div>



				</section>



				<section className={ cssModObj.galSec }>{ /* What: Gallery Section Element. Why: The controls and the cards are the page's content. How: This holds the controls, the count, and the grid or the empty message. */ }



					<div className={ cssModObj.secInnDiv }>{ /* What: Section Inner Div Element. Why: The section's content sits in the site's centered column. How: This caps and centers it with the side gutter. */ }



						<div className={ cssModObj.conBarDiv }>{ /* What: Controls Bar Div Element. Why: The search and the filter sit together above the cards. How: This sets them in a row that wraps. */ }


							<div className={ cssModObj.seaFieDiv }>{ /* What: Search Field Div Element. Why: The search's label and field read as one unit. How: This stacks them. */ }


								<label
									className={ cssModObj.seaLabLab }

									htmlFor='galSeaInp'
								>Search cards</label>{ /* What: Search Label Label Element. Why: The search field needs a visible label. How: This labels galSeaInp. */ }

								<input
									id='galSeaInp'

									className={ cssModObj.seaTexInp }

									autoComplete='off'
									placeholder='Try "birthday" or "spooky"'
									type='search'
									value={ seaTexStr }

									onChange={ ( chaEveObj ) => setSeaTexStr( chaEveObj.target.value ) }
								/>{ /* What: Search Text Input Element. Why: A visitor can narrow the cards by typing. How: This filters the grid as they type. */ }


							</div>

							<div
								className={ cssModObj.occFilDiv }

								aria-label='Occasion'
								role='group'
							>{ /* What: Occasion Filter Div Element. Why: A visitor can narrow the cards to one occasion. How: This groups the occasion buttons under one name. */ }


								{ [ 'All' as const, ...OCC_NAM_ARR ].map( ( occNamStr ) => ( // What: Occasion Button Map Call. Why: Every occasion, after All, gets a button. How: This renders one per occasion. // What: Type Assertion Note. Why: A plain 'All' would widen the array to string, losing the occasion type the state needs. How: as const keeps it the literal All.


									<button
										key={ occNamStr }

										className={ cssModObj.occFilBut }

										type='button'

										aria-pressed={ actOccStr === occNamStr }

										onClick={ () => setActOccStr( occNamStr ) }
									>{ occNamStr }</button> // What: Occasion Filter Button Element. Why: Each button chooses its occasion. How: This chooses it, reporting whether it's the chosen one through aria-pressed.


								) ) }


							</div>


						</div>

						<p
							className={ cssModObj.resCouPar }

							role='status'
						>{ `${ shoCarArr.length } ${ shoCarArr.length === 1 ? 'card' : 'cards' }` }</p>{ /* What: Result Count Paragraph Element. Why: A visitor, and a screen reader, should know how many cards match. How: This live region shows the count, announcing each change. */ }



						<h2 className={ cssModObj.galHidHea }>Cards</h2>{ /* What: Gallery Hidden Heading Element. Why: The tiles' titles are h3s, and the page's headings should step down in order from its h1. How: This names the cards section with an h2 that only screen readers and the outline see. */ }



						{ shoCarArr.length > 0 ? ( // What: Results Check. Why: The grid only makes sense with cards to show. How: This renders the grid when any card matches, or the empty message when none does.


							<div className={ cssModObj.galGriDiv }>{ /* What: Gallery Grid Div Element. Why: The cards line up in columns, with a short last row centered. How: This wraps the tiles in centered rows, three, two, or one across. */ }



								{ shoCarArr.map( ( carRecObj ) => ( // What: Card Map Call. Why: Every matching card gets a tile. How: This renders one per card.


									<CarTilCom
										key={ carRecObj.sluStr }

										carRecObj={ carRecObj }

										onShaCarFun={ setShaCarObj }
									/> // What: Card Tile Component. Why: Each card shows as a tile. How: This renders the card's tile, its Share opening the dialog for it.


								) ) }



							</div>


						) : ( // What: Empty Results Branch. Why: A search with no matches needs a way back. How: This renders the empty message instead of the grid.


							<div className={ cssModObj.empResDiv }>{ /* What: Empty Results Div Element. Why: A search with no matches should say so kindly. How: This centers the message and the button. */ }


								<p className={ cssModObj.empResPar }>No cards match that search yet.</p>{ /* What: Empty Results Paragraph Element. Why: The visitor should know why the grid is empty. How: This says nothing matched. */ }

								<button
									className={ cssModObj.butSecBut }

									type='button'

									onClick={ cleFilFun }
								>Show all cards</button>{ /* What: Button Secondary Button Element. Why: The way back is one press. How: This clears the search and the filter. */ }


							</div>


						) }



						<p className={ cssModObj.cusNotPar }>{ /* What: Custom Note Paragraph Element. Why: A visitor who doesn't see their occasion can ask for one. How: This invites a custom card, linking to the Contact page. */ }
							Don't see your occasion? <Link className={ cssModObj.cusNotAnc } to='/contact'>Request a custom card</Link>.
						</p>


					</div>



				</section>



			</div>



			{ shaCarObj && ( // What: Share Dialog Check. Why: The dialog only exists while a card is being shared. How: This mounts it once a tile's Share is pressed.


				<ShaDiaCom
					key={ shaCarObj.sluStr }

					carRecObj={ shaCarObj }

					onCloFun={ () => setShaCarObj( null ) }
				/> // What: Share Dialog Component. Why: The visitor sends the card from here. How: This opens the dialog for the card, keyed by it so each card starts fresh, unmounting it once it closes.


			) }


		</>


	);


}

// #endregion GalPagCom

// #endregion Components



// #region Exports

export { GalPagCom }; // What: Named Exports. Why: The router's gallery route renders the Gallery. How: This exports GalPagCom.

// #endregion Exports


