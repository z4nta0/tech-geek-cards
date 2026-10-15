


// #region Imports

import { chromium      } from '@playwright/test'; // What: Chromium. Why: The icons are drawn in a real browser's canvas, the one image tool every machine running the tests already has. How: This launches Playwright's Chromium.
import { copyFileSync  } from 'node:fs';          // What: Copy File Sync. Why: Browsers that read SVG favicons fetch favicon.svg from the site's root. How: This copies the package's artwork into public/.
import { fileURLToPath } from 'node:url';         // What: File URL To Path. Why: The source and output paths are resolved from this script's own location. How: This turns a file URL into a path.
import { readFileSync  } from 'node:fs';          // What: Read File Sync. Why: The mark is handed to the browser as data. How: This reads it from the design package.
import { writeFileSync } from 'node:fs';          // What: Write File Sync. Why: Each finished icon is saved into public/. How: This writes its bytes.

// #endregion Imports



/**
 * render.mts = Favicon Set Renderer
 *
 * @summary
 * Rebuilds the site's icons in public/ from the TechGeek family's mark, the
 * design package's favicon.svg: TechGeek's orange hexagon around a blue
 * hexagon and an orange dot, on a transparent background. Browsers that read
 * SVG favicons use favicon.svg itself, which this script copies into public/;
 * it also draws the fallbacks: PNG icons at 16, 32, 192, and 512px, a
 * favicon.ico holding the 16, 32, and 48px sizes for older browsers and the
 * request browsers make for /favicon.ico on their own, and a 180px
 * apple-touch-icon.png on a solid square of the site's ivory, since iOS fills
 * transparency with black and rounds the corners itself. The touch icon draws
 * the mark a little smaller than the square, so the rounded corners never
 * crowd it. Since the mark is a vector, each size is drawn straight from it.
 * The script stays in the site rather than the package, since Node won't strip
 * TypeScript types from a file inside node_modules. Copied from
 * the-bernie-bears. Run it with npm run icons whenever the package's mark
 * changes.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

type IcoRecTyp = { // What: Icon Record Type. Why: Every PNG icon is described the same way. How: This names its file, its size, and whether it needs a solid background.


	filStr : string,  // What: File String. Why: Each icon is saved under its own name in public/. How: This is the file name.
	opaBoo : boolean, // What: Opaque Boolean. Why: iOS turns transparent pixels black and rounds the icon's corners. How: This is true for the icon drawn smaller on solid ivory.
	sizNum : number   // What: Size Number. Why: Each icon is square at its own size. How: This is its width and height in pixels.


};

const ICO_REC_ARR : IcoRecTyp[] = [ // What: Icon Record Array. Why: The PNG icons the head links to, and the one iOS reads, are rendered from one list. How: Each row names a file and its size.


	{ filStr : 'favicon-16x16.png',    opaBoo : false, sizNum : 16  }, // What: Small Icon Row. Why: Tabs draw small icons crisper at their own size. How: This renders the 16px icon.
	{ filStr : 'favicon-32x32.png',    opaBoo : false, sizNum : 32  }, // What: Medium Icon Row. Why: Most browsers pick a 32px tab icon. How: This renders the 32px icon.
	{ filStr : 'favicon-192x192.png',  opaBoo : false, sizNum : 192 }, // What: Large Icon Row. Why: Android and some browsers use a large icon for shortcuts. How: This renders the 192px icon.
	{ filStr : 'favicon-512x512.png',  opaBoo : false, sizNum : 512 }, // What: Extra Large Icon Row. Why: High-density screens and launchers can ask for a bigger icon still. How: This renders the 512px icon.
	{ filStr : 'apple-touch-icon.png', opaBoo : true,  sizNum : 180 }  // What: Apple Touch Icon Row. Why: iOS draws the home screen icon at 180px and fills transparency with black. How: This renders it on solid ivory.


];



const ICO_SIZ_ARR = [ 16, 32, 48 ]; // What: ICO Size Array. Why: favicon.ico should hold the sizes older browsers and Windows pick from. How: Each entry is one square size packed into the file.



const OUT_DIR_STR = fileURLToPath( new URL( '../../public/', import.meta.url ) );                                                       // What: Output Directory String. Why: Browsers request icons from the site's root. How: This resolves public/ from this script's folder.
const SOU_SVG_STR = fileURLToPath( new URL( '../../node_modules/techgeek-design/src/assets/brand/favicon.svg', import.meta.url ) ); // What: Source SVG String. Why: The TechGeek family's mark lives in the shared design package. How: This resolves the installed package's artwork from this script's folder.
const SOU_B64_STR = readFileSync( SOU_SVG_STR ).toString( 'base64' );                                                                   // What: Source Base64 String. Why: The browser draws the mark from data rather than a file path. How: This reads the artwork and encodes it.
const TOU_SCA_NUM = 0.8;                                                                                         // What: Touch Scale Number. Why: iOS rounds the touch icon's corners, which would crowd a mark drawn edge to edge. How: The touch icon draws the mark at this share of its square, centered.

// #endregion Constants



// #region Module Init

const broInsObj = await chromium.launch();   // What: Browser Instance Object. Why: The icons are drawn in a real browser's canvas. How: This launches Chromium.
const draPagObj = await broInsObj.newPage(); // What: Draw Page Object. Why: The canvas work runs inside a page. How: This opens a blank one.



// #region renPngFun

/**
 * renPngFun = Render PNG Function
 *
 * @summary
 * Draws the mark at one square size inside the browser and returns the PNG's
 * bytes. The mark is a vector, so the browser rasterizes it straight at the
 * target size. When asked for an opaque icon, it fills the square ivory and
 * draws the mark at TOU_SCA_NUM of the square, centered.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param icoSizNum - Icon Size Number: The icon's width and height in pixels.
 * @param icoOpaBoo - Icon Opaque Boolean: Whether to draw on solid ivory.
 *
 * @returns A promise that resolves with the finished PNG's bytes.
 *
 * @example
 * ```ts
 * renPngFun(32, false) // => Promise<Buffer>
 * ```
 *
*/

async function renPngFun ( icoSizNum : number, icoOpaBoo : boolean ) : Promise< Buffer > {


	const pngB64Str = await draPagObj.evaluate( async ( [ souB64Str, tarSizNum, solBacBoo, touScaNum ] ) => { // What: PNG Base64 String. Why: The canvas lives in the page, so the finished image comes back as text. How: This runs the drawing in the page and returns the PNG as base64.


		const souImaEle = new Image(); // What: Source Image Element. Why: The mark has to be decoded before it's drawn. How: This loads it from its base64 data.


		souImaEle.src = `data:image/svg+xml;base64,${ souB64Str }`; // What: Source Address Assignment. Why: The image loads from the data handed in. How: This sets it as an SVG data URL.

		await souImaEle.decode(); // What: Source Decode Wait. Why: Drawing an undecoded image draws nothing. How: This waits until it's ready.


		const finCanEle = document.createElement( 'canvas' ); // What: Final Canvas Element. Why: The icon draws at its exact target size. How: This creates the canvas.


		finCanEle.height = tarSizNum; // What: Final Height Assignment. Why: The icon is square at its target size. How: This sets the height.
		finCanEle.width  = tarSizNum; // What: Final Width Assignment. Why: The icon is square at its target size. How: This sets the width.


		const finConObj = finCanEle.getContext( '2d' )!;                 // What: Final Context Object. Why: Drawing goes through the canvas's 2D context. How: This gets it. // What: Non-Null Note. Why: getContext can return null for an unsupported type. How: A 2D context is always available on a fresh canvas.
		const marSizNum = solBacBoo ? tarSizNum * touScaNum : tarSizNum; // What: Mark Size Number. Why: The touch icon leaves room around the mark for iOS's rounded corners. How: This shrinks the mark for the opaque icon and fills the square otherwise.
		const marOffNum = ( tarSizNum - marSizNum ) / 2;                 // What: Mark Offset Number. Why: The shrunk mark sits in the middle of its square. How: This splits the spare room evenly on each side.


		if ( solBacBoo ) { // What: Solid Background Fill. Why: iOS fills transparency with black. How: For the opaque icon, this paints the square ivory before the mark goes on.


			finConObj.fillStyle = '#F5F0E8'; // What: Ivory Fill Assignment. Why: The background has to be solid, and the site's page ivory matches its pages. How: This sets the fill color, the default value of the page background role, since a script's canvas can't read the stylesheet's tokens.

			finConObj.fillRect( 0, 0, tarSizNum, tarSizNum ); // What: Background Fill Call. Why: Every pixel under the mark has to be opaque. How: This paints the whole square.


		}



		finConObj.drawImage( souImaEle, marOffNum, marOffNum, marSizNum, marSizNum ); // What: Mark Draw Call. Why: This draws the icon itself. How: This rasterizes the mark at its size and offset.



		return finCanEle.toDataURL( 'image/png' ).split( ',' )[ 1 ]; // What: PNG Data Return. Why: The bytes have to leave the page as text. How: This encodes the canvas as a PNG and returns its base64 part.


	}, [ SOU_B64_STR, icoSizNum, icoOpaBoo, TOU_SCA_NUM ] as const ); // What: Drawing Arguments. Why: The page can't read this script's variables. How: This hands the mark's data, the target size, the opaque flag, and the touch scale into the page. // What: Type Assertion Note. Why: Without it the array widens to one mixed type, so the page function's destructured parameters lose their own types. How: as const keeps it a readonly tuple, so each parameter is typed by its position.



	return Buffer.from( pngB64Str, 'base64' ); // What: PNG Bytes Return. Why: The caller writes bytes, not text. How: This decodes the base64 PNG into a buffer.


}

// #endregion renPngFun



for ( const icoRecObj of ICO_REC_ARR ) writeFileSync( OUT_DIR_STR + icoRecObj.filStr, await renPngFun( icoRecObj.sizNum, icoRecObj.opaBoo ) ); // What: PNG Icon Loop. Why: Each PNG icon is saved under its own name. How: This renders every row and writes it into public/.



const icoPngArr = await Promise.all( ICO_SIZ_ARR.map( ( icoSizNum ) => renPngFun( icoSizNum, false ) ) ); // What: ICO PNG Array. Why: favicon.ico packs one PNG per size. How: This renders each of its sizes.
const icoHeaBuf = Buffer.alloc( 6 + 16 * icoPngArr.length );                                              // What: ICO Header Buffer. Why: An ICO file starts with a header and one directory entry per image. How: This allocates both.


icoHeaBuf.writeUInt16LE( 1, 2 );                // What: ICO Type Write. Why: The format marks icons with type 1. How: This writes it after the reserved zero.
icoHeaBuf.writeUInt16LE( icoPngArr.length, 4 ); // What: ICO Count Write. Why: The header says how many images follow. How: This writes the count.


let icoOffNum = icoHeaBuf.length; // What: ICO Offset Number. Why: Each directory entry says where its image starts. How: This begins right after the header and directory.


for ( const [ icoIndNum, icoPngBuf ] of icoPngArr.entries() ) { // What: ICO Entry Loop. Why: Each image needs a directory entry. How: This writes one per size, in order.


	const entOffNum = 6 + 16 * icoIndNum;       // What: Entry Offset Number. Why: Each entry has its own place in the directory. How: This finds it.
	const entSizNum = ICO_SIZ_ARR[ icoIndNum ]; // What: Entry Size Number. Why: The entry names its image's width and height. How: This reads the size it was rendered at.


	icoHeaBuf.writeUInt8( entSizNum, entOffNum );               // What: Entry Width Write. Why: The entry names the image's width. How: This writes it.
	icoHeaBuf.writeUInt8( entSizNum, entOffNum + 1 );           // What: Entry Height Write. Why: The entry names the image's height. How: This writes it.
	icoHeaBuf.writeUInt16LE( 1, entOffNum + 4 );                // What: Entry Planes Write. Why: The format expects one color plane. How: This writes it.
	icoHeaBuf.writeUInt16LE( 32, entOffNum + 6 );               // What: Entry Depth Write. Why: The images are full-color PNGs with alpha. How: This writes 32 bits per pixel.
	icoHeaBuf.writeUInt32LE( icoPngBuf.length, entOffNum + 8 ); // What: Entry Size Write. Why: The entry says how many bytes its image takes. How: This writes the PNG's length.
	icoHeaBuf.writeUInt32LE( icoOffNum, entOffNum + 12 );       // What: Entry Offset Write. Why: The entry says where its image starts. How: This writes the running offset.


	icoOffNum += icoPngBuf.length; // What: Offset Advance. Why: The next image starts after this one. How: This adds its length.


}



writeFileSync( OUT_DIR_STR + 'favicon.ico', Buffer.concat( [ icoHeaBuf, ...icoPngArr ] ) ); // What: ICO Write Call. Why: Browsers request /favicon.ico on their own. How: This writes the header, directory, and PNGs as one file.

await broInsObj.close(); // What: Browser Close Call. Why: The script should exit once the icons are saved. How: This shuts Chromium down.



copyFileSync( SOU_SVG_STR, OUT_DIR_STR + 'favicon.svg' ); // What: SVG Copy Call. Why: Browsers that read SVG favicons use the artwork itself. How: This copies it into public/ beside the drawn icons.



console.log( `Wrote favicon.svg, ${ ICO_REC_ARR.length } PNG icons, and favicon.ico to ${ OUT_DIR_STR }.` ); // What: Result Log Call. Why: The run should say what it wrote. How: This prints the files and folder.

// #endregion Module Init


