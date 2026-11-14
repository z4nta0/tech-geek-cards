


// #region Imports

import { BAR_STA_ARR } from '../support/share.ts';       // What: Bar State Array. Why: The share dialog opened from a card page's floating bar sits over the card, a state a visitor reaches. How: This lists the Birthday card's page at the phone width with its dialog open.
import { CAR_DAT_ARR } from '../../src/ui/card-data.ts'; // What: Card Data Array. Why: Every card that shows a name from its address is checked with script-like names. How: This lists every card and whether it takes a recipient's or a sender's name.
import { COP_STA_ARR } from '../support/share.ts';       // What: Copy State Array. Why: The share dialog after a copy, worked or refused, is a state a visitor reaches. How: This lists the dialog after each result at both widths.
import { EMP_STA_ARR } from '../support/gallery.ts';     // What: Empty State Array. Why: The Gallery's empty search swaps its grid for a message and a button, which the policy has to allow too. How: This lists the Gallery states after a search no card matches, one per width.
import { expect      } from '@playwright/test';          // What: Expect. Why: Each check passes only when the policy is enforced and the page breaks none of its rules. How: This asserts on what each check collects from the page.
import { FIL_STA_ARR } from '../support/gallery.ts';     // What: Filtered State Array. Why: A chosen occasion narrows the Gallery's grid, a state the policy has to allow too. How: This lists the Gallery states with "Family" chosen, one per width.
import { heaPatFun   } from '../support/headers.ts';     // What: Headers Path Function. Why: The pages are loaded under the headers Netlify really sends with each path. How: This reads the headers the built dist/_headers sends with one path.
import { INV_STA_ARR } from '../support/contact.ts';     // What: Invalid State Array. Why: The Contact form after a refused empty send is a state the policy has to allow too. How: This lists the Contact states after that send, one per width.
import { opeStaFun   } from '../support/states.ts';      // What: Open State Function. Why: Each state is opened the way the other page suites open it. How: This loads the state and waits until it's settled.
import { PAU_STA_ARR } from '../support/family.ts';      // What: Paused State Array. Why: A Family card paused on a scene while it plays with motion is a state a visitor reaches, with the controls over its photo. How: This lists the Mother's Day states paused on the second scene's photo, one per width.
import { PHO_STA_ARR } from '../support/family.ts';      // What: Photo State Array. Why: A Family card's photo opened full size loads its image into a dialog, which the policy has to allow too. How: This lists the Mother's Day states with its first photo open, one per width.
import { STA_REC_ARR } from '../support/states.ts';      // What: State Record Array. Why: The policy has to hold in every state the suites visit. How: This is the list of states to load.
import { STI_STA_ARR } from '../support/family.ts';      // What: Still State Array. Why: The Family scene controls step back through stills under reduced motion, looks a visitor can stay on. How: This lists the Mother's Day card's last photo and line stills, one per width.
import { test        } from '@playwright/test';          // What: Test. Why: Each state is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The policy setup drives a Playwright page. How: This types the policy helpers' page parameters.

// #endregion Imports



/**
 * browser.spec.ts = Browser Spec
 *
 * @summary
 * Checks that the site works under its own security policy, in whichever
 * engine the project runs. Each page loads from the production build, which
 * the preview server serves, since the dev server injects inline scripts the
 * policy would block. Neither server reads Netlify's headers file, so every
 * response is given the headers the built dist/_headers sends with its path.
 * First a check proves the policy is live, by injecting an inline script and
 * seeing it refused and reported. Then every state the suites visit, the
 * reachable ones each control leads to included, is checked for policy
 * violations, apart from the one WebKit reports for every select element, and
 * checked to close off every new tab link, with neither an opener nor a
 * referrer. The Contact form's sent and failed results are checked for policy
 * violations too. Last, every card that shows a name from its address is
 * opened with script-like names, which have to show as text rather than
 * become markup, and the share dialog is given a short one in both its name
 * fields, which have to keep it as a value and carry it encoded in the link.
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

const INJ_FIE_STR = '<img src=x onerror=a() id=z>';                           // What: Injected Field String. Why: A name typed into the share dialog that became markup would run code on the sender's own page. How: This is an image tag with an inline handler and an id, short enough for a 30-character field, which a page keeping it as text never turns into an element.
const INJ_MAR_STR = '<img src=x onerror=alert(1) data-test-injected-markup>'; // What: Injected Markup String. Why: A name that became markup would let a shared link run code in a visitor's browser. How: This is an image tag with an inline handler and a marker attribute, which a page showing it as text never turns into an element.

// #endregion Constants



// #region Helpers

// #region polSetFun

/**
 * polSetFun = Policy Setup Function
 *
 * @summary
 * Readies a page to be checked against the policy. Every response the page
 * receives is given the headers the built dist/_headers sends with its path,
 * the way Netlify gives them once deployed, and a listener added before any
 * of the page's own script runs records every violation the browser reports,
 * as a line naming the directive broken and what broke it, on the page's
 * window, where polVioFun reads them back.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to ready.
 *
 * @returns A promise that settles once the headers and the listener are in
 *          place, with no value.
 *
 * @example
 * ```ts
 * polSetFun(page) // => Promise<void>
 * ```
 *
*/

async function polSetFun ( curPagObj : Page ) : Promise< void > {


	await curPagObj.route( '**/*', async ( rouCurObj ) => { // What: Header Route Call. Why: The preview server sends none of the policy's headers. How: This fetches every response as normal and fulfills it with its path's headers added.


		const resCurObj = await rouCurObj.fetch(); // What: Response Current Object. Why: The page should get the real file. How: This fetches it from the preview server.


		await rouCurObj.fulfill( { headers : { ...resCurObj.headers(), ...heaPatFun( new URL( rouCurObj.request().url() ).pathname ) }, response : resCurObj } ); // What: Fulfill Call. Why: The browser applies this site's policy from a response's headers. How: This answers with the real response and the headers its path is sent with on top.


	} );



	await curPagObj.addInitScript( () => { // What: Violation Listener Call. Why: The listener has to be in place before the page's own script runs, or an early violation would be missed. How: This runs before every page's script and records each violation the browser reports.


		const winVioObj = window as unknown as { __polVioArr : string[] }; // What: Window Violation Object. Why: The violations are kept where the test can read them back. How: This views the window with its violation list. // What: Type Assertion Note. Why: The window has no such field in its type. How: The as names the one the listener adds.


		winVioObj.__polVioArr = []; // What: Violation List Assignment. Why: Each page starts with none. How: This sets an empty list.


		document.addEventListener( 'securitypolicyviolation', ( vioEveObj ) => winVioObj.__polVioArr.push( `${ vioEveObj.effectiveDirective } blocked ${ vioEveObj.blockedURI || 'inline code' } on ${ ( vioEveObj.target as Element | null )?.tagName?.toLowerCase() ?? 'the page' }` ) ); // What: Violation Listener. Why: The browser reports each refused resource as an event. How: This records the directive broken, what it blocked, and the element it was on. // What: Type Assertion Note. Why: An event's target is typed as a plain event target. How: A violation's target is the element or document it happened on, so this reads it as an element, falling back for the document.


	} );


}

// #endregion polSetFun



// #region polVioFun

/**
 * polVioFun = Policy Violation Function
 *
 * @summary
 * Reads back the violations the listener polSetFun adds has recorded on the
 * page so far, one line each naming the directive broken and what broke it,
 * leaving out the one WebKit reports for every select element, even one with
 * no style of its own, which no page can avoid short of allowing inline style
 * attributes everywhere.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to read.
 * @param broNamStr - Browser Name String: The engine the page runs in.
 *
 * @returns A promise that resolves with the list of violations recorded.
 *
 * @example
 * ```ts
 * polVioFun(page, 'webkit') // => []
 * ```
 *
*/

async function polVioFun ( curPagObj : Page, broNamStr : string ) : Promise< string[] > {


	const vioAllArr = await curPagObj.evaluate( () => ( window as unknown as { __polVioArr : string[] } ).__polVioArr ); // What: Violation All Array. Why: The test reads what the browser reported. How: This reads the page's list. // What: Type Assertion Note. Why: The window has no such field in its type. How: The as names the one polSetFun's listener adds.



	return vioAllArr.filter( ( vioCurStr ) => !( broNamStr === 'webkit' && vioCurStr === 'style-src-attr blocked inline on select' ) ); // What: Violation List Return. Why: WebKit's select report says nothing about the site. How: This hands back every violation but that one.


}

// #endregion polVioFun



// #region relCheFun

/**
 * relCheFun = Relationship Check Function
 *
 * @summary
 * Checks that every link on the page that opens a new tab carries noopener,
 * so the opened page gets no handle on this one, and noreferrer, so the
 * opened site doesn't learn the address it came from, which for a card can
 * hold its recipient's name.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to check.
 *
 * @returns A promise that settles once both checks have passed, with no
 *          value.
 *
 * @example
 * ```ts
 * relCheFun(page) // => Promise<void>
 * ```
 *
*/

async function relCheFun ( curPagObj : Page ) : Promise< void > {


	const opeRelArr = await curPagObj.locator( 'a[target="_blank"]' ).evaluateAll( ( ancEleArr ) => ancEleArr.map( ( ancCurEle ) => ancCurEle.getAttribute( 'rel' ) ?? '' ) ); // What: Opener Relationship Array. Why: A new tab opened without noopener can reach back and change this page. How: This collects the rel of every link that opens a new tab.


	expect( opeRelArr.filter( ( relValStr ) => !/\bnoopener\b/.test( relValStr ) ) ).toEqual( [] );   // What: No Opener Assertion. Why: The opened page shouldn't get a handle on this one. How: This checks every new tab link carries noopener.
	expect( opeRelArr.filter( ( relValStr ) => !/\bnoreferrer\b/.test( relValStr ) ) ).toEqual( [] ); // What: No Referrer Assertion. Why: The opened site shouldn't learn the address it came from. How: This checks every new tab link carries noreferrer.


}

// #endregion relCheFun

// #endregion Helpers



// #region Module Init

test( 'the policy refuses an injected inline script', async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Policy Live Test. Why: A clean run means nothing unless the policy was really applied and its violations really recorded. How: This loads the Home page under the policy, injects an inline script, and checks it didn't run and was reported.


	await polSetFun( curPagObj ); // What: Policy Setup Call. Why: The page has to load under the policy. How: This adds the headers and the violation listener.

	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The script is injected into a real page. How: This loads the Home page.


	const injRanBoo = await curPagObj.evaluate( async () => { // What: Injection Ran Boolean. Why: A refused script never sets its flag. How: This adds an inline script that sets a flag, waits a moment for any violation event, and reports whether the flag was set.


		const scrNewEle = document.createElement( 'script' ); // What: Script New Element. Why: Injected markup is how a cross-site scripting attack runs code. How: This makes an inline script.


		scrNewEle.textContent = 'document.documentElement.dataset.injectedScriptRan = "true";'; // What: Script Text Assignment. Why: The flag shows whether the script ran. How: This sets a data attribute on the page's root if it does.


		document.body.append( scrNewEle ); // What: Script Append Call. Why: An inline script runs as soon as it joins the page, unless the policy refuses it. How: This adds it to the body.

		await new Promise( ( resWaiFun ) => setTimeout( resWaiFun, 100 ) ); // What: Event Wait Call. Why: The browser reports a violation as an event shortly after refusing the script. How: This waits 100ms for it.



		return document.documentElement.dataset.injectedScriptRan === 'true'; // What: Flag Return. Why: The test checks the script stayed off. How: This reports whether it set its flag.


	} );


	expect( injRanBoo ).toBe( false );                                                                           // What: Script Refused Assertion. Why: The policy has to stop inline script. How: This checks the injected script never ran.
	expect( await polVioFun( curPagObj, broNamStr ) ).toContainEqual( expect.stringContaining( 'script-src' ) ); // What: Violation Reported Assertion. Why: The later checks rely on violations being recorded. How: This checks the refusal was recorded as a script-src violation.


} );



for ( const staRecObj of [ ...STA_REC_ARR, ...INV_STA_ARR, ...FIL_STA_ARR, ...EMP_STA_ARR, ...PAU_STA_ARR, ...PHO_STA_ARR, ...STI_STA_ARR, ...COP_STA_ARR, ...BAR_STA_ARR ] ) { // What: State Loop. Why: Every state the suites visit has to work under the policy, every card's page, the Contact form's refused send, the Gallery's narrowed grids, a Family card's paused scene, open photo, and scene stills, and the share dialog's copy results and card page opening included. How: This declares one test per state.


	test( `${ staRecObj.ideStr } breaks no rule of the security policy and closes off every new tab link`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: State Policy Test. Why: A blocked resource, such as a font, would break the page once deployed, and the policy can't be loosened to hide it. How: This opens the state under the policy and checks nothing was refused and every new tab link is closed off.


		await polSetFun( curPagObj ); // What: Policy Setup Call. Why: The page has to load under the policy. How: This adds the headers and the violation listener.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The state's fonts, images, and open menu or dialog have to load before the page is checked. How: This opens the state the way the other page suites do.

		expect( await polVioFun( curPagObj, broNamStr ) ).toEqual( [] ); // What: No Violation Assertion. Why: Everything the state loads should be allowed by the policy. How: This checks none was refused.

		await relCheFun( curPagObj ); // What: Relationship Check Call. Why: Every new tab link has to be closed off. How: This checks each carries noopener and noreferrer.


	} );


}



for ( const [ resNamStr, staCodNum, resHeaStr ] of [ [ 'sent', 200, 'Message sent!' ], [ 'failed', 500, '' ] ] as const ) { // What: Form Result Loop. Why: Sending the form posts to the site and swaps in the thank-you or the error, which the policy has to allow too. How: This declares one test per result, each with the status Netlify answers with and the heading the thank-you shows, empty for the error. // What: Type Assertion Note. Why: Each row has to keep its fixed types rather than widen to a mixed array. How: The as const keeps each row a tuple.


	test( `the Contact form's ${ resNamStr } result breaks no rule of the security policy`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Form Result Policy Test. Why: Netlify Forms takes the post on the live site, and the result has to show without a refused resource. How: This sends the filled-in form with its post answered in the page, waits for the result, and checks nothing was refused.


		await polSetFun( curPagObj ); // What: Policy Setup Call. Why: The page has to load under the policy. How: This adds the headers and the violation listener.

		await curPagObj.route( ( urlCurObj ) => urlCurObj.pathname === '/', ( rouCurObj ) => rouCurObj.request().method() === 'POST' ? rouCurObj.fulfill( { body : '', status : staCodNum } ) : rouCurObj.fallback() ); // What: Root Post Route Call. Why: The preview server has no Netlify Forms to take the post. How: This answers a POST to the root with the result's status and hands every other request on to the policy's route.

		await curPagObj.goto( '/contact' ); // What: Contact Open Call. Why: The form lives on the Contact page. How: This loads it.

		await curPagObj.getByRole( 'main' ).getByLabel( 'Your name' ).fill( 'Test Visitor' );         // What: Name Fill Call. Why: Every required field is filled. How: This fills in a name.
		await curPagObj.getByRole( 'main' ).getByLabel( 'Your email' ).fill( 'visitor@example.com' ); // What: Email Fill Call. Why: Every required field is filled. How: This fills in a reserved example address.
		await curPagObj.getByRole( 'main' ).getByLabel( 'Message' ).fill( 'Hello.' );                 // What: Message Fill Call. Why: Every required field is filled. How: This fills in a message.

		await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: The filled-in form is sent. How: This presses "Send Message".

		await expect( resHeaStr ? curPagObj.getByRole( 'heading', { name : resHeaStr } ) : curPagObj.getByRole( 'alert' ) ).toBeVisible(); // What: Result Shown Assertion. Why: The check means something only once the result is on screen. How: This waits for the thank-you's heading, or the error's alert.

		expect( await polVioFun( curPagObj, broNamStr ) ).toEqual( [] ); // What: No Violation Assertion. Why: The result should load nothing the policy refuses. How: This checks none was refused.


	} );


}



for ( const carDatObj of CAR_DAT_ARR.filter( ( carCurObj ) => carCurObj.cusBoo || carCurObj.froBoo ) ) { // What: Named Card Loop. Why: A card that shows a name from its address shows whatever a shared link carries. How: This declares one test per card that takes a recipient's or a sender's name.


	test( `${ carDatObj.sluStr } shows a script-like name as text`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Untrusted Name Test. Why: A link anyone can write must never run code or add markup on the card. How: This opens the card under the policy with script-like names, then checks they show as text, no element came of them, and nothing was refused.


		const namParObj = new URLSearchParams( { from : INJ_MAR_STR, name : INJ_MAR_STR } ); // What: Name Parameters Object. Why: The card reads its names from its address. How: This encodes the script-like text as both ?name= and ?from=.


		await polSetFun( curPagObj ); // What: Policy Setup Call. Why: An injected handler would also show up as a refused inline script. How: This adds the headers and the violation listener.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Finished Card Emulation. Why: The names show once the card's scene is finished. How: This turns reduced motion on before the card loads, so it opens on its finished scene.

		await curPagObj.goto( `/${ carDatObj.sluStr }?${ namParObj }` ); // What: Card Open Call. Why: The names arrive through the card's own address, as a shared link carries them. How: This loads the card with both names.

		await expect( curPagObj.getByRole( 'main' ) ).toContainText( INJ_MAR_STR ); // What: Name As Text Assertion. Why: The name has to reach the card as the characters it was written in. How: This waits for the card to show the script-like text whole.

		expect( await curPagObj.locator( '[data-test-injected-markup]' ).count() ).toBe( 0 ); // What: No Markup Assertion. Why: A name rendered as HTML would turn into an image element with the marker attribute. How: This checks no such element exists.
		expect( await polVioFun( curPagObj, broNamStr ) ).toEqual( [] );                      // What: No Violation Assertion. Why: An inline handler the name added would be refused and reported. How: This checks nothing was refused.


	} );


}



test( 'the share dialog keeps script-like names as text', async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Untrusted Field Test. Why: The share dialog builds its link and preview from what the sender types, which must never run code or add markup. How: This opens the Merry Christmas card's share dialog under the policy, types script-like text into both name fields, then checks the fields and the link keep it as text, no element came of it, and nothing was refused.


	await polSetFun( curPagObj ); // What: Policy Setup Call. Why: An injected handler would also show up as a refused inline script. How: This adds the headers and the violation listener.

	await curPagObj.goto( '/gallery' ); // What: Gallery Open Call. Why: The share dialog opens from a card tile. How: This loads the Gallery.

	await curPagObj.getByRole( 'button', { name : 'Share Merry Christmas' } ).click(); // What: Share Click Call. Why: The Merry Christmas card takes both a recipient's and a sender's name. How: This opens its share dialog.

	await curPagObj.getByLabel( 'Their name (optional)' ).fill( INJ_FIE_STR ); // What: Recipient Fill Call. Why: The recipient's name feeds the link. How: This types the script-like text into it.
	await curPagObj.getByLabel( 'Your name (optional)' ).fill( INJ_FIE_STR );  // What: Sender Fill Call. Why: The sender's name feeds the link too. How: This types the script-like text into it.

	await expect( curPagObj.getByLabel( 'Their name (optional)' ) ).toHaveValue( INJ_FIE_STR ); // What: Recipient Value Assertion. Why: The field has to hold the characters typed. How: This checks its value is the text whole.
	await expect( curPagObj.getByLabel( 'Your name (optional)' ) ).toHaveValue( INJ_FIE_STR );  // What: Sender Value Assertion. Why: The field has to hold the characters typed. How: This checks its value is the text whole.

	expect( await curPagObj.getByLabel( 'Card link' ).inputValue() ).toContain( `?${ new URLSearchParams( [ [ 'name', INJ_FIE_STR ], [ 'from', INJ_FIE_STR ] ] ) }` ); // What: Encoded Link Assertion. Why: The link has to carry both names as encoded text, not markup. How: This checks the link field holds the name as ?name= and the sender as &from=, encoded the way the dialog's URL builder writes them, in its order.
	expect( await curPagObj.locator( '#z' ).count() ).toBe( 0 ); // What: No Markup Assertion. Why: A name rendered as HTML would turn into an image element with the id z. How: This checks no such element exists.
	expect( await polVioFun( curPagObj, broNamStr ) ).toEqual( [] );                                                                                                   // What: No Violation Assertion. Why: An inline handler the name added would be refused and reported. How: This checks nothing was refused.


} );

// #endregion Module Init


