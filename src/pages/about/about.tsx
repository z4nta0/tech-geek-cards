


// #region Imports

import cssModObj from './about.module.css'; // What: CSS Module Object. Why: About's hero, story, and family sections are styled in its own module. How: This maps each class name in about.module.css to its hashed module class.


import { ConCirCom    } from '../../ui/confetti-circuit.tsx';          // What: Confetti Circuit Component. Why: The hero carries the site's motif. How: The page sets it behind the hero.
import { Link         } from 'react-router';                           // What: Link. Why: The closing buttons move to the Gallery without a full page load. How: This renders that link.
import { usePagDesFun } from 'techgeek-design/ui/page-description.ts'; // What: Use Page Description Function. Why: About's search description differs from the home page's. How: The page calls it to swap the one description tag's text while it shows.


import type { JSX } from 'react'; // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * about.tsx = About
 *
 * @summary
 * The page about who makes the cards and how: a hero, a few paragraphs on
 * how each card is built beside a short list of what that means for whoever
 * receives one, and the TechGeek family of three sister sites, ending with
 * the way to z4nta0's portfolio and back to the Gallery.
 *
 * Sections:
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const FAC_LIS_ARR = [ // What: Fact List Array. Why: The story's side list sums up what a hand-coded card means for its recipient. How: Each row is one short fact.


	'Animation written by hand in code', // What: Hand-Coded Fact Row. Why: No template makes these cards. How: This says so.
	'Opens in any modern browser',       // What: Browser Fact Row. Why: A recipient needs nothing special to open one. How: This says a browser is enough.
	'No app or account needed',          // What: No Account Fact Row. Why: Nobody has to sign up to send or open a card. How: This says so.
	'Free to send'                       // What: Free Fact Row. Why: Sending a card is just sharing its link. How: This says it costs nothing.


];



const FAM_SIT_ARR = [ // What: Family Site Array. Why: The family section introduces the three sister sites in the same order every visit. How: Each row holds a site's name, address, description, and whether it's this site.


	{ herBoo : false, hreStr : 'https://techgeek.dev/',     namStr : 'TechGeek.dev',     desStr : 'The developer side: the websites and web apps I have designed and built, and how to hire me for one.' }, // What: Developer Site Row. Why: The cards come from a working developer. How: This describes and links the portfolio.
	{ herBoo : false, hreStr : 'https://techgeek.support/', namStr : 'TechGeek.support', desStr : 'Tech support: answers and how-to guides for everyday computer and phone questions.' }, // What: Support Site Row. Why: A visitor may need help with a device. How: This describes and links the support site.
	{ herBoo : true,  hreStr : 'https://techgeek.cards/',   namStr : 'TechGeek.cards',   desStr : 'Animated greeting cards to send to the people you care about.' } // What: Cards Site Row. Why: The family list includes this site, marked as the one the visitor is on. How: This describes it without linking away.


];

// #endregion Constants



// #region Components

// #region AboPagCom

/**
 * AboPagCom = About Page Component
 *
 * @summary
 * Renders the About page and its title and canonical link, and swaps in its
 * search description. The story's paragraphs sit beside the fact list. Each
 * sister site is a card linking to that site in the same tab, except this
 * site's own, which says the visitor is here instead of linking to itself.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The page's head tags and its wrapper div.
 *
 * @example
 * ```tsx
 * AboPagCom() // => <AboPagCom />
 * ```
 *
*/

function AboPagCom () : JSX.Element {


	usePagDesFun( 'Meet z4nta0, the developer who codes every TechGeek.cards greeting card by hand, and the sister sites behind it.' ); // What: Page Description Call. Why: Search listings should describe this page, not repeat the home page. How: This swaps the one description tag's text for the page's own while it shows.



	return (


		<>{ /* What: About Fragment. Why: The page's head tags and its content render side by side. How: This groups them without adding an element. */ }


			<title>About the Maker | TechGeek.cards</title>{ /* What: Page Title Element. Why: A visitor's tab and history should name the page. How: React 19 moves this title into the document head while the page is shown. */ }

			<link
				href='https://techgeek.cards/about'
				rel='canonical'
			/>{ /* What: Canonical Link Element. Why: Search engines should treat every address that reaches About as one page. How: React 19 moves this link into the head while the page is shown. */ }



			<div className={ cssModObj.pagEntDiv }>{ /* What: Page Enter Div Element. Why: The page fades up into view as it opens. How: This wraps every section and plays the shared entrance. */ }


				<section className={ cssModObj.aboHerSec }>{ /* What: About Hero Section Element. Why: The page opens on its heading over the site's motif. How: This holds the motif and the hero's text, its bottom edge cut in scallops like a stamp's. */ }


					<ConCirCom patOpaStr='var( --cdn-pow-007-rec )' />{ /* What: Confetti Circuit Component. Why: The hero carries the site's motif behind its content. How: This draws the pattern at about 14% strength. */ }{ /* Core-Design-Number to the Power of 7 Reciprocal ~= 0.140 */ }



					<div className={ cssModObj.herInnDiv }>{ /* What: Hero Inner Div Element. Why: The hero's text sits in the site's centered column. How: This caps, centers, and stacks it. */ }


						<p className={ cssModObj.secEyePar }>About</p>{ /* What: Section Eyebrow Paragraph Element. Why: A small label names the page. How: This shows it in berry mono capitals. */ }

						<h1 className={ cssModObj.herTitHea }>Made by hand, sent with a link</h1>{ /* What: Hero Title Heading Element. Why: The heading sums up what the cards are. How: This shows the page's h1. */ }

						<p className={ cssModObj.herLeaPar }>{ /* What: Hero Lead Paragraph Element. Why: A line says who's behind the cards. How: This introduces z4nta0, in the first person like the rest of the page, and the site. */ }
							TechGeek.cards is the greeting card corner of TechGeek. I'm z4nta0, a full stack web developer, and I build every card from a blank file.
						</p>


					</div>


				</section>



				<section className={ cssModObj.aboStoSec }>{ /* What: About Story Section Element. Why: The page explains how the cards are made. How: This holds the paragraphs and the fact list. */ }


					<div className={ cssModObj.stoInnDiv }>{ /* What: Story Inner Div Element. Why: The paragraphs and the fact list sit side by side on wide screens. How: This lays them out in two columns in the site's centered column, stacking on phones. */ }


						<div className={ cssModObj.stoTexDiv }>{ /* What: Story Text Div Element. Why: The paragraphs read as one column. How: This stacks them. */ }


							<h2 className={ cssModObj.secTitHea }>Every card starts as code</h2>{ /* What: Section Title Heading Element. Why: The heading names the story. How: This shows the section's h2. */ }

							<p className={ cssModObj.stoTexPar }>{ /* What: Story Text Paragraph Element. Why: The first paragraph says how a card is made. How: This describes the hand-coded animation. */ }
								There are no templates or drag-and-drop builders here. Each card's animation is written by hand in code, then tuned until it plays smoothly on a phone as well as a big screen.
							</p>

							<p className={ cssModObj.stoTexPar }>{ /* What: Story Text Paragraph Element. Why: The second paragraph says what the cards are built with and why that helps. How: This names the tools and what they mean for a recipient. */ }
								They're built with the same tools as the websites I make for clients: React, TypeScript, and GSAP for the motion. So a card is simply a web page. It opens in any modern browser, with nothing to install and no account to create.
							</p>

							<p className={ cssModObj.stoTexPar }>{ /* What: Story Text Paragraph Element. Why: The last paragraph says what's next. How: This mentions names on cards, new occasions, and custom cards. */ }
								Some cards can carry a name, so the person opening one sees it was made for them. More occasions are on the way, and if there's one you need now, a custom card is a message away.
							</p>


						</div>

						<ul className={ cssModObj.facLisUno }>{ /* What: Fact List Unordered Element. Why: The story's main points read at a glance. How: This lists them in a white card beside the paragraphs. */ }


							{ FAC_LIS_ARR.map( ( facTexStr ) => ( // What: Fact Map Call. Why: Every fact gets a row. How: This renders one list item per fact.


								<li
									key={ facTexStr }

									className={ cssModObj.facIteIte }
								>{ facTexStr }</li> // What: Fact Item Item Element. Why: Each fact is one line, led by a dot of confetti. How: This shows the fact's text.


							))}


						</ul>


					</div>


				</section>



				<section className={ cssModObj.aboFamSec }>{ /* What: About Family Section Element. Why: TechGeek.cards is one of three sister sites. How: This holds the heading, the three site cards, and the closing buttons. */ }


					<div className={ cssModObj.secInnDiv }>{ /* What: Section Inner Div Element. Why: The section's content sits in the site's centered column. How: This caps and centers it with the side gutter. */ }


						<p className={ cssModObj.secEyePar }>The TechGeek family</p>{ /* What: Section Eyebrow Paragraph Element. Why: A small label names the section. How: This shows it in berry mono capitals. */ }

						<h2 className={ cssModObj.secTitHea }>Three sites, one maker</h2>{ /* What: Section Title Heading Element. Why: The heading introduces the sister sites. How: This shows the section's h2. */ }


						<ul className={ cssModObj.famLisUno }>{ /* What: Family List Unordered Element. Why: The three sites sit side by side as equal cards. How: This lays them out three across, stacking on phones. */ }


							{ FAM_SIT_ARR.map( ( famSitObj ) => ( // What: Family Site Map Call. Why: Every sister site gets a card. How: This renders one list item per site.


								<li
									key={ famSitObj.namStr }

									className={ cssModObj.famIteIte }

									data-site-current-page={ famSitObj.herBoo || undefined } // What: Site Current Page Attribute. Why: This site's own card is marked as the one the visitor is on. How: The module styles the card by this attribute, present only on this site's card.
								>{ /* What: Family Item Item Element. Why: Each site is a card naming it and what it's for. How: This holds the site's name, its description, and its link or a You Are Here label. */ }


									<h3 className={ cssModObj.famNamHea }>{ famSitObj.namStr }</h3>{ /* What: Family Name Heading Element. Why: The site's name heads its card. How: This shows it as an h3. */ }

									<p className={ cssModObj.famDesPar }>{ famSitObj.desStr }</p>{ /* What: Family Description Paragraph Element. Why: A line says what the site is for. How: This shows the site's description. */ }

									{ famSitObj.herBoo ? ( // What: Current Site Check. Why: A link from a site to itself would be pointless. How: This shows a label on this site's card and a link on the others.


										<span className={ cssModObj.famHerSpa }>You are here</span> // What: Family Here Span Element. Why: The visitor should know which of the three they're on. How: This shows a small berry label.


									) : ( // What: Sister Site Branch. Why: The other two sites are a click away. How: This renders the link.


										<a
											className={ cssModObj.famLinAnc }

											href={ famSitObj.hreStr }
										>Visit { famSitObj.namStr } <span className={ cssModObj.famArrSpa } aria-hidden='true'>→</span></a> // What: Family Link Anchor Element. Why: The visitor can go to the sister site. How: This links to it in the same tab, its arrow nudging on hover and hidden from screen readers.


									) }


								</li>


							))}


						</ul>


						<div className={ cssModObj.famActDiv }>{ /* What: Family Actions Div Element. Why: The page ends on two ways onward. How: This sets the buttons in a row that wraps. */ }


							<a
								className={ cssModObj.butSecAnc }

								href='https://techgeek.dev/'
							>See My Portfolio</a>{ /* What: Button Secondary Anchor Element. Why: A visitor curious about the maker can see the rest of z4nta0's work. How: This links to TechGeek.dev as an outlined button. */ }



							<Link
								className={ cssModObj.butPriAnc }

								to='/gallery'
							>Browse the Gallery</Link>{ /* What: Browse The Gallery Link. Why: Browsing cards is the site's main action. How: This routes to the Gallery as an orange button. */ }


						</div>


					</div>


				</section>


			</div>


		</>


	);


}

// #endregion AboPagCom

// #endregion Components



// #region Exports

export { AboPagCom }; // What: Named Exports. Why: The router's about route renders the About page. How: This exports AboPagCom.

// #endregion Exports


