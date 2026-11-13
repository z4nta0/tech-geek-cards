


// #region Imports

import { expect      } from '@playwright/test'; // What: Expect. Why: A send is finished only once its result shows. How: This waits until the result is visible.
import { STA_REC_ARR } from './states.ts';      // What: State Record Array. Why: The result states reuse the Contact page's phone and desktop states. How: This lists every state, from which the Contact ones are picked.


import type { Page      } from '@playwright/test'; // What: Page. Why: Sending the form drives a Playwright page. How: This types the send helper's and the actions' page parameters.
import type { StaRecTyp } from './states.ts';      // What: State Record Type. Why: The result states are opened like any other state. How: This types the result and invalid state lists.

// #endregion Imports



/**
 * contact.ts = Contact
 *
 * @summary
 * The Contact form's result states and the state after a refused empty send,
 * for the suites that check every state a visitor can reach, and the helper
 * that brings a result about. Netlify isn't there in testing, so the root's
 * POST is answered here instead, with a 200 for a sent message, which swaps
 * the form for its thank-you, and a 500 for a failed one, which shows the
 * error. They're kept out of the shared state list, since the rendering suite
 * captures every state there against a baseline. Adapted from TechGeek.dev's
 * own.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const CON_STA_ARR = STA_REC_ARR.filter( ( staRecObj ) => staRecObj.patStr === '/contact' );             // What: Contact State Array. Why: Each result is opened at the Contact page's phone and desktop widths. How: This picks the Contact rows from the shared state list.
const ERR_MES_STR = 'Something went wrong. Please try again or email contact@techgeek.cards directly.'; // What: Error Message String. Why: A failed send has to put this message in the alert region. How: This is the error the page shows.



const INV_STA_ARR : StaRecTyp[] = CON_STA_ARR.map( ( staRecObj ) => ( { // What: Invalid State Array. Why: A send the browser stops for missing fields is a state a visitor reaches too. How: For each Contact state, this copies the state, presses "Send Message" with the form empty in its action, and names it after the state.


	...staRecObj, // What: State Record Spread. Why: The invalid state keeps the Contact state's path and viewport. How: This copies the row.

	ideStr : `${ staRecObj.ideStr }-invalid`, // What: Identifier String. Why: Each test names its width and the refused send. How: This adds invalid to the Contact state's name, such as contact-desktop-invalid.

	actFun : async ( curPagObj : Page ) => { // What: Action Function. Why: The state shows the form after the browser refuses an empty send. How: This presses "Send Message" and waits until the browser moves focus to the empty name field.


		await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: An empty send is what the browser refuses. How: This presses "Send Message" with every field blank.

		await expect( curPagObj.getByRole( 'main' ).getByLabel( 'Your name' ) ).toBeFocused(); // What: Refused Send Assertion. Why: The checks read the page only once the browser has refused the send. How: This waits until focus lands on the first empty required field.


	}


} ) );



/**
 * RES_REC_ARR = Result Record Array
 *
 * @summary
 * The two ways a send can end. Every row shares one shape, so its fields
 * carry no comments of their own:
 *
 * - `ideStr` (String): Identifier String, the result's name in test titles.
 *
 * - `staNum` (Number): Status Number, the status the root's POST answers with.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const RES_REC_ARR = [ // What: Result Record Array. Why: Both the thank-you and the error are states a visitor can reach. How: Each row names a result and the status that brings it about.


	{ ideStr : 'sent',   staNum : 200 }, // What: Sent Result Row. Why: An `ok` reply shows the thank-you. How: This answers with a 200.
	{ ideStr : 'failed', staNum : 500 }  // What: Failed Result Row. Why: A failed reply shows the error. How: This answers with a 500.


];

// #endregion Constants



// #region Helpers

// #region senForFun

/**
 * senForFun = Send Form Function
 *
 * @summary
 * Sends the Contact form and waits for its result: answers the root's POST
 * with the given status, fills in a valid name, email, and message, presses
 * "Send Message", then waits until the thank-you's heading shows for a 200,
 * or the error shows in the alert region for any other status. Any other
 * request to the root falls back to the page's other route handlers, such as
 * one that adds the security policy's headers. It expects the Contact page
 * already loaded.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page showing the form.
 * @param staCodNum - Status Code Number: The status the root's POST answers
 *                    with.
 *
 * @returns A promise that settles once the result shows, with no value.
 *
 * @example
 * ```ts
 * senForFun(page, 500) // => Promise<void>
 * ```
 *
*/

async function senForFun ( curPagObj : Page, staCodNum : number ) : Promise< void > {


	await curPagObj.route( ( urlCurObj ) => urlCurObj.pathname === '/', async ( rouCurObj ) => { // What: Root Route Handler. Why: Netlify Forms answers the root's POST on the live site, but not in testing. How: This answers a POST with an empty body at the given status, and hands any other request to the root on to the routes added before it.


		if ( rouCurObj.request().method() !== 'POST' ) return rouCurObj.fallback(); // What: Other Request Guard. Why: Only the form's POST needs answering, while a route added earlier, such as the policy's headers, still has to see the rest. How: This passes any other request to the root on to the next handler, or to the network when there's none.



		await rouCurObj.fulfill( { body : '', status : staCodNum } ); // What: Status Answer Call. Why: The form shows its thank-you only on an `ok` reply, and its error otherwise. How: This answers with an empty body at the given status.


	} );


	await curPagObj.getByRole( 'main' ).getByLabel( 'Your name' ).fill( 'Test Visitor' );         // What: Name Fill Call. Why: Every required field is filled. How: This fills in a name.
	await curPagObj.getByRole( 'main' ).getByLabel( 'Your email' ).fill( 'visitor@example.com' ); // What: Email Fill Call. Why: Every required field is filled. How: This fills in a reserved example address.
	await curPagObj.getByRole( 'main' ).getByLabel( 'Message' ).fill( 'Hello.' );                 // What: Message Fill Call. Why: Every required field is filled. How: This fills in a message.

	await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: The valid form is submitted. How: This presses "Send Message".


	const resLocObj = staCodNum === 200 ? curPagObj.getByRole( 'heading', { name : 'Message sent!' } ) : curPagObj.getByRole( 'alert' ).getByText( ERR_MES_STR ); // What: Result Locator Object. Why: Each status ends in its own result. How: This finds the thank-you's heading for a 200, or the error inside the alert region otherwise.


	await expect( resLocObj ).toBeVisible(); // What: Result Shown Assertion. Why: The checks read the page only once the result is there. How: This waits until the result shows.


}

// #endregion senForFun



const RES_STA_ARR : StaRecTyp[] = RES_REC_ARR.flatMap( ( resRecObj ) => CON_STA_ARR.map( ( staRecObj ) => ( { // What: Result State Array. Why: The suites open each result at the Contact page's phone and desktop widths like any other state. How: For each result and each Contact state, this copies the state, sends the form in its action, and names it after both.


	...staRecObj, // What: State Record Spread. Why: The result state keeps the Contact state's path and viewport. How: This copies the row.

	actFun : ( curPagObj : Page ) => senForFun( curPagObj, resRecObj.staNum ), // What: Action Function. Why: The state shows the form's result. How: This sends the form with the root's POST answered at the result's status.
	ideStr : `${ staRecObj.ideStr }-${ resRecObj.ideStr }`                     // What: Identifier String. Why: Each test names its width and result. How: This joins the Contact state's name and the result's, such as contact-desktop-sent.


} ) ) );

// #endregion Helpers



// #region Exports

export { ERR_MES_STR, INV_STA_ARR, RES_STA_ARR, senForFun }; // What: Named Exports. Why: The suites that check every reachable state share the result and invalid states and the result states' sender. How: This exports the error message, the invalid and result state lists, and the send helper.

// #endregion Exports


