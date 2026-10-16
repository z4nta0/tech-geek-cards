


/**
 * random.ts = Random
 *
 * @summary
 * The random number helper the cards' animations share, picking each
 * confetti piece's, balloon's, star's, and firework's size, speed, and
 * position between two bounds, so no two plays of a card look quite alike.
 *
 * Sections:
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region ranValFun

/**
 * ranValFun = Random Value Function
 *
 * @summary
 * A random number between two bounds, any fraction included, drawn evenly
 * from the whole range. The upper bound itself is never returned, since
 * Math.random never returns 1.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param minValNum - Minimum Value Number: The lowest value it can return.
 * @param maxValNum - Maximum Value Number: The bound it stays below.
 *
 * @returns The random number.
 *
 * @example
 * ```ts
 * ranValFun(2, 5) // => a number from 2 up to 5
 * ```
 *
*/

const ranValFun = ( minValNum : number, maxValNum : number ) : number => minValNum + Math.random() * ( maxValNum - minValNum ); // What: Random Value Function. Why: Every animated card picks its pieces' sizes, speeds, and places at random within set bounds. How: This scales a random fraction across the range and adds the minimum.

// #endregion ranValFun

// #endregion Helpers



// #region Exports

export { ranValFun }; // What: Named Export. Why: The Birthday and Fourth of July cards draw their random values the same way. How: This exports ranValFun by name.

// #endregion Exports


