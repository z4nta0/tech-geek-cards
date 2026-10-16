


/**
 * rhythm.ts = Rhythm
 *
 * @summary
 * The design scale's steps as plain numbers, for motion JavaScript plays
 * itself (a GSAP timeline) that can't read the stylesheet's tokens: the
 * duration scale's steps in milliseconds, the vertical rhythm's steps in
 * pixels, and any power of the core design number, for an angle or a pace
 * that sits on the scale without a named step of its own. Every value uses
 * the same formulas as the design package's tokens.css, so a step read here
 * always matches the stylesheet's own value. Adapted from ease-my-life.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const COR_DES_NUM = ( Math.cbrt( 108 + 12 * Math.sqrt( 69 ) ) + Math.cbrt( 108 - 12 * Math.sqrt( 69 ) ) ) / 6; // What: Core Design Number. Why: Every step is a power of the plastic ratio, the same core design number tokens.css starts from. How: This solves for it with the same cube-root formula as the stylesheet's --cor-des-num, about 1.325.

// #endregion Constants



// #region Helpers

// #region cdnPowFun

/**
 * cdnPowFun = Core-Design-Number Power Function
 *
 * @summary
 * Any power of the core design number as a plain number, the JavaScript
 * counterpart of the stylesheet's --cdn-pow-* tokens, for an angle or a pace
 * that sits on the scale without a named step of its own. The duration and
 * rhythm helpers below build their steps on it too.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param powValNum - Power Value Number: The power to raise the core design
 *                    number to, e.g. 15.
 *
 * @returns The core design number raised to that power.
 *
 * @example
 * ```ts
 * cdnPowFun(15) // => about 67.9
 * ```
 *
*/

const cdnPowFun = ( powValNum : number ) : number => Math.pow( COR_DES_NUM, powValNum ); // What: Core-Design-Number Power Function. Why: An angle or a pace with no named step still sits on the scale as a power of the core design number, like the stylesheet's --cdn-pow-* tokens. How: This raises the core design number to the given power.

// #endregion cdnPowFun



const steOffFun = ( steNamStr : string ) : number => steNamStr === 'bas' ? 0 : ( steNamStr[ 0 ] === 'p' ? 1 : -1 ) * Number( steNamStr.slice( 1 ) ); // What: Step Offset Function. Why: The rhythm and the duration scale name their steps the same way, by offset from a base step. How: This returns 0 for 'bas', NN for 'pNN', and -NN for 'mNN'.



// #region durMilFun

/**
 * durMilFun = Duration Millisecond Function
 *
 * @summary
 * The length of one duration step in milliseconds, named the way the
 * stylesheet names its --dur-ani-* and --dur-tra-* steps: 'bas' for the base
 * step, 'pNN' for NN steps above it, and 'mNN' for NN steps below it. The
 * base step is the 18th power of the core design number, so 'p04' is the
 * 22nd power, about 486ms. Steps below 'm03', which the stylesheet doesn't
 * name, carry on the same way for motion quicker than any interface needs (a
 * glitch's flicker).
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param durSteStr - Duration Step String: The step's name, e.g. 'bas', 'p04',
 *                    or 'm01'.
 *
 * @returns The step's length in milliseconds.
 *
 * @example
 * ```ts
 * durMilFun('p04') // => about 486
 * ```
 *
*/

const durMilFun = ( durSteStr : string ) : number => cdnPowFun( 18 + steOffFun( durSteStr ) ); // What: Duration Millisecond Function. Why: JavaScript motion needs the same step lengths the stylesheet uses. How: This raises the core design number to the 18th power plus the step's offset.

// #endregion durMilFun



// #region durSecFun

/**
 * durSecFun = Duration Second Function
 *
 * @summary
 * The length of one duration step in seconds, for GSAP, which takes its
 * durations in seconds while the duration scale is in milliseconds. It names
 * steps the same way durMilFun does.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param durSteStr - Duration Step String: The step's name, e.g. 'bas', 'p04',
 *                    or 'm01'.
 *
 * @returns The step's length in seconds.
 *
 * @example
 * ```ts
 * durSecFun('p04') // => about 0.486
 * ```
 *
*/

const durSecFun = ( durSteStr : string ) : number => durMilFun( durSteStr ) / 1000; // What: Duration Second Function. Why: GSAP takes durations in seconds, while the duration scale is in milliseconds. How: This converts a step's length to seconds.

// #endregion durSecFun



// #region rhyPxlFun

/**
 * rhyPxlFun = Rhythm Pixel Function
 *
 * @summary
 * The pixel size of one vertical rhythm step, named the way the stylesheet
 * names it: 'bas' for the base step, 'pNN' for NN steps above it, and 'mNN'
 * for NN steps below it. The base step is the first power of the core design
 * number, so 'p03' is the fourth power and 'm01' the zeroth. The spacing
 * families use the same steps, so a Spacing Horizontal step reads the same
 * way. It reads the root font size on every call, so a change to the
 * browser's font size is picked up without a reload.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param rhySteStr - Rhythm Step String: The step's name, e.g. 'bas', 'p03',
 *                    or 'm02'.
 *
 * @returns The step's size in pixels at the current root font size.
 *
 * @example
 * ```ts
 * rhyPxlFun('bas') // => about 14.57 at an 11px root font size
 * ```
 *
*/

const rhyPxlFun = ( rhySteStr : string ) : number => { // What: Rhythm Pixel Function. Why: JavaScript motion that moves in pixels needs the same step sizes the stylesheet uses. How: This turns the step's name into a power of the core design number and multiplies the root font size by it.


	const rooPxlNum = parseFloat( getComputedStyle( document.documentElement ).fontSize ) || 11; // What: Root Pixel Number. Why: Every step scales with the root font size, which follows the browser's own font size setting. How: This reads the root element's computed font size, falling back to the 11px default.



	return rooPxlNum * cdnPowFun( 1 + steOffFun( rhySteStr ) ); // What: Step Pixel Return. Why: The caller needs the step's size in pixels. How: This scales the root pixel size by the core design number raised to the base step's first power plus the step's offset.


};

// #endregion rhyPxlFun

// #endregion Helpers



// #region Exports

export { cdnPowFun, durMilFun, durSecFun, rhyPxlFun }; // What: Named Exports. Why: Every animated card reads the stylesheet's scales through the same helpers. How: This exports cdnPowFun, durMilFun, durSecFun, and rhyPxlFun by name.

// #endregion Exports


