


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: The check passes only when the link behaves as it should. How: This asserts on what the link holds and where it leads.
import { test   } from '@playwright/test'; // What: Test. Why: The Ko-fi link's behavior is its own test. How: This declares it.

// #endregion Imports



/**
 * ko-fi.spec.ts = Ko-fi Spec
 *
 * @summary
 * Checks the About page's Ko-fi button in whichever engine the project runs:
 * it points at z4nta0's Ko-fi page, keeps that page from reaching back to
 * this one, and opens it in a new tab while the About page stays put. Ko-fi
 * itself isn't loaded, since a test shouldn't depend on an outside site, so
 * its address is answered here instead.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



const TIP_URL_STR = 'https://ko-fi.com/techgeekdev'; // What: Tip URL String. Why: The button has to lead to z4nta0's Ko-fi page. How: This is the address the test expects.



test( 'the Ko-fi button opens the tip page in a new tab', async ( { page : curPagObj } ) => { // What: Ko-fi Link Test. Why: The tip page has to open without the visitor leaving the site. How: This checks the link's attributes, clicks it, and checks the new tab and the page left behind.


	await curPagObj.context().route( TIP_URL_STR, ( rouCurObj ) => rouCurObj.fulfill( { body : 'Ko-fi', contentType : 'text/plain' } ) ); // What: Tip Page Route. Why: The new tab shouldn't reach the real Ko-fi. How: This answers its address with a stand-in page for every tab in the context.

	await curPagObj.goto( '/about' ); // What: About Page Load Call. Why: The button sits on the About page. How: This opens it.


	const kofLinObj = curPagObj.getByRole( 'link', { name : 'Buy Me a Coffee (opens Ko-fi in a new tab)' } ); // What: Ko-fi Link Object. Why: The test reads and clicks the one button. How: This finds it by the name a screen reader announces.


	await expect( kofLinObj ).toHaveAttribute( 'href', TIP_URL_STR ); // What: Address Assertion. Why: The button has to lead to the Ko-fi page. How: This reads its href.
	await expect( kofLinObj ).toHaveAttribute( 'target', '_blank' );  // What: New Tab Assertion. Why: The visitor shouldn't lose their place on the site. How: This reads its target.
	await expect( kofLinObj ).toHaveAttribute( 'rel', /noopener/ );   // What: No Opener Assertion. Why: The page it opens mustn't reach back to this one. How: This reads its rel for noopener.
	await expect( kofLinObj ).toHaveAttribute( 'rel', /noreferrer/ ); // What: No Referrer Assertion. Why: The page it opens shouldn't learn where the visitor came from. How: This reads its rel for noreferrer.


	const newTabPro = curPagObj.context().waitForEvent( 'page' ); // What: New Tab Promise. Why: The click should open a second tab. How: This waits for the context's next page.


	await kofLinObj.click(); // What: Ko-fi Link Click. Why: The button is used the way a visitor uses it. How: This clicks it.


	const newTabObj = await newTabPro; // What: New Tab Object. Why: The test reads where the new tab went. How: This is the tab the click opened.


	await newTabObj.waitForLoadState(); // What: New Tab Load Wait. Why: The tab's address settles once it loads. How: This waits for its load event.

	expect( newTabObj.url() ).toBe( TIP_URL_STR );                  // What: New Tab Address Assertion. Why: The new tab has to show the Ko-fi page. How: This reads its address.
	expect( new URL( curPagObj.url() ).pathname ).toBe( '/about' ); // What: Page Kept Assertion. Why: The visitor's own tab should stay on the About page. How: This reads its path.


} );


