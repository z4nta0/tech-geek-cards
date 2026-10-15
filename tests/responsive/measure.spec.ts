


// #region Imports

import { expect    } from '@playwright/test';     // What: Expect. Why: Each page passes only when every paragraph keeps its measure. How: This asserts the problem list is empty.
import { opeStaFun } from '../support/states.ts'; // What: Open State Function. Why: Each width is measured settled. How: This loads the page and waits for it.
import { test      } from '@playwright/test';     // What: Test. Why: Each page is its own test. How: This declares them.

// #endregion Imports



/**
 * measure.spec.ts = Measure Spec
 *
 * @summary
 * Checks the text measure rule on every route, each converted card, the 404
 * page, and the open phone menu, in whichever engine the project runs: no line
 * of a paragraph may run past 75 characters, or past 60 for small text
 * (anything set below the 14.572px body size, such as captions and labels).
 * Each paragraph's text is walked one character at a time and split into its
 * rendered lines by where each character lands, so the count is what a reader
 * actually sees at that width, skipping a visually hidden copy meant only for
 * screen readers. The widths run from 320px to 1,920px, with the site's
 * breakpoints and the pixel past each, since a column is at its widest just
 * before a layout switches. Only the upper limits are checked, since narrow
 * screens make shorter lines unavoidable.
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

type MeaCasTyp = { ideStr : string, menBoo : boolean, patStr : string }; // What: Measure Case Type. Why: Each test measures one page in one state. How: This names the case, whether it opens the menu, and its path.

const MEA_CAS_ARR : MeaCasTyp[] = [ // What: Measure Case Array. Why: Every page and the open menu hold paragraphs. How: Each row names a case, whether it opens the menu, and its path.


	{ ideStr : 'home',           menBoo : false, patStr : '/'                   }, // What: Home Case. Why: The home page holds the hero's lead, the steps, the card descriptions, and the banner. How: This measures it as loaded.
	{ ideStr : 'gallery',        menBoo : false, patStr : '/gallery'            }, // What: Gallery Case. Why: The Gallery holds every card's description and the custom card note. How: This measures it as loaded.
	{ ideStr : 'about',          menBoo : false, patStr : '/about'              }, // What: About Case. Why: The About page holds the story and the sister sites' descriptions. How: This measures it as loaded.
	{ ideStr : 'contact',        menBoo : false, patStr : '/contact'            }, // What: Contact Case. Why: The Contact page holds its intro and the sidebar. How: This measures it as loaded.
	{ ideStr : 'not-found',      menBoo : false, patStr : '/missing'            }, // What: Not Found Case. Why: Every unknown address lands on the 404 page. How: This measures an address the site doesn't have.
	{ ideStr : 'christmas',      menBoo : false, patStr : '/merry-christmas'    }, // What: Christmas Case. Why: The Christmas card is the first converted card, and its lettering grows with the screen. How: This measures its finished snowy scene, which reduced motion shows at once.
	{ ideStr : 'birthday',       menBoo : false, patStr : '/happy-birthday'     }, // What: Birthday Case. Why: The Birthday card's message and cake. How: This measures its message, cake, and balloons, still under reduced motion.
	{ ideStr : 'mothers-day',    menBoo : false, patStr : '/mothers-day'        }, // What: Mother's Day Case. Why: The Mother's Day card ends on its greeting over a photo mosaic. How: This measures its finished greeting and mosaic, which reduced motion shows at once.
	{ ideStr : 'fathers-day',    menBoo : false, patStr : '/fathers-day'        }, // What: Father's Day Case. Why: The Father's Day card ends on its greeting over a photo mosaic. How: This measures its finished greeting and mosaic, which reduced motion shows at once.
	{ ideStr : 'fourth-of-july', menBoo : false, patStr : '/fourth-of-july'     }, // What: Fourth Of July Case. Why: The Fourth of July card's flag and lettering center above the bar. How: This measures its finished flag and lettering, which reduced motion shows at once.
	{ ideStr : 'halloween',      menBoo : false, patStr : '/happy-halloween'    }, // What: Halloween Case. Why: The Halloween card's heading, ghosts, and pumpkins share the screen. How: This measures its finished scene, which reduced motion shows at once.
	{ ideStr : 'thanksgiving',   menBoo : false, patStr : '/happy-thanksgiving' }, // What: Thanksgiving Case. Why: The Thanksgiving card's illustrations and message stack on a phone. How: This measures its finished illustrations and message, which reduced motion shows at once.
	{ ideStr : 'menu',           menBoo : true,  patStr : '/'                   }  // What: Menu Case. Why: The open menu ends on its tagline. How: This measures the home page with the menu open.


];



const BOD_MAX_NUM = 75;                                                                            // What: Body Maximum Number. Why: Paragraph text has to land within 45 to 75 characters a line. How: This is the upper limit body text is held to.
const MEN_MAX_NUM = 768;                                                                           // What: Menu Maximum Number. Why: The phone menu exists only up to the site's 768px breakpoint. How: The menu case is measured only at widths up to this.
const SMA_MAX_NUM = 60;                                                                            // What: Small Maximum Number. Why: Small and secondary text has to land within 40 to 60 characters a line. How: This is the upper limit small text is held to.
const SMA_SIZ_NUM = 14;                                                                            // What: Small Size Number. Why: Small text is anything set below the body size of about 14.572px. How: A paragraph whose font size is under this many pixels is held to the small limit.
const WID_LIS_ARR = [ 320, 360, 390, 414, 480, 640, 641, 768, 769, 1024, 1025, 1280, 1440, 1920 ]; // What: Width List Array. Why: A column is at its widest just before a layout switches. How: This lists the responsive suite's widths, the site's breakpoints and the pixel past each included.

// #endregion Constants



// #region Helpers

// #region meaProFun

/**
 * meaProFun = Measure Problems Function
 *
 * @summary
 * Runs inside the page and returns a problem for each visible paragraph
 * whose longest rendered line holds more characters than its limit. Each
 * character's box is read through a range, and a character whose box starts
 * lower than the current line's top by more than half its own height begins
 * a new line, so wrapped lines are counted as drawn. Spaces at a line's end
 * aren't counted. Passed to Playwright's evaluate, so it reads its limits
 * from its argument rather than from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param limSetObj - Limit Settings Object: The body and small limits and
 *                    the size below which text counts as small.
 *
 * @returns Every paragraph past its limit, described by its opening words,
 *          its longest line's length, and its limit.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * page.evaluate(meaProFun, limSetObj) // => [ '"I respond..." 81 > 75' ]
 * ```
 *
*/

function meaProFun ( limSetObj : { bodNum : number, sizNum : number, smaNum : number } ) : string[] {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every paragraph past its limit should be reported. How: This collects them.


	for ( const parCurEle of Array.from( document.querySelectorAll( 'p' ) ) ) { // What: Paragraph Loop. Why: Every paragraph is held to the measure. How: This measures each one in turn.


		const parBoxObj = parCurEle.getBoundingClientRect(); // What: Paragraph Box Object. Why: A hidden paragraph has no lines to count. How: This reads its box.


		if ( !parBoxObj.width || getComputedStyle( parCurEle ).visibility === 'hidden' ) continue; // What: Hidden Paragraph Guard. Why: Only paragraphs a visitor can see are measured. How: This skips one with no width or that's hidden.



		const ranCurObj = document.createRange();                                             // What: Range Current Object. Why: Each character's box is read through a range. How: This is reused for every character.
		const sizPixNum = parseFloat( getComputedStyle( parCurEle ).fontSize );               // What: Size Pixel Number. Why: Small text has a shorter limit. How: This reads the paragraph's font size.
		const limValNum = sizPixNum < limSetObj.sizNum ? limSetObj.smaNum : limSetObj.bodNum; // What: Limit Value Number. Why: Each paragraph is held to the limit for its size. How: This picks the small or the body limit.
		const texWalObj = document.createTreeWalker( parCurEle, NodeFilter.SHOW_TEXT );       // What: Text Walker Object. Why: A paragraph's text can sit in several nodes, inside links and spans. How: This walks every text node in order.

		const linLenArr : number[] = []; // What: Line Length Array. Why: The longest line decides the result. How: This collects each rendered line's character count.

		let linCouNum = 0;   // What: Line Count Number. Why: The current line's characters are counted as the walk goes. How: This holds the running count, trailing spaces trimmed when the line ends.
		let linTopNum = NaN; // What: Line Top Number. Why: A character lower than the current line starts a new one. How: This holds the current line's top, unset until the first character.
		let spaTraNum = 0;   // What: Space Trailing Number. Why: Spaces at a line's end aren't part of what a reader sees. How: This counts the spaces since the last other character.


		for ( let texCurNod = texWalObj.nextNode(); texCurNod; texCurNod = texWalObj.nextNode() ) { // What: Text Node Loop. Why: Every character of the paragraph is placed on a line. How: This walks each text node.


			const texBoxObj = texCurNod.parentElement!.getBoundingClientRect(); // What: Text Box Object. Why: Text in a visually hidden box is for screen readers, not a line anyone sees. How: This reads the box of the element holding the node. // What: Non-Null Note. Why: TypeScript can't see the parent. How: A text node walked inside a paragraph always has a parent element.
			const texValStr = texCurNod.textContent ?? '';                      // What: Text Value String. Why: Each character is read in turn. How: This holds the node's text.


			if ( texBoxObj.width <= 1 && texBoxObj.height <= 1 ) continue; // What: Visually Hidden Guard. Why: A screen-reader copy sits on one unwrapped line in a one-pixel box, which no visitor reads. How: This skips a node whose element is that small.



			for ( let chaIndNum = 0; chaIndNum < texValStr.length; chaIndNum++ ) { // What: Character Loop. Why: Each character lands on one line. How: This measures each in turn.


				ranCurObj.setStart( texCurNod, chaIndNum ); // What: Range Start Call. Why: The range has to cover one character. How: This starts it at the character.

				ranCurObj.setEnd( texCurNod, chaIndNum + 1 ); // What: Range End Call. Why: The range has to cover one character. How: This ends it just after.


				const chaBoxObj = ranCurObj.getBoundingClientRect(); // What: Character Box Object. Why: Where the character lands says which line it's on. How: This reads its box.


				if ( !chaBoxObj.height ) continue; // What: Collapsed Character Guard. Why: Collapsed whitespace isn't drawn. How: This skips a character with no box.



				if ( Number.isNaN( linTopNum ) || chaBoxObj.top > linTopNum + chaBoxObj.height / 2 ) { // What: New Line Check. Why: A character well below the current line starts the next one. How: This closes the current line and opens a new one at this character.


					if ( !Number.isNaN( linTopNum ) ) linLenArr.push( linCouNum - spaTraNum ); // What: Line Close Call. Why: The finished line's length is kept. How: This stores its count without its trailing spaces.



					linCouNum = 0; // What: Line Count Reset. Why: The new line starts empty. How: This clears the count.

					linTopNum = chaBoxObj.top; // What: Line Top Set. Why: Later characters are compared with the new line. How: This stores its top.

					spaTraNum = 0; // What: Trailing Space Reset. Why: The new line has no trailing spaces yet. How: This clears the count.


				}



				linCouNum++; // What: Line Count Step. Why: The character belongs to the current line. How: This counts it.

				spaTraNum = /\s/.test( texValStr[ chaIndNum ] ) ? spaTraNum + 1 : 0; // What: Trailing Space Step. Why: Only spaces at the very end of a line are trimmed. How: This counts a space and resets on anything else.


			}


		}



		if ( !Number.isNaN( linTopNum ) ) linLenArr.push( linCouNum - spaTraNum ); // What: Last Line Close Call. Why: The paragraph's last line ends with its text. How: This stores its count.



		const maxLenNum = Math.max( 0, ...linLenArr ); // What: Maximum Length Number. Why: The longest line decides the result. How: This takes the largest count.


		if ( maxLenNum > limValNum ) proLisArr.push( `"${ ( parCurEle.textContent ?? '' ).trim().slice( 0, 40 ) }..." ${ maxLenNum } > ${ limValNum }` ); // What: Measure Check. Why: A line past the limit is too long to read comfortably. How: This records the paragraph's opening words, its longest line, and its limit.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion meaProFun

// #endregion Helpers



// #region Module Init

test.use( { reducedMotion : 'reduce' } ); // What: Reduced Motion Use. Why: Entrance animations would otherwise still be moving text when it's measured. How: This makes every page in this file match prefers-reduced-motion: reduce.



for ( const meaCasObj of MEA_CAS_ARR ) { // What: Case Test Loop. Why: Every page and the open menu are checked. How: This declares one test per case.


	test( `${ meaCasObj.ideStr } keeps every paragraph within its measure`, async ( { page : curPagObj } ) => { // What: Measure Test. Why: Long lines are hard to read at any width. How: This measures the case at each width and collects every problem.


		test.slow(); // What: Slow Test Mark. Why: Each case is measured at up to fourteen widths, one character at a time. How: This triples the test's timeout.


		const proAllArr : string[] = []; // What: Problem All Array. Why: Every width's problems are reported together. How: This collects them.


		for ( const widValNum of WID_LIS_ARR.filter( ( widCurNum ) => !meaCasObj.menBoo || widCurNum <= MEN_MAX_NUM ) ) { // What: Width Loop. Why: Each width lays the text out differently. How: This measures the case at every width, the menu only where it exists.


			await opeStaFun( curPagObj, { // What: Case Open Call. Why: The text is measured settled. How: This opens the case's path at the width, opening the menu first for the menu case.


				heiNum : 900,              // What: Height Number. Why: Only the width changes how text wraps. How: Every case is measured at the same height.
				ideStr : meaCasObj.ideStr, // What: Identifier String. Why: The state names its case. How: This reuses the case's name.
				patStr : meaCasObj.patStr, // What: Path String. Why: The state opens the case's route. How: This reuses the case's path.
				widNum : widValNum,        // What: Width Number. Why: The width is what this test varies. How: This sizes the viewport to the loop's width.

				...( meaCasObj.menBoo ? { actFun : async ( actPagObj ) => { await actPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); } } : {} ) // What: Menu Action Spread. Why: Only the menu case opens the menu. How: This adds the toggle click as the state's action for that case.


			} );


			const proWidArr = await curPagObj.evaluate( meaProFun, { bodNum : BOD_MAX_NUM, sizNum : SMA_SIZ_NUM, smaNum : SMA_MAX_NUM } ); // What: Problem Width Array. Why: This width's problems are collected. How: This measures every paragraph in the page.


			proAllArr.push( ...proWidArr.map( ( proCurStr ) => `${ widValNum }px ${ proCurStr }` ) ); // What: Problem Record Call. Why: A problem should say the width it appeared at. How: This prefixes each with the width.


		}



		expect( proAllArr ).toEqual( [] ); // What: No Measure Problems Assertion. Why: The case passes only when every paragraph keeps its measure. How: This compares the problems with an empty list, so a failure prints each one.


	} );


}

// #endregion Module Init


