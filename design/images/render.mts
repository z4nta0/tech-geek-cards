


// #region Imports

import { chromium      } from '@playwright/test'; // What: Chromium. Why: The images are scaled and encoded by a real browser's canvas, so no image library is needed. How: This launches Playwright's Chromium.
import { fileURLToPath } from 'node:url';         // What: File URL To Path. Why: Every path is resolved from this script's own location. How: This turns a file URL into a path.
import { mkdirSync     } from 'node:fs';          // What: Make Directory Sync. Why: An output folder may not exist yet on a fresh checkout. How: This creates it.
import { readFileSync  } from 'node:fs';          // What: Read File Sync. Why: Each original is handed to the browser as data. How: This reads its bytes.
import { statSync      } from 'node:fs';          // What: Stat Sync. Why: The run reports how much the images shrank. How: This reads each original's size in bytes.
import { writeFileSync } from 'node:fs';          // What: Write File Sync. Why: The encoded images are saved. How: This writes each one.

// #endregion Imports



/**
 * render.mts = Image Renderer
 *
 * @summary
 * Rebuilds every raster image the site shows from the originals in
 * originals/, a folder kept out of git so the large source files never bloat
 * the repository again. Each image is scaled so it covers its box, which is
 * twice the largest size the site shows it at, never scaled up, and encoded
 * at 0.85 quality, the lowest that showed no difference from the original at
 * 3x zoom. The card illustrations are shown at up to 1920 by 1080, larger
 * than their originals, so they keep their full size. Everything is written
 * as WebP into src/assets, except the birthday card's social preview, which
 * link scrapers need as a JPEG at exactly 1200 by 630, written into public/.
 * Run it with npm run images whenever an image is added or replaced, or a
 * display size changes.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

type BoxRecTyp = { cutBoo : boolean, heiNum : number, widNum : number }; // What: Box Record Type. Why: A kind of image is either fitted to cover its box or cut to exactly its size. How: This names whether it's cut, and the box's height and width in pixels, Infinity for no limit.

const BOX_REC_OBJ : Record< string, BoxRecTyp > = { // What: Box Record Object. Why: Each kind of image is shown at a different largest size, and its file should be no more than twice that. How: This maps each kind to its box.


	'card'     : { cutBoo : false, heiNum : Infinity, widNum : Infinity }, // What: Card Box. Why: The card illustrations fill a 1920 by 1080 stage, larger than their originals. How: This leaves them at full size.
	'portrait' : { cutBoo : false, heiNum : 640,      widNum : 560      }, // What: Portrait Box. Why: The About portrait fills a 280 by 320 frame. How: This covers twice that.
	'preview'  : { cutBoo : false, heiNum : 930,      widNum : 1240     }, // What: Preview Box. Why: A card preview fills a 4:3 frame up to about 620px wide. How: This covers twice that.
	'project'  : { cutBoo : false, heiNum : 698,      widNum : 1240     }, // What: Project Box. Why: A project screenshot fills a 16:9 frame up to about 620px wide. How: This covers twice that.
	'social'   : { cutBoo : true,  heiNum : 630,      widNum : 1200     }  // What: Social Box. Why: Link previews expect a 1200 by 630 image. How: This cuts the original to exactly that.


};



type ImaRecTyp = { boxStr : string, outStr : string, souStr : string }; // What: Image Record Type. Why: Every image has a box, an output, and an original. How: This names its box key and its output and original paths, each relative to its own root.

const IMA_REC_ARR : ImaRecTyp[] = [ // What: Image Record Array. Why: Every image the site shows is rebuilt from this one list. How: Each row names the original, where it's written, and which box it fits.


	...[ 'fathers-day-card', 'fdc-special', 'mothers-day-card' ].flatMap( ( dirNamStr ) => [ 'appreciate', 'appreciate-you', 'celebration', 'everything', 'everything-you-do', 'extra-1', 'extra-2', 'extra-image-1', 'extra-image-2', 'feces-flinging', 'important-role', 'little-things', 'love', 'love-you', 'monkeying-around', 'mothers-love', 'need-you', 'need-your', 'our-responsibility', 'our-world', 'provide-for-us', 'simian-role', 'special-day', 'thank-you', 'through-the-generations', 'through-the-simian-offspring' ].map( ( filNamStr ) => ( { boxStr : 'card', outStr : `src/assets/${ dirNamStr }/${ filNamStr }.webp`, souStr : `${ dirNamStr }/${ filNamStr }.png` } ) ) ), // What: Card Illustration Rows. Why: The three cards share most illustration names, and each folder holds only some of them. How: This lists every name for every folder, and the loop skips an original that doesn't exist.

	...[ 'ease-my-life', 'hair-designs', 'reese-roofing', 'seal-and-shield', 'tech-geek', 'the-bernie-bears', 'tonys-toppers' ].map( ( proNamStr ) => ( { boxStr : 'project', outStr : `src/assets/${ proNamStr }-website.webp`, souStr : `${ proNamStr }-website.png` } ) ), // What: Project Screenshot Rows. Why: Every project card shows a screenshot of its site. How: This builds one row per project.

	...[ 'fathers-day', 'fourth-of-july', 'happy-birthday', 'happy-halloween', 'happy-thanksgiving', 'mothers-day' ].map( ( carNamStr ) => ( { boxStr : 'preview', outStr : `src/assets/${ carNamStr }-card-preview-image.webp`, souStr : `${ carNamStr }-card-preview-image.png` } ) ), // What: Card Preview Rows. Why: Every card in the catalog shows a preview. How: This builds one row per card.

	{ boxStr : 'portrait', outStr : 'src/assets/self-portrait.webp',                     souStr : 'self-portrait.jpg'          }, // What: Portrait Row. Why: The About page shows the portrait. How: This fits it to the portrait box.
	{ boxStr : 'social',   outStr : 'public/happy-birthday-card-preview-image.jpg',      souStr : 'og-happy-birthday-card.png' }  // What: Social Preview Row. Why: The birthday card's link preview is fetched by its fixed URL. How: This cuts it to the social box as a JPEG in public/.


];



const ORI_DIR_STR = fileURLToPath( new URL( './originals/', import.meta.url ) ); // What: Originals Directory String. Why: The originals live beside this script, outside git. How: This resolves that folder.
const QUA_VAL_NUM = 0.85;                                                        // What: Quality Value Number. Why: This is the lowest quality that showed no difference from the originals at 3x zoom. How: Every image is encoded at it.
const ROO_DIR_STR = fileURLToPath( new URL( '../../', import.meta.url ) );       // What: Root Directory String. Why: Outputs are named from the project root. How: This resolves it.

// #endregion Constants



// #region Module Init

const broInsObj = await chromium.launch();   // What: Browser Instance Object. Why: The images are drawn by a real browser. How: This launches Chromium.
const encPagObj = await broInsObj.newPage(); // What: Encode Page Object. Why: The canvas work runs in a page. How: This opens a blank one.

let aftBytNum = 0; // What: After Bytes Number. Why: The run reports how much smaller the images got. How: This adds up the encoded files' sizes.
let befBytNum = 0; // What: Before Bytes Number. Why: The run reports how much smaller the images got. How: This adds up the originals' sizes.
let wroCouNum = 0; // What: Written Count Number. Why: The run reports how many images it wrote. How: This counts them.


for ( const imaRecObj of IMA_REC_ARR ) { // What: Image Record Loop. Why: Each original is rebuilt the same way. How: This scales, encodes, and writes one image per pass.


	const souPatStr = `${ ORI_DIR_STR }${ imaRecObj.souStr }`; // What: Source Path String. Why: The original is read from the originals folder. How: This joins its folder and name.



	try { statSync( souPatStr ); }

	catch { continue; }



	const boxRecObj = BOX_REC_OBJ[ imaRecObj.boxStr ];                                                                                                   // What: Box Record Object. Why: The image fits its kind's box. How: This looks the box up by kind.
	const mimTypStr = imaRecObj.outStr.endsWith( '.jpg' ) ? 'image/jpeg' : 'image/webp';                                                                 // What: MIME Type String. Why: Only the social preview is a JPEG. How: This picks the format from the output's extension.
	const souUrlStr = `data:image/${ imaRecObj.souStr.endsWith( '.jpg' ) ? 'jpeg' : 'png' };base64,${ readFileSync( souPatStr ).toString( 'base64' ) }`; // What: Source URL String. Why: A canvas drawn from a file URL can't be read back, while one drawn from data can. How: This hands the original to the page as a data URL.


	const encResObj = await encPagObj.evaluate( async ( [ souUrlStr, boxRecObj, mimTypStr, quaValNum ] ) => { // What: Encode Result Object. Why: The browser scales and encodes the image. How: This decodes the original, draws it onto a canvas at the fitted size, and returns the encoded data.


		const souImaEle = new Image(); // What: Source Image Element. Why: The original has to be decoded before it's drawn. How: This creates an image to load it into.


		souImaEle.src = souUrlStr; // What: Source Address Assignment. Why: The image loads the original's data. How: This sets its source.

		await souImaEle.decode(); // What: Source Decode Wait. Why: Drawing an undecoded image draws nothing. How: This waits until it's ready.


		const souHeiNum = souImaEle.naturalHeight;                                                                                // What: Source Height Number. Why: The fit is measured against the original. How: This reads its height.
		const souWidNum = souImaEle.naturalWidth;                                                                                 // What: Source Width Number. Why: The fit is measured against the original. How: This reads its width.
		const scaValNum = Math.min( 1, Math.max( boxRecObj.widNum / souWidNum, boxRecObj.heiNum / souHeiNum ) );                  // What: Scale Value Number. Why: The image covers its box, as object-fit cover shows it, but is never enlarged. How: This takes the larger of the two fits, capped at 1.
		const drwHeiNum = Math.round( souHeiNum * scaValNum );                                                                    // What: Drawn Height Number. Why: The original is drawn at the fitted size. How: This scales its height.
		const drwWidNum = Math.round( souWidNum * scaValNum );                                                                    // What: Drawn Width Number. Why: The original is drawn at the fitted size. How: This scales its width.
		const outHeiNum = boxRecObj.cutBoo ? boxRecObj.heiNum : drwHeiNum;                                                        // What: Output Height Number. Why: A cut image is exactly its box, and any other is its fitted size. How: This picks between them.
		const outWidNum = boxRecObj.cutBoo ? boxRecObj.widNum : drwWidNum;                                                        // What: Output Width Number. Why: A cut image is exactly its box, and any other is its fitted size. How: This picks between them.
		const outCanEle = document.createElement( 'canvas' );                                                                     // What: Output Canvas Element. Why: The image is redrawn at its new size. How: This creates the canvas.


		outCanEle.height = outHeiNum; // What: Canvas Height Assignment. Why: The canvas has to match the output size. How: This sets its height.
		outCanEle.width  = outWidNum; // What: Canvas Width Assignment. Why: The canvas has to match the output size. How: This sets its width.


		const outConObj = outCanEle.getContext( '2d' )!; // What: Output Context Object. Why: Drawing goes through the canvas's 2D context. How: This reads it. // What: Non-Null Note. Why: getContext can return null for an unsupported type. How: Every browser supports a 2D context.


		outConObj.imageSmoothingQuality = 'high'; // What: Smoothing Quality Assignment. Why: A large downscale should stay sharp without jagged edges. How: This asks for the browser's best resampling.

		outConObj.drawImage( souImaEle, ( outWidNum - drwWidNum ) / 2, ( outHeiNum - drwHeiNum ) / 2, drwWidNum, drwHeiNum ); // What: Image Draw Call. Why: A cut image keeps its center, the way object-fit cover crops it. How: This draws the scaled original centered on the canvas, which crops nothing unless the box is cut.



		return outCanEle.toDataURL( mimTypStr, quaValNum ).split( ',' )[ 1 ]; // What: Encoded Data Return. Why: Only text crosses back from the page. How: This encodes the canvas and keeps the base64 data after the data URL's comma.


	}, [ souUrlStr, boxRecObj, mimTypStr, QUA_VAL_NUM ] as const ); // What: Encode Arguments. Why: The page can't read this script's variables. How: This passes the original, its box, the format, and the quality in. // What: Type Assertion Note. Why: Without it the array widens to one mixed type, so the page function's destructured parameters lose their own types. How: as const keeps it a readonly tuple, so each parameter is typed by its position.


	const outPatStr = `${ ROO_DIR_STR }${ imaRecObj.outStr }`; // What: Output Path String. Why: The image is written where the site reads it. How: This joins the project root and the output path.
	const outBufObj = Buffer.from( encResObj, 'base64' );      // What: Output Buffer Object. Why: The file is written as bytes. How: This decodes the base64 data.


	mkdirSync( outPatStr.slice( 0, outPatStr.lastIndexOf( '/' ) ), { recursive : true } ); // What: Output Folder Creation. Why: A fresh checkout may lack the folder. How: This creates it, doing nothing when it exists.

	writeFileSync( outPatStr, outBufObj ); // What: Image Write Call. Why: The site reads the encoded image. How: This saves it.


	aftBytNum += outBufObj.length;           // What: After Bytes Increase. Why: The total covers every encoded image. How: This adds this file's size.
	befBytNum += statSync( souPatStr ).size; // What: Before Bytes Increase. Why: The total covers every original. How: This adds this original's size.
	wroCouNum += 1;                          // What: Written Count Increase. Why: The total counts every image written. How: This adds one.


}



await broInsObj.close(); // What: Browser Close Call. Why: The script should exit once every image is written. How: This shuts Chromium down.



console.log( `Wrote ${ wroCouNum } images, ${ Math.round( befBytNum / 1024 ).toLocaleString() } KB down to ${ Math.round( aftBytNum / 1024 ).toLocaleString() } KB.` ); // What: Result Log Call. Why: The run should say what it wrote. How: This prints the count and the sizes before and after.

// #endregion Module Init


