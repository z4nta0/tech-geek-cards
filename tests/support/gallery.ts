


// #region Imports

import { expect      } from '@playwright/test'; // What: Expect. Why: A narrowed state is ready only once the grid has changed. How: This waits until it has.
import { STA_REC_ARR } from './states.ts';      // What: State Record Array. Why: The narrowed states reuse the Gallery's phone and desktop states. How: This lists every state, from which the Gallery ones are picked.


import type { Page      } from '@playwright/test'; // What: Page. Why: Choosing a filter or typing a search drives a Playwright page. How: This types the actions' page parameters.
import type { StaRecTyp } from './states.ts';      // What: State Record Type. Why: The narrowed states are opened like any other state. How: This types the narrowed state lists.

// #endregion Imports



/**
 * gallery.ts = Gallery
 *
 * @summary
 * The Gallery's narrowed states, for the suites that check every state a
 * visitor can reach: the grid narrowed to the "Family" occasion's two listed
 * cards, and a search no card matches, which swaps the grid for its empty
 * message, each at the Gallery's phone and desktop widths. They're kept out of
 * the shared state list, since the rendering suite captures every state there
 * against a baseline.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const GAL_STA_ARR = STA_REC_ARR.filter( ( staRecObj ) => staRecObj.patStr === '/gallery' && !staRecObj.actFun ); // What: Gallery State Array. Why: Each narrowed state is opened at the Gallery's phone and desktop widths. How: This picks the Gallery rows from the shared state list, leaving out the share dialog's.


const EMP_STA_ARR : StaRecTyp[] = GAL_STA_ARR.map( ( staRecObj ) => ( { // What: Empty State Array. Why: A search no card matches swaps the grid for a message and a button, a look of its own. How: For each Gallery state, this copies the state, types a search nothing holds in its action, and names it after the state.


	...staRecObj, // What: State Record Spread. Why: The empty state keeps the Gallery state's path and viewport. How: This copies the row.

	ideStr : `${ staRecObj.ideStr }-empty`, // What: Identifier String. Why: Each test names its width and the empty search. How: This adds empty to the Gallery state's name, such as gallery-desktop-empty.

	actFun : async ( curPagObj : Page ) => { // What: Action Function. Why: The state shows the Gallery with nothing matching. How: This types a search no card holds and waits for the empty message.


		await curPagObj.getByLabel( 'Search cards' ).fill( 'zzzz' ); // What: Search Fill Call. Why: No card's title, occasion, holiday, or description holds this word. How: This types it into the search field.

		await expect( curPagObj.getByText( 'No cards match that search yet.' ) ).toBeVisible(); // What: Empty Message Assertion. Why: The checks read the page only once the grid has given way. How: This waits until the empty message shows.


	}


} ) );



const FIL_STA_ARR : StaRecTyp[] = GAL_STA_ARR.map( ( staRecObj ) => ( { // What: Filtered State Array. Why: A chosen occasion narrows the grid and changes the count, so it's a state of its own. How: For each Gallery state, this copies the state, chooses "Family" in its action, and names it after the state.


	...staRecObj, // What: State Record Spread. Why: The filtered state keeps the Gallery state's path and viewport. How: This copies the row.

	ideStr : `${ staRecObj.ideStr }-filtered`, // What: Identifier String. Why: Each test names its width and the filter. How: This adds filtered to the Gallery state's name, such as gallery-desktop-filtered.

	actFun : async ( curPagObj : Page ) => { // What: Action Function. Why: The state shows the grid narrowed by an occasion. How: This presses "Family" and waits until two tiles remain.


		await curPagObj.getByRole( 'button', { exact : true, name : 'Family' } ).click(); // What: Filter Click Call. Why: "Family" narrows the grid to its two listed cards. How: This presses its button.

		await expect( curPagObj.locator( 'article' ) ).toHaveCount( 2 ); // What: Narrowed Grid Assertion. Why: The checks read the page only once the filter has applied. How: This waits until two tiles remain.


	}


} ) );

// #endregion Constants



// #region Exports

export { EMP_STA_ARR, FIL_STA_ARR }; // What: Named Exports. Why: The suites that check every reachable state share the narrowed states. How: This exports the empty and filtered state lists.

// #endregion Exports


