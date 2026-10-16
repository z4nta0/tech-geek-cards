



// #region Imports

import { CAR_DAT_ARR   } from '../../src/ui/card-data.ts'; // What: Card Data Array. Why: Every card gets its own link preview image. How: The script captures one per row, named after the card's address.
import { chromium      } from '@playwright/test';          // What: Chromium. Why: The images are captured in a real browser, in the site's own fonts and tokens. How: This launches Playwright's Chromium.
import { createServer  } from 'vite';                      // What: Create Server. Why: The cards are captured as the site plays them. How: This starts the site's own dev server for the run.
import { fileURLToPath } from 'node:url';                  // What: File URL To Path. Why: The output paths are resolved from this script's own location. How: This turns a file URL into a path.
import { mkdirSync     } from 'node:fs';                   // What: Make Directory Sync. Why: The cards' images go in their own folder, which a fresh checkout may lack. How: This creates it if needed.
import { statSync      } from 'node:fs';                   // What: Stat Sync. Why: Every image has to stay under the size WhatsApp accepts. How: This reads a saved image's size in bytes.

// #endregion Imports



/**
 * render.mts = Social Preview Image Renderer
 *
 * @summary
 * Rebuilds every link preview image, each 1,200x630. The site's own,
 * public/og-image.png, is captured from card.html beside this script: the
 * hexagon mark, the TechGeek.cards wordmark, and "Animated Greeting Cards"
 * between two fanned stacks of card previews, as a PNG since it's flat
 * artwork. Each card's, public/social/<address>.jpg, is captured from the
 * card itself, played by the site's own dev server on port 5196 under
 * reduced motion so it opens on its finished scene, with the floating bar
 * and the Family cards' controls hidden; those are JPEGs, since most are
 * photographs, saved at the highest quality that stays under 300 KB, the
 * most WhatsApp will show. Run it with npm run og-images whenever a card or
 * the site's look changes, and give a changed image a new filename, since
 * apps cache previews.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const CAR_URL_STR = new URL( './card.html', import.meta.url ).href;                            // What: Card URL String. Why: The site's card loads its fonts and styles by paths relative to itself. How: This is card.html's own file URL.
const MAX_BYT_NUM = 300 * 1024;                                                                // What: Maximum Bytes Number. Why: WhatsApp drops a preview image of 300 KB or more. How: This is the limit every image is checked against.
const OUT_PAT_STR = fileURLToPath( new URL( '../../public/og-image.png', import.meta.url ) );  // What: Output Path String. Why: The home page's tags point at the site's card in public/. How: This resolves that path from this script's folder.
const SOC_DIR_STR = fileURLToPath( new URL( '../../public/social/', import.meta.url ) );       // What: Social Directory String. Why: Each card's tags point at its own image in public/social/. How: This resolves that folder from this script's folder.
const HID_CSS_STR = "nav[aria-label='Card'], [data-family-stills-mode] > :has( > [aria-label='Card controls'] ) { display : none !important; } [data-family-stills-mode] { grid-template-rows : minmax( 0, 1fr ) !important; } * { --car-bar-mar : var( --spa-ver-m01 ) !important; }"; // What: Hide CSS String. Why: A preview shows the card alone, without the floating bar or the Family cards' controls, whose room it reclaims. How: This hides both by their accessible names and shrinks the bar's clearing margin, styles only this capture ever sees.

// #endregion Constants



// #region Module Init

const broInsObj = await chromium.launch();                                                 // What: Browser Instance Object. Why: Every image is drawn by a real browser. How: This launches Chromium.
const capPagObj = await broInsObj.newPage( { viewport : { height : 630, width : 1200 } } ); // What: Capture Page Object. Why: Every capture has to be exactly 1,200x630. How: This opens a page at that size.


await capPagObj.goto( CAR_URL_STR ); // What: Site Card Load Call. Why: The site's card has to be on screen before it's captured. How: This opens card.html.

await capPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Text captured before its web font loads would be set in a fallback. How: This waits for every font face.

await capPagObj.screenshot( { path : OUT_PAT_STR, type : 'png' } ); // What: Site Card Capture Call. Why: This writes the site's image. How: This saves the page as a PNG in public/.



if ( statSync( OUT_PAT_STR ).size >= MAX_BYT_NUM ) throw new Error( `og-image.png is at or over the ${ MAX_BYT_NUM } byte limit.` ); // What: Site Size Guard. Why: An image over the limit would quietly drop out of WhatsApp previews. How: This fails the run.



const vitSerObj = await createServer( { server : { port : 5196, strictPort : true } } ); // What: Vite Server Object. Why: The cards are captured as the site plays them, on a port of the script's own. How: This starts the dev server on 5196, failing rather than taking another.


await vitSerObj.listen(); // What: Server Listen Call. Why: The cards load from the server. How: This starts it.

await capPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: A card's preview is its finished scene, which reduced motion opens on at once. How: This makes the page match prefers-reduced-motion: reduce.

mkdirSync( SOC_DIR_STR, { recursive : true } ); // What: Social Folder Creation. Why: The cards' images need their folder. How: This creates it if it's missing.



for ( const carDatObj of CAR_DAT_ARR ) { // What: Card Capture Loop. Why: Every card gets its own preview. How: This captures each in turn.


	const imaPatStr = `${ SOC_DIR_STR }${ carDatObj.sluStr }.jpg`; // What: Image Path String. Why: Each card's tags point at its image by its address. How: This is the card's file in public/social/.


	await capPagObj.goto( `http://localhost:5196/${ carDatObj.sluStr }` ); // What: Card Load Call. Why: The card has to be on screen before it's captured. How: This opens the card's page.

	await capPagObj.waitForLoadState( 'networkidle' ); // What: Network Idle Wait. Why: A card's code and images arrive after its page. How: This waits until nothing more is loading.

	await capPagObj.addStyleTag( { content : HID_CSS_STR } ); // What: Hide Style Call. Why: The preview shows the card alone. How: This adds the capture-only styles.

	await capPagObj.evaluate( () => Promise.all( [ document.fonts.ready, ...Array.from( document.images, ( imaCurEle ) => imaCurEle.decode().catch( () => {} ) ) ] ) ); // What: Fonts And Images Wait. Why: A capture taken before the card's fonts and photos are ready would show fallbacks and gaps. How: This waits for every font and decodes every image, ignoring one that never loads.

	await capPagObj.waitForTimeout( 500 ); // What: Settle Wait. Why: A layout that changed with the capture styles needs a frame or two to repaint. How: This pauses half a second.


	for ( let quaValNum = 90; quaValNum >= 50; quaValNum -= 5 ) { // What: Quality Loop. Why: Each image should look its best while staying under WhatsApp's limit. How: This saves the card from quality 90 down in steps of 5 until it fits.


		await capPagObj.screenshot( { path : imaPatStr, quality : quaValNum, type : 'jpeg' } ); // What: Card Capture Call. Why: This writes the card's image. How: This saves the page as a JPEG at this pass's quality.



		if ( statSync( imaPatStr ).size < MAX_BYT_NUM ) break; // What: Size Fit Exit. Why: The first quality that fits is the best that fits. How: This stops the loop once the image is under the limit.


	}



	if ( statSync( imaPatStr ).size >= MAX_BYT_NUM ) throw new Error( `${ carDatObj.sluStr }.jpg is over the ${ MAX_BYT_NUM } byte limit even at quality 50.` ); // What: Card Size Guard. Why: An image over the limit would quietly drop out of WhatsApp previews. How: This fails the run.



	console.log( `Wrote ${ imaPatStr } (${ statSync( imaPatStr ).size } bytes).` ); // What: Card Result Log Call. Why: The run should say what it wrote. How: This prints the path and size.


}



await vitSerObj.close(); // What: Server Close Call. Why: The script's server shouldn't outlive it. How: This stops the dev server.

await broInsObj.close(); // What: Browser Close Call. Why: The script should exit once every image is saved. How: This shuts Chromium down.

console.log( `Wrote ${ OUT_PAT_STR } (${ statSync( OUT_PAT_STR ).size } bytes).` ); // What: Site Result Log Call. Why: The run should say what it wrote. How: This prints the site image's path and size.

// #endregion Module Init


