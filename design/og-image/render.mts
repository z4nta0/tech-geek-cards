


// #region Imports

import { CAR_DAT_ARR   } from '../../src/ui/card-data.ts'; // What: Card Data Array. Why: Every card gets its own link preview image. How: The script captures one per row, named after the card's address.
import { chromium      } from '@playwright/test';          // What: Chromium. Why: The images are captured in a real browser, in the site's own fonts and tokens. How: This launches Playwright's Chromium.
import { createServer  } from 'vite';                      // What: Create Server. Why: The cards are captured as the site plays them. How: This starts the site's own dev server for the run.
import { fileURLToPath } from 'node:url';                  // What: File URL To Path. Why: The output paths are resolved from this script's own location. How: This turns a file URL into a path.
import { mkdirSync     } from 'node:fs';                   // What: Make Directory Sync. Why: The cards' images go in their own folder, which a fresh checkout may lack. How: This creates it if needed.
import { statSync      } from 'node:fs';                   // What: Stat Sync. Why: Every image has to stay under the 300 KB cap the social preview rule keeps as a safe margin for WhatsApp. How: This reads a saved image's size in bytes.
import { writeFileSync } from 'node:fs';                   // What: Write File Sync. Why: Each card's image is captured into memory first, so its PNG size can choose its format. How: This saves the chosen capture to its file.

// #endregion Imports



/**
 * render.mts = Social Preview Image Renderer
 *
 * @summary
 * Rebuilds every link preview image, each 1,200x630. The site's own,
 * public/og-image-2.png, is captured from card.html beside this script: the
 * hexagon mark, the TechGeek.cards wordmark, and "Animated Greeting Cards"
 * between two fanned stacks of card previews, as a PNG since it's flat
 * artwork. Each card's, public/social/ under the file name its catalog row
 * gives, is captured from the card itself, played by the site's own dev
 * server on port 5207 under reduced motion so it opens on its finished
 * scene, with the floating bar and the Family cards' controls hidden, and its
 * main line shrunk to fit the center square some apps crop a preview to. A
 * card ships as a PNG when that fits under 300 KB, the cap the social preview
 * rule keeps as a safe margin for WhatsApp, and as a JPEG otherwise, at the
 * lowest quality that showed no difference at 3x zoom; the run fails when a
 * file name's format disagrees with the size. Run it with npm run og-images
 * whenever a card or the site's look changes, and give a changed image a new
 * file name in the catalog, since apps cache previews.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const CAR_URL_STR = new URL( './card.html', import.meta.url ).href;                           // What: Card URL String. Why: The site's card loads its fonts and styles by paths relative to itself. How: This is card.html's own file URL.
const HID_CSS_STR = "nav[aria-label='Card'], [data-family-stills-mode] > :has( > [aria-label='Card controls'] ) { display : none !important; } [data-family-stills-mode] { grid-template-rows : minmax( 0, 1fr ) !important; } * { --car-bar-mar : var( --spa-ver-m01 ) !important; }"; // What: Hide CSS String. Why: A preview shows the card alone, without the floating bar or the Family cards' controls, whose room it reclaims. How: This hides both by their accessible names and shrinks the bar's clearing margin, styles only this capture ever sees. // What: Important Note. Why: These capture-only rules have to beat the card modules' own rules, whose hashed class names this script can't name to outrank them. How: Each one is marked important. // Spacing Vertical Base Minus 1 = 11px



/**
 * JPE_QUA_OBJ = JPEG Quality Object
 *
 * @summary
 * The JPEG quality each photo-heavy or detailed card's preview is saved at,
 * keyed by the card's address: the lowest that showed no difference from
 * the card's PNG capture at 3x zoom, measured on 2026-11-14. Every row is a
 * quality from 0 to 100. Birthday's saturated letter edges smeared below 80,
 * and the rest held at 70.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const JPE_QUA_OBJ : Record< string, number > = { // What: JPEG Quality Object. Why: A JPEG preview should be as small as it can be without a visible loss. How: Each row is a card's measured quality.


	'fathers-day'           : 70,
	'fathers-day-prank'     : 70,
	'happy-birthday'        : 80,
	'happy-thanksgiving'    : 70,
	'merry-christmas'       : 70,
	'merry-christmas-prank' : 70,
	'mothers-day'           : 70


};



const MAX_BYT_NUM = 300 * 1024;                                                                 // What: Maximum Bytes Number. Why: The social preview rule caps a preview image at 300 KB, a safe margin for WhatsApp. How: This is the limit every image is checked against.
const OUT_PAT_STR = fileURLToPath( new URL( '../../public/og-image-2.png', import.meta.url ) ); // What: Output Path String. Why: The Home page's tags point at the site's card in public/. How: This resolves that path from this script's folder.
const SOC_DIR_STR = fileURLToPath( new URL( '../../public/social/', import.meta.url ) );        // What: Social Directory String. Why: Each card's tags point at its own image in public/social/. How: This resolves that folder from this script's folder.
const SQU_WID_NUM = 600;                                                                        // What: Square Width Number. Why: Some apps crop a preview to its center 630x630 square, so a card's main line has to fit inside it. How: This is the widest the line may run, leaving a 15px margin each side.

// #endregion Constants



// #region Module Init

const broInsObj = await chromium.launch();                                                  // What: Browser Instance Object. Why: Every image is drawn by a real browser. How: This launches Chromium.
const capPagObj = await broInsObj.newPage( { viewport : { height : 630, width : 1200 } } ); // What: Capture Page Object. Why: Every capture has to be exactly 1,200x630. How: This opens a page at that size.


await capPagObj.goto( CAR_URL_STR ); // What: Site Card Load Call. Why: The site's card has to be on screen before it's captured. How: This opens card.html.

await capPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Text captured before its web font loads would be set in a fallback. How: This waits for every font face.

await capPagObj.screenshot( { path : OUT_PAT_STR, type : 'png' } ); // What: Site Card Capture Call. Why: This writes the site's image. How: This saves the page as a PNG in public/.



if ( statSync( OUT_PAT_STR ).size >= MAX_BYT_NUM ) throw new Error( `og-image-2.png is at or over the ${ MAX_BYT_NUM.toLocaleString( 'en-US' ) } byte limit.` ); // What: Site Size Guard. Why: An image over the limit would break the cap kept as WhatsApp's safe margin. How: This fails the run.



const vitSerObj = await createServer( { server : { port : 5207, strictPort : true } } ); // What: Vite Server Object. Why: The cards are captured as the site plays them, on a port of the script's own. How: This starts the dev server on 5207, failing rather than taking another.


await vitSerObj.listen(); // What: Server Listen Call. Why: The cards load from the server. How: This starts it.

await capPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: A card's preview is its finished scene, which reduced motion opens on at once. How: This makes the page match prefers-reduced-motion: reduce.

mkdirSync( SOC_DIR_STR, { recursive : true } ); // What: Social Folder Creation. Why: The cards' images need their folder. How: This creates it if it's missing.


for ( const carDatObj of CAR_DAT_ARR ) { // What: Card Capture Loop. Why: Every card gets its own preview. How: This captures each in turn.


	const imaPatStr = `${ SOC_DIR_STR }${ carDatObj.socStr }`; // What: Image Path String. Why: Each card's tags point at its image by the file name its catalog row gives. How: This is the card's file in public/social/.


	await capPagObj.goto( `http://localhost:5207/${ carDatObj.sluStr }` ); // What: Card Load Call. Why: The card has to be on screen before it's captured. How: This opens the card's page.

	await capPagObj.waitForLoadState( 'networkidle' ); // What: Network Idle Wait. Why: A card's code and images arrive after its page. How: This waits until nothing more is loading.

	await capPagObj.addStyleTag( { content : HID_CSS_STR } ); // What: Hide Style Call. Why: The preview shows the card alone. How: This adds the capture-only styles.

	await capPagObj.evaluate( () => Promise.all( [ document.fonts.ready, ...Array.from( document.images, ( imaCurEle ) => imaCurEle.decode().catch( () => {} ) ) ] ) ); // What: Fonts And Images Wait. Why: A capture taken before the card's fonts and photos are ready would show fallbacks and gaps. How: This waits for every font face and every image to decode, ignoring one that never loads.

	await capPagObj.evaluate( ( squWidNum ) => { // What: Main Line Fit Call. Why: A main line wider than the center square would be cut off where apps crop the preview to it. How: This measures the card's greeting or visible heading by its text and shrinks it to the square's width when it runs wider.


		const maiLinEle = ( document.querySelector( '[class*="famGreSpa"]' ) ?? Array.from( document.querySelectorAll( 'main h1' ) ).find( ( heaCurEle ) => heaCurEle.checkVisibility( { opacityProperty : true, visibilityProperty : true } ) ) ) as HTMLElement | undefined; // What: Main Line Element. Why: A Family card's main line is its grown greeting, and every other card's is its heading, which a prank may follow a hidden one with. How: This finds the greeting by the class name Vite keeps inside the hashed class, or else the first heading shown. // What: Type Assertion Note. Why: The lookups type their match as a general element. How: Both find HTML elements.


		if ( !maiLinEle ) return; // What: Main Line Guard. Why: A card without a main line has nothing to fit. How: This returns early.



		const texRanObj = document.createRange(); // What: Text Range Object. Why: A block heading's box spans the screen, while its text may not. How: This range measures the text alone.


		texRanObj.selectNodeContents( maiLinEle ); // What: Range Select Call. Why: The range has to cover the line's text. How: This selects the element's contents.


		const texWidNum = texRanObj.getBoundingClientRect().width; // What: Text Width Number. Why: Only a line wider than the square needs shrinking. How: This reads the text's drawn width.


		if ( texWidNum > squWidNum ) maiLinEle.style.scale = String( squWidNum / texWidNum ); // What: Line Shrink Assignment. Why: The line has to fit the square without changing the card's layout. How: This scales the line about its own center by the square's share of its width, on top of any transform the card gave it.


	}, SQU_WID_NUM ); // What: Square Width Argument. Why: The page script can't read this file's constants. How: This hands it the square's width.

	await capPagObj.waitForTimeout( 500 ); // What: Settle Wait. Why: A layout that changed with the capture styles or the fit needs a frame or two to repaint. How: This pauses half a second.


	const pngBufObj = await capPagObj.screenshot( { type : 'png' } ); // What: PNG Buffer Object. Why: A card ships as a PNG whenever that fits under the cap. How: This captures it losslessly into memory.


	const pngFitBoo = pngBufObj.length < MAX_BYT_NUM;    // What: PNG Fit Boolean. Why: The format follows the size. How: This checks the PNG is under the cap.
	const pngNamBoo = carDatObj.socStr.endsWith( '.png' ); // What: PNG Name Boolean. Why: The catalog's file name decides the format the tags announce. How: This checks the name ends in .png.


	if ( pngFitBoo !== pngNamBoo ) throw new Error( `${ carDatObj.socStr } should be a ${ pngFitBoo ? 'PNG' : 'JPEG' }, since its PNG capture is ${ pngBufObj.length.toLocaleString( 'en-US' ) } bytes. Rename it in src/ui/card-data.ts.` ); // What: Format Guard. Why: A card that fits as a PNG shouldn't ship as a JPEG, and one that doesn't can't ship as a PNG. How: This stops the run when the file name's format disagrees with the PNG's size.



	if ( pngNamBoo ) writeFileSync( imaPatStr, pngBufObj ); // What: PNG Write Call. Why: A card that fits as a PNG keeps every pixel. How: This saves the capture.

	else writeFileSync( imaPatStr, await capPagObj.screenshot( { quality : JPE_QUA_OBJ[ carDatObj.sluStr ], type : 'jpeg' } ) ); // What: JPEG Write Call. Why: A card too big as a PNG ships as a JPEG at its measured quality. How: This captures the card as a JPEG at that quality and saves it.



	if ( statSync( imaPatStr ).size >= MAX_BYT_NUM ) throw new Error( `${ carDatObj.socStr } is at or over the ${ MAX_BYT_NUM.toLocaleString( 'en-US' ) } byte limit.` ); // What: Card Size Guard. Why: An image over the limit would break the cap kept as WhatsApp's safe margin. How: This stops the run if the saved file is too big.



	console.log( `Wrote ${ imaPatStr } (${ statSync( imaPatStr ).size.toLocaleString( 'en-US' ) } bytes; ${ pngBufObj.length.toLocaleString( 'en-US' ) } as a PNG).` ); // What: Card Result Log Call. Why: The run should say what it wrote. How: This prints the path, its size, and its size as a PNG.


}



await vitSerObj.close(); // What: Server Close Call. Why: The script's server shouldn't outlive it. How: This stops the dev server.
await broInsObj.close(); // What: Browser Close Call. Why: The script should exit once every image is saved. How: This shuts Chromium down.



console.log( `Wrote ${ OUT_PAT_STR } (${ statSync( OUT_PAT_STR ).size.toLocaleString( 'en-US' ) } bytes).` ); // What: Site Result Log Call. Why: The run should say what it wrote. How: This prints the site image's path and size.

// #endregion Module Init


