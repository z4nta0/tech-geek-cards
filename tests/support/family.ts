


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
 * The Family cards' reachable states, for the suites that check every state
 * a visitor can reach, each at the Mother's Day card's phone and desktop
 * widths: its first photo opened full size in its dialog from the finished
 * mosaic by keyboard, the way a keyboard user reaches it, so the dialog's one
 * control holds the keyboard's focus ring, the last scene's photo and line
 * stills the scene controls step back to under reduced motion, and a scene
 * paused on its photo while the card plays with motion. The Family
 * cards share one engine, so one card stands for all three. They're kept out
 * of the shared state list, since the rendering suite captures every state
 * there against a baseline.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const PAU_STA_ARR : StaRecTyp[] = STA_REC_ARR.filter( ( staRecObj ) => staRecObj.patStr === '/mothers-day' ).map( ( staRecObj ) => ( { // What: Paused State Array. Why: With motion on, Pause leaves a visitor on a scene they can stay on, with the controls over the photo rather than in the stills' strip. How: For each Mother's Day state, this copies the state, replays the card with motion, pauses it on the second scene's photo, and names it after the state.


	...staRecObj, // What: State Record Spread. Why: The paused state keeps the card state's path and viewport, and its finished load decodes every photo before the replay. How: This copies the row.

	ideStr : `${ staRecObj.ideStr }-paused`, // What: Identifier String. Why: Each test names its width and the pause. How: This adds paused to the card state's name, such as mothers-day-desktop-paused.

	actFun : async ( curPagObj : Page ) => { // What: Action Function. Why: The state shows a scene paused while the card plays with motion. How: This replays the card, pauses it, steps to the second scene, plays it until its photo fills the heart, and pauses again.


		const redPreBoo = await curPagObj.evaluate( () => matchMedia( '(prefers-reduced-motion: reduce)' ).matches ); // What: Reduced Preset Boolean. Why: A check that asked for reduced motion has to get it back once the card is paused. How: This reads the preference before the action lifts it.


		if ( redPreBoo ) await curPagObj.emulateMedia( { reducedMotion : 'no-preference' } ); // What: Motion Allow Call. Why: Only a card playing with motion has a Pause button. How: This lifts reduced motion before the replay, when a check had set it.



		await curPagObj.getByRole( 'button', { name : 'Replay' } ).click(); // What: Replay Click Call. Why: The card opened finished, its photos decoded, and a replay plays it again with motion. How: This presses the floating bar's Replay, which remounts the card.

		await curPagObj.getByRole( 'button', { exact : true, name : 'Pause' } ).click(); // What: First Pause Click Call. Why: The card should hold still while it's stepped to a scene. How: This presses Pause.

		await curPagObj.getByRole( 'button', { name : 'Next scene' } ).click(); // What: Next Click Call. Why: The second scene's start is a known point to play from. How: This steps there, the card staying paused.

		await curPagObj.getByRole( 'button', { exact : true, name : 'Play' } ).click(); // What: Play Click Call. Why: The scene has to play until its photo shows. How: This presses Play.

		await expect.poll( () => curPagObj.locator( '[class*="famPhoDiv"]' ).evaluate( ( phoDivEle ) => getComputedStyle( phoDivEle ).getPropertyValue( '--fam-hea-sca' ).trim() ), { intervals : [ 50 ], timeout : 20000 } ).toBe( '1' ); // What: Heart Open Poll. Why: The pause should land on the scene's photo filling the screen, held for a while before the heart closes. How: This reads the heart's scale, found by the class name Vite keeps inside the hashed class, until it's fully open.

		await curPagObj.getByRole( 'button', { exact : true, name : 'Pause' } ).click(); // What: Second Pause Click Call. Why: The photo should stay on screen for the checks. How: This presses Pause.



		if ( redPreBoo ) await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Restore Call. Why: The check that asked for reduced motion reads the paused card with it. How: This sets the preference again.



		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Move Call. Why: The pointer would otherwise rest on Pause and hold its hover look in every check of this state. How: This parks the pointer in the corner.


	}


} ) );



const PHO_STA_ARR : StaRecTyp[] = STA_REC_ARR.filter( ( staRecObj ) => staRecObj.patStr === '/mothers-day' ).map( ( staRecObj ) => ( { // What: Photo State Array. Why: A photo opened full size covers the card with a dialog of its own, a state a visitor reaches and can stay on. How: For each Mother's Day state, this copies the state, opens the first photo in its action, and names it after the state.


	...staRecObj, // What: State Record Spread. Why: The photo state keeps the card state's path, viewport, and finished scene. How: This copies the row.

	ideStr : `${ staRecObj.ideStr }-photo`, // What: Identifier String. Why: Each test names its width and the open photo. How: This adds photo to the card state's name, such as mothers-day-desktop-photo.

	actFun : async ( curPagObj : Page ) => { // What: Action Function. Why: The state shows a photo opened from the mosaic. How: This focuses the first photo, opens it with Enter, and waits for the dialog.


		await curPagObj.getByRole( 'button', { name : /^View photo/ } ).first().focus(); // What: Photo Focus Call. Why: A photo opens full size only from its place in the mosaic. How: This focuses the first one.

		await curPagObj.keyboard.press( 'Enter' ); // What: Photo Open Press. Why: A keyboard opening leaves the dialog's control showing its focus ring, as it would for a keyboard user. How: This presses Enter on the focused photo.

		await expect( curPagObj.getByRole( 'dialog', { name : 'Photo' } ) ).toBeVisible(); // What: Photo Dialog Assertion. Why: The checks read the page only once the photo is open. How: This waits until the dialog shows.


	}


} ) );



const STI_STA_ARR : StaRecTyp[] = STA_REC_ARR.filter( ( staRecObj ) => staRecObj.patStr === '/mothers-day' ).flatMap( ( staRecObj ) => [ { cliNum : 1, kinStr : 'photo-still' }, { cliNum : 2, kinStr : 'line-still' } ].map( ( stiKinObj ) => ( { // What: Still State Array. Why: Under reduced motion the scene controls step back through each scene as two stills, its photo and its line, looks a visitor can stay on. How: For each Mother's Day state and each kind of still, this copies the state, presses "Previous scene" from the finished card once for the last scene's photo or twice for its line, and names it after both.


	...staRecObj, // What: State Record Spread. Why: The still keeps the card state's path, viewport, and reduced motion. How: This copies the row.

	ideStr : `${ staRecObj.ideStr }-${ stiKinObj.kinStr }`, // What: Identifier String. Why: Each test names its width and the still. How: This adds the still's kind to the card state's name, such as mothers-day-desktop-photo-still.

	actFun : async ( curPagObj : Page ) => { // What: Action Function. Why: The state shows a still the controls step back to. How: This presses "Previous scene" the still's number of times, waiting each time for the dots to name a scene.


		for ( let cliIndNum = 0; cliIndNum < stiKinObj.cliNum; cliIndNum++ ) { // What: Previous Press Loop. Why: The last photo is one step back from the finished card, and the last line two. How: This presses once per step.


			await curPagObj.getByRole( 'button', { name : 'Previous scene' } ).click(); // What: Previous Click Call. Why: The controls step back one still per press. How: This presses "Previous scene".

			await expect( curPagObj.getByRole( 'img', { name : /^Scene \d+ of \d+$/ } ) ).toBeVisible(); // What: Scene Dots Assertion. Why: The checks read the card only once it sits on a scene rather than the closing. How: This waits until the dots name a scene.


		}



		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Move Call. Why: The pointer would otherwise rest on "Previous scene" and hold its hover look in every check of this state. How: This parks the pointer in the corner.


	}


} ) ) );

// #endregion Constants



// #region Exports

export { PAU_STA_ARR, PHO_STA_ARR, STI_STA_ARR }; // What: Named Exports. Why: The suites that check every reachable state share the Family states. How: This exports the paused, photo, and still state lists.

// #endregion Exports


