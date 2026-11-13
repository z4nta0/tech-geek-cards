


// #region Imports

import { EMP_STA_ARR } from '../support/gallery.ts'; // What: Empty State Array. Why: The Gallery's "Show All Cards" only shows after a search nothing matches. How: This lists the Gallery states after that search.
import { ERR_MES_STR } from '../support/contact.ts'; // What: Error Message String. Why: A failed send has to put this message in the alert region. How: This is the error the page shows.
import { expect      } from '@playwright/test';      // What: Expect. Why: Each check passes only when the result is announced and focus lands where it should. How: This asserts on what each check reads, such as the alert region.
import { opeStaFun   } from '../support/states.ts';  // What: Open State Function. Why: The empty Gallery is opened like any other state. How: This loads the state and runs its action.
import { senForFun   } from '../support/contact.ts'; // What: Send Form Function. Why: The focus and alert checks send the form themselves. How: This answers the root's POST at a given status, fills in and sends the form, and waits for its result.
import { test        } from '@playwright/test';      // What: Test. Why: Each check is its own test. How: This declares them.

// #endregion Imports



/**
 * announce.spec.ts = Announce Spec
 *
 * @summary
 * Checks that the Contact form tells screen reader users what happened once
 * it's sent, in whichever engine the project runs. The error's alert region is
 * in the form and empty on load and holds the error after a failed send, which
 * also leaves focus on the submit button, a sent message moves focus to the
 * thank-you that replaces the form, and its "Send Another" button moves focus
 * back to the name field. The share dialog's status region is empty when the
 * dialog opens and holds the copy result once "Copy Link" is pressed, whether
 * the clipboard takes the link or refuses it. The Gallery's "Show All Cards",
 * which leaves with the empty message, hands focus to the search field.
 * Adapted from TechGeek.dev's own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



test.use( { reducedMotion : 'reduce' } ); // What: Reduced Motion Use. Why: The thank-you's and the error's fades would otherwise still be running when the checks read them. How: This makes each page in this file match prefers-reduced-motion: reduce.



test( 'the alert region is in the form and empty on load, and focus stays put', async ( { page : curPagObj } ) => { // What: Empty Alert Test. Why: A live region added at the moment it speaks is often missed, and a first visit shouldn't move focus. How: This loads the Contact page and checks the form's alert region is there, empty, and that the name field isn't focused.


	await curPagObj.goto( '/contact' ); // What: Contact Page Navigation. Why: The form lives on the Contact page. How: This loads it.

	await expect( curPagObj.locator( 'form[name="contact"]' ).getByRole( 'alert' ) ).toHaveCount( 1 ); // What: One Alert Assertion. Why: The alert region has to be in the form from the first render. How: This checks exactly one alert region exists in the form.
	await expect( curPagObj.locator( 'form[name="contact"]' ).getByRole( 'alert' ) ).toBeEmpty();      // What: Empty Alert Assertion. Why: Nothing has gone wrong yet. How: This checks the region holds no text.
	await expect( curPagObj.getByRole( 'main' ).getByLabel( 'Your name' ) ).not.toBeFocused();         // What: Unmoved Focus Assertion. Why: Only a return from the thank-you moves focus to the name field. How: This checks the field isn't focused on load.


} );



test( 'a failed send puts the error in the alert region and keeps focus on the submit button', async ( { page : curPagObj } ) => { // What: Failed Send Test. Why: Screen reader users have to hear that the message didn't go out, and the button's disabled spell while sending mustn't drop focus to the page. How: This sends the form against a 500, then checks the alert's text and the button's focus.


	await curPagObj.goto( '/contact' ); // What: Contact Page Navigation. Why: The form lives on the Contact page. How: This loads it.

	await senForFun( curPagObj, 500 ); // What: Failed Send Call. Why: The error shows only after a failed send. How: This sends the form with the root's POST answered by a 500.

	await expect( curPagObj.locator( 'form[name="contact"]' ).getByRole( 'alert' ) ).toHaveText( ERR_MES_STR ); // What: Error Alert Assertion. Why: The alert region announces the error. How: This checks it holds the error message.
	await expect( curPagObj.getByRole( 'button', { name : 'Send Message' } ) ).toBeFocused();                   // What: Submit Focus Assertion. Why: Focus never falls to the page, so the visitor can try again from where they were. How: This checks the submit button is the focused element once sending ends.


} );



test( 'a sent message moves focus to the thank-you, and sending another moves it to the name field', async ( { page : curPagObj } ) => { // What: Result Focus Test. Why: The focused submit button disappears with the form, so focus has to land on what replaces it each way. How: This sends the form against a 200, checks the thank-you holds focus, presses "Send Another", and checks the name field does.


	await curPagObj.goto( '/contact' ); // What: Contact Page Navigation. Why: The form lives on the Contact page. How: This loads it.

	await senForFun( curPagObj, 200 ); // What: Sent Send Call. Why: The thank-you shows only after a sent message. How: This sends the form with the root's POST answered by a 200.

	await expect( curPagObj.getByRole( 'heading', { name : 'Message sent!' } ).locator( '..' ) ).toBeFocused(); // What: Thank-You Focus Assertion. Why: Focus on the panel announces it, and keeps focus from falling to the page. How: This checks the heading's parent, the thank-you panel, is the focused element.

	await curPagObj.getByRole( 'button', { name : 'Send Another' } ).click(); // What: Send Another Click Call. Why: The form comes back for another message. How: This presses "Send Another".

	await expect( curPagObj.getByRole( 'main' ).getByLabel( 'Your name' ) ).toBeFocused(); // What: Name Field Focus Assertion. Why: The visitor starts the next message at the first field. How: This checks the name field is focused.


} );



test( 'pressing "Show All Cards" moves focus to the search field', async ( { page : curPagObj } ) => { // What: Show All Focus Test. Why: The pressed button leaves with the empty message, and focus must never fall to the page. How: This opens the Gallery after a search nothing matches, presses "Show All Cards", and checks the search field holds focus.


	await opeStaFun( curPagObj, EMP_STA_ARR[ 0 ] ); // What: Empty Gallery Open Call. Why: The button shows only after a search nothing matches. How: This opens the Gallery with that search typed.

	await curPagObj.getByRole( 'button', { name : 'Show All Cards' } ).click(); // What: Show All Click Call. Why: The way back from an empty search is this button. How: This presses it.

	await expect( curPagObj.getByLabel( 'Search cards' ) ).toBeFocused(); // What: Search Focus Assertion. Why: Focus has to land somewhere useful once the button is gone. How: This checks the search field holds it.


} );



for ( const copRowObj of [ { mesStr : 'Link copied. Paste it into a text, an email, or a message.', resStr : 'copied' }, { mesStr : 'Your browser blocked copying. Select the link above and copy it.', resStr : 'failed' } ] ) { // What: Copy Result Loop. Why: The share dialog announces both a copy that worked and one the browser refused. How: This declares one test per result, with the message each should announce.


	test( `the share status region is empty on open and announces the ${ copRowObj.resStr } result`, async ( { page : curPagObj } ) => { // What: Share Status Test. Why: The copy result has to reach screen reader users, and a region added as it speaks is often missed. How: This stubs the clipboard to take or refuse the link, opens the Birthday card's share dialog on the Gallery, checks its status region is empty, presses "Copy Link", and checks the region holds the message.


		await curPagObj.addInitScript( ( resStr ) => Object.defineProperty( navigator, 'clipboard', { value : { writeText : () => resStr === 'copied' ? Promise.resolve() : Promise.reject( new Error( 'Blocked' ) ) } } ), copRowObj.resStr ); // What: Clipboard Stub Call. Why: A headless browser's clipboard may refuse without permission, and each result has to be reached on purpose. How: This replaces the page's clipboard with one that takes the link or refuses it, before the site loads.

		await curPagObj.goto( '/gallery' ); // What: Gallery Page Navigation. Why: The share dialog opens from a card tile. How: This loads the Gallery.

		await curPagObj.getByRole( 'button', { name : 'Share Happy Birthday' } ).click(); // What: Share Click Call. Why: The dialog opens only from a "Share" button. How: This presses the Birthday tile's.

		await expect( curPagObj.getByRole( 'dialog' ).getByRole( 'status' ) ).toHaveCount( 1 ); // What: One Status Assertion. Why: The status region has to be in the dialog from its first render. How: This checks exactly one status region exists in the dialog.
		await expect( curPagObj.getByRole( 'dialog' ).getByRole( 'status' ) ).toBeEmpty();      // What: Empty Status Assertion. Why: Nothing has been copied yet. How: This checks the region holds no text.

		await curPagObj.getByRole( 'button', { name : 'Copy Link' } ).click(); // What: Copy Click Call. Why: The status speaks only once a copy is tried. How: This presses "Copy Link".

		await expect( curPagObj.getByRole( 'dialog' ).getByRole( 'status' ) ).toHaveText( copRowObj.mesStr ); // What: Copy Status Assertion. Why: The region announces the copy's result. How: This checks it holds the message for that result.


	} );


}


