


// #region Imports

import { expect      } from '@playwright/test';     // What: Expect. Why: The checks pass only when the dialog closes, and the motion checks also need its closing fade to play. How: This asserts on what each check reads, such as the dialog's animations.
import { opeStaFun   } from '../support/states.ts'; // What: Open State Function. Why: The dialog closes from a settled state. How: This loads the state and runs its action, which opens the dialog.
import { STA_REC_ARR } from '../support/states.ts'; // What: State Record Array. Why: The checks start from the Gallery with the share dialog open. How: This lists every state, from which that one is picked.
import { test        } from '@playwright/test';     // What: Test. Why: Each way of closing is its own test. How: This declares them.

// #endregion Imports



/**
 * share.spec.ts = Share Spec
 *
 * @summary
 * Checks that the share dialog leaves the way it arrived, in whichever engine
 * the project runs: its "Close" button, Escape, and a tap on the dimmed page
 * around it each start the dialog's closing fade, and the dialog closes once
 * it ends. The dialog opens at the desktop width with motion allowed, so the
 * fade really plays, and is closed again with reduced motion turned on just
 * before, where the shortened fade still has to end for the dialog to close.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const CLO_KIN_ARR = [ 'button', 'Escape', 'backdrop' ];                                         // What: Close Kind Array. Why: The "Close" button, Escape, and a tap outside the panel each close the dialog. How: This names each way, one test per way and per motion setting.
const SHA_STA_OBJ = STA_REC_ARR.find( ( staRecObj ) => staRecObj.ideStr === 'share-desktop' )!; // What: Share State Object. Why: The dialog is closed from its open state at the desktop width. How: This picks that row from the shared state list. // What: Non-Null Note. Why: TypeScript can't see that the row exists. How: The shared state list always carries the share-desktop row.

// #endregion Constants



// #region Module Init

for ( const cloKinStr of CLO_KIN_ARR ) { // What: Close Kind Loop. Why: Each way of closing should fade the dialog out. How: This declares one test per way, with motion and under reduced motion.


	test( `the share dialog closed by its ${ cloKinStr === 'button' ? '"Close" button' : cloKinStr === 'Escape' ? 'Escape key' : 'backdrop' } fades out before it closes`, async ( { page : curPagObj } ) => { // What: Share Close Test. Why: A dialog that vanished at once would read as the screen breaking rather than closing. How: This opens the dialog, closes it, checks the closing fade is playing, then checks the dialog closed.


		await opeStaFun( curPagObj, SHA_STA_OBJ ); // What: Dialog Open Call. Why: The dialog has to be open to close. How: This opens the Gallery with the share dialog showing.


		if ( cloKinStr === 'button' ) await curPagObj.getByRole( 'dialog' ).getByRole( 'button', { exact : true, name : 'Close' } ).click(); // What: Button Close Call. Why: The Close button is one way to close the dialog. How: This presses it.

		else if ( cloKinStr === 'Escape' ) await curPagObj.keyboard.press( 'Escape' ); // What: Escape Close Call. Why: Escape is another way. How: This presses it.

		else await curPagObj.mouse.click( 5, 5 ); // What: Backdrop Close Call. Why: A tap on the dimmed page around the panel is the third way. How: This taps the top left corner, outside the panel.



		expect( await curPagObj.getByRole( 'dialog' ).evaluate( ( diaCurEle ) => diaCurEle.getAnimations().map( ( aniCurObj ) => ( aniCurObj as CSSAnimation ).animationName ).join( ' ' ) ) ).toContain( 'shaDiaDiaCloseFadeOut' ); // What: Closing Fade Assertion. Why: The dialog should fade rather than vanish. How: This reads the animations on the dialog right after the close and checks its closing keyframe is among them. // What: Type Assertion Note. Why: getAnimations returns plain Animation objects, while only a CSS animation has a name. How: Every animation on the dialog comes from its stylesheet.

		await expect( curPagObj.getByRole( 'dialog' ) ).toBeHidden(); // What: Dialog Closed Assertion. Why: The fade has to end in the dialog closing. How: This waits until the dialog is no longer shown.


	} );



	test( `the share dialog closed by its ${ cloKinStr === 'button' ? '"Close" button' : cloKinStr === 'Escape' ? 'Escape key' : 'backdrop' } under reduced motion still closes`, async ( { page : curPagObj } ) => { // What: Reduced Share Close Test. Why: Under reduced motion the dialog still closes only once its shortened fade ends, so a variant that never ended would leave it stuck open. How: This opens the dialog, turns reduced motion on, closes it, and checks the dialog closed.


		await opeStaFun( curPagObj, SHA_STA_OBJ ); // What: Dialog Open Call. Why: The dialog has to be open to close. How: This opens the Gallery with the share dialog showing.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Call. Why: The close is checked with the shortened fade. How: This asks the page for reduced motion.


		if ( cloKinStr === 'button' ) await curPagObj.getByRole( 'dialog' ).getByRole( 'button', { exact : true, name : 'Close' } ).click(); // What: Button Close Call. Why: The Close button is one way to close the dialog. How: This presses it.

		else if ( cloKinStr === 'Escape' ) await curPagObj.keyboard.press( 'Escape' ); // What: Escape Close Call. Why: Escape is another way. How: This presses it.

		else await curPagObj.mouse.click( 5, 5 ); // What: Backdrop Close Call. Why: A tap on the dimmed page around the panel is the third way. How: This taps the top left corner, outside the panel.



		await expect( curPagObj.getByRole( 'dialog' ) ).toBeHidden(); // What: Dialog Closed Assertion. Why: The shortened fade has to end in the dialog closing. How: This waits until the dialog is no longer shown.


	} );


}

// #endregion Module Init


