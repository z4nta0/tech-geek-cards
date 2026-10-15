


// #region Imports

import { expect        } from '@playwright/test';     // What: Expect. Why: Each state passes only when it matches its approved screenshot. How: This compares the page with its baseline.
import { fileURLToPath } from 'node:url';             // What: File URL To Path. Why: The capture stylesheet is found beside this spec. How: This turns its file URL into a path.
import { opeStaFun     } from '../support/states.ts'; // What: Open State Function. Why: Each state is captured settled. How: This loads it and waits for it.
import { STA_REC_ARR   } from '../support/states.ts'; // What: State Record Array. Why: Every page state gets a baseline. How: This lists them.
import { test          } from '@playwright/test';     // What: Test. Why: Each state is its own comparison. How: This declares them.

// #endregion Imports



/**
 * screens.spec.ts = Screens Spec
 *
 * @summary
 * Compares a full-page screenshot of every page state with its approved
 * baseline, in whichever engine the project runs, so a change that shifts the
 * layout or the styling anywhere on a page fails until it's looked at. Each
 * state opens under reduced motion and is captured with animations stopped, so
 * it's always caught at rest, with the page's clock fixed to one date,
 * since the footer's copyright year comes from the current year and would
 * otherwise fail the baselines every January, and with Math.random fixed,
 * since Home picks its featured cards at random. Chromium and WebKit
 * capture with hide-patterns.css, which hides the faint background patterns
 * they tile slightly differently from run to run. Baselines live in
 * tests/rendering/baselines, one per state and engine, captured on Linux;
 * another system's font rendering would differ, so baselines are refreshed on
 * the machine that runs the suite. When a change is meant to alter how a page
 * looks, review the failing diff in the report, then refresh the baselines
 * with npm run test:rendering -- --update-snapshots and commit them with the
 * change.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const FIX_TIM_STR = '2026-10-11T12:00:00';                                              // What: Fixed Time String. Why: The footer's copyright year is worked out from today's date, so the baselines would stop matching once the year turned over. How: This is the date and time every capture's page clock reads.
const HID_PAT_STR = fileURLToPath( new URL( './hide-patterns.css', import.meta.url ) ); // What: Hide Patterns String. Why: Chromium and WebKit tile the background patterns a few color levels differently from run to run. How: This is the path of the stylesheet that hides them during those engines' captures.
const MAX_DIF_NUM = 0;                                                                  // What: Maximum Difference Number. Why: Each engine renders a state identically from run to run on the machine that captured its baseline, and even a small tolerance can hide a real change, as it hid reese-roofing's nav links moving. How: This fails a comparison when even one pixel differs, with PIX_THR_NUM deciding what counts as differing.
const PIX_THR_NUM = 0;                                                                  // What: Pixel Threshold Number. Why: Playwright otherwise treats a pixel whose color moved by less than 0.2 of its color space as unchanged, which let a contrast fix's slightly darker text pass as identical in seal-and-shield. How: This counts any change to a pixel's color at all as a difference.

// #endregion Constants



// #region Module Init

for ( const staRecObj of STA_REC_ARR ) { // What: State Test Loop. Why: Every page state has a baseline. How: This declares one comparison per state.


	test( `${ staRecObj.ideStr } matches its approved screenshot`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Screenshot Test. Why: A page should only change how it looks on purpose. How: This opens the state at rest and compares it with its baseline.


		await curPagObj.clock.setFixedTime( new Date( FIX_TIM_STR ) ); // What: Fixed Clock Call. Why: The page's year-based text has to read the same in every run. How: This makes the page's Date always return the fixed time, while its timers keep running normally.

		await curPagObj.addInitScript( () => { Math.random = () => 0.5; } ); // What: Fixed Random Call. Why: Home picks its featured cards at random on each visit, so the baselines would change from run to run. How: This makes the page's Math.random always return 0.5 before any of its scripts run, so the shuffle lands on the same four every time.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Entrance animations would otherwise be caught partway. How: This makes the page match prefers-reduced-motion, which turns them off.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The state is captured settled. How: This loads and settles it.


		await expect( curPagObj ).toHaveScreenshot( `${ staRecObj.ideStr }.png`, { // What: Baseline Comparison Assertion. Why: The state should look exactly as approved. How: This captures the whole page with animations stopped and compares it with the state's baseline pixel for pixel, color for color.


			animations        : 'disabled',                                 // What: Animations. Why: A looping animation would never hold still for the capture. How: This fast-forwards every finite animation and transition to its end, and resets each looping one to its start, for the capture.
			fullPage          : true,                                       // What: Full Page. Why: The whole state has to match, not just the first screen. How: This captures the page's full height.
			maxDiffPixelRatio : MAX_DIF_NUM,                                // What: Maximum Diff Pixel Ratio. Why: No pixel may differ from the baseline. How: This reads the suite's zero tolerance.
			stylePath         : engNamStr === 'firefox' ? [] : HID_PAT_STR, // What: Style Path. Why: Chromium and WebKit don't draw the background patterns the same every run, while Firefox does. How: This hides the patterns for those two engines' captures and leaves Firefox's untouched.
			threshold         : PIX_THR_NUM                                 // What: Threshold. Why: Even a slight color change should fail. How: This reads the suite's zero per-pixel threshold.


		} );


	} );


}

// #endregion Module Init


