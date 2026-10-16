



// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the right font files load. How: This asserts on the files the page requested.
import { test   } from '@playwright/test'; // What: Test. Why: Each card and name is its own test. How: This declares them.

// #endregion Imports



/**
 * names.spec.ts = Names Spec
 *
 * @summary
 * Checks that the cards that show a name load a font's extended Latin file
 * only when a name needs it, in whichever engine the project runs. Each name
 * font declares its Latin and extended Latin files with the characters each
 * covers, so a name in basic Latin, accents like Zoë included, never fetches
 * the extended file, while a name with a letter such as Ł does. Each row
 * opens a card with a name and records every font file the page asks for.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

/**
 * NAM_ROW_ARR = Name Row Array
 *
 * @summary
 * The names each card is opened with. Every row shares one shape:
 * - `extBoo` (Boolean): Extended Boolean, whether the name needs the
 *   extended Latin file.
 * - `filStr` (String): File String, the start of the extended file's name.
 * - `patStr` (String): Path String, the card's address with its name.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const NAM_ROW_ARR = [ // What: Name Row Array. Why: Each name card is checked with a plain name and one that needs more letters. How: Each row names a card's address with its name, whether that name needs the extended file, and the file's name.


	{ extBoo : false, filStr : 'luckiest-guy-latin-ext',      patStr : '/happy-birthday?name=Zo%C3%AB'                     },
	{ extBoo : true,  filStr : 'luckiest-guy-latin-ext',      patStr : '/happy-birthday?name=%C5%81ukasz'                  },
	{ extBoo : false, filStr : 'gloria-hallelujah-latin-ext', patStr : '/merry-christmas?name=Zo%C3%AB&from=Sam'           },
	{ extBoo : true,  filStr : 'gloria-hallelujah-latin-ext', patStr : '/merry-christmas?name=Zo%C3%AB&from=%C5%81ukasz'   }


];

// #endregion Constants



// #region Module Init

for ( const namRowObj of NAM_ROW_ARR ) { // What: Name Test Loop. Why: Every row is its own check. How: This declares one test per row.


	test( `${ namRowObj.patStr } ${ namRowObj.extBoo ? 'loads' : 'skips' } the extended Latin font`, async ( { page : curPagObj } ) => { // What: Extended Font Test. Why: Visitors should download extra letters only when a name uses them. How: This opens the card with its name and checks whether the extended file was requested.


		const fonUrlArr : string[] = []; // What: Font URL Array. Why: The test needs every font file the page asks for. How: This collects their addresses as they're requested.


		curPagObj.on( 'request', ( reqCurObj ) => { if ( reqCurObj.url().endsWith( '.woff2' ) ) fonUrlArr.push( reqCurObj.url() ); } ); // What: Font Request Listener. Why: A font is fetched only when the page needs one of its characters. How: This records each WOFF2 the page requests.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The name has to be on screen, which reduced motion shows at once. How: This makes the page match prefers-reduced-motion: reduce.

		await curPagObj.goto( namRowObj.patStr ); // What: Card Load Call. Why: The card shows the name from its link. How: This opens the card's address with its name.

		await curPagObj.getByRole( 'heading', { level : 1 } ).waitFor(); // What: Card Heading Wait. Why: Each card loads on demand, so its name isn't on the page until its code arrives. How: This waits for the card's heading.

		await curPagObj.waitForLoadState( 'networkidle' ); // What: Network Idle Wait. Why: A font is requested only once the text that needs it is laid out. How: This waits until nothing more is loading.

		await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Every font the name needs has to have been asked for. How: This waits until the page's fonts have loaded.


		expect( fonUrlArr.some( ( fonUrlStr ) => fonUrlStr.includes( namRowObj.filStr ) ) ).toBe( namRowObj.extBoo ); // What: Extended Font Assertion. Why: The extended file should load exactly when the name needs it. How: This checks whether it was requested against the row's expectation.


	} );


}

// #endregion Module Init


