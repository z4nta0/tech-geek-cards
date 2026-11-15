


// #region Imports

import subFonFun from 'subset-font'; // What: Subset Font Function. Why: Fraunces ships every axis it has, while the card needs only a sliver of them. How: This HarfBuzz wrapper pins a variable font's axes and writes the result as WOFF2.


import { fileURLToPath } from 'node:url'; // What: File URL To Path. Why: The source and output paths are resolved from this script's own location. How: This turns a file URL into a path.
import { readFileSync  } from 'node:fs';  // What: Read File Sync. Why: Each Fontsource file and its stylesheet are read from the installed package. How: This reads their bytes and text.
import { writeFileSync } from 'node:fs';  // What: Write File Sync. Why: Each pinned font is saved beside the card that loads it. How: This writes its bytes.

// #endregion Imports



/**
 * render.mts = Pinned Font Renderer
 *
 * @summary
 * Rebuilds the Turkeys Away card's Fraunces files from the Fontsource
 * package. Fontsource's full Fraunces files carry every axis the face has
 * (weight, optical size, softness, and wonkiness), about 105 to 150 KB each,
 * while the card sets its lettering at one softness, one optical size, and a
 * few weights. This script pins those axes to the card's values, keeps the
 * weight range the card uses, and keeps every character the Fontsource file
 * covers, read from Fontsource's own unicode-range so the card's @font-face
 * rules stay true. Run it with npm run fonts whenever the package updates or
 * the card's lettering needs another weight.
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

const AXI_PIN_OBJ = { opsz : 144, SOFT : 100, WONK : 0 }; // What: Axis Pin Object. Why: The card's lettering is the soft, display-sized cut with steady letters. How: Each axis is pinned to this value. // What: Optical Size Number. Why: The card's lettering is set large. How: This pins the display-sized cut. // What: Softness Number. Why: The card's lettering is soft. How: This pins the fully soft cut. // What: Wonkiness Number. Why: The card's letters stand steady. How: This pins wonkiness off.



type FonRecTyp = { // What: Font Record Type. Why: Every pinned file is described the same way. How: This names its subset, its style, and the weights it keeps.


	maxNum : number, // What: Maximum Number. Why: The pinned file keeps a range of weights. How: This is the heaviest weight it keeps.
	minNum : number, // What: Minimum Number. Why: The pinned file keeps a range of weights. How: This is the lightest weight it keeps.
	styStr : string, // What: Style String. Why: Upright and italic are separate files. How: This is Fontsource's style name, normal or italic.
	subStr : string  // What: Subset String. Why: Fontsource splits each style by character set. How: This is the subset's name, latin or latin-ext.


};

const FON_REC_ARR : FonRecTyp[] = [ // What: Font Record Array. Why: The card's upright lettering may show a name, while its italic lines are fixed text. How: Each row is one pinned file.


	{ maxNum : 900, minNum : 800, styStr : 'normal', subStr : 'latin'     }, // What: Upright Latin Row. Why: The logo, heading, and labels are set upright at 800 to 900. How: This pins the upright Latin file.
	{ maxNum : 900, minNum : 800, styStr : 'normal', subStr : 'latin-ext' }, // What: Upright Extended Latin Row. Why: The heading carries the recipient's name, which may use a letter such as Ł. How: This pins the upright extended Latin file.
	{ maxNum : 800, minNum : 600, styStr : 'italic', subStr : 'latin'     }  // What: Italic Latin Row. Why: The quote and "Oh, the humanity!" are set in italic at 600 to 800, and neither shows a name. How: This pins the italic Latin file alone.


];



const OUT_DIR_STR = fileURLToPath( new URL( '../../src/cards/turkeys-away/', import.meta.url ) );                     // What: Output Directory String. Why: A card's fonts sit in its own folder, so they load only with it. How: This resolves the card's folder from this script's folder.
const SOU_DIR_STR = fileURLToPath( new URL( '../../node_modules/@fontsource-variable/fraunces/', import.meta.url ) ); // What: Source Directory String. Why: The full Fraunces files come from the installed Fontsource package. How: This resolves the package from this script's folder.

// #endregion Constants



// #region Helpers

// #region uniChaFun

/**
 * uniChaFun = Unicode Characters Function
 *
 * @summary
 * Reads the unicode-range Fontsource gives one of its files and returns every
 * character in it as one string, which tells the subsetter which characters to
 * keep. It expects the stylesheet to declare the file, and throws when it
 * doesn't, so a renamed file can't quietly drop every character.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param cssTexStr - CSS Text String: The Fontsource stylesheet declaring the
 *                    file.
 * @param filNamStr - File Name String: The file whose range is read.
 *
 * @returns Every character in the file's range, as one string.
 *
 * @example
 * ```ts
 * uniChaFun(cssTexStr, 'fraunces-latin-full-normal.woff2') // => ' !"#...'
 * ```
 *
*/

function uniChaFun ( cssTexStr : string, filNamStr : string ) : string {


	const ranMatArr = cssTexStr.split( '@font-face' ).find( ( facBloStr ) => facBloStr.includes( filNamStr ) )?.match( /unicode-range:\s*([^;]+);/ ); // What: Range Match Array. Why: Each file's block names the characters it covers. How: This finds the block declaring the file and captures its unicode-range.


	if ( !ranMatArr ) throw new Error( `no unicode-range found for ${ filNamStr }` ); // What: Missing Range Guard. Why: A file the stylesheet doesn't declare would keep no characters at all. How: This stops the run, naming the file.



	const chaLisArr = ranMatArr[ 1 ].split( ',' ).flatMap( ( ranParStr ) => { // What: Character List Array. Why: The range is a list of single code points and spans. How: This expands each part into its characters.


		const [ staCodNum, endCodNum ] = ranParStr.trim().replace( 'U+', '' ).split( '-' ).map( ( hexValStr ) => parseInt( hexValStr, 16 ) ); // What: Start Code Number. Why: Each part begins at a code point. How: This reads its first hex value. // What: End Code Number. Why: A span ends at a second code point. How: This reads its second hex value, absent for a single code point.



		return Array.from( Array( ( endCodNum ?? staCodNum ) - staCodNum + 1 ).keys(), ( offCodNum ) => String.fromCodePoint( staCodNum + offCodNum ) ); // What: Part Characters Return. Why: The part's characters join the list. How: This builds one character per code point from the start to the end, or the start alone.


	} );



	return chaLisArr.join( '' ); // What: Characters Return. Why: The subsetter takes the characters to keep as one string. How: This joins the list.


}

// #endregion uniChaFun

// #endregion Helpers



// #region Module Init

for ( const fonRecObj of FON_REC_ARR ) { // What: Font Loop. Why: Each pinned file is built the same way. How: This reads, pins, and writes each row's file.


	const cssTexStr = readFileSync( `${ SOU_DIR_STR }full${ fonRecObj.styStr === 'italic' ? '-italic' : '' }.css`, 'utf8' ); // What: CSS Text String. Why: The file's character range is declared in Fontsource's stylesheet. How: This reads the full stylesheet for the row's style.
	const outFilStr = `fraunces-${ fonRecObj.subStr }-soft-${ fonRecObj.styStr }.woff2`;                                     // What: Output File String. Why: The pinned file is named for its subset, its soft cut, and its style. How: This builds the name the card's @font-face rules read.
	const souFilStr = `fraunces-${ fonRecObj.subStr }-full-${ fonRecObj.styStr }.woff2`;                                     // What: Source File String. Why: Fontsource names each full file by subset and style. How: This builds the row's source file name.
	const souBytObj = readFileSync( `${ SOU_DIR_STR }files/${ souFilStr }` );                                                // What: Source Bytes Object. Why: The pinning works on the font's bytes. How: This reads the full file.

	const varAxiObj = { // What: Variation Axes Object. Why: The pinned file keeps only the card's slice of each axis. How: This pins the fixed axes and narrows the weight to the row's range.


		...AXI_PIN_OBJ, // What: Pinned Axes Spread. Why: Softness, optical size, and wonkiness are the same in every pinned file. How: This spreads in their fixed values.

		wght : { max : fonRecObj.maxNum, min : fonRecObj.minNum } // What: Weight Range Object. Why: Each file keeps the weights its lettering uses. How: This narrows the weight axis to the row's range.


	};

	const outBytObj = await subFonFun( souBytObj, uniChaFun( cssTexStr, souFilStr ), { targetFormat : 'woff2', variationAxes : varAxiObj } ); // What: Output Bytes Object. Why: The card needs only its own slice of the font. How: This keeps the file's characters and applies the axes as WOFF2.


	writeFileSync( `${ OUT_DIR_STR }${ outFilStr }`, outBytObj ); // What: Font Write Call. Why: The card loads the pinned file from its folder. How: This saves it there.



	console.log( `${ outFilStr }: ${ souBytObj.length.toLocaleString( 'en-US' ) } bytes pinned to ${ outBytObj.length.toLocaleString( 'en-US' ) } bytes` ); // What: Result Log Call. Why: The run should show what it saved. How: This prints each file's size before and after.


}

// #endregion Module Init


