


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
 * Rebuilds the site's raster images, such as the card previews, from the
 * originals in originals/, a folder kept out of git so the large source files
 * never bloat the repository again. Each image is scaled so it covers its
 * box, never scaled up, and encoded at 0.85 quality, the lowest that showed
 * no difference from the original at 3x zoom, except flat artwork, which is
 * encoded lossless. A card preview's box is about twice its largest display
 * size, and cuts it to exactly 16:9 around its center, so a 4:3 original
 * matches every other preview. A full-screen background's box is twice the
 * 1,920 by 1,080 stage, and the Family photos, shown up to that stage's size,
 * keep their full size, cut to one shared 1,671 by 941, while the flat
 * artwork keeps its own. Everything is written as WebP into src/assets, or
 * into a converted card's own folder for images only it shows.
 * The link preview images are captured from the site itself by
 * design/og-image/render.mts instead.
 * Run it with npm run images whenever an image is added or replaced, or a
 * display size changes.
 *
 * Sections:
 *  - Constants
 *  - Module State
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

type BoxRecTyp = { cutBoo : boolean, heiNum : number, losBoo : boolean, widNum : number }; // What: Box Record Type. Why: A kind of image is either fitted to cover its box or cut to exactly its size, and encoded lossy or lossless. How: This names whether it's cut, the box's height and width in pixels, Infinity for no limit, and whether it's lossless.

const BOX_REC_OBJ : Record< string, BoxRecTyp > = { // What: Box Record Object. Why: Each kind of image is shown at a different largest size, and its file should be no more than three times that. How: This maps each kind to its box.


	'artwork' : { cutBoo : false, heiNum : Infinity, losBoo : true,  widNum : Infinity }, // What: Artwork Box. Why: Flat cartoon artwork is encoded lossless, per the Images rule, and the card artwork shows smaller than its originals. How: This leaves it at full size and lossless.
	'card'    : { cutBoo : true,  heiNum : 941,      losBoo : false, widNum : 1671     }, // What: Card Box. Why: The Family photos fill a stage up to 1,920 by 1,080, larger than their originals, and share one size so their markup can name it. How: This keeps them at full size, cut to the narrowest original's 1,671 by 941, which trims one column from the 1,672-wide ones.
	'preview' : { cutBoo : true,  heiNum : 675,      losBoo : false, widNum : 1200     }, // What: Preview Box. Why: A card preview shows at its own 16:9 shape, up to about 563px wide on Home and the Gallery at a 640px viewport, and the 4:3 Family originals would otherwise come out 1,200 by 900. How: This cuts every preview to 1,200 by 675, centered, the size the tiles declare.
	'stage'   : { cutBoo : false, heiNum : 2160,     losBoo : false, widNum : 3840     }  // What: Stage Box. Why: A full-screen card background covers a stage up to 1,920 by 1,080. How: This covers twice that.


};



type ImaRecTyp = { boxStr : string, outStr : string, souStr : string }; // What: Image Record Type. Why: Every image has a box, an output, and an original. How: This names its box key and its output and original paths, each relative to its own root.

const IMA_REC_ARR : ImaRecTyp[] = [ // What: Image Record Array. Why: The site's card previews, Family photos, and card artwork are rebuilt from this one list. How: Each row names the original, where it's written, and which box it fits.


	...[ [ 'fathers-day-card', 'fathers-day' ], [ 'fdc-special', 'fathers-day-prank' ], [ 'mothers-day-card', 'mothers-day' ] ].flatMap( ( [ dirNamStr, carDirStr ] ) => [ 'appreciate', 'appreciate-you', 'celebration', 'everything', 'everything-you-do', 'extra-1', 'extra-2', 'extra-image-1', 'extra-image-2', 'feces-flinging', 'important-role', 'little-things', 'love', 'love-you', 'monkeying-around', 'mothers-love', 'need-you', 'need-your', 'our-responsibility', 'our-world', 'provide-for-us', 'simian-role', 'special-day', 'thank-you', 'through-the-generations', 'through-the-simian-offspring' ].map( ( filNamStr ) => ( { boxStr : 'card', outStr : `src/cards/${ carDirStr }/${ filNamStr }.webp`, souStr : `${ dirNamStr }/${ filNamStr }.png` } ) ) ), // What: Family Photo Rows. Why: The three Family cards share most photo names, and each folder holds only some of them. How: This lists every name for every original folder, writing into that card's own folder, and the loop skips an original that doesn't exist.

	...[ 'christmas', 'fathers-day', 'fourth-of-july', 'happy-birthday', 'happy-halloween', 'happy-thanksgiving', 'mothers-day' ].map( ( carNamStr ) => ( { boxStr : 'preview', outStr : `src/assets/${ carNamStr }-card-preview-image.webp`, souStr : `${ carNamStr }-card-preview-image.png` } ) ), // What: Card Preview Rows. Why: Every card in the catalog shows a preview, and each prank shares its listed card's. How: This builds one row per distinct preview.

	{ boxStr : 'artwork', outStr : 'src/cards/christmas/snowman.webp',           souStr : 'christmas-card/snowman.png'           }, // What: Christmas Snowman Row. Why: The snowman is flat cartoon art shown at most about 115px wide, at a 1,920px viewport, smaller than its original. How: This keeps it at full size, encoded lossless.
	{ boxStr : 'stage',   outStr : 'src/cards/christmas/pirate-background.webp', souStr : 'christmas-card/pirate-background.jpg' }, // What: Christmas Pirate Background Row. Why: The hacked scene fills the screen. How: This fits it to the stage box.
	{ boxStr : 'stage',   outStr : 'src/cards/christmas/snowy-background.webp',  souStr : 'christmas-card/snowy-background.jpg'  }  // What: Christmas Snowy Background Row. Why: The snowy scene fills the screen. How: This fits it to the stage box.


];



const ORI_DIR_STR = fileURLToPath( new URL( './originals/', import.meta.url ) ); // What: Originals Directory String. Why: The originals live beside this script, outside git. How: This resolves that folder.
const QUA_VAL_NUM = 0.85;                                                        // What: Quality Value Number. Why: This is the lowest quality that showed no difference from the originals at 3x zoom. How: Every lossy image is encoded at it.
const ROO_DIR_STR = fileURLToPath( new URL( '../../', import.meta.url ) );       // What: Root Directory String. Why: Outputs are named from the project root. How: This resolves it.

// #endregion Constants



// #region Module State

let aftBytNum = 0; // What: After Bytes Number. Why: The run reports how much smaller the images got. How: This adds up the encoded files' sizes.
let befBytNum = 0; // What: Before Bytes Number. Why: The run reports how much smaller the images got. How: This adds up the originals' sizes.
let wriCouNum = 0; // What: Written Count Number. Why: The run reports how many images it wrote. How: This counts them.

// #endregion Module State



// #region Module Init

const broInsObj = await chromium.launch();   // What: Browser Instance Object. Why: The images are drawn by a real browser. How: This launches Chromium.
const encPagObj = await broInsObj.newPage(); // What: Encode Page Object. Why: The canvas work runs in a page. How: This opens a blank one.


for ( const imaRecObj of IMA_REC_ARR ) { // What: Image Record Loop. Why: Each original is rebuilt the same way. How: This scales, encodes, and writes one image per pass.


	const souPatStr = `${ ORI_DIR_STR }${ imaRecObj.souStr }`; // What: Source Path String. Why: The original is read from the originals folder. How: This joins its folder and name.



	try { statSync( souPatStr ); } // What: Original Existence Check. Why: Each Family photo name exists in only some of the original folders. How: This reads the original's details, which throws when it's missing.

	catch { continue; } // What: Missing Original Skip. Why: A name with no original in its folder has nothing to rebuild. How: This moves on to the next row.



	const boxRecObj = BOX_REC_OBJ[ imaRecObj.boxStr ];                                                                                                   // What: Box Record Object. Why: The image fits its kind's box. How: This looks the box up by kind.
	const mimTypStr = 'image/webp'; // What: MIME Type String. Why: Every image this script writes is a WebP. How: This names the format the canvas encodes.
	const quaValNum = boxRecObj.losBoo ? 1 : QUA_VAL_NUM;                                                                                                // What: Quality Value Number. Why: Flat artwork is encoded lossless and everything else lossy. How: This passes 1, which Chromium's canvas encodes as lossless WebP (a VP8L chunk, measured with every opaque pixel unchanged), or the lossy quality.
	const souUrlStr = `data:image/${ imaRecObj.souStr.endsWith( '.jpg' ) ? 'jpeg' : 'png' };base64,${ readFileSync( souPatStr ).toString( 'base64' ) }`; // What: Source URL String. Why: A canvas drawn from a file URL can't be read back, while one drawn from data can. How: This hands the original to the page as a data URL.


	const encResStr = await encPagObj.evaluate( async ( [ souUrlStr, boxRecObj, mimTypStr, quaValNum ] ) => { // What: Encode Result String. Why: The browser scales and encodes the image. How: This decodes the original, draws it onto a canvas at the fitted size, and returns the encoded data.


		const souImaEle = new Image(); // What: Source Image Element. Why: The original has to be decoded before it's drawn. How: This creates an image to load it into.


		souImaEle.src = souUrlStr; // What: Source Address Assignment. Why: The image loads the original's data. How: This sets its source.


		await souImaEle.decode(); // What: Source Decode Wait. Why: Drawing an undecoded image draws nothing. How: This waits until it's ready.


		const souHeiNum = souImaEle.naturalHeight;                                                               // What: Source Height Number. Why: The fit is measured against the original. How: This reads its height.
		const souWidNum = souImaEle.naturalWidth;                                                                // What: Source Width Number. Why: The fit is measured against the original. How: This reads its width.
		const scaValNum = Math.min( 1, Math.max( boxRecObj.widNum / souWidNum, boxRecObj.heiNum / souHeiNum ) ); // What: Scale Value Number. Why: The image covers its box, as object-fit cover shows it, but is never enlarged. How: This takes the larger of the two fits, capped at 1.
		const draHeiNum = Math.round( souHeiNum * scaValNum );                                                   // What: Drawn Height Number. Why: The original is drawn at the fitted size. How: This scales its height.
		const draWidNum = Math.round( souWidNum * scaValNum );                                                   // What: Drawn Width Number. Why: The original is drawn at the fitted size. How: This scales its width.
		const outHeiNum = boxRecObj.cutBoo ? boxRecObj.heiNum : draHeiNum;                                       // What: Output Height Number. Why: A cut image is exactly its box, and any other is its fitted size. How: This picks between them.
		const outWidNum = boxRecObj.cutBoo ? boxRecObj.widNum : draWidNum;                                       // What: Output Width Number. Why: A cut image is exactly its box, and any other is its fitted size. How: This picks between them.
		const outCanEle = document.createElement( 'canvas' );                                                    // What: Output Canvas Element. Why: The image is redrawn at its new size. How: This creates the canvas.


		outCanEle.height = outHeiNum; // What: Canvas Height Assignment. Why: The canvas has to match the output size. How: This sets its height.
		outCanEle.width  = outWidNum; // What: Canvas Width Assignment. Why: The canvas has to match the output size. How: This sets its width.


		const outCotObj = outCanEle.getContext( '2d' )!; // What: Output Context Object. Why: Drawing goes through the canvas's 2D context. How: This reads it. // What: Non-Null Note. Why: getContext can return null for an unsupported type. How: Every browser supports a 2D context.


		outCotObj.imageSmoothingQuality = 'high'; // What: Smoothing Quality Assignment. Why: A large downscale should stay sharp without jagged edges. How: This asks for the browser's best resampling.


		outCotObj.drawImage( souImaEle, Math.trunc( ( outWidNum - draWidNum ) / 2 ), Math.trunc( ( outHeiNum - draHeiNum ) / 2 ), draWidNum, draHeiNum ); // What: Image Draw Call. Why: A cut image keeps its center, the way object-fit cover crops it. How: This draws the scaled original centered on the canvas at whole pixels, so an odd pixel's trim takes one edge rather than blurring the image, which crops nothing unless the box is cut.



		return outCanEle.toDataURL( mimTypStr, quaValNum ).split( ',' )[ 1 ]; // What: Encoded Data Return. Why: Only text crosses back from the page. How: This encodes the canvas and keeps the base64 data after the data URL's comma.


	}, [ souUrlStr, boxRecObj, mimTypStr, quaValNum ] as const ); // What: Encode Arguments. Why: The page can't read this script's variables. How: This passes the original, its box, the format, and the quality in. // What: Type Assertion Note. Why: Without it the array widens to one mixed type, so the page function's destructured parameters lose their own types. How: as const keeps it a readonly tuple, so each parameter is typed by its position.


	const outPatStr = `${ ROO_DIR_STR }${ imaRecObj.outStr }`; // What: Output Path String. Why: The image is written where the site reads it. How: This joins the project root and the output path.
	const outBufObj = Buffer.from( encResStr, 'base64' );      // What: Output Buffer Object. Why: The file is written as bytes. How: This decodes the base64 data.


	mkdirSync( outPatStr.slice( 0, outPatStr.lastIndexOf( '/' ) ), { recursive : true } ); // What: Output Folder Creation. Why: A fresh checkout may lack the folder. How: This creates it, doing nothing when it exists.

	writeFileSync( outPatStr, outBufObj ); // What: Image Write Call. Why: The site reads the encoded image. How: This saves it.


	aftBytNum += outBufObj.length;           // What: After Bytes Increase. Why: The total covers every encoded image. How: This adds this file's size.
	befBytNum += statSync( souPatStr ).size; // What: Before Bytes Increase. Why: The total covers every original. How: This adds this original's size.
	wriCouNum += 1;                          // What: Written Count Increase. Why: The total counts every image written. How: This adds one.


}



await broInsObj.close(); // What: Browser Close Call. Why: The script should exit once every image is written. How: This shuts Chromium down.



console.log( `Wrote ${ wriCouNum } images, ${ Math.round( befBytNum / 1024 ).toLocaleString( 'en-US' ) } KB down to ${ Math.round( aftBytNum / 1024 ).toLocaleString( 'en-US' ) } KB.` ); // What: Result Log Call. Why: The run should say what it wrote. How: This prints the count and the sizes before and after.

// #endregion Module Init


