


// #region Imports

import type { Page } from '@playwright/test'; // What: Page. Why: Opening a state drives a Playwright page. How: This types opeStaFun's page parameter.

// #endregion Imports



/**
 * states.ts = States
 *
 * @summary
 * The page states the accessibility, interaction, and rendering suites visit,
 * and the helper that opens one; the responsive suite opens its own widths
 * through the same helper. A state is a page at a width, sometimes with
 * something opened on it: every route and the 404 page at phone and desktop
 * widths, the mobile menu open on a phone, and the share dialog open on the
 * Gallery at both widths. The card pages aren't states yet, since each card's
 * own code is checked as that card is converted. opeStaFun sizes the
 * viewport, loads the page, waits for the fonts, scrolls through the page so
 * any lazily loaded image loads, runs the state's own action, such as opening
 * the menu, and then waits for the page to stay still so nothing is measured
 * mid-fade.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type StaRecTyp = { // What: State Record Type. Why: Every check reads the same description of a state. How: This names a state, its path, its viewport, and an optional action that opens something on it.


	actFun? : ( curPagObj : Page ) => Promise< void >, // What: Action Function. Why: Some states need something opened after the page loads. How: This runs against the loaded page, e.g. clicking the menu toggle.
	heiNum  : number,                                  // What: Height Number. Why: The viewport's height decides what's on screen. How: This is the viewport height in CSS pixels.
	ideStr  : string,                                  // What: Identifier String. Why: Each test names the state it checks. How: This becomes part of the test title.
	patStr  : string,                                  // What: Path String. Why: Each state opens one route. How: This is the path loaded from the dev server.
	redBoo? : boolean,                                 // What: Reduced Boolean. Why: A card plays for up to two minutes, so it never sits still long enough to check. How: When true, the page loads under reduced motion, opening on the card's finished scene, and the preference is switched back off once it's open.
	widNum  : number                                   // What: Width Number. Why: Layouts and menus change with width. How: This is the viewport width in CSS pixels.


};

// #endregion Types



// #region Constants

// #region STA_REC_ARR

/**
 * STA_REC_ARR = State Record Array
 *
 * @summary
 * Every state the checks visit: each route (Home, Gallery, About, Contact, and
 * each converted card's page) and the 404 page at a phone width (390px) and a
 * desktop width (1,440px), the mobile menu open at the phone width, since the
 * menu is only reachable there, and the share dialog open on the Gallery at
 * both widths, plus a signable card's at the phone width. Every row shares the
 * {@link StaRecTyp} shape, so its fields carry no comments of their own:
 *  - `actFun` (Function): Action Function, run after the page loads to open
 *    something on it, such as the menu. Only the menu and dialog rows have
 *    one.
 *  - `heiNum` (Number): Height Number, the viewport height in CSS pixels.
 *  - `ideStr` (String): Identifier String, the state's name in test titles.
 *  - `patStr` (String): Path String, the route loaded from the dev server.
 *  - `redBoo` (Boolean): Reduced Boolean, true on a card's rows, which load
 *    under reduced motion so the card opens finished, then switch it off.
 *  - `widNum` (Number): Width Number, the viewport width in CSS pixels.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const STA_REC_ARR : StaRecTyp[] = [ // What: State Record Array. Why: Every check walks the same list of states, so a new state is added in one place. How: Each row names a state, its path, and its viewport, and the menu and dialog rows add the action that opens each.


	{ heiNum : 900, ideStr : 'home-desktop',              patStr : '/',                      redBoo : false, widNum : 1440 }, // What: Home Desktop State. Why: Most visitors land here. How: This loads the home page at 1,440px.
	{ heiNum : 844, ideStr : 'home-phone',                patStr : '/',                      redBoo : false, widNum : 390  }, // What: Home Phone State. Why: The phone layout stacks the page into one column and hides the bar's links behind the menu. How: This loads the home page at 390px.
	{ heiNum : 900, ideStr : 'gallery-desktop',           patStr : '/gallery',               redBoo : false, widNum : 1440 }, // What: Gallery Desktop State. Why: The Gallery holds the search, the filters, and every card tile. How: This loads the Gallery at 1,440px.
	{ heiNum : 844, ideStr : 'gallery-phone',             patStr : '/gallery',               redBoo : false, widNum : 390  }, // What: Gallery Phone State. Why: The phone layout stacks the tiles into one column and hides the bar's links behind the menu. How: This loads the Gallery at 390px.
	{ heiNum : 900, ideStr : 'about-desktop',             patStr : '/about',                 redBoo : false, widNum : 1440 }, // What: About Desktop State. Why: The About page holds the story, the facts, and the sister sites. How: This loads the About page at 1,440px.
	{ heiNum : 844, ideStr : 'about-phone',               patStr : '/about',                 redBoo : false, widNum : 390  }, // What: About Phone State. Why: The phone layout stacks the page into one column and hides the bar's links behind the menu. How: This loads the About page at 390px.
	{ heiNum : 900, ideStr : 'contact-desktop',           patStr : '/contact',               redBoo : false, widNum : 1440 }, // What: Contact Desktop State. Why: The Contact page holds the form and the sidebar. How: This loads the Contact page at 1,440px.
	{ heiNum : 844, ideStr : 'contact-phone',             patStr : '/contact',               redBoo : false, widNum : 390  }, // What: Contact Phone State. Why: The phone layout stacks the page into one column and hides the bar's links behind the menu. How: This loads the Contact page at 390px.
	{ heiNum : 900, ideStr : 'not-found-desktop',         patStr : '/missing',               redBoo : false, widNum : 1440 }, // What: Not Found Desktop State. Why: Every unknown address lands on the 404 page. How: This loads an address the site doesn't have at 1,440px.
	{ heiNum : 844, ideStr : 'not-found-phone',           patStr : '/missing',               redBoo : false, widNum : 390  }, // What: Not Found Phone State. Why: The phone bar hides its links behind the menu on the 404 page too. How: This loads an address the site doesn't have at 390px.
	{ heiNum : 900, ideStr : 'christmas-desktop',         patStr : '/merry-christmas',       redBoo : true,  widNum : 1440 }, // What: Christmas Desktop State. Why: The Christmas card is the first converted card, so its page joins every check. How: This loads it at 1,440px, where reduced motion shows its finished snowy scene.
	{ heiNum : 844, ideStr : 'christmas-phone',           patStr : '/merry-christmas',       redBoo : true,  widNum : 390  }, // What: Christmas Phone State. Why: The card's lettering shrinks and the floating bar crowds it on a phone. How: This loads it at 390px.
	{ heiNum : 900, ideStr : 'birthday-desktop',          patStr : '/happy-birthday',        redBoo : true,  widNum : 1440 }, // What: Birthday Desktop State. Why: The Birthday card's message and cake, and converted cards join every check. How: This loads it at 1,440px, where it shows its message, cake, and balloons, still under reduced motion.
	{ heiNum : 844, ideStr : 'birthday-phone',            patStr : '/happy-birthday',        redBoo : true,  widNum : 390  }, // What: Birthday Phone State. Why: The Birthday card's message and cake, and converted cards join every check. How: This loads it at 390px, where it shows its message, cake, and balloons, still under reduced motion.
	{ heiNum : 900, ideStr : 'mothers-day-desktop',       patStr : '/mothers-day',           redBoo : true,  widNum : 1440 }, // What: Mother's Day Desktop State. Why: The Mother's Day card ends on its greeting over a photo mosaic, and converted cards join every check. How: This loads it at 1,440px, where it shows its finished greeting and mosaic, which reduced motion shows at once.
	{ heiNum : 844, ideStr : 'mothers-day-phone',         patStr : '/mothers-day',           redBoo : true,  widNum : 390  }, // What: Mother's Day Phone State. Why: The Mother's Day card ends on its greeting over a photo mosaic, and converted cards join every check. How: This loads it at 390px, where it shows its finished greeting and mosaic, which reduced motion shows at once.
	{ heiNum : 900, ideStr : 'fathers-day-desktop',       patStr : '/fathers-day',           redBoo : true,  widNum : 1440 }, // What: Father's Day Desktop State. Why: The Father's Day card ends on its greeting over a photo mosaic, and converted cards join every check. How: This loads it at 1,440px, where it shows its finished greeting and mosaic, which reduced motion shows at once.
	{ heiNum : 844, ideStr : 'fathers-day-phone',         patStr : '/fathers-day',           redBoo : true,  widNum : 390  }, // What: Father's Day Phone State. Why: The Father's Day card ends on its greeting over a photo mosaic, and converted cards join every check. How: This loads it at 390px, where it shows its finished greeting and mosaic, which reduced motion shows at once.
	{ heiNum : 900, ideStr : 'fourth-of-july-desktop',    patStr : '/fourth-of-july',        redBoo : true,  widNum : 1440 }, // What: Fourth Of July Desktop State. Why: The Fourth of July card's flag and lettering center above the bar, and converted cards join every check. How: This loads it at 1,440px, where it shows its finished flag and lettering, which reduced motion shows at once.
	{ heiNum : 844, ideStr : 'fourth-of-july-phone',      patStr : '/fourth-of-july',        redBoo : true,  widNum : 390  }, // What: Fourth Of July Phone State. Why: The Fourth of July card's flag and lettering center above the bar, and converted cards join every check. How: This loads it at 390px, where it shows its finished flag and lettering, which reduced motion shows at once.
	{ heiNum : 900, ideStr : 'halloween-desktop',         patStr : '/happy-halloween',       redBoo : true,  widNum : 1440 }, // What: Halloween Desktop State. Why: The Halloween card's heading, ghosts, and pumpkins share the screen, and converted cards join every check. How: This loads it at 1,440px, where it shows its finished scene, which reduced motion shows at once.
	{ heiNum : 844, ideStr : 'halloween-phone',           patStr : '/happy-halloween',       redBoo : true,  widNum : 390  }, // What: Halloween Phone State. Why: The Halloween card's heading, ghosts, and pumpkins share the screen, and converted cards join every check. How: This loads it at 390px, where it shows its finished scene, which reduced motion shows at once.
	{ heiNum : 900, ideStr : 'thanksgiving-desktop',      patStr : '/happy-thanksgiving',    redBoo : true,  widNum : 1440 }, // What: Thanksgiving Desktop State. Why: The Thanksgiving card's illustrations and message stack on a phone, and converted cards join every check. How: This loads it at 1,440px, where it shows its finished illustrations and message, which reduced motion shows at once.
	{ heiNum : 844, ideStr : 'thanksgiving-phone',        patStr : '/happy-thanksgiving',    redBoo : true,  widNum : 390  }, // What: Thanksgiving Phone State. Why: The Thanksgiving card's illustrations and message stack on a phone, and converted cards join every check. How: This loads it at 390px, where it shows its finished illustrations and message, which reduced motion shows at once.
	{ heiNum : 900, ideStr : 'christmas-prank-desktop',   patStr : '/merry-christmas-prank', redBoo : true,  widNum : 1440 }, // What: Christmas Prank Desktop State. Why: The Christmas prank opens on a fake hacked screen no other card shows. How: This loads it at 1,440px, where it shows its finished snowy scene, which reduced motion shows at once.
	{ heiNum : 844, ideStr : 'christmas-prank-phone',     patStr : '/merry-christmas-prank', redBoo : true,  widNum : 390  }, // What: Christmas Prank Phone State. Why: The Christmas prank opens on a fake hacked screen no other card shows. How: This loads it at 390px, where it shows its finished snowy scene, which reduced motion shows at once.
	{ heiNum : 900, ideStr : 'fathers-day-prank-desktop', patStr : '/fathers-day-prank',     redBoo : true,  widNum : 1440 }, // What: Father's Day Prank Desktop State. Why: The Father's Day prank shares the Family engine with its own photos and lines. How: This loads it at 1,440px, where it shows its finished greeting and mosaic, which reduced motion shows at once.
	{ heiNum : 844, ideStr : 'fathers-day-prank-phone',   patStr : '/fathers-day-prank',     redBoo : true,  widNum : 390  }, // What: Father's Day Prank Phone State. Why: The Father's Day prank shares the Family engine with its own photos and lines. How: This loads it at 390px, where it shows its finished greeting and mosaic, which reduced motion shows at once.

	{ // What: Menu Phone State. Why: The open menu holds the phone's only copy of the page links. How: This loads the home page at 390px and opens the menu through its toggle button.


		heiNum : 844,
		ideStr : 'menu-phone',
		patStr : '/',
		widNum : 390,

		actFun : async ( curPagObj ) => { // What: Menu Open Action. Why: The state shows the menu as a visitor sees it once it's open. How: This taps the toggle, then moves the pointer off it.


			await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); // What: Toggle Click Call. Why: The menu opens only through its toggle. How: This clicks the button.

			await curPagObj.mouse.move( 0, 0 ); // What: Pointer Move Call. Why: A finger lifts after a tap, but Playwright's mouse stays put and would hold the toggle's hover color in every check of this state. How: This parks the pointer on the bar's empty top-left corner.


		}


	},

	{ // What: Share Desktop State. Why: The share dialog is how every card is sent, so it gets the same checks as a page. How: This loads the Gallery at 1,440px and opens the share dialog for the birthday card.


		heiNum : 900,
		ideStr : 'share-desktop',
		patStr : '/gallery',
		widNum : 1440,

		actFun : async ( curPagObj ) => { // What: Share Open Action. Why: The state shows the dialog as a visitor sees it once it's open. How: This presses the birthday tile's Share button, then moves the pointer off it.


			await curPagObj.getByRole( 'button', { name : 'Share Happy Birthday' } ).click(); // What: Share Click Call. Why: The dialog opens only from a Share button. How: This presses the birthday card's, which has a name field.

			await curPagObj.mouse.move( 0, 0 ); // What: Pointer Move Call. Why: The pointer would otherwise rest on whatever lands under it and hold its hover look in every check of this state. How: This parks the pointer in the corner.


		}


	},

	{ // What: Share Phone State. Why: On a phone the dialog fills most of the screen and its buttons wrap. How: This loads the Gallery at 390px and opens the share dialog for the birthday card.


		heiNum : 844,
		ideStr : 'share-phone',
		patStr : '/gallery',
		widNum : 390,

		actFun : async ( curPagObj ) => { // What: Share Open Action. Why: The state shows the dialog as a visitor sees it once it's open. How: This presses the birthday tile's Share button, then moves the pointer off it.


			await curPagObj.getByRole( 'button', { name : 'Share Happy Birthday' } ).click(); // What: Share Click Call. Why: The dialog opens only from a Share button. How: This presses the birthday card's, which has a name field.

			await curPagObj.mouse.move( 0, 0 ); // What: Pointer Move Call. Why: The pointer would otherwise rest on whatever lands under it and hold its hover look in every check of this state. How: This parks the pointer in the corner.


		}


	},

	{ // What: Share Signed Phone State. Why: A card that can be signed adds a second name field, the dialog's tallest form, which matters most on a phone. How: This loads the Gallery at 390px and opens the share dialog for the Merry Christmas card.


		heiNum : 844,
		ideStr : 'share-signed-phone',
		patStr : '/gallery',
		widNum : 390,

		actFun : async ( curPagObj ) => { // What: Share Open Action. Why: The state shows the dialog as a visitor sees it once it's open. How: This presses the Merry Christmas tile's Share button, then moves the pointer off it.


			await curPagObj.getByRole( 'button', { name : 'Share Merry Christmas' } ).click(); // What: Share Click Call. Why: The dialog opens only from a Share button. How: This presses the Merry Christmas card's, which has both name fields.

			await curPagObj.mouse.move( 0, 0 ); // What: Pointer Move Call. Why: The pointer would otherwise rest on whatever lands under it and hold its hover look in every check of this state. How: This parks the pointer in the corner.


		}


	}


];

// #endregion STA_REC_ARR

// #endregion Constants



// #region Helpers

// #region revPagFun

/**
 * revPagFun = Reveal Page Function
 *
 * @summary
 * Scrolls the page from top to bottom half a screen at a time, the way a
 * visitor reading it would, then jumps back to the top. An image set to load
 * lazily only loads once it nears the screen, so a page that's never scrolled
 * would keep it blank, and a full-page screenshot or an axe scan would miss
 * it. Each step pauses briefly so the browser starts the images coming into
 * view, and every jump is instant, overriding any smooth scrolling the page
 * asks for.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to scroll through.
 *
 * @returns A promise that settles once the whole page has been scrolled
 *          through, with no value.
 *
 * @example
 * ```ts
 * revPagFun(page) // => Promise<void>
 * ```
 *
*/

async function revPagFun ( curPagObj : Page ) : Promise< void > {


	await curPagObj.evaluate( async () => { // What: Page Scroll Pass. Why: Images that load lazily have to be scrolled near before they're checked. How: This steps down the page half a screen at a time, pausing at each step, then returns to the top.


		for ( let scrTopNum = 0; scrTopNum < document.documentElement.scrollHeight; scrTopNum += window.innerHeight / 2 ) { // What: Scroll Step Loop. Why: Every image has to come near the viewport at some point. How: This moves the scroll position down by half the viewport's height each pass until it passes the page's end.


			window.scrollTo( { behavior : 'instant', top : scrTopNum } ); // What: Scroll Step Call. Why: The next stretch of the page has to come into view. How: This jumps straight to the step's position, skipping any smooth scrolling.

			await new Promise( ( resProFun ) => setTimeout( resProFun, 100 ) ); // What: Step Pause Wait. Why: The browser decides to start a lazy image on its own schedule, not the moment the page moves. How: This waits 100ms before the next step.


		}



		window.scrollTo( { behavior : 'instant', top : 0 } ); // What: Scroll Reset Call. Why: Each state is checked from the top of the page, where a visitor arrives. How: This jumps back to the top.


	} );


}

// #endregion revPagFun



// #region waiSetFun

/**
 * waiSetFun = Wait Settled Function
 *
 * @summary
 * Waits until the page has stayed still for half a second: no animation or
 * transition running except any that repeat forever, which never finish and so
 * are skipped (the reduced motion check is what catches one that shouldn't be
 * playing). A single still moment isn't enough, since a fade can start just
 * after the last one ends, so the page has to read as still on five checks in
 * a row, 100ms apart. It fails after 5 seconds rather than hanging, which
 * leaves plenty of room for each page's entrance fade.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to wait on.
 *
 * @returns A promise that settles once the page has stopped moving, with no
 *          value.
 *
 * @example
 * ```ts
 * waiSetFun(page) // => Promise<void>
 * ```
 *
*/

async function waiSetFun ( curPagObj : Page ) : Promise< void > {


	const deaTimNum = Date.now() + 5000; // What: Deadline Time Number. Why: A page that never settles should fail rather than hang the run. How: This marks 5 seconds from now.

	let quiCouNum = 0; // What: Quiet Count Number. Why: The page has to stay still across several checks in a row. How: This counts consecutive still checks, starting from none.


	while ( quiCouNum < 5 ) { // What: Settle Check Loop. Why: The page counts as settled only after five still checks in a row. How: This keeps checking until the count reaches five.


		if ( Date.now() > deaTimNum ) throw new Error( 'The page was still animating after 5 seconds.' ); // What: Deadline Guard. Why: A page that keeps moving would otherwise loop forever. How: This fails the check once the deadline passes.



		const stiPagBoo = await curPagObj.evaluate( () => document.getAnimations().every( ( aniCurObj ) => aniCurObj.playState !== 'running' || aniCurObj.effect?.getComputedTiming().iterations === Infinity ) ); // What: Still Page Boolean. Why: Each check asks whether anything that ends is still moving. How: This is true when every running animation or transition is one that repeats forever.

		quiCouNum = stiPagBoo ? quiCouNum + 1 : 0; // What: Quiet Count Update. Why: Any movement restarts the count, so the page has to stay still the whole half second. How: This adds one for a still check and resets to zero otherwise.

		await curPagObj.waitForTimeout( 100 ); // What: Check Pause Wait. Why: The checks have to span time to prove the page stays still. How: This waits 100ms before the next one.


	}


}

// #endregion waiSetFun



// #region opeStaFun

/**
 * opeStaFun = Open State Function
 *
 * @summary
 * Opens one state on a page and waits until it's settled: sizes the
 * viewport, loads the path, waits for the web fonts, scrolls through the
 * page so every lazily loaded image starts loading ({@link revPagFun}),
 * waits for every image to decode, runs the state's action if it has one,
 * then waits until the page stays still ({@link waiSetFun}), so a check never
 * measures a heading halfway through its entrance fade or a menu halfway
 * open.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the state on.
 * @param staRecObj - State Record Object: {@link StaRecTyp}
 *
 * @returns A promise that settles once the state is open and settled, with no
 *          value.
 *
 * @example
 * ```ts
 * opeStaFun(page, staRecObj) // => Promise<void>
 * ```
 *
*/

async function opeStaFun ( curPagObj : Page, staRecObj : StaRecTyp ) : Promise< void > {


	await curPagObj.setViewportSize( { height : staRecObj.heiNum, width : staRecObj.widNum } ); // What: Viewport Size Call. Why: The state's layout depends on its width. How: This sizes the page before it loads, so breakpoints apply from the first paint.

	const redPreBoo = await curPagObj.evaluate( () => matchMedia( '(prefers-reduced-motion: reduce)' ).matches ); // What: Reduced Preset Boolean. Why: A test that asked for reduced motion itself has to keep it. How: This reads the preference before the state touches it.



	if ( staRecObj.redBoo ) await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Card Finish Emulation. Why: A card would otherwise still be playing when it's checked. How: This loads the card under reduced motion, which opens it on its finished scene.



	await curPagObj.goto( staRecObj.patStr ); // What: Page Load Call. Why: Each state starts from a fresh load of its route. How: This opens the path on the suite's dev server.

	await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Text measured before its web font loads would have the wrong size and wrapping. How: This waits until every font face has loaded.

	await revPagFun( curPagObj ); // What: Page Reveal Call. Why: Lazy images stay blank until scrolled near. How: This scrolls through the page and back to the top.

	await curPagObj.evaluate( () => Promise.all( Array.from( document.images, ( imaCurEle ) => imaCurEle.decode() ) ) ); // What: Images Decoded Wait. Why: A check shouldn't measure or capture the page before its images are drawn. How: This waits until every image on the page has finished decoding.



	if ( staRecObj.redBoo && !redPreBoo ) await curPagObj.emulateMedia( { reducedMotion : 'no-preference' } ); // What: Card Motion Restore. Why: The card is finished, but its controls still have to ease their hover and focus looks. How: This turns the preference back off, unless the test asked for reduced motion itself.



	if ( staRecObj.actFun ) await staRecObj.actFun( curPagObj ); // What: State Action Call. Why: Some states need something opened first. How: This runs the state's action, if it has one.



	await waiSetFun( curPagObj ); // What: Settled Page Wait. Why: A check should see the page at rest, not mid-fade. How: This waits until the page stays still for half a second.


}

// #endregion opeStaFun

// #endregion Helpers



// #region Exports

export { opeStaFun, STA_REC_ARR }; // What: Named Exports. Why: The accessibility, interaction, rendering, and responsive specs share these states and their opener. How: This exports the state list and the helper that opens one.

// #endregion Exports


