


// #region Imports

import { expect      } from '@playwright/test';          // What: Expect. Why: Each page passes only when its grids keep their rows. How: This asserts each problem list is empty.
import { OCC_NAM_ARR } from '../../src/ui/card-data.ts'; // What: Occasion Name Array. Why: The Gallery's grid is checked under every occasion filter. How: This lists the occasions its filter offers.
import { opeStaFun   } from '../support/states.ts';      // What: Open State Function. Why: Each width is measured settled. How: This loads the page and waits for it.
import { test        } from '@playwright/test';          // What: Test. Why: Each page is its own test. How: This declares them.

// #endregion Imports



/**
 * grid.spec.ts = Grid Spec
 *
 * @summary
 * Checks the rows of the site's card grids across the same widths as the
 * layout spec, in whichever engine the project runs, per the Card Grids rule.
 * An even grid has the same number of cards in every row, and the Gallery,
 * exempt as its cards change with the search and the filter, keeps every row
 * but its last full and centers that last row at the others' card width,
 * unfiltered at every width and under each occasion filter at a few. Pages
 * open under reduced motion, so no card is measured mid-entrance.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type GriCasTyp = { // What: Grid Case Type. Why: Each case names a grid and how its rows are judged. How: This holds the grid's class and whether its last row is centered.


	cenBoo : boolean, // What: Centered Boolean. Why: The Gallery's last row may be short and centered, while every other grid keeps even rows. How: This is true for the Gallery.
	claStr : string   // What: Class String. Why: The grid is found by its module class. How: This is the class name the hashed class contains.


};

// #endregion Types



// #region Constants

const FIL_WID_ARR = [ 390, 768, 1440 ];                                                            // What: Filter Width Array. Why: Each occasion filter changes the Gallery's count, and the Card Grids rule checks every filter at a few widths. How: This lists a phone, a tablet, and a desktop width, one per column count.
const WID_LIS_ARR = [ 320, 360, 390, 414, 480, 640, 641, 768, 769, 1024, 1025, 1280, 1440, 1920 ]; // What: Width List Array. Why: A grid changes its columns at the breakpoints. How: This lists the layout spec's widths, a pixel either side of each of the site's 640px, 768px, and 1,024px breakpoints included.

const PAG_GRI_ARR : { griArr : GriCasTyp[], patStr : string }[] = [ // What: Page Grid Array. Why: Each page with a card grid is checked at every width. How: Each row names a page and its grids.


	{ griArr : [ { cenBoo : false, claStr : 'steLisOrd' }, { cenBoo : false, claStr : 'feaGriDiv' } ], patStr : '/'        }, // What: Home Row. Why: Home's steps and featured cards each keep even rows. How: This checks both grids.
	{ griArr : [ { cenBoo : false, claStr : 'facLisUno' }, { cenBoo : false, claStr : 'famLisUno' } ], patStr : '/about'   }, // What: About Row. Why: About's facts and sister sites each keep even rows. How: This checks both grids.
	{ griArr : [ { cenBoo : true,  claStr : 'galGriDiv' }                                            ], patStr : '/gallery' }  // What: Gallery Row. Why: The Gallery's rows wrap with a centered last row. How: This checks its one grid.


];

// #endregion Constants



// #region Helpers

// #region griProFun

/**
 * griProFun = Grid Problems Function
 *
 * @summary
 * Runs in the page and lists what's wrong with one grid's rows. It groups the
 * grid's shown children by the top of their boxes, then reports a missing
 * grid, rows of different lengths, or, for a centered grid, a row before the
 * last that differs from the first, a last row sitting more than a pixel
 * off center, or a last-row card more than a pixel off the first row's
 * width.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param griCasObj - Grid Case Object: The grid to check and how.
 *
 * @returns The problems found, as short findings, empty when the rows hold.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * griProFun({ cenBoo: false, claStr: 'feaGriDiv' }) // => []
 * ```
 *
*/

function griProFun ( griCasObj : GriCasTyp ) : string[] {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem is reported together. How: Each finding is pushed here.

	const griCurEle = document.querySelector( `[class*="${ griCasObj.claStr }"]` ); // What: Grid Current Element. Why: The rows are read from the grid's children. How: This finds the grid by the class its hashed class contains.



	if ( !griCurEle ) return [ `grid "${ griCasObj.claStr }" is missing` ]; // What: Missing Grid Guard. Why: A grid that isn't there can't be measured, and a renamed class shouldn't pass quietly. How: This reports it and stops.



	const rowMapObj = new Map< number, DOMRect[] >(); // What: Row Map Object. Why: Children sharing a top edge form one row. How: This maps each rounded top to its children's boxes.



	for ( const chiCurEle of griCurEle.children ) { // What: Child Loop. Why: Every shown child belongs to one row. How: This files each child's box under its rounded top.


		const chiRecObj = chiCurEle.getBoundingClientRect(); // What: Child Rect Object. Why: The child's place decides its row. How: This reads its box.



		if ( chiRecObj.width === 0 ) continue; // What: Hidden Child Guard. Why: A child that isn't drawn sits in no row. How: This skips it.



		rowMapObj.set( Math.round( chiRecObj.top ), [ ...( rowMapObj.get( Math.round( chiRecObj.top ) ) ?? [] ), chiRecObj ] ); // What: Row Entry Set. Why: The child joins the row at its top edge. How: This adds its box to that row's list.


	}



	const rowLisArr = [ ...rowMapObj.entries() ].sort( ( rowOneArr, rowTwoArr ) => rowOneArr[ 0 ] - rowTwoArr[ 0 ] ).map( ( rowCurArr ) => rowCurArr[ 1 ] ); // What: Row List Array. Why: The rows are judged top to bottom. How: This sorts them by their top and keeps their boxes.
	const rowLenArr = rowLisArr.map( ( rowRecArr ) => rowRecArr.length );                                                                                     // What: Row Length Array. Why: The rows' lengths show whether they're even. How: This counts each row's children.



	if ( !griCasObj.cenBoo && new Set( rowLenArr ).size > 1 ) proLisArr.push( `grid "${ griCasObj.claStr }" has rows of ${ rowLenArr.join( ', ' ) }` ); // What: Uneven Rows Check. Why: An even grid holds the same number of cards in every row. How: This reports the row lengths when they differ.

	if ( griCasObj.cenBoo && rowLenArr.slice( 0, -1 ).some( ( rowLenNum ) => rowLenNum !== rowLenArr[ 0 ] ) ) proLisArr.push( `grid "${ griCasObj.claStr }" has a short row before its last, ${ rowLenArr.join( ', ' ) }` ); // What: Short Row Check. Why: Only the Gallery's last row may be short. How: This reports a row before the last that differs from the first.



	if ( griCasObj.cenBoo && rowLisArr.length > 0 ) { // What: Centered Last Row Check. Why: The Gallery's last row sits centered under the rows above it. How: This compares the space left and right of the last row inside the grid, and its cards' width with the first row's.


		const firWidNum = rowLisArr[ 0 ][ 0 ].width;                                                         // What: First Width Number. Why: A leftover card keeps the others' width rather than stretching across its row. How: This is the first row's first card's width.
		const griRecObj = griCurEle.getBoundingClientRect();                                                 // What: Grid Rect Object. Why: The last row is centered within the grid. How: This reads the grid's box.
		const lasRowArr = rowLisArr[ rowLisArr.length - 1 ];                                                 // What: Last Row Array. Why: Only the last row may be short. How: This is its boxes.
		const lefGapNum = Math.min( ...lasRowArr.map( ( recCurObj ) => recCurObj.left ) ) - griRecObj.left;   // What: Left Gap Number. Why: A centered row leaves the same room on both sides. How: This is the room before its first child.
		const rigGapNum = griRecObj.right - Math.max( ...lasRowArr.map( ( recCurObj ) => recCurObj.right ) ); // What: Right Gap Number. Why: A centered row leaves the same room on both sides. How: This is the room after its last child.


		if ( Math.abs( lefGapNum - rigGapNum ) > 1 ) proLisArr.push( `grid "${ griCasObj.claStr }" has its last row ${ Math.round( lefGapNum - rigGapNum ).toLocaleString( 'en-US' ) }px off center` ); // What: Off Center Check. Why: A last row more than a pixel off center reads as left hanging. How: This reports how far off it sits.



		for ( const recCurObj of lasRowArr ) if ( Math.abs( recCurObj.width - firWidNum ) > 1 ) proLisArr.push( `grid "${ griCasObj.claStr }" has a last-row card ${ Math.round( recCurObj.width ).toLocaleString( 'en-US' ) }px wide against ${ Math.round( firWidNum ).toLocaleString( 'en-US' ) }px above` ); // What: Leftover Width Loop. Why: A stretched leftover card would still read as centered, while the rule keeps it at the others' width. How: This reports any last-row card more than a pixel wider or narrower than the first row's.


	}



	return proLisArr; // What: Problem List Return. Why: The test compares the findings with an empty list. How: This hands them back.


}

// #endregion griProFun

// #endregion Helpers



// #region Module Init

test.use( { reducedMotion : 'reduce' } ); // What: Reduced Motion Use. Why: A card mid-entrance sits lower than its row. How: This makes each page match prefers-reduced-motion, which skips the entrances.



for ( const pagGriObj of PAG_GRI_ARR ) { // What: Page Loop. Why: Each page with a card grid is checked. How: This declares one test per page.


	test( `${ pagGriObj.patStr } keeps its card grids' rows at every width`, async ( { page : curPagObj } ) => { // What: Grid Rows Test. Why: A short last row left by a column count that doesn't divide the cards breaks the grid. How: This opens the page at each width and lists its grids' row problems.


		test.slow(); // What: Slow Test Mark. Why: Opening the page at 14 widths can run past the default 30 second timeout when the machine is busy. How: This triples this test's timeout.



		const proLisArr : string[] = []; // What: Problem List Array. Why: Every width's problems are reported together. How: Each finding is pushed here with its width.



		for ( const widCurNum of WID_LIS_ARR ) { // What: Width Loop. Why: A grid's columns change at the breakpoints. How: This opens the page at each width and collects its problems.


			await opeStaFun( curPagObj, { heiNum : 900, ideStr : `grid-${ widCurNum }`, patStr : pagGriObj.patStr, widNum : widCurNum } ); // What: Page Open Call. Why: The rows are measured settled. How: This opens the page at the width.



			for ( const griCasObj of pagGriObj.griArr ) proLisArr.push( ...( await curPagObj.evaluate( griProFun, griCasObj ) ).map( ( proCurStr ) => `${ proCurStr } at ${ widCurNum.toLocaleString( 'en-US' ) }px` ) ); // What: Grid Problems Loop. Why: Each grid on the page is judged at this width. How: This runs the check in the page and tags each finding with the width.


		}



		expect( proLisArr ).toEqual( [] ); // What: No Grid Problems Assertion. Why: The page passes only with every grid's rows holding at every width. How: This compares the findings with an empty list, so a failure prints each one.


	} );


}



for ( const occNamStr of OCC_NAM_ARR ) { // What: Occasion Loop. Why: A chosen occasion narrows the Gallery's grid to a count of its own, where a short last row is most likely. How: This declares one test per occasion.


	test( `the Gallery keeps its rows with "${ occNamStr }" chosen`, async ( { page : curPagObj } ) => { // What: Filtered Grid Test. Why: The Gallery's centered last row has to hold for every count a filter leaves. How: This opens the Gallery at each filter width, chooses the occasion, and lists the grid's row problems.


		const proLisArr : string[] = []; // What: Problem List Array. Why: Every width's problems are reported together. How: Each finding is pushed here with its width.



		for ( const widCurNum of FIL_WID_ARR ) { // What: Width Loop. Why: The narrowed grid is checked at each column count. How: This opens the Gallery at each width, chooses the occasion, and collects its problems.


			await opeStaFun( curPagObj, { heiNum : 900, ideStr : `grid-${ occNamStr }-${ widCurNum }`, patStr : '/gallery', widNum : widCurNum } ); // What: Gallery Open Call. Why: The rows are measured settled. How: This opens the Gallery at the width.

			await curPagObj.getByRole( 'button', { exact : true, name : occNamStr } ).click(); // What: Occasion Click Call. Why: The filter narrows the grid. How: This presses the occasion's button.

			await expect( curPagObj.getByRole( 'button', { exact : true, name : occNamStr } ) ).toHaveAttribute( 'aria-pressed', 'true' ); // What: Chosen Filter Assertion. Why: The grid is measured only once the filter has applied. How: This waits until the occasion's button reads as chosen.

			proLisArr.push( ...( await curPagObj.evaluate( griProFun, { cenBoo : true, claStr : 'galGriDiv' } ) ).map( ( proCurStr ) => `${ proCurStr } at ${ widCurNum.toLocaleString( 'en-US' ) }px` ) ); // What: Grid Problems Call. Why: The narrowed grid is judged at this width. How: This runs the check in the page and tags each finding with the width.


		}



		expect( proLisArr ).toEqual( [] ); // What: No Grid Problems Assertion. Why: The Gallery passes only with its rows holding for this occasion at every width. How: This compares the findings with an empty list, so a failure prints each one.


	} );


}

// #endregion Module Init


