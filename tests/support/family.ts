


// #region Imports

import { expect      } from '@playwright/test'; // What: Expect. Why: The photo state is ready only once its dialog shows. How: This waits until it does.
import { STA_REC_ARR } from './states.ts';      // What: State Record Array. Why: The photo states reuse the Mother's Day card's phone and desktop states. How: This lists every state, from which the Mother's Day ones are picked.


import type { Page      } from '@playwright/test'; // What: Page. Why: Opening a photo drives a Playwright page. How: This types the photo action's page parameter.
import type { StaRecTyp } from './states.ts';      // What: State Record Type. Why: The photo states are opened like any other state. How: This types the photo state list.

// #endregion Imports



/**
 * family.ts = Family
 *
 * @summary
 * The Family cards' photo states, for the suites that check every state a
 * visitor can reach: the Mother's Day card's first photo opened full size in
 * its dialog from the finished mosaic by keyboard, the way a keyboard user
 * reaches it, so the dialog's one control holds the keyboard's focus ring, at
 * the card's phone and desktop widths. The Family cards share one engine, so
 * one card stands for all three. They're kept out of the shared state list,
 * since the rendering suite captures every state there against a baseline.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const PHO_STA_ARR : StaRecTyp[] = STA_REC_ARR.filter( ( staRecObj ) => staRecObj.patStr === '/mothers-day' ).map( ( staRecObj ) => ( { // What: Photo State Array. Why: A photo opened full size covers the card with a dialog of its own, a state a visitor reaches and can stay on. How: For each Mother's Day state, this copies the state, opens the first photo in its action, and names it after the state.


	...staRecObj, // What: State Record Spread. Why: The photo state keeps the card state's path, viewport, and finished scene. How: This copies the row.

	ideStr : `${ staRecObj.ideStr }-photo`, // What: Identifier String. Why: Each test names its width and the open photo. How: This adds photo to the card state's name, such as mothers-day-desktop-photo.

	actFun : async ( curPagObj : Page ) => { // What: Action Function. Why: The state shows a photo opened from the mosaic. How: This focuses the first photo, opens it with Enter, and waits for the dialog.


		await curPagObj.getByRole( 'button', { name : /^View photo/ } ).first().focus(); // What: Photo Focus Call. Why: A photo opens full size only from its place in the mosaic. How: This focuses the first one.

		await curPagObj.keyboard.press( 'Enter' ); // What: Photo Open Press. Why: A keyboard opening leaves the dialog's control showing its focus ring, as it would for a keyboard user. How: This presses Enter on the focused photo.

		await expect( curPagObj.getByRole( 'dialog', { name : 'Photo' } ) ).toBeVisible(); // What: Photo Dialog Assertion. Why: The checks read the page only once the photo is open. How: This waits until the dialog shows.


	}


} ) );

// #endregion Constants



// #region Exports

export { PHO_STA_ARR }; // What: Named Export. Why: The suites that check every reachable state share the photo states. How: This exports the photo state list.

// #endregion Exports


