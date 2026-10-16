


// #region Imports

import cssModObj from './card.module.css';                         // What: CSS Module Object. Why: The card page's floating bar and loading message are styled in its own module. How: This maps each class name in card.module.css to its hashed module class.
import marSvgUrl from 'techgeek-design/assets/brand/favicon.svg'; // What: Mark SVG URL. Why: The floating bar shows the family's hexagon mark, which stands in for the wordmark on a phone. How: This is the design package's mark, fingerprinted by Vite.


import { Link         } from 'react-router';                           // What: Link. Why: The floating bar moves to the home page and the Gallery without a full page load. How: This renders those two links.
import { ShaDiaCom    } from '../../ui/share-dialog.tsx';              // What: Share Dialog Component. Why: Someone viewing a card can send it on. How: The page mounts it when Share is pressed.
import { Suspense     } from 'react';                                  // What: Suspense. Why: A card's code loads the first time its page opens. How: This shows the loading message until it arrives.
import { usePagDesFun } from 'techgeek-design/ui/page-description.ts'; // What: Use Page Description Function. Why: Each card's search description differs from the home page's. How: The page calls it to swap the one description tag's text while it shows.
import { useState     } from 'react';                                  // What: Use State. Why: The page remembers whether its share dialog is open and how many times the card has been replayed. How: This holds both.


import type { CarRecTyp } from '../../ui/cards.ts'; // What: Card Record Type. Why: The page plays one card. How: This types its card prop.
import type { JSX       } from 'react';             // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * card.tsx = Card
 *
 * @summary
 * The page at each card's own address: the card itself, playing full screen,
 * and a small floating bar over it with the TechGeek mark and TechGeek.cards
 * name, the mark alone on a phone (back to the home page), a link to more
 * cards, a Replay button that plays the card again from the start, and a Share
 * button that opens the share dialog for this card. The page sets its own
 * title, description, and canonical address. The card's code arrives on
 * demand, so a short loading message shows until it has.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

type CpcProTyp = { carRecObj : CarRecTyp }; // What: Card-Page-Component Props Type. Why: The page plays the card its address names. How: This types CarPagCom's props.

// #region CarPagCom

/**
 * CarPagCom = Card Page Component
 *
 * @summary
 * Renders one card's page: its title and either its canonical link (a listed
 * card) or a noindex tag (an unlisted one), which React moves into the
 * document head, the card's component inside Suspense with a loading message
 * as the fallback, and the floating bar. The card is keyed by a replay count,
 * so Replay remounts it and every card replays the same way, without reaching
 * into its own code. The canonical address leaves out any ?name= or ?from=,
 * so every personalized copy of a card counts as the card's one page. Share
 * mounts the share dialog, keyed by the card, and the dialog's close callback
 * unmounts it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.carRecObj - Card Record Object: {@link CarRecTyp}
 *
 * @returns The page's head tags, the card, the floating bar, and the share
 *          dialog when it's open.
 *
 * @example
 * ```tsx
 * CarPagCom({ carRecObj }) // => <CarPagCom />
 * ```
 *
*/

function CarPagCom ( { carRecObj } : CpcProTyp ) : JSX.Element {


	const CarComCom = carRecObj.carCom; // What: Card Component Component. Why: JSX only renders a component held in a capitalized name. How: This holds the card's lazy component.



	const [ repCouNum, setRepCouNum ] = useState( 0 );     // What: Replay Count Number And Setter. Why: Replay starts the card over from its first frame. How: Each press counts up, and the card is keyed by the count, so React mounts it fresh.
	const [ shaOpeBoo, setShaOpeBoo ] = useState( false ); // What: Share Open Boolean And Setter. Why: The share dialog shows only after Share is pressed. How: This starts closed.



	usePagDesFun( carRecObj.seaStr ); // What: Page Description Call. Why: Search listings should describe this card, not repeat the home page. How: This swaps the one description tag's text for the card's own search description while it shows.



	const carLoaEle = <p className={ cssModObj.carLoaPar }>Opening your card…</p>; // What: Card Loading Element. Why: The card's code arrives on demand, so the visitor should know it's on its way. How: Suspense shows this muted paragraph, centered on the screen, until the card's component has loaded.



	return (


		<>{ /* What: Card Page Fragment. Why: The page's head tags, the card, the bar, and the dialog render side by side. How: This groups them without adding an element. */ }


			<title>{ `${ carRecObj.titStr } Card | TechGeek.cards` }</title>{ /* What: Page Title Element. Why: A visitor's tab and history should name the card. How: React 19 moves this title into the document head while the card is shown. */ }

			{ carRecObj.lisBoo ? ( // What: Listed Card Check. Why: A listed card belongs in search results, while an unlisted one, made for one person, should stay out of them though its link still works. How: This renders the canonical link for a listed card and a noindex tag for an unlisted one.


				<link
					href={ `https://techgeek.cards/${ carRecObj.sluStr }` }
					rel='canonical'
				/> // What: Canonical Link Element. Why: Search engines should treat every personalized copy of the card as one page. How: React 19 moves this link into the head, naming the card's address without its name.


			) : ( // What: Unlisted Card Branch. Why: An unlisted card keeps itself out of search results. How: This renders the noindex tag instead.


				<meta
					name='robots'

					content='noindex'
				/> // What: Robots Meta Element. Why: An unlisted card isn't meant to be found by searching. How: React 19 moves this tag into the head while the card is shown.


			) }



			<div className={ cssModObj.carStaDiv }>{ /* What: Card Stage Div Element. Why: Every card's lettering has to clear the floating bar. How: This holds the card, handing it the margin that clears the bar. */ }


				<Suspense fallback={ carLoaEle }>{ /* What: Card Suspense. Why: The card's code arrives on demand. How: This shows the loading message until the card's component has loaded. */ }


					<CarComCom key={ repCouNum } />{ /* What: Card Component Component. Why: The card is the page. How: This plays the card full screen, keyed by the replay count so Replay mounts it fresh and it plays again from the start. */ }


				</Suspense>


			</div>



			<nav
				className={ cssModObj.carBarNav }

				aria-label='Card'
			>{ /* What: Card Bar Nav Element. Why: A recipient should be able to find more cards, and a sender to share this one, without the site's full bar covering the card. How: This floats a small dark pill at the bottom of the screen. */ }


				<Link
					className={ cssModObj.barHomAnc }

					to='/'
				>{ /* What: Home Link. Why: The site's mark and name lead back to its home page. How: This routes home, showing the mark beside the wordmark, or the mark alone on a phone, where the wordmark is hidden but still names the link. */ }


					<img
						className={ cssModObj.barMarIma }

						height='32' // What: Intrinsic Height. Why: The bar shouldn't shift while the mark loads. How: This is the mark's drawing height.
						src={ marSvgUrl }
						width='32' // What: Intrinsic Width. Why: The bar shouldn't shift while the mark loads. How: This is the mark's drawing width.

						alt=''
					/>{ /* What: Bar Mark Image Element. Why: The hexagon mark leads the bar like the site's own bar, and it's decoration the wordmark already names. How: This shows the mark with an empty alt. */ }

					<span className={ cssModObj.barWorSpa }>TechGeek<span className={ cssModObj.barEndSpa }>.cards</span></span>{ /* What: Bar Wordmark Span Element. Why: The site's name reads beside the mark and names the link. How: This shows the wordmark with its ending in orange, hidden from view on a phone. */ }


				</Link>



				<Link
					className={ cssModObj.barGalAnc }

					to='/gallery'
				>More cards</Link>{ /* What: More Cards Link. Why: A recipient may want to send a card of their own. How: This routes to the Gallery. */ }



				<button
					className={ cssModObj.barRepBut }

					type='button'

					onClick={ () => setRepCouNum( ( preCouNum ) => preCouNum + 1 ) } // What: Replay Click Handler. Why: The card should start over from its first frame, the same way for every card. How: This counts the replay up, which remounts the card.
				>Replay</button>{ /* What: Bar Replay Button Element. Why: Anyone viewing the card may want to watch it again. How: This plays the card again from the start. */ }

				<button
					className={ cssModObj.barShaBut }

					type='button'

					onClick={ () => setShaOpeBoo( true ) }
				>Share</button>{ /* What: Bar Share Button Element. Why: Anyone viewing the card can send it on. How: This opens the share dialog for this card. */ }


			</nav>



			{ shaOpeBoo && ( // What: Share Dialog Check. Why: The dialog only exists while it's open. How: This mounts it after Share is pressed.


				<ShaDiaCom
					carRecObj={ carRecObj }

					onDiaCloFun={ () => setShaOpeBoo( false ) }
				/> // What: Share Dialog Component. Why: The visitor sends the card from here. How: This opens the dialog for this card, unmounting it once it closes.


			) }


		</>


	);


}

// #endregion CarPagCom

// #endregion Components



// #region Exports

export { CarPagCom }; // What: Named Exports. Why: The app root renders a card's page when the address names a card. How: This exports CarPagCom.

// #endregion Exports


