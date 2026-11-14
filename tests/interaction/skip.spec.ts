


// #region Imports

import { expect      } from '@playwright/test';     // What: Expect. Why: Each check passes only when the finished card arrives the way it should. How: This asserts on what each check reads, such as the photo grid's opacity.
import { opeStaFun   } from '../support/states.ts'; // What: Open State Function. Why: Each check starts from a settled card. How: This loads the state and runs its action.
import { PAU_STA_ARR } from '../support/family.ts'; // What: Paused State Array. Why: With motion, the skip is pressed from a scene paused partway through the card. How: This lists the Mother's Day states paused on a scene.
import { STI_STA_ARR } from '../support/family.ts'; // What: Still State Array. Why: Under reduced motion, the skip is pressed from a still the controls stepped back to. How: This lists the Mother's Day stills.
import { test        } from '@playwright/test';     // What: Test. Why: The skip with motion and under reduced motion are separate tests. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The opacity helper reads a page. How: This types its page parameter.

// #endregion Imports



/**
 * skip.spec.ts = Skip Spec
 *
 * @summary
 * Checks that a Family card's "Skip to end" shows its result arriving, in
 * whichever engine the project runs. With motion, the finished card's photo
 * grid fades in after the jump rather than appearing at once; under reduced
 * motion the finished card simply shows. The Family cards share one engine, so
 * the Mother's Day card stands for all three.
 *
 * Sections:
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

const griOpaFun = ( curPagObj : Page ) : Promise< number > => curPagObj.locator( '[class*="famGriDiv"]' ).evaluate( ( griDivEle ) => Number( getComputedStyle( griDivEle ).opacity ) ); // What: Grid Opacity Function. Why: The checks read how far the photo grid has faded in. How: This finds the grid by the class name Vite keeps inside the hashed class and returns its computed opacity.

// #endregion Helpers



// #region Module Init

test( 'skipping to the end of a playing Family card fades the finished card in', async ( { page : curPagObj } ) => { // What: Skip Fade Test. Why: A press should show its result arriving rather than the finished card snapping in. How: This pauses the card on a scene, skips to the end, and checks the grid starts faded and then fades fully in.


	await opeStaFun( curPagObj, PAU_STA_ARR[ 0 ] ); // What: Paused Open Call. Why: The skip is pressed partway through the card. How: This opens the card paused on its second scene's photo.

	await curPagObj.getByRole( 'button', { name : 'Skip to end' } ).click(); // What: Skip Click Call. Why: The skip is the press being checked. How: This presses "Skip to end".

	expect( await griOpaFun( curPagObj ) ).toBeLessThan( 1 ); // What: Faded Start Assertion. Why: The grid should still be fading in just after the press. How: This reads its opacity right away and checks it isn't full yet.

	await expect.poll( () => griOpaFun( curPagObj ), { timeout : 2000 } ).toBe( 1 ); // What: Faded In Assertion. Why: The fade has to end on the finished card. How: This reads the grid's opacity until it's full.


} );



test( 'skipping to the end of a Family card under reduced motion shows the finished card at once', async ( { page : curPagObj } ) => { // What: Reduced Skip Test. Why: Someone who asked for less motion should get the finished card without a fade. How: This opens a still under reduced motion, skips to the end, and checks the grid is already fully shown.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Call. Why: The skip is checked with the setting on. How: This asks the page for reduced motion before it loads.

	await opeStaFun( curPagObj, STI_STA_ARR[ 0 ] ); // What: Still Open Call. Why: The skip is pressed from a scene rather than the finished card. How: This opens the card on its last scene's photo still.

	await curPagObj.getByRole( 'button', { name : 'Skip to end' } ).click(); // What: Skip Click Call. Why: The skip is the press being checked. How: This presses "Skip to end".

	expect( await griOpaFun( curPagObj ) ).toBe( 1 ); // What: Shown Assertion. Why: Under reduced motion nothing should fade. How: This reads the grid's opacity right away and checks it's already full.


} );

// #endregion Module Init


