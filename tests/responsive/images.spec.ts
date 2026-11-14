


// #region Imports

import { expect    } from '@playwright/test';     // What: Expect. Why: Each page passes only when no image in view waits to load. How: This asserts the problem list is empty.
import { opeStaFun } from '../support/states.ts'; // What: Open State Function. Why: Each page is measured settled at its size. How: This loads the page and waits for it.
import { test      } from '@playwright/test';     // What: Test. Why: Each page at each size is its own test. How: This declares them.

// #endregion Imports



/**
 * images.spec.ts = Images Spec
 *
 * @summary
 * Checks that every image in view as a page opens loads at once, in
 * whichever engine the project runs, per the Images rule's loading='lazy' for
 * an image that starts below the fold. Each page with card tiles opens at a
 * phone, a tablet, a portrait monitor, and two desktop sizes, and any image
 * on screen at the top of the page that still carries loading='lazy' is a
 * problem.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const PAG_PAT_ARR = [ '/', '/gallery' ]; // What: Page Path Array. Why: These pages show card tiles, whose previews decide between loading at once and lazily. How: This lists Home and the Gallery.

const VIE_SIZ_ARR = [ // What: Viewport Size Array. Why: How much of a page is in view as it opens depends on the screen. How: Each row is a screen's width and height.


	{ heiNum : 844,  widNum : 390  }, // What: Phone Size Row. Why: A phone shows one column. How: This is a common phone.
	{ heiNum : 1366, widNum : 1024 }, // What: Tablet Size Row. Why: A tall tablet shows two columns and more rows. How: This is a large tablet held upright.
	{ heiNum : 1920, widNum : 1080 }, // What: Portrait Monitor Row. Why: A monitor turned upright shows the most of a page. How: This is a 1080p monitor turned on its side.
	{ heiNum : 900,  widNum : 1440 }, // What: Laptop Size Row. Why: A laptop shows a desktop layout with a short screen. How: This is a common laptop.
	{ heiNum : 1440, widNum : 2560 }  // What: Large Desktop Row. Why: A large monitor shows the desktop layout with a tall screen. How: This is a 1440p monitor.


];

// #endregion Constants



// #region Module Init

for ( const patCurStr of PAG_PAT_ARR ) { // What: Page Loop. Why: Each page with tiles is checked. How: This walks the page paths.


	for ( const vieSizObj of VIE_SIZ_ARR ) { // What: Size Loop. Why: Each screen size is its own test. How: This walks the sizes.


		test( `${ patCurStr } at ${ vieSizObj.widNum }x${ vieSizObj.heiNum } loads every image in view at once`, async ( { page : curPagObj } ) => { // What: In View Image Test. Why: An image in view as the page opens shouldn't wait to be scrolled near. How: This opens the page settled at the size and lists each lazy image on screen at the top.


			await opeStaFun( curPagObj, { heiNum : vieSizObj.heiNum, ideStr : `images-${ vieSizObj.widNum }`, patStr : patCurStr, widNum : vieSizObj.widNum } ); // What: Page Open Call. Why: Positions are read once the page is at rest. How: This opens the page at the size, back at the top.


			const proLisArr = await curPagObj.evaluate( () => Array.from( document.images ).filter( ( imaCurEle ) => imaCurEle.loading === 'lazy' && imaCurEle.getBoundingClientRect().top < innerHeight && imaCurEle.getBoundingClientRect().bottom > 0 ).map( ( imaCurEle ) => `image "${ imaCurEle.alt }" is in view but lazy` ) ); // What: Problem List Array. Why: Each lazy image on screen is one problem. How: This keeps the lazy images whose box overlaps the screen and names each by its alt text.

			expect( proLisArr ).toEqual( [] ); // What: No Problems Assertion. Why: Every image in view should load at once. How: This checks the list is empty.


		} );


	}


}

// #endregion Module Init


