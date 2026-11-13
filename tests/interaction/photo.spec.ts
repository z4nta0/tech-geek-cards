


// #region Imports

import { expect      } from '@playwright/test';     // What: Expect. Why: Each check passes only when the photo fades out and its dialog closes. How: This asserts on what each check reads, such as the dialog's animations.
import { opeStaFun   } from '../support/states.ts'; // What: Open State Function. Why: The photo opens from a settled card. How: This loads the state and runs its action.
import { PHO_STA_ARR } from '../support/family.ts'; // What: Photo State Array. Why: Each check starts from the Mother's Day card's first photo open. How: This lists that state at both widths.
import { test        } from '@playwright/test';     // What: Test. Why: Each way of closing is its own test. How: This declares them.

// #endregion Imports



/**
 * photo.spec.ts = Photo Spec
 *
 * @summary
 * Checks that a Family card's open photo leaves the way it arrived, in
 * whichever engine the project runs: a tap on the photo and Escape each start
 * the dialog's closing fade, and the dialog closes once it ends. The photo
 * opens at the desktop width with motion allowed, so the fade really plays,
 * and again under reduced motion, where the shortened fade still has to end
 * for the dialog to close.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



for ( const cloKeyStr of [ 'click', 'Escape' ] ) { // What: Close Kind Loop. Why: A tap and Escape both close the photo, and each should fade it out. How: This declares one test per way of closing.


	test( `a photo closed by ${ cloKeyStr === 'click' ? 'a tap' : 'Escape' } fades out before its dialog closes`, async ( { page : curPagObj } ) => { // What: Photo Close Test. Why: A photo that vanished at once would read as the screen breaking rather than closing. How: This opens the first photo, closes it, checks the closing fade is playing, then checks the dialog closed.


		await opeStaFun( curPagObj, PHO_STA_ARR[ 0 ] ); // What: Photo Open Call. Why: The photo has to be open to close. How: This opens the card with its first photo full size.


		if ( cloKeyStr === 'click' ) await curPagObj.getByRole( 'button', { name : 'Close photo' } ).click(); // What: Tap Close Call. Why: Tapping the photo is one way to close it. How: This presses the full-size photo.

		else await curPagObj.keyboard.press( 'Escape' ); // What: Escape Close Call. Why: Escape is the other way. How: This presses it.



		expect( await curPagObj.getByRole( 'dialog', { name : 'Photo' } ).evaluate( ( diaCurEle ) => diaCurEle.getAnimations().map( ( aniCurObj ) => ( aniCurObj as CSSAnimation ).animationName ).join( ' ' ) ) ).toContain( 'famExpDiaCloseFadeOut' ); // What: Closing Fade Assertion. Why: The photo should fade rather than vanish. How: This reads the animations on the dialog right after the close and checks its closing keyframe is among them. // What: Type Assertion Note. Why: getAnimations returns plain Animation objects, while only a CSS animation has a name. How: Every animation on the dialog comes from its stylesheet.

		await expect( curPagObj.getByRole( 'dialog', { name : 'Photo' } ) ).toBeHidden(); // What: Dialog Closed Assertion. Why: The fade has to end in the dialog closing. How: This waits until the dialog is no longer shown.


	} );


}



for ( const cloKeyStr of [ 'click', 'Escape' ] ) { // What: Reduced Close Kind Loop. Why: Under reduced motion the dialog still closes only once its shortened fade ends, so a variant that never ended would leave the photo stuck open. How: This declares one test per way of closing.


	test( `a photo closed by ${ cloKeyStr === 'click' ? 'a tap' : 'Escape' } under reduced motion still closes its dialog`, async ( { page : curPagObj } ) => { // What: Reduced Photo Close Test. Why: A visitor who asked for reduced motion still has to be able to close the photo. How: This opens the first photo, turns reduced motion on, closes it, and checks the dialog closed.


		await opeStaFun( curPagObj, PHO_STA_ARR[ 0 ] ); // What: Photo Open Call. Why: The photo has to be open to close. How: This opens the card with its first photo full size.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Call. Why: The close is checked with the shortened fade. How: This asks the page for reduced motion.


		if ( cloKeyStr === 'click' ) await curPagObj.getByRole( 'button', { name : 'Close photo' } ).click(); // What: Tap Close Call. Why: Tapping the photo is one way to close it. How: This presses the full-size photo.

		else await curPagObj.keyboard.press( 'Escape' ); // What: Escape Close Call. Why: Escape is the other way. How: This presses it.



		await expect( curPagObj.getByRole( 'dialog', { name : 'Photo' } ) ).toBeHidden(); // What: Dialog Closed Assertion. Why: The shortened fade has to end in the dialog closing. How: This waits until the dialog is no longer shown.


	} );


}


