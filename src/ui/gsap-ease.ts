


// #region Imports

import { CustomEase } from 'gsap/CustomEase';    // What: Custom Ease. Why: GSAP can't read the stylesheet's cubic-bezier curves on its own. How: This registers each easing token as a named GSAP ease.
import { gsap       } from 'gsap';               // What: GSAP. Why: The CustomEase plugin has to be registered with GSAP before it's used. How: This is the animation library the plugin joins.
import { motEasFun  } from '../utils/motion.ts'; // What: Motion Easing Function. Why: A card's timeline should ease the way the stylesheet says. How: This reads an easing token's curve.

// #endregion Imports



/**
 * gsap-ease.ts = GSAP Ease
 *
 * @summary
 * Hands the stylesheet's easing tokens to GSAP, for every card whose
 * timeline GSAP plays. GSAP can't read a CSS cubic-bezier, so each token's
 * curve is registered as a named GSAP ease through its CustomEase plugin,
 * and a card passes that name to its tweens. Moved here from the Christmas
 * card once a second card needed it.
 *
 * Sections:
 *  - Helpers
 *  - Module Init
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region gsaEasFun

/**
 * gsaEasFun = GSAP Easing Function
 *
 * @summary
 * Registers one of the stylesheet's --mot-*-eas curves as a named GSAP ease,
 * since GSAP can't read a CSS cubic-bezier, and returns the name a card's
 * timeline uses. The curve is read through motEasFun, so the timeline always
 * eases the way the stylesheet says; the standard family's plain ease keyword
 * becomes its cubic-bezier equivalent. Registering a name again replaces it,
 * so calling this on every replay is harmless.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param easFamStr - Easing Family String: The family's 3-letter name, e.g.
 *                    'dec' or 'ino'.
 *
 * @returns The ease's GSAP name.
 * @see {@link easNamStr}
 *
 * @example
 * ```ts
 * gsaEasFun('dec') // => 'mot-dec-eas'
 * ```
 *
*/

const gsaEasFun = ( easFamStr : string ) : string => { // What: GSAP Easing Function. Why: The timeline's curves come from the stylesheet. How: This registers the family's curve with CustomEase and returns its name.


	const easNamStr = `mot-${ easFamStr }-eas`;                                                           // What: Easing Name String. Why: The GSAP name matches the token it comes from. How: This names it after the token.
	const easValStr = motEasFun( easFamStr );                                                             // What: Easing Value String. Why: The curve is the stylesheet's own. How: This reads the token's value.
	const bezValStr = ( easValStr === 'ease' ? '.25, .1, .25, 1' : easValStr ).replace( /[^\d.,]/g, '' ); // What: Bezier Value String. Why: CustomEase takes a cubic-bezier's four numbers. How: This swaps the ease keyword for its own four, then keeps only the digits, dots, and commas.


	CustomEase.create( easNamStr, bezValStr ); // What: Ease Registration Call. Why: The timeline refers to the curve by name. How: This registers it with GSAP.



	return easNamStr;


};

// #endregion gsaEasFun

// #endregion Helpers



// #region Module Init

gsap.registerPlugin( CustomEase ); // What: Plugin Registration Call. Why: CustomEase has to be registered before an ease is created. How: This registers it once, when the module loads.

// #endregion Module Init



// #region Exports

export { gsaEasFun }; // What: Named Export. Why: Every card's timeline registers its eases the same way. How: This exports the easing function by name.

// #endregion Exports


