


// #region Imports

import { expect    } from '@playwright/test';     // What: Expect. Why: Each width passes only when its layout holds together. How: This asserts each problem list is empty.
import { opeStaFun } from '../support/states.ts'; // What: Open State Function. Why: Each width is measured settled. How: This loads the page and waits for it.
import { test      } from '@playwright/test';     // What: Test. Why: Each page at each width is its own test. How: This declares them.

// #endregion Imports



/**
 * layout.spec.ts = Layout Spec
 *
 * @summary
 * Measures every route, every card, the 404 page, and the open mobile menu
 * across a range of screen widths, in whichever engine the project runs, and
 * fails a width whose layout breaks: the page scrolling sideways, a visible
 * element reaching past either edge of the screen (unless an ancestor clips it
 * on purpose), text spilling out of its own box, or two controls a visitor can
 * reach overlapping each other. The widths run from 320px, WCAG's narrowest
 * reflow width, to 1,920px, and include a pixel either side of each of the
 * site's breakpoints, where a layout switches and is most likely to crowd.
 * Pages open under reduced motion, which changes nothing about the layout but
 * skips the wait for entrance animations.
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

type LayCasTyp = { // What: Layout Case Type. Why: Each test measures one page in one state. How: This names the case, its path, and whether it opens the menu.


	ideStr : string,  // What: Identifier String. Why: Each test names the case it measures. How: This becomes part of the test title.
	menBoo : boolean, // What: Menu Boolean. Why: The open menu is measured as its own case. How: This is true when the case opens it.
	patStr : string   // What: Path String. Why: Each case opens one route. How: This is the path loaded from the dev server.


};

const LAY_CAS_ARR : LayCasTyp[] = [ // What: Layout Case Array. Why: Every page and the open menu are measured the same way. How: Each row names a case, its path, and whether it opens the menu.


	{ ideStr : 'home',              menBoo : false, patStr : '/'                      }, // What: Home Case. Why: The home page holds the envelope hero, the steps, the featured cards, and the postcard banner. How: This measures it as loaded.
	{ ideStr : 'gallery',           menBoo : false, patStr : '/gallery'               }, // What: Gallery Case. Why: The Gallery holds the search, the filters, and every card tile. How: This measures it as loaded.
	{ ideStr : 'about',             menBoo : false, patStr : '/about'                 }, // What: About Case. Why: The About page holds the story, the facts, and the sister sites. How: This measures it as loaded.
	{ ideStr : 'contact',           menBoo : false, patStr : '/contact'               }, // What: Contact Case. Why: The Contact page holds the form and the sidebar. How: This measures it as loaded.
	{ ideStr : 'not-found',         menBoo : false, patStr : '/missing'               }, // What: Not Found Case. Why: Every unknown address lands on the 404 page. How: This measures an address the site doesn't have.
	{ ideStr : 'christmas',         menBoo : false, patStr : '/merry-christmas'       }, // What: Christmas Case. Why: The Christmas card is the first converted card, and its lettering grows with the screen. How: This measures its finished snowy scene, which reduced motion shows at once.
	{ ideStr : 'birthday',          menBoo : false, patStr : '/happy-birthday'        }, // What: Birthday Case. Why: The Birthday card's message, cake, and balloons share the screen. How: This measures its message, cake, and balloons, still under reduced motion.
	{ ideStr : 'mothers-day',       menBoo : false, patStr : '/mothers-day'           }, // What: Mother's Day Case. Why: The Mother's Day card ends on its greeting over a photo mosaic. How: This measures its finished greeting and mosaic, which reduced motion shows at once.
	{ ideStr : 'fathers-day',       menBoo : false, patStr : '/fathers-day'           }, // What: Father's Day Case. Why: The Father's Day card ends on its greeting over a photo mosaic. How: This measures its finished greeting and mosaic, which reduced motion shows at once.
	{ ideStr : 'fourth-of-july',    menBoo : false, patStr : '/fourth-of-july'        }, // What: Fourth Of July Case. Why: The Fourth of July card's flag and lettering center above the bar. How: This measures its finished flag and lettering, which reduced motion shows at once.
	{ ideStr : 'halloween',         menBoo : false, patStr : '/happy-halloween'       }, // What: Halloween Case. Why: The Halloween card's heading, ghosts, and pumpkins share the screen. How: This measures its finished scene, which reduced motion shows at once.
	{ ideStr : 'thanksgiving',      menBoo : false, patStr : '/happy-thanksgiving'    }, // What: Thanksgiving Case. Why: The Thanksgiving card's illustrations and message stack on a phone. How: This measures its finished illustrations and message, which reduced motion shows at once.
	{ ideStr : 'christmas-prank',   menBoo : false, patStr : '/merry-christmas-prank' }, // What: Christmas Prank Case. Why: The Christmas prank opens on a fake hacked screen no other card shows. How: This measures its finished snowy scene, which reduced motion shows at once.
	{ ideStr : 'fathers-day-prank', menBoo : false, patStr : '/fathers-day-prank'     }, // What: Father's Day Prank Case. Why: The Father's Day prank shares the Family engine with its own photos and lines. How: This measures its finished greeting and mosaic, which reduced motion shows at once.
	{ ideStr : 'menu',              menBoo : true,  patStr : '/'                      }  // What: Menu Case. Why: The open menu stacks the page links its own way. How: This measures the home page with the menu open.


];



const MEN_MAX_NUM = 768;                                                                           // What: Menu Maximum Number. Why: The mobile menu exists only up to the site's 768px breakpoint. How: The menu case is measured only at widths up to this.
const WID_LIS_ARR = [ 320, 360, 390, 414, 480, 640, 641, 768, 769, 1024, 1025, 1280, 1440, 1920 ]; // What: Width List Array. Why: Layouts crowd at the narrowest widths and switch at the breakpoints. How: This lists common screen widths (480px a landscape phone, 1,280px a laptop) plus the site's 640px, 768px, and 1,024px breakpoints and the pixel past each.

// #endregion Constants



// #region Helpers

// #region layProFun

/**
 * layProFun = Layout Problems Function
 *
 * @summary
 * Runs inside the page and returns every layout problem it finds, each naming
 * the element by its tag and its first class (just the readable part, once
 * that class comes from a hashed CSS module). The page scrolling sideways is
 * one problem. A visible element counts as spilling past an edge when it
 * reaches more than a pixel beyond the viewport and no ancestor clips its
 * overflow. An element with text of its own spills its box when a line of that
 * text runs more than a pixel past either inner edge and it doesn't clip or
 * scroll its content; a decoration drawn past the text on purpose doesn't
 * count, and inline elements are skipped, since they have no box width of
 * their own. Two reachable controls (links and buttons that are visible, in
 * the tab order, and not inside inert content) overlap when their boxes share
 * more than a pixel of area and neither holds the other. Passed to
 * Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns Every layout problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * page.evaluate(layProFun) // => [ 'a.braLogAnc overlaps button.menTogBut' ]
 * ```
 *
*/

function layProFun () : string[] {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.

	const vieWidNum = document.documentElement.clientWidth; // What: Viewport Width Number. Why: Edges and sideways scrolling are measured against the visible width. How: This reads the root's width without its scrollbar.



	const desEleFun = ( desCurEle : Element ) => `${ desCurEle.tagName.toLowerCase() }${ desCurEle.classList.length ? '.' + ( desCurEle.classList[ 0 ].split( '_' )[ 1 ] || desCurEle.classList[ 0 ] ) : '' }`; // What: Describe Element Function. Why: A problem should name the element in terms of the source. How: This joins the tag with its first class, keeping only the readable part when it's a hashed module class.


	const cliAncFun = ( cliCurEle : Element ) => { // What: Clipped Ancestor Function. Why: An element an ancestor clips can reach past the edge without showing there. How: This reports whether any ancestor hides, clips, or scrolls its overflow.


		for ( let ancCurEle = cliCurEle.parentElement; ancCurEle; ancCurEle = ancCurEle.parentElement ) if ( getComputedStyle( ancCurEle ).overflowX !== 'visible' ) return true; // What: Ancestor Overflow Loop. Why: Any clipping ancestor contains the element. How: This walks up the tree and returns as soon as one doesn't show its overflow.



		return false; // What: Unclipped Return. Why: No ancestor clips the element, so its spill would show. How: This reports that none was found.


	};


	const texSpiFun = ( texCurEle : Element ) => { // What: Text Spill Function. Why: Only the element's own text running out of its box is a spill, not a decoration drawn past it on purpose, such as an underline or highlight reaching past an italic line. How: This measures every line of the element's own text and reports whether any runs more than a pixel past either inner edge of its box.


		const boxRecObj = texCurEle.getBoundingClientRect();                                                                       // What: Box Rect Object. Why: The text is measured against the element's own box. How: This measures the box.
		const ranTexObj = document.createRange();                                                                                  // What: Range Text Object. Why: A range measures text by its lines rather than by the element's box. How: This creates one to point at each text node in turn.
		const sizRatNum = texCurEle instanceof HTMLElement && texCurEle.offsetWidth ? boxRecObj.width / texCurEle.offsetWidth : 1; // What: Size Ratio Number. Why: An element grown by a transform (a card's greeting) is drawn larger than its layout width, while its border and inner width are read unscaled. How: This is its drawn width over its layout width, 1 when it isn't scaled.
		const boxLefNum = boxRecObj.left + texCurEle.clientLeft * sizRatNum;                                                       // What: Box Left Number. Why: Text may reach the padding but not the border. How: This is the inner left edge, just inside the left border, scaled as drawn.
		const boxRigNum = boxLefNum + texCurEle.clientWidth * sizRatNum;                                                           // What: Box Right Number. Why: Text may reach the padding but not the border. How: This is the inner right edge, the inner width past the left one, scaled as drawn.


		for ( const chiCurNod of texCurEle.childNodes ) { // What: Text Node Loop. Why: Only the element's own text counts, since each child element is measured on its own. How: This walks the element's direct children.


			if ( chiCurNod.nodeType !== Node.TEXT_NODE ) continue; // What: Text Node Guard. Why: Child elements aren't the element's own text. How: This skips anything that isn't a text node.



			ranTexObj.selectNodeContents( chiCurNod ); // What: Range Select Call. Why: The range has to cover this text node's lines. How: This points the range at the node's whole text.


			for ( const linRecObj of ranTexObj.getClientRects() ) if ( linRecObj.right > boxRigNum + 1 || linRecObj.left < boxLefNum - 1 ) return true; // What: Line Spill Loop. Why: Any one line past an inner edge is a spill. How: This checks each line's box and returns as soon as one runs more than a pixel past either edge.


		}



		return false; // What: No Spill Return. Why: Every line of the element's own text fits its box. How: This reports that none ran past an edge.


	};



	const visHidFun = ( hidCurEle : Element | null ) : boolean => !!hidCurEle && ( ( hidCurEle.getBoundingClientRect().width <= 1 && hidCurEle.getBoundingClientRect().height <= 1 ) || visHidFun( hidCurEle.parentElement ) ); // What: Visually Hidden Function. Why: A screen-reader copy sits in a one-pixel clipped box, where its text runs past by design and no visitor sees it. How: This reports whether the element or any ancestor is a box of one pixel or less.



	if ( document.documentElement.scrollWidth > vieWidNum ) proLisArr.push( `the page scrolls sideways by ${ document.documentElement.scrollWidth - vieWidNum }px` ); // What: Sideways Scroll Check. Why: Nobody should have to scroll sideways to read the page. How: This records how far the page reaches past the visible width.



	for ( const layCurEle of document.body.querySelectorAll( '*' ) ) { // What: Element Loop. Why: Any element can spill. How: This measures each one in turn.


		const recCurObj = layCurEle.getBoundingClientRect(); // What: Rect Current Object. Why: Edges are judged from the element's box. How: This measures it.
		const styCurObj = getComputedStyle( layCurEle );     // What: Style Current Object. Why: Hidden and inline elements are judged differently. How: This reads its computed styles.

		const zerWidBoo = !recCurObj.width;                   // What: Zero Width Boolean. Why: An element with no width takes no room. How: This checks its box has no width.
		const zerHeiBoo = !recCurObj.height;                  // What: Zero Height Boolean. Why: An element with no height takes no room. How: This checks its box has no height.
		const hidStyBoo = styCurObj.visibility !== 'visible'; // What: Hidden Style Boolean. Why: A hidden element doesn't show. How: This checks its computed visibility.
		const visHidBoo = visHidFun( layCurEle );             // What: Visually Hidden Boolean. Why: A screen-reader copy doesn't show either. How: This checks for a one-pixel box at or above the element.

		const invEleBoo = zerWidBoo || zerHeiBoo || hidStyBoo || visHidBoo; // What: Invisible Element Boolean. Why: Any one of these means the element can't break the layout. How: This combines them.


		if ( invEleBoo ) continue; // What: Invisible Element Guard. Why: An element that takes no room or doesn't show can't break the layout. How: This skips it.



		const rigSpiBoo = recCurObj.right > vieWidNum + 1; // What: Right Spill Boolean. Why: Content past the right edge is cut off or forces sideways scrolling. How: This checks the box reaches more than a pixel beyond the viewport's right.
		const lefSpiBoo = recCurObj.left < -1;             // What: Left Spill Boolean. Why: Content past the left edge is cut off. How: This checks the box starts more than a pixel before the viewport.
		const ancCliBoo = cliAncFun( layCurEle );          // What: Ancestor Clipped Boolean. Why: An element an ancestor clips doesn't show past the edge. How: This checks for a clipping ancestor.

		const edgSpiBoo = ( rigSpiBoo || lefSpiBoo ) && !ancCliBoo; // What: Edge Spill Boolean. Why: Only an unclipped element past an edge breaks the layout. How: This combines them.


		if ( edgSpiBoo ) proLisArr.push( `${ desEleFun( layCurEle ) } spills past the ${ rigSpiBoo ? 'right' : 'left' } edge` ); // What: Edge Spill Check. Why: Content past the edge is cut off or forces sideways scrolling. How: This records an unclipped element that reaches more than a pixel beyond the viewport.



		const ownTexBoo = [ ...layCurEle.childNodes ].some( ( chiCurNod ) => chiCurNod.nodeType === Node.TEXT_NODE && !!chiCurNod.textContent?.trim() ); // What: Own Text Boolean. Why: Only an element holding text itself can spill it. How: This checks its direct children for text that isn't just whitespace.
		const spiBoxBoo = texSpiFun( layCurEle ); // What: Spill Box Boolean. Why: Text running past its box has spilled out of it. How: This checks whether any line of the element's own text runs past an inner edge.
		const visOveBoo = styCurObj.overflowX === 'visible';                                                                                             // What: Visible Overflow Boolean. Why: Content a box clips or scrolls on purpose isn't a spill. How: This checks the box shows its overflow.
		const bloBoxBoo = styCurObj.display !== 'inline';                                                                                                // What: Block Box Boolean. Why: An inline element has no box width to compare with. How: This checks it isn't inline.

		const texSpiBoo = ownTexBoo && spiBoxBoo && visOveBoo && bloBoxBoo; // What: Text Spill Boolean. Why: All four together mean text has spilled out of its box. How: This combines them.


		if ( texSpiBoo ) proLisArr.push( `${ desEleFun( layCurEle ) } spills its text past its box` ); // What: Text Spill Check. Why: Text outside its box overlaps its neighbors or gets cut off. How: This records the element.


	}



	const conEleArr = [ ...document.querySelectorAll( 'a, button' ) ].filter( ( conCurEle ) => { // What: Control Element Array. Why: Only controls a visitor can see and reach have to stay apart. How: This keeps every link and button that's visible, in the tab order, and outside inert content.


		const tabOrdBoo = conCurEle.getAttribute( 'tabindex' ) !== '-1';          // What: Tab Order Boolean. Why: A control taken out of the tab order can't be reached. How: This checks it isn't tabindex -1.
		const notIneBoo = !conCurEle.closest( '[inert]' );                        // What: Not Inert Boolean. Why: Controls inside inert content can't be reached. How: This checks no ancestor is inert.
		const visStyBoo = getComputedStyle( conCurEle ).visibility === 'visible'; // What: Visible Style Boolean. Why: A hidden control can't be seen. How: This checks its computed visibility.
		const hasWidBoo = conCurEle.getBoundingClientRect().width > 0;            // What: Has Width Boolean. Why: A control with no width takes no room. How: This checks its box has width.

		const reaConBoo = tabOrdBoo && notIneBoo && visStyBoo && hasWidBoo; // What: Reachable Control Boolean. Why: All four together mean a visitor can see and reach the control. How: This combines them.



		return reaConBoo; // What: Reachable Control Return. Why: The filter keeps only reachable controls. How: This keeps the control when it's reachable.


	} );


	const expFraFun = ( expCurEle : Element ) : number => { // What: Exposed Fraction Function. Why: A control a floating bar crosses still works when enough of it stays uncovered. How: This samples a grid of points over the control and returns the share where the control itself is on top.


		const expRecObj = expCurEle.getBoundingClientRect(); // What: Exposed Rect Object. Why: The samples cover the control's own box. How: This measures it.
		const samPoiArr = [ 0.1, 0.3, 0.5, 0.7, 0.9 ];        // What: Sample Point Array. Why: Five fractions across each side make an even grid of 25 points. How: Each fraction places a sample across the box.
		const hitCouNum = samPoiArr.flatMap( ( xcoFraNum ) => samPoiArr.map( ( ycoFraNum ) => document.elementFromPoint( expRecObj.left + expRecObj.width * xcoFraNum, expRecObj.top + expRecObj.height * ycoFraNum ) ) ).filter( ( hitCurEle ) => !!hitCurEle && expCurEle.contains( hitCurEle ) ).length; // What: Hit Count Number. Why: Each sample the control wins is a spot a visitor can tap. How: This counts the samples whose top element is the control or inside it.



		return hitCouNum / ( samPoiArr.length * samPoiArr.length ); // What: Exposed Fraction Return. Why: The caller compares the share with its limit. How: This divides the hits by the 25 samples.


	};



	conEleArr.forEach( ( oneCurEle, oneIndNum ) => conEleArr.slice( oneIndNum + 1 ).forEach( ( twoCurEle ) => { // What: Control Pair Loop. Why: Overlap is a property of two controls. How: This visits every pair once.


		const oneRecObj = oneCurEle.getBoundingClientRect();                                                         // What: One Rect Object. Why: The pair's overlap is measured from both boxes. How: This measures the first.
		const twoRecObj = twoCurEle.getBoundingClientRect();                                                         // What: Two Rect Object. Why: The pair's overlap is measured from both boxes. How: This measures the second.
		const oveWidNum = Math.min( oneRecObj.right, twoRecObj.right ) - Math.max( oneRecObj.left, twoRecObj.left ); // What: Overlap Width Number. Why: Two boxes overlap only where both their spans cross. How: This measures how far their horizontal spans cross.
		const oveHeiNum = Math.min( oneRecObj.bottom, twoRecObj.bottom ) - Math.max( oneRecObj.top, twoRecObj.top ); // What: Overlap Height Number. Why: Two boxes overlap only where both their spans cross. How: This measures how far their vertical spans cross.

		const widOveBoo = oveWidNum > 0;                                                        // What: Width Overlap Boolean. Why: Boxes overlap only where their horizontal spans cross. How: This checks they do.
		const heiOveBoo = oveHeiNum > 0;                                                        // What: Height Overlap Boolean. Why: Boxes overlap only where their vertical spans cross. How: This checks they do.
		const areOveBoo = oveWidNum * oveHeiNum > 1;                                            // What: Area Overlap Boolean. Why: A shared edge or corner isn't a real overlap. How: This checks they share more than a pixel of area.
		const sepConBoo = !oneCurEle.contains( twoCurEle ) && !twoCurEle.contains( oneCurEle ); // What: Separate Control Boolean. Why: A control inside another overlaps it by design. How: This checks that neither holds the other.

		const conOveBoo = widOveBoo && heiOveBoo && areOveBoo && sepConBoo && !( expFraFun( oneCurEle ) >= 0.25 && expFraFun( twoCurEle ) >= 0.25 ); // What: Control Overlap Boolean. Why: All four together mean two separate controls cover each other, unless both still show a quarter of themselves to tap, as photos do behind a card's floating bar. How: This combines them, skipping such a pair.


		if ( conOveBoo ) proLisArr.push( `${ desEleFun( oneCurEle ) } overlaps ${ desEleFun( twoCurEle ) }` ); // What: Overlap Check. Why: Overlapping controls are hard to read and to tap. How: This records a pair sharing more than a pixel of area.


	} ) );



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion layProFun

// #endregion Helpers



// #region Module Init

for ( const layCasObj of LAY_CAS_ARR ) { // What: Case Loop. Why: Every page and the open menu are measured. How: This declares each case's tests.


	for ( const widCurNum of WID_LIS_ARR.filter( ( widFilNum ) => !layCasObj.menBoo || widFilNum <= MEN_MAX_NUM ) ) { // What: Width Loop. Why: Each case is measured at every width it exists at. How: This declares one test per width, skipping menu widths past the breakpoint.


		test( `${ layCasObj.ideStr } holds its layout at ${ widCurNum }px`, async ( { page : curPagObj } ) => { // What: Layout Test. Why: The layout should hold together at every width. How: This opens the case at the width and lists its layout problems.


			await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Entrance animations don't change the layout, so waiting on them only slows the run. How: This makes the page match prefers-reduced-motion, which turns them off.

			await opeStaFun( curPagObj, { // What: Case Open Call. Why: The layout is measured settled. How: This opens the case's path at the width, opening the menu first for the menu case.


				heiNum : 900,              // What: Height Number. Why: Only the width changes this layout. How: Every case is measured at the same height.
				ideStr : layCasObj.ideStr, // What: Identifier String. Why: The state names its case. How: This reuses the case's name.
				patStr : layCasObj.patStr, // What: Path String. Why: The state opens the case's route. How: This reuses the case's path.
				widNum : widCurNum,        // What: Width Number. Why: The width is what this test varies. How: This sizes the viewport to the loop's width.

				...( layCasObj.menBoo ? { actFun : async ( actPagObj ) => { await actPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); } } : {} ) // What: Menu Action Spread. Why: Only the menu case opens the menu. How: This adds the toggle click as the state's action for that case.


			} );


			expect( await curPagObj.evaluate( layProFun ) ).toEqual( [] ); // What: No Layout Problems Assertion. Why: The width passes only with nothing spilling or overlapping. How: This compares the problems with an empty list, so a failure prints each one.


		} );


	}


}

// #endregion Module Init


