


// #region Imports

import { AboPagCom    } from './pages/about/about.tsx';          // What: About Page Component. Why: The About route says who makes the cards and introduces the sister sites. How: The about route renders it.
import { CAR_REC_ARR  } from './ui/cards.ts';                    // What: Card Record Array. Why: Every card opens at its own address. How: The root looks the current path up in the catalog.
import { CarPagCom    } from './pages/card/card.tsx';            // What: Card Page Component. Why: A card's address plays the card full screen. How: The root renders it when the path names a card.
import { ConPagCom    } from './pages/contact/contact.tsx';      // What: Contact Page Component. Why: The Contact route shows the form and the contact details. How: The contact route renders it.
import { GalPagCom    } from './pages/gallery/gallery.tsx';      // What: Gallery Page Component. Why: The Gallery route lists every card. How: The gallery route renders it.
import { HomPagCom    } from './pages/home/home.tsx';            // What: Home Page Component. Why: The site's root address is its home page. How: The home route renders it.
import { NavBarCom    } from 'techgeek-design/ui/nav.tsx';       // What: Navigation Bar Component. Why: Every site page starts with the TechGeek family's shared bar. How: This renders above the routes.
import { NotFouCom    } from './pages/not-found/not-found.tsx';  // What: Not Found Component. Why: Every unknown address shows the 404 page. How: The catch-all route renders it.
import { PAG_LIN_ARR  } from './ui/page-links.ts';               // What: Page Link Array. Why: The bar and the footer link to the site's pages. How: This is the list the root hands them.
import { Route        } from 'react-router';                     // What: Route. Why: Each page is matched to its path. How: This declares one route per page.
import { Routes       } from 'react-router';                     // What: Routes. Why: Only one page should render for any path. How: This renders the first route whose path matches.
import { SitFooCom    } from 'techgeek-design/ui/footer.tsx';    // What: Site Footer Component. Why: Every site page ends with the TechGeek family's shared footer. How: This renders below the routes.
import { useLocation  } from 'react-router';                     // What: Use Location. Why: The root picks the card frame or the site frame by path, and each page change remounts the page. How: This reads the current location.
import { useScrTopFun } from 'techgeek-design/ui/scroll-top.ts'; // What: Use Scroll Top Function. Why: A new page should open at its top rather than where the last one was scrolled. How: The app root calls it once inside the router.


import type { JSX       } from 'react';                            // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.
import type { PagLinTyp } from 'techgeek-design/ui/link-types.ts'; // What: Page Link Type. Why: The call to action follows the package's page link shape. How: This types it.
import type { SisLinTyp } from 'techgeek-design/ui/link-types.ts'; // What: Sister Link Type. Why: The sister sites follow the package's sister link shape. How: This types them.

// #endregion Imports



/**
 * app.tsx = App
 *
 * @summary
 * The site's root component, mounted by main.tsx inside the router. A card's
 * own address, such as /happy-birthday, renders that card alone, full
 * screen, since a card is an experience for its recipient rather than a page
 * of the site. Every other address renders the site's frame: the bar, the
 * main landmark holding whichever page the address matches, and the footer,
 * the bar and footer coming from the shared techgeek-design package with
 * this site's details. The routes are keyed by the current path, so every
 * change of page mounts the new page fresh and its entrance plays again. A
 * new page is added as another route here, and a new card as a row in the
 * card catalog.
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

const SIT_EMA_STR = 'contact@techgeek.cards';               // What: Site Email String. Why: The phone menu offers the site's contact address. How: The bar links it from the drawer.
const SIT_TAG_STR = 'Hand-coded cards for every occasion.'; // What: Site Tagline String. Why: The phone menu and the footer end on the site's tagline. How: The bar and the footer both show it.
const WOR_END_STR = '.cards';                               // What: Wordmark Ending String. Why: The family's wordmark ends in each site's own domain. How: The bar's wordmark and the footer's copyright both show it after TechGeek.

const CTA_LIN_OBJ : PagLinTyp = { labStr : 'Send a Card', patStr : '/gallery' }; // What: Call-To-Action Link Object. Why: The bar's one button asks a visitor to send a card, the site's main action. How: The bar and the drawer both route it to the Gallery.


const SIS_LIN_ARR : SisLinTyp[] = [ // What: Sister Link Array. Why: TechGeek.cards is one of three sister sites, and a visitor here may want z4nta0's portfolio or tech support. How: The footer links to each row in the same tab.


	{ labStr : 'TechGeek.dev',     urlStr : 'https://techgeek.dev/'     }, // What: Developer Link Row. Why: A visitor may want to see the developer behind the cards. How: This links to TechGeek.dev.
	{ labStr : 'TechGeek.support', urlStr : 'https://techgeek.support/' }  // What: Support Link Row. Why: A visitor may need tech support. How: This links to TechGeek.support.


];

// #endregion Constants



// #region Components

// #region AppRooCom

/**
 * AppRooCom = App Root Component
 *
 * @summary
 * The top of the component tree. It first looks the current path up in the
 * card catalog, ignoring a trailing slash: a card's path renders only that
 * card's page inside the main landmark, with no bar or footer. Any other
 * path renders the bar, the page the address matches inside the main
 * landmark, and the footer, so every site page shares the same frame. The
 * routes take the current location and use its path as their key, so moving
 * to another page replaces the old page's tree rather than updating it,
 * which restarts the new page's entrance animation. It calls useScrTopFun so
 * every link opens its page at the top, as a real page load would, while
 * back and forward keep the browser's restored position.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The card's main landmark on a card's path, or a fragment holding
 *          the bar, the main landmark, and the footer.
 *
 * @example
 * ```tsx
 * AppRooCom() // => <AppRooCom />
 * ```
 *
*/

function AppRooCom () : JSX.Element {


	const curLocObj = useLocation();                                                               // What: Current Location Object. Why: The root picks its frame by path, and the routes remount on each change of page. How: This reads the router's current location.
	const curPatStr = curLocObj.pathname.replace( /\/+$/, '' );                                    // What: Current Path String. Why: /happy-birthday/ should open the same card as /happy-birthday. How: This drops any trailing slashes.
	const curCarObj = CAR_REC_ARR.find( ( carRecObj ) => `/${ carRecObj.sluStr }` === curPatStr ); // What: Current Card Object. Why: A card's address shows the card instead of a site page. How: This finds the card whose path matches, or nothing.



	useScrTopFun(); // What: Scroll Top Call. Why: Every link to another page should open it at its top, and a link with a hash at its section. How: This runs the hook once from the root, which stays mounted across every route.



	if ( curCarObj ) { // What: Card Frame Check. Why: A card plays alone, full screen, for its recipient. How: When the path names a card, this renders only the card's page, with no bar or footer.


		return (


			<main>{ /* What: Card Main Element. Why: The card is the page's main content. How: This holds the card's page as the main landmark. */ }


				<CarPagCom
					key={ curCarObj.sluStr } // What: Card Page Key. Why: Moving from one card straight to another should start the new card fresh. How: Each card's slug is its own key.

					carRecObj={ curCarObj }
				/>{ /* What: Card Page Component. Why: The card's address plays the card. How: This renders the card's page for the matched card. */ }


			</main>


		);


	}



	return (


		<>{ /* What: App Fragment. Why: The bar, the main landmark, and the footer sit directly in the mount element. How: This groups them without a wrapper. */ }


			<NavBarCom
				ctaLinObj={ CTA_LIN_OBJ }
				emaAdrStr={ SIT_EMA_STR }
				pagLinArr={ PAG_LIN_ARR }
				tagLinStr={ SIT_TAG_STR }
				worEndStr={ WOR_END_STR }
			/>{ /* What: Navigation Bar Component. Why: Every site page starts with the family's shared bar. How: This renders it above the page with this site's details, leaving out the availability line, which only TechGeek.dev shows. */ }



			<main>{ /* What: App Main Element. Why: Each page's content is the main landmark. How: This holds whichever page the address matches. */ }


				<Routes
					key={ curLocObj.pathname } // What: Routes Key. Why: A new key makes React mount the new page fresh instead of reusing the old one, so its entrance replays. How: The path changes on every change of page.

					location={ curLocObj }
				>{ /* What: Page Routes. Why: Only one page should render for any path. How: This renders the first route below whose path matches the current location. */ }


					<Route
						element={ <HomPagCom /> }
						path='/'
					/>{ /* What: Home Route. Why: The site's root address is its home page. How: This renders HomPagCom at the root path. */ }



					<Route
						element={ <GalPagCom /> }
						path='/gallery'
					/>{ /* What: Gallery Route. Why: Every card is listed on its own page. How: This renders GalPagCom at /gallery. */ }



					<Route
						element={ <AboPagCom /> }
						path='/about'
					/>{ /* What: About Route. Why: The maker's story has its own page. How: This renders AboPagCom at /about. */ }



					<Route
						element={ <ConPagCom /> }
						path='/contact'
					/>{ /* What: Contact Route. Why: The ways to get in touch have their own page. How: This renders ConPagCom at /contact. */ }



					<Route
						element={ <NotFouCom /> }
						path='*'
					/>{ /* What: Not Found Route. Why: Every unknown address should land somewhere useful. How: This catch-all renders NotFouCom for any path the routes above miss. */ }


				</Routes>


			</main>



			<SitFooCom
				pagLinArr={ PAG_LIN_ARR }
				sisLinArr={ SIS_LIN_ARR }
				tagLinStr={ SIT_TAG_STR }
				worEndStr={ WOR_END_STR }
			/>{ /* What: Site Footer Component. Why: Every site page ends with the family's shared footer. How: This renders it below the page with this site's details. */ }


		</>


	);


}

// #endregion AppRooCom

// #endregion Components



// #region Exports

export { AppRooCom }; // What: Named Exports. Why: main.tsx is the sole consumer, mounting this as the site's root. How: This exports AppRooCom.

// #endregion Exports


