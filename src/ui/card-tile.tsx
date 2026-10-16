


// #region Imports

import cssModObj from './card-tile.module.css'; // What: CSS Module Object. Why: The tile's stamp frame, text, and buttons are styled in its own module. How: This maps each class name in card-tile.module.css to its hashed module class.


import { Link } from 'react-router'; // What: Link. Why: A tile opens its card without a full page load. How: This renders the title as a router link.


import type { CarRecTyp } from './cards.ts'; // What: Card Record Type. Why: A tile shows one card record. How: This types the tile's card prop.
import type { JSX       } from 'react';      // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * card-tile.tsx = Card Tile
 *
 * @summary
 * One card as Home and the Gallery show it: a still of the card in a
 * postage-stamp frame, tipped slightly as if dropped on a table, then its
 * occasion, title, and description, a reminder that it opens on a tap, and a
 * Share button. The title is the tile's link, stretched over the whole tile,
 * so the tile opens the card anywhere it's clicked, while Share sits above
 * that link and asks the page to open its share dialog for this card.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

type CtcProTyp = { carRecObj : CarRecTyp, onShaCarFun : ( carRecObj : CarRecTyp ) => void }; // What: Card-Tile-Component Props Type. Why: A tile shows one card and hands Share presses back to its page. How: This types CarTilCom's props.

// #region CarTilCom

/**
 * CarTilCom = Card Tile Component
 *
 * @summary
 * Renders one card's tile as an article: the preview in its stamp frame, the
 * occasion tag (with a Personalize tag beside it for a card that takes a
 * name), the title linking to the card's page, the description, an Open
 * Card cue whose arrow nudges on hover, and the Share button. The title's
 * link covers the whole tile through its ::after, so the tile is one large
 * target without nesting links, and the Share button is lifted above it.
 * The preview is decoration beside the title, so it carries alt text for
 * the card's look but isn't a link of its own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.carRecObj   - Card Record Object: {@link CarRecTyp}
 * @param props.onShaCarFun - On Share Card Function: Called with the card
 *                            when its Share button is pressed, so the page
 *                            can open its share dialog.
 *
 * @returns The tile's article element.
 *
 * @example
 * ```tsx
 * CarTilCom({ carRecObj, onShaCarFun }) // => <CarTilCom />
 * ```
 *
*/

function CarTilCom ( { carRecObj, onShaCarFun } : CtcProTyp ) : JSX.Element {


	return (


		<article
			className={ cssModObj.carTilArt }

			data-card-occasion-name={ carRecObj.occStr } // What: Card Occasion Name Attribute. Why: Each occasion's tag takes its own color. How: The module styles the tag by this attribute's value.
		>{ /* What: Card Tile Article Element. Why: Each card is a self-contained item in its grid. How: This holds the stamp frame and the tile's text, lifting as one on hover. */ }


			<div className={ cssModObj.staWraDiv }>{ /* What: Stamp Wrap Div Element. Why: The stamp casts a shadow that follows its perforated edge, and tips slightly. How: This draws a drop shadow around the frame and tilts it, straightening on hover. */ }


				<div className={ cssModObj.staFraDiv }>{ /* What: Stamp Frame Div Element. Why: Each preview sits in a postage-stamp frame, the site's mail motif. How: This draws a white border cut with perforations around the image. */ }


					<img
						className={ cssModObj.staPreIma }

						height='930' // What: Intrinsic Height. Why: The page shouldn't shift while the preview loads. How: This is the preview file's real height in pixels.
						loading='lazy'
						src={ carRecObj.imaStr }
						width='1653' // What: Intrinsic Width. Why: The page shouldn't shift while the preview loads. How: This is the preview file's real width in pixels.

						alt={ carRecObj.altStr }
					/>{ /* What: Stamp Preview Image Element. Why: A still of the card shows what it looks like. How: This shows the card's preview, loading it once it nears the screen. */ }


				</div>


			</div>


			<div className={ cssModObj.carBodDiv }>{ /* What: Card Body Div Element. Why: The card's details sit under its stamp. How: This stacks the tags, title, description, and actions. */ }


				<div className={ cssModObj.carTagDiv }>{ /* What: Card Tag Div Element. Why: A visitor sees at a glance what the card is for and whether it takes a name. How: This lines up the tags. */ }


					<span className={ cssModObj.occTagSpa }>{ carRecObj.occStr }</span>{ /* What: Occasion Tag Span Element. Why: The card's occasion is its main grouping. How: This shows the occasion in its own color. */ }

					{ carRecObj.cusBoo && ( // What: Personalize Tag Check. Why: Only cards that take a name should say so. How: This shows the tag when the card is customizable.


						<span className={ cssModObj.perTagSpa }>Add a name</span> // What: Personalize Tag Span Element. Why: A visitor should know this card can show the recipient's name. How: This shows a quiet tag beside the occasion.


					) }


				</div>

				<h3 className={ cssModObj.carTitHea }>{ /* What: Card Title Heading Element. Why: The card's name heads its details. How: This holds the link to the card. */ }


					<Link
						className={ cssModObj.carTitAnc }

						to={ `/${ carRecObj.sluStr }` }
					>{ carRecObj.titStr }</Link>{ /* What: Card Title Link. Why: The title opens the card, and the whole tile should too. How: This routes to the card's page, its ::after stretched over the tile. */ }


				</h3>

				<p className={ cssModObj.carDesPar }>{ carRecObj.desStr }</p>{ /* What: Card Description Paragraph Element. Why: A short line says what the card is like. How: This shows the card's description. */ }

				<div className={ cssModObj.carActDiv }>{ /* What: Card Actions Div Element. Why: Opening and sharing sit together at the tile's foot. How: This sets the cue and the Share button in a row. */ }


					<span
						className={ cssModObj.opeCueSpa }

						aria-hidden='true'
					>Open card <span className={ cssModObj.opeArrSpa }>→</span></span>{ /* What: Open Cue Span Element. Why: The tile should say a tap opens the card. How: This shows the cue with an arrow that nudges on hover, hidden from screen readers since the title link already says it. */ }

					<button
						className={ cssModObj.carShaBut }

						type='button'

						aria-label={ `Share ${ carRecObj.titStr }` }

						onClick={ () => onShaCarFun( carRecObj ) }
					>Share</button>{ /* What: Card Share Button Element. Why: A visitor can send the card without opening it first. How: This asks the page to open its share dialog for this card, naming the card for screen readers. */ }


				</div>


			</div>


		</article>


	);


}

// #endregion CarTilCom

// #endregion Components



// #region Exports

export { CarTilCom }; // What: Named Exports. Why: Home and the Gallery both show card tiles. How: This exports CarTilCom.

// #endregion Exports


