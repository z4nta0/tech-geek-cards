


// #region Imports

import { CAR_DAT_ARR } from '../../src/ui/card-data.ts'; // What: Card Data Array. Why: Every card's own page carries its own link preview. How: The preview tests check one page and one image per card.
import { expect      } from '@playwright/test';          // What: Expect. Why: Each check passes only when the page says what it should. How: This asserts on the page's head, its links, and the crawler files.
import { test        } from '@playwright/test';          // What: Test. Why: Each page and each file is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The head helper reads a Playwright page. How: This types its page parameter.

// #endregion Imports



/**
 * head.spec.ts = Head Spec
 *
 * @summary
 * Checks the site's SEO setup in whichever engine the project runs. Home, the
 * Gallery, About, Contact, and every listed card are indexed: each has its own
 * title, a description of 100 to 125 characters, and one canonical address on
 * this domain, while the 404 page and the unlisted cards carry noindex and no
 * canonical link. Every page has exactly one description, index.html's, which
 * every page but Home and the 404 page swaps for its own, names z4nta0 as its
 * author, and, apart from the cards still to be converted, has one h1; moving
 * between pages swaps the tags rather than piling them up. The raw page, read
 * without running the site's script the way link checkers read it, carries the
 * home page's full title and description. The structured data describes this
 * domain as a WebSite whose author is z4nta0, the same Person TechGeek.dev
 * describes, with the GitHub and LinkedIn profiles the footer links to. Every
 * icon the head links to is served, the PNGs at the size their links promise.
 * robots.txt lets every crawler in and names the sitemap, which lists every
 * indexed page. Home's raw page and every card's carry a complete set of link
 * preview tags with absolute addresses, the card's own title, description,
 * address, and image, and every preview image is served at 1,200x630 under
 * 300 KB. Adapted from TechGeek.dev.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const HOM_DES_STR = 'Hand-coded, animated greeting cards for birthdays, holidays, and family days. Pick one and send the link to someone special.'; // What: Home Description String. Why: The raw page carries the home page's description, and every other page must swap it for its own. How: This is the exact text it should hold.
const LIV_URL_STR = 'https://techgeek.cards/'; // What: Live URL String. Why: The canonical links, structured data, robots.txt, and sitemap all name the live site. How: This is its address.



/**
 * SOC_KEY_ARR = Social Key Array
 *
 * @summary
 * Every Open Graph and Twitter tag a complete link preview needs, per the
 * social preview rule; twitter:site and twitter:creator are left out, since
 * the site has no X account. Every row is one tag's property or name.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const SOC_KEY_ARR = [ // What: Social Key Array. Why: A shared link shows a full card only when every tag is there. How: Each entry names one tag.


	'og:description',
	'og:image',
	'og:image:alt',
	'og:image:height',
	'og:image:type',
	'og:image:width',
	'og:locale',
	'og:site_name',
	'og:title',
	'og:type',
	'og:url',
	'twitter:card',
	'twitter:description',
	'twitter:image',
	'twitter:image:alt',
	'twitter:title'


];



// #region PAG_HEA_ARR

/**
 * PAG_HEA_ARR = Page Head Array
 *
 * @summary
 * What each page's head should say. Every row shares one shape, so its fields
 * carry no comments of their own:
 * - `canStr` (String or null): Canonical String, the page's canonical
 *   address, or null for a page that carries noindex and no canonical link.
 * - `heaBoo` (Boolean): Heading Boolean, whether the page's one h1 is checked,
 *   now true on every row.
 * - `patStr` (String): Path String, the address the page is loaded from.
 * - `titStr` (String): Title String, the page's exact title.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const PAG_HEA_ARR = [ // What: Page Head Array. Why: Every page's head is checked against what it should say. How: Each row names one page, its title, its canonical address or null, and whether its h1 is checked.


	{ canStr : LIV_URL_STR,                          heaBoo : true,  patStr : '/',                      titStr : 'Animated Digital Greeting Cards to Send | TechGeek.cards' },
	{ canStr : `${ LIV_URL_STR }gallery`,            heaBoo : true,  patStr : '/gallery',               titStr : 'Greeting Card Gallery | TechGeek.cards'                   },
	{ canStr : `${ LIV_URL_STR }about`,              heaBoo : true,  patStr : '/about',                 titStr : 'About the Maker | TechGeek.cards'                         },
	{ canStr : `${ LIV_URL_STR }contact`,            heaBoo : true,  patStr : '/contact',               titStr : 'Contact | TechGeek.cards'                                 },
	{ canStr : null,                                 heaBoo : true,  patStr : '/no-such-page',          titStr : 'Page Not Found | TechGeek.cards'                          },
	{ canStr : `${ LIV_URL_STR }happy-birthday`,     heaBoo : true,  patStr : '/happy-birthday',        titStr : 'Happy Birthday Card | TechGeek.cards'                     },
	{ canStr : `${ LIV_URL_STR }mothers-day`,        heaBoo : true,  patStr : '/mothers-day',           titStr : "Mother's Day Card | TechGeek.cards"                       },
	{ canStr : `${ LIV_URL_STR }fathers-day`,        heaBoo : true,  patStr : '/fathers-day',           titStr : "Father's Day Card | TechGeek.cards"                       },
	{ canStr : `${ LIV_URL_STR }fourth-of-july`,     heaBoo : true,  patStr : '/fourth-of-july',        titStr : 'Fourth of July Card | TechGeek.cards'                     },
	{ canStr : `${ LIV_URL_STR }happy-halloween`,    heaBoo : true,  patStr : '/happy-halloween',       titStr : 'Happy Halloween Card | TechGeek.cards'                    },
	{ canStr : `${ LIV_URL_STR }happy-thanksgiving`, heaBoo : true,  patStr : '/happy-thanksgiving',    titStr : 'Happy Thanksgiving Card | TechGeek.cards'                 },
	{ canStr : `${ LIV_URL_STR }merry-christmas`,    heaBoo : true,  patStr : '/merry-christmas',       titStr : 'Merry Christmas Card | TechGeek.cards'                    },
	{ canStr : null,                                 heaBoo : true,  patStr : '/fathers-day-prank',     titStr : "Father's Day Special Card | TechGeek.cards"               },
	{ canStr : null,                                 heaBoo : true,  patStr : '/merry-christmas-prank', titStr : 'Christmas Prank Card | TechGeek.cards'                    }


];

// #endregion PAG_HEA_ARR

// #endregion Constants



// #region Helpers

// #region heaCheFun

/**
 * heaCheFun = Head Check Function
 *
 * @summary
 * Checks that the page showing now has the head its row describes: its exact
 * title, exactly one description, z4nta0 as author, and, unless it's a card,
 * one h1. A page with a canonical address has that one canonical link, a
 * description of 100 to 125 characters, and no robots tag; a page without one
 * has a noindex robots tag and no canonical link. Counting the tags also
 * catches a navigation that left the previous page's tags behind.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to check.
 * @param heaRowObj - Head Row Object: The page's row from PAG_HEA_ARR.
 *
 * @returns A promise that settles once every check has passed, with no
 *          value.
 *
 * @example
 * ```ts
 * heaCheFun(page, PAG_HEA_ARR[0]) // => Promise<void>
 * ```
 *
*/

async function heaCheFun ( curPagObj : Page, heaRowObj : typeof PAG_HEA_ARR[ number ] ) : Promise< void > {


	await expect( curPagObj ).toHaveTitle( heaRowObj.titStr ); // What: Title Assertion. Why: Search listings and tabs name the page by its title. How: This waits for the page's own title.

	expect( heaRowObj.titStr.length ).toBeLessThanOrEqual( 60 ); // What: Title Length Assertion. Why: Search listings and link cards cut long titles off. How: This keeps it to 60 characters.

	await expect( curPagObj.locator( 'meta[name="author"]' ) ).toHaveAttribute( 'content', 'z4nta0' ); // What: Author Assertion. Why: The site names z4nta0, who built and owns it, as its author. How: This checks the author tag.

	await expect( curPagObj.locator( 'meta[name="description"]' ) ).toHaveCount( 1 ); // What: Single Description Assertion. Why: Two descriptions leave search engines to guess. How: This checks there's exactly one, index.html's, on every page.

	if ( heaRowObj.heaBoo ) await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveCount( 1 ); // What: Single Heading Assertion. Why: One h1 tells search engines and screen readers what the page is about. How: This checks there's exactly one on every page the row marks, now every page and every card.



	if ( heaRowObj.canStr === null ) { // What: Noindex Page Branch. Why: The 404 page and the unlisted cards must stay out of search results. How: This checks for the noindex tag and the absence of the indexed pages' tags.


		await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveAttribute( 'content', 'noindex' ); // What: Noindex Assertion. Why: Search engines must leave the page out. How: This checks the one robots tag says noindex.

		await expect( curPagObj.locator( 'link[rel="canonical"]' ) ).toHaveCount( 0 ); // What: No Canonical Assertion. Why: A page kept out of search has no use for a canonical address, and one left over from the previous page would contradict it. How: This checks there's none.


	}

	else { // What: Indexed Page Branch. Why: The site's pages and its listed cards have to be findable and described. How: This checks their one description and canonical link, and that nothing keeps them out.


		const desConStr = await curPagObj.locator( 'meta[name="description"]' ).getAttribute( 'content' ) ?? ''; // What: Description Content String. Why: The description's length is checked against what listings show. How: This reads the one description's text.


		expect( desConStr.length ).toBeGreaterThanOrEqual( 100 ); // What: Description Minimum Assertion. Why: A summary that's too short wastes the space a listing gives it. How: This checks it runs at least 100 characters.

		expect( desConStr.length ).toBeLessThanOrEqual( 125 ); // What: Description Maximum Assertion. Why: Phones cut a summary off around 125 characters. How: This checks it stays within that.

		await expect( curPagObj.locator( 'link[rel="canonical"]' ) ).toHaveCount( 1 ); // What: Single Canonical Assertion. Why: Two canonical links leave search engines to guess. How: This checks there's exactly one.

		await expect( curPagObj.locator( 'link[rel="canonical"]' ) ).toHaveAttribute( 'href', heaRowObj.canStr ); // What: Canonical Assertion. Why: Every address Netlify serves the page at should count as its live one. How: This checks the canonical link names it.

		await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveCount( 0 ); // What: Indexable Assertion. Why: The page has to stay findable. How: This checks it carries no robots tag that could keep it out.


	}


}

// #endregion heaCheFun



const socTagFun = ( htmTexStr : string ) : Record< string, string > => Object.fromEntries( [ ...htmTexStr.matchAll( /<meta\s+(?:name|property)=(['"])([^'"]+)\1\s+content=(['"])(.*?)\3/g ) ].map( ( tagMatArr ) => [ tagMatArr[ 2 ], tagMatArr[ 4 ].replace( /&quot;/g, '"' ).replace( /&#39;/g, "'" ).replace( /&amp;/g, '&' ) ] ) ); // What: Social Tag Function. Why: The raw page's tags are read without a browser, the way a link scraper reads them. How: This maps each meta tag's name or property to its decoded content.



// #region imaSizFun

/**
 * imaSizFun = Image Size Function
 *
 * @summary
 * Reads an image's width and height from its own bytes, the way an app sizes
 * a preview before drawing it. A PNG keeps them at a fixed place in its
 * header; a JPEG keeps them in its first start-of-frame segment, found by
 * walking its segments from the start.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param imaBufObj - Image Buffer Object: The image's bytes.
 *
 * @returns The image's width and height in pixels, or zeros when no size is
 *          found.
 *
 * @example
 * ```ts
 * imaSizFun(imaBufObj) // => [ 1200, 630 ]
 * ```
 *
*/

function imaSizFun ( imaBufObj : Buffer ) : [ number, number ] {


	if ( imaBufObj.readUInt32BE( 0 ) === 0x89504E47 ) return [ imaBufObj.readUInt32BE( 16 ), imaBufObj.readUInt32BE( 20 ) ]; // What: PNG Size Return. Why: A PNG's width and height sit at bytes 16 and 20 of its header. How: This reads them when the PNG signature leads the file.



	let offPosNum = 2; // What: Offset Position Number. Why: A JPEG's segments follow its two-byte start marker. How: This starts the walk just past it.



	while ( offPosNum < imaBufObj.length ) { // What: Segment Walk Loop. Why: The size sits in the first start-of-frame segment, wherever it falls. How: This steps from segment to segment by their lengths.


		const marCodNum = imaBufObj[ offPosNum + 1 ]; // What: Marker Code Number. Why: The segment's kind decides whether it holds the size. How: This reads the byte after the segment's 0xFF.



		if ( marCodNum >= 0xC0 && marCodNum <= 0xC3 ) return [ imaBufObj.readUInt16BE( offPosNum + 7 ), imaBufObj.readUInt16BE( offPosNum + 5 ) ]; // What: Frame Size Return. Why: A start-of-frame segment holds the height then the width. How: This reads both and returns them width first.



		offPosNum += 2 + imaBufObj.readUInt16BE( offPosNum + 2 ); // What: Next Segment Step. Why: Every other segment is skipped. How: This moves past its marker and its stated length.


	}



	return [ 0, 0 ]; // What: No Size Return. Why: An image without a readable size should fail the check, not the test run. How: This returns zeros.


}

// #endregion imaSizFun

// #endregion Helpers



// #region Module Init

for ( const heaRowObj of PAG_HEA_ARR ) { // What: Page Head Loop. Why: Every page's head is checked when it's loaded directly, as a search engine loads it. How: This declares one test per page.


	test( `${ heaRowObj.patStr } has the right head`, async ( { page : curPagObj } ) => { // What: Page Head Test. Why: Each page should say what it is and whether it belongs in search results. How: This loads the page and checks its head.


		await curPagObj.goto( heaRowObj.patStr ); // What: Page Open Call. Why: The check starts on its page. How: This loads it.

		await heaCheFun( curPagObj, heaRowObj ); // What: Head Check Call. Why: The page's head is checked against its row. How: This runs every head check.


	} );


}



test( 'moving between pages swaps their head tags', async ( { page : curPagObj } ) => { // What: Navigation Head Test. Why: React adds and removes each page's tags as visitors move around, and a leftover description or canonical link would mislabel the next page. How: This walks from Home through the Gallery and About to Contact by the footer's links, checking each head.


	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The walk starts on the home page. How: This loads the root path.

	await curPagObj.waitForLoadState( 'networkidle' ); // What: Home Settled Wait. Why: A footer click landing while Home is still loading its cards and images can miss as the page shifts under it. How: This waits until nothing more is loading.

	await heaCheFun( curPagObj, PAG_HEA_ARR[ 0 ] ); // What: Home Head Check. Why: The walk starts from a known head. How: This checks Home's.


	for ( const heaRowObj of PAG_HEA_ARR.slice( 1, 4 ) ) { // What: Footer Walk Loop. Why: Each page should take over the head from the one before. How: This follows the footer's link to the Gallery, About, and Contact in turn.


		const linNamStr = heaRowObj.patStr.slice( 1, 2 ).toUpperCase() + heaRowObj.patStr.slice( 2 ); // What: Link Name String. Why: The footer names each page the way its path reads, capitalized. How: This capitalizes the path's first letter and drops its slash.


		await curPagObj.getByRole( 'navigation', { name : 'Footer navigation' } ).getByRole( 'link', { exact : true, name : linNamStr } ).click(); // What: Footer Link Click. Why: Visitors move between pages without reloading. How: This clicks the footer link named after the page's path.

		await expect( curPagObj ).toHaveURL( heaRowObj.patStr ); // What: Destination Assertion. Why: The head is only checked once the new page shows. How: This waits for the address to change.

		await heaCheFun( curPagObj, heaRowObj ); // What: Page Head Check. Why: The previous page's tags must be gone and this page's in place. How: This checks its head.

		await expect( curPagObj.locator( 'meta[name="description"]' ) ).not.toHaveAttribute( 'content', HOM_DES_STR ); // What: Own Description Assertion. Why: Each page should describe itself, not repeat the home page. How: This checks the description changed.


	}


} );



test( 'the structured data describes z4nta0 and matches the pages', async ( { page : curPagObj } ) => { // What: Structured Data Test. Why: Search engines may show z4nta0's details from the JSON-LD, so every claim has to match what the pages show. How: This reads the data and checks the person, the site, and the profiles against the pages.


	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The profiles in the data have to be the ones the footer links to. How: This loads the home page.


	const ldjTexStr = await curPagObj.locator( 'script[type="application/ld+json"]' ).textContent() ?? '{}'; // What: Linked-Data-JSON Text String. Why: The data is checked as the page serves it. How: This reads the script's text.
	const socHreArr = await curPagObj.getByRole( 'contentinfo' ).locator( 'a[href^="https://"][target="_blank"]' ).evaluateAll( ( ancEleArr ) => ancEleArr.map( ( ancCurEle ) => ancCurEle.getAttribute( 'href' ) ?? '' ) ); // What: Social Href Array. Why: The data's profiles have to be the footer's. How: This reads every outside link the footer opens in a new tab, which are its profiles, leaving out the sister sites, which open in the same tab.


	type LdjNodTyp = { '@id'? : string, '@type'? : string, author? : { '@id' : string }, name? : string, sameAs? : string[], url? : string }; // What: Linked-Data-JSON Node Type. Why: The checks read a handful of each node's fields. How: This types the fields they use.

	const ldjGraArr : LdjNodTyp[] = JSON.parse( ldjTexStr )[ '@graph' ] ?? []; // What: Linked-Data-JSON Graph Array. Why: The person and the site are separate nodes, each checked on its own. How: This parses the text and reads its graph.

	const perNodObj = ldjGraArr.find( ( graNodObj ) => graNodObj[ '@type' ] === 'Person' ) ?? {};  // What: Person Node Object. Why: z4nta0's details are checked together. How: This finds the person node, or an empty object.
	const webNodObj = ldjGraArr.find( ( graNodObj ) => graNodObj[ '@type' ] === 'WebSite' ) ?? {}; // What: WebSite Node Object. Why: This site's details are checked together. How: This finds its node, or an empty object.


	expect( [ perNodObj[ '@id' ], perNodObj.name, perNodObj.url, webNodObj.name, webNodObj.url ] ).toEqual( [ 'https://techgeek.dev/#person', 'z4nta0', 'https://techgeek.dev/', 'TechGeek.cards', LIV_URL_STR ] ); // What: Person And Site Assertion. Why: The site is z4nta0's, never a business's, and z4nta0 is the same person TechGeek.dev describes. How: This checks the person's id, name, and address match TechGeek.dev's, and the site's name and address are this one's.

	expect( webNodObj.author?.[ '@id' ] ).toBe( perNodObj[ '@id' ] ); // What: Author Link Assertion. Why: Search engines join the nodes by their ids. How: This checks the site names z4nta0 as its author.

	expect( [ ...( perNodObj.sameAs ?? [] ) ].sort() ).toEqual( [ ...socHreArr ].sort() ); // What: Profiles Assertion. Why: Every profile in the data has to be one the site links to. How: This compares the data's profiles with the footer's outside links.


} );



test( 'the raw page carries the home title and description for script-free readers', async ( { request : reqConObj } ) => { // What: Raw Head Test. Why: Link checkers and many crawlers read the page without running the site's script, so the title and description have to be in index.html itself. How: This fetches the root as raw HTML and checks both.


	const rawHtmStr = await ( await reqConObj.get( '/' ) ).text();                                        // What: Raw HTML String. Why: The page is read the way a script-free reader reads it. How: This fetches the root's HTML without a browser.
	const titTexStr = rawHtmStr.match( /<title>([^<]*)<\/title>/ )?.[ 1 ].replace( /&amp;/g, '&' ) ?? ''; // What: Title Text String. Why: The raw title is checked as written. How: This reads the title element's text and decodes its ampersand.


	expect( titTexStr ).toBe( PAG_HEA_ARR[ 0 ].titStr ); // What: Raw Title Assertion. Why: The raw page should name the home page in full, not the bare site name. How: This checks it matches the home page's title.

	expect( titTexStr.length ).toBeGreaterThanOrEqual( 50 ); // What: Raw Title Length Assertion. Why: Checkers flag a title that leaves most of a listing's room unused. How: This checks it runs at least 50 characters.

	expect( rawHtmStr ).toContain( `<meta name='description' content='${ HOM_DES_STR }' />` ); // What: Raw Description Assertion. Why: Checkers and crawlers without the script need a description to show. How: This checks the raw page carries the home page's.


} );



for ( const carDatObj of [ null, ...CAR_DAT_ARR ] ) { // What: Raw Preview Loop. Why: Home and every card each need a complete preview in their raw page. How: This declares one test per page, null standing for Home.


	const patStr = carDatObj ? `/${ carDatObj.sluStr }` : '/'; // What: Path String. Why: Each test loads its own page. How: This is the card's address, or the root.


	test( `${ patStr } raw page carries its link preview`, async ( { request : reqConObj } ) => { // What: Raw Preview Test. Why: Link scrapers never run the site's script, so the raw page alone decides the card a shared link shows. How: This fetches the page without a browser and checks every preview tag.


		const socTagObj = socTagFun( await ( await reqConObj.get( `${ patStr }?name=Sam` ) ).text() );                           // What: Social Tag Object. Why: A shared card's link may carry a name, which mustn't change its preview. How: This reads the tags of the page, fetched with a name.
		const expUrlStr = carDatObj ? `${ LIV_URL_STR }${ carDatObj.sluStr }` : LIV_URL_STR;                                     // What: Expected URL String. Why: The preview has to point at the page's own address. How: This is the card's absolute address, or the root.
		const expImaStr = carDatObj ? `${ LIV_URL_STR }social/${ carDatObj.sluStr }.jpg` : `${ LIV_URL_STR }og-image.png`;       // What: Expected Image String. Why: Each page shows its own image. How: This is the card's JPEG, or the site's card.
		const expTitStr = carDatObj ? `${ carDatObj.titStr } Card | TechGeek.cards` : PAG_HEA_ARR[ 0 ].titStr;                   // What: Expected Title String. Why: The preview's title matches the page's own. How: This is the card's title, or Home's.
		const expDesStr = carDatObj ? carDatObj.seaStr : HOM_DES_STR;                                                            // What: Expected Description String. Why: The preview's summary matches the page's description. How: This is the card's search description, or Home's.


		expect( SOC_KEY_ARR.filter( ( socKeyStr ) => !socTagObj[ socKeyStr ] ) ).toEqual( [] ); // What: Complete Tags Assertion. Why: An app shows a bare link when a tag it needs is missing. How: This lists any required tag the page lacks.

		expect( [ socTagObj[ 'og:url' ], socTagObj[ 'og:image' ], socTagObj[ 'twitter:image' ] ] ).toEqual( [ expUrlStr, expImaStr, expImaStr ] ); // What: Address Assertion. Why: Scrapers need absolute addresses for the page and its image. How: This checks each against the page's own.

		expect( [ socTagObj[ 'og:title' ], socTagObj[ 'twitter:title' ], socTagObj[ 'description' ], socTagObj[ 'og:description' ], socTagObj[ 'twitter:description' ] ] ).toEqual( [ expTitStr, expTitStr, expDesStr, expDesStr, expDesStr ] ); // What: Text Assertion. Why: The preview names and describes the page as the page itself does. How: This checks the titles and descriptions.

		expect( [ socTagObj[ 'og:image:type' ], socTagObj[ 'og:image:width' ], socTagObj[ 'og:image:height' ], socTagObj[ 'twitter:card' ] ] ).toEqual( [ carDatObj ? 'image/jpeg' : 'image/png', '1200', '630', 'summary_large_image' ] ); // What: Image Details Assertion. Why: Apps lay out a large preview from the image's stated type and size. How: This checks them and the card type.


	} );


}



test( 'every link preview image is 1,200x630 and under 300 KB', async ( { request : reqConObj } ) => { // What: Preview Images Test. Why: The tags promise each image's size, and WhatsApp drops one of 300 KB or more. How: This fetches every preview image and reads its bytes.


	for ( const imaPatStr of [ '/og-image.png', ...CAR_DAT_ARR.map( ( carDatObj ) => `/social/${ carDatObj.sluStr }.jpg` ) ] ) { // What: Image Check Loop. Why: Every page's image has to be real. How: This checks the site's card, then each card's.


		const imaResObj = await reqConObj.get( imaPatStr ); // What: Image Response Object. Why: The image has to exist where the tags point. How: This fetches it.
		const imaBufObj = await imaResObj.body();           // What: Image Buffer Object. Why: The image's size is read from its bytes. How: This reads them.


		expect( [ imaPatStr, imaResObj.headers()[ 'content-type' ] ] ).toEqual( [ imaPatStr, imaPatStr.endsWith( '.png' ) ? 'image/png' : 'image/jpeg' ] ); // What: Image Type Assertion. Why: A missing image falls through to the app's HTML. How: This checks the file is served as its type, naming it on failure.

		expect( [ imaPatStr, ...imaSizFun( imaBufObj ) ] ).toEqual( [ imaPatStr, 1200, 630 ] ); // What: Image Size Assertion. Why: The tags promise 1,200x630. How: This reads the image's real size, naming it on failure.

		expect( imaBufObj.length ).toBeLessThan( 300 * 1024 ); // What: Image Bytes Assertion. Why: WhatsApp drops a preview image of 300 KB or more. How: This checks the file is under the limit.


	}


} );



test( 'robots.txt welcomes crawlers and names the sitemap', async ( { request : reqConObj } ) => { // What: Robots File Test. Why: Crawlers read robots.txt before anything else. How: This fetches it and checks its rules and sitemap line.


	const robTexStr = await ( await reqConObj.get( '/robots.txt' ) ).text(); // What: Robots Text String. Why: The file's rules are checked as served. How: This fetches and reads it.


	expect( robTexStr ).toContain( 'User-agent: *\nAllow: /' ); // What: Allow All Assertion. Why: Every crawler may read the site, since the unwanted pages keep themselves out with noindex. How: This checks the one rule group.

	expect( robTexStr ).toContain( `Sitemap: ${ LIV_URL_STR }sitemap.xml` ); // What: Sitemap Line Assertion. Why: Crawlers find the sitemap from this line. How: This checks it names the live sitemap.


} );



test( 'the sitemap lists every indexed page', async ( { request : reqConObj } ) => { // What: Sitemap Test. Why: The sitemap should list exactly the indexed pages, by their canonical addresses. How: This fetches it and compares its addresses with the indexed rows.


	const sitXmlStr = await ( await reqConObj.get( '/sitemap.xml' ) ).text(); // What: Sitemap XML String. Why: The file's addresses are checked as served. How: This fetches and reads it.


	expect( [ ...sitXmlStr.matchAll( /<loc>([^<]+)<\/loc>/g ) ].map( ( locMatArr ) => locMatArr[ 1 ] ) ).toEqual( PAG_HEA_ARR.filter( ( heaRowObj ) => heaRowObj.canStr !== null ).map( ( heaRowObj ) => heaRowObj.canStr ) ); // What: Indexed Pages Assertion. Why: Listing a noindex page would contradict it, and missing an indexed page slows its discovery. How: This checks the sitemap's addresses equal the indexed pages' canonical addresses, in order.


} );



test( 'every icon the head links to is served at its size', async ( { page : curPagObj, request : reqConObj } ) => { // What: Icons Test. Why: Browsers and apps fetch the icons the head names, and a missing or wrong-sized one shows a blank or blurry mark. How: This reads every icon link and checks each file exists and, for PNGs, has the size its link promises.


	await curPagObj.goto( '/' ); // What: Home Load Call. Why: The icon links live in the page's head. How: This opens the home page.


	const icoLinArr = await curPagObj.locator( 'link[rel="icon"], link[rel="apple-touch-icon"]' ).evaluateAll( ( linEleArr ) => linEleArr.map( ( linCurEle ) => [ linCurEle.getAttribute( 'href' ) || '', linCurEle.getAttribute( 'sizes' ) || '' ] ) ); // What: Icon Link Array. Why: Each icon is checked against its own link. How: This reads every icon link's address and size.


	expect( icoLinArr.length ).toBe( 7 ); // What: Icon Count Assertion. Why: The set is the SVG, the ICO, four PNG sizes, and the Apple touch icon. How: This checks all seven are linked.


	for ( const [ icoHreStr, icoSizStr ] of icoLinArr ) { // What: Icon Check Loop. Why: Every linked icon has to be real. How: This fetches each one in turn.


		const icoResObj = await reqConObj.get( icoHreStr ); // What: Icon Response Object. Why: The icon has to exist where its link points. How: This fetches it.
		const icoBufObj = await icoResObj.body();           // What: Icon Buffer Object. Why: A PNG's size is written in its header. How: This reads the bytes.


		expect( icoResObj.ok() ).toBe( true ); // What: Icon Served Assertion. Why: A missing icon falls through to the app's HTML. How: This checks the file is served.



		if ( icoHreStr.endsWith( '.svg' ) ) { // What: SVG Icon Guard. Why: The SVG mark has no fixed size to check. How: This checks it's served as an SVG and moves on.


			expect( icoResObj.headers()[ 'content-type' ] ).toContain( 'image/svg+xml' ); // What: SVG Type Assertion. Why: Browsers only draw an SVG favicon served as one. How: This checks the served type.



			continue; // What: SVG Skip. Why: The size checks below don't apply to it. How: This moves on to the next icon.


		}



		if ( icoSizStr === 'any' ) { // What: ICO Header Guard. Why: favicon.ico isn't a PNG and has no single size. How: This checks its header marks it an icon file and moves on.


			expect( icoBufObj.readUInt16LE( 2 ) ).toBe( 1 ); // What: ICO Type Assertion. Why: The file has to be a real icon file. How: This checks its header's type field reads 1.



			continue; // What: ICO Skip. Why: The PNG size check below doesn't apply to it. How: This moves on to the next icon.


		}



		expect( `${ icoBufObj.readUInt32BE( 16 ) }x${ icoBufObj.readUInt32BE( 20 ) }` ).toBe( icoSizStr ); // What: PNG Icon Size Assertion. Why: Each PNG should be the size its link promises. How: This reads the width and height from its header.


	}


} );

// #endregion Module Init


