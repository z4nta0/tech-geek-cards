


// #region Imports

import { expect      } from '@playwright/test'; // What: Expect. Why: A copy state is ready only once its message shows. How: This waits until it does.
import { STA_REC_ARR } from './states.ts';      // What: State Record Array. Why: The copy states reuse the share dialog's phone and desktop states. How: This lists every state, from which the share ones are picked.


import type { Page      } from '@playwright/test'; // What: Page. Why: Copying the link and opening the bar's dialog drive a Playwright page. How: This types the actions' page parameters.
import type { StaRecTyp } from './states.ts';      // What: State Record Type. Why: The share states are opened like any other state. How: This types the share state list.

// #endregion Imports



/**
 * share.ts = Share
 *
 * @summary
 * The share dialog's reachable states, for the suites that check every state
 * a visitor can reach: the dialog after "Copy Link" when the clipboard takes
 * the link and when it refuses it, at the Gallery's phone and desktop widths,
 * and the dialog opened from a card page's floating bar at the phone width.
 * They're kept out of the shared state list, since the rendering suite
 * captures every state there against a baseline.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const BAR_STA_ARR : StaRecTyp[] = [ // What: Bar State Array. Why: The floating bar's "Share" opens the dialog over the card itself, a context the Gallery's dialog doesn't cover. How: This holds the Birthday card's page at the phone width with its dialog open.


	{ // What: Share Card Phone State. Why: On a phone the dialog sits over the card and its floating bar. How: This loads the Birthday card at 390px and opens the share dialog from its bar.


		heiNum : 844,
		ideStr : 'share-card-phone',
		patStr : '/happy-birthday',
		redBoo : true,
		widNum : 390,

		actFun : async ( curPagObj : Page ) => { // What: Share Open Action. Why: The state shows the dialog as a visitor sees it once it's open. How: This presses the floating bar's "Share" button, then moves the pointer off it.


			await curPagObj.getByRole( 'button', { exact : true, name : 'Share' } ).click(); // What: Share Click Call. Why: The bar's "Share" opens the dialog for the card showing. How: This presses it.

			await curPagObj.mouse.move( 0, 0 ); // What: Pointer Move Call. Why: The pointer would otherwise rest on whatever lands under it and hold its hover look in every check of this state. How: This parks the pointer in the corner.


		}


	}


];



const COP_RES_ARR = [ // What: Copy Result Array. Why: The dialog shows a different message when the clipboard takes the link and when it refuses it. How: Each row names a result and the message that shows for it.


	{ mesStr : 'Link copied. Paste it into a text, an email, or a message.',      resStr : 'copied' }, // What: Copied Result Row. Why: A copy that worked swaps the button's label and shows its message. How: This names it and its message.
	{ mesStr : 'Your browser blocked copying. Select the link above and copy it.', resStr : 'failed' }  // What: Failed Result Row. Why: A refused copy asks the visitor to copy the link by hand. How: This names it and its message.


];



const SHA_OPE_ARR = STA_REC_ARR.filter( ( staRecObj ) => staRecObj.ideStr === 'share-desktop' || staRecObj.ideStr === 'share-phone' ); // What: Share Open Array. Why: Each copy state starts from the Birthday card's open dialog at both widths. How: This picks those two rows from the shared state list.



const COP_STA_ARR : StaRecTyp[] = SHA_OPE_ARR.flatMap( ( staRecObj ) => COP_RES_ARR.map( ( copResObj ) => ( { // What: Copy State Array. Why: Each copy result is a look a visitor reaches and stays on. How: For each open dialog state and each result, this copies the state, adds the copy to its action, and names it after both.


	...staRecObj, // What: State Record Spread. Why: The copy state keeps the open dialog state's path and viewport. How: This copies the row.

	ideStr : `${ staRecObj.ideStr }-${ copResObj.resStr }`, // What: Identifier String. Why: Each test names its width and the copy's result. How: This adds the result to the state's name, such as share-desktop-copied.

	actFun : async ( curPagObj : Page ) => { // What: Action Function. Why: The state shows the dialog after a copy. How: This opens the dialog, sets the clipboard to take or refuse the link, presses "Copy Link", and waits for the message.


		await staRecObj.actFun!( curPagObj ); // What: Share Open Call. Why: The copy is made from the open dialog. How: This runs the state's own action, which opens it. // What: Non-Null Note. Why: TypeScript can't see that both picked rows carry an action. How: SHA_OPE_ARR picks only the two share rows, each written with one.

		await curPagObj.evaluate( ( resStr ) => Object.defineProperty( navigator, 'clipboard', { configurable : true, value : { writeText : () => resStr === 'copied' ? Promise.resolve() : Promise.reject( new Error( 'Blocked' ) ) } } ), copResObj.resStr ); // What: Clipboard Stub Call. Why: A headless browser's clipboard may refuse without permission, and each result has to be reached on purpose. How: This replaces the page's clipboard with one that takes the link or refuses it.

		await curPagObj.getByRole( 'button', { name : 'Copy Link' } ).click(); // What: Copy Click Call. Why: The result shows only once a copy is tried. How: This presses "Copy Link".

		await expect( curPagObj.getByRole( 'dialog' ).getByRole( 'status' ) ).toHaveText( copResObj.mesStr ); // What: Copy Message Assertion. Why: The checks read the dialog only once the result shows. How: This waits until the status holds the result's message.

		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Move Call. Why: The pointer would otherwise rest on "Copy Link" and hold its hover look in every check of this state. How: This parks the pointer in the corner.


	}


} ) ) );
// #endregion Constants



// #region Exports

export { BAR_STA_ARR, COP_STA_ARR }; // What: Named Exports. Why: The suites that check every reachable state share the share dialog's states. How: This exports the bar and copy state lists.

// #endregion Exports


