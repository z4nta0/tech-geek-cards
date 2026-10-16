


// #region Imports

import { durMilFun } from '../../utils/rhythm.ts'; // What: Duration Millisecond Function. Why: The balloons' rise and sway take steps on the duration scale. How: This returns a step's length in milliseconds.
import { ranValFun } from '../../utils/random.ts'; // What: Random Value Function. Why: Pieces are sized, paced, and placed at random within set bounds. How: This returns a random number between two bounds.
import { rhyPxlFun } from '../../utils/rhythm.ts'; // What: Rhythm Pixel Function. Why: The balloons' sway is a rhythm step. How: This returns a step's size in pixels.

// #endregion Imports



/**
 * balloons.ts = Balloons
 *
 * @summary
 * The birthday card's balloons, rising behind the greeting. Each balloon is
 * one of the card's own elements, spaced evenly across the card, that rises
 * from below the bottom edge to above the top at its own pace, between the
 * duration scale's Base Plus 15 and Base Plus 18 steps, about 10.7 and 24.9
 * seconds, while swaying side to side by the rhythm's Base to Base Plus 3
 * step, once every Base Plus 10 to Base Plus 13 step, about 2.6 to 6.1
 * seconds. A balloon that floats out the top starts again just below the
 * bottom. Each balloon is also drawn at its own size, from about 0.61 to
 * full. The balloons move by transform alone, on requestAnimationFrame, and
 * each step is scaled by the time since the last frame, so they rise at the
 * same pace on a 60Hz or a 120Hz screen. Under reduced motion they're placed
 * at rest across the sky instead and never move. staBalFun starts them and
 * returns the function that stops them.
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

const FRA_MAX_NUM = 1000 / 15; // What: Frame Maximum Number. Why: A tab left in the background resumes after a long gap, which would throw every balloon at once. How: This caps one frame's step at a 15th of a second.
const SCA_MIN_NUM = 28 / 46;   // What: Scale Minimum Number. Why: The smallest balloons were drawn at 28 of the largest's 46 units. How: This keeps that ratio, about 0.61, as the drawing's own proportion.

// #endregion Constants



// #region Helpers

type BalRecTyp = { // What: Balloon Record Type. Why: Each balloon keeps its own size, pace, and sway between frames. How: This holds its element and every value its next step reads.


	phaNum    : number,        // What: Phase Number. Why: The balloons shouldn't sway in step. How: This holds where in its sway each one starts, in radians.
	risDurNum : number,        // What: Rise Duration Number. Why: Each balloon rises at its own pace. How: This holds how long it takes to cross the card, in milliseconds.
	scaNum    : number,        // What: Scale Number. Why: Balloons come in different sizes. How: This holds its scale, from about 0.61 to 1.
	svgEle    : SVGSVGElement, // What: SVG Element. Why: The balloon is drawn as an SVG. How: This holds it.
	swaAmpNum : number,        // What: Sway Amplitude Number. Why: Each balloon sways its own distance. How: This holds how far it swings either way, in pixels.
	swaPerNum : number,        // What: Sway Period Number. Why: Each balloon sways at its own pace. How: This holds one full swing's length, in milliseconds.
	ycoNum    : number         // What: Y-Coordinate Number. Why: The balloon rises. How: This holds its top edge's distance from the card's top, in pixels.


};

// #region staBalFun

/**
 * staBalFun = Start Balloons Function
 *
 * @summary
 * Starts the balloons rising inside a container. Each of the container's
 * children is a balloon: it gets a random size, rise, and sway, a column of
 * its own across the container, and a starting height around the bottom
 * edge, or anywhere in the sky when the balloons stay at rest. Each frame
 * raises every balloon by its share of the frame's length, sways it by the
 * sine of the time, and starts it again below the bottom once it has floated
 * out the top. The container's size is measured whenever it changes. It
 * returns the function that stops the loop and stops measuring; under reduced
 * motion nothing moves and that function only stops measuring.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param conDivEle - Container Div Element: The element holding the balloons,
 *                    covering the card.
 * @param movValBoo - Move Value Boolean: Whether the balloons rise, false to
 *                    place them at rest for reduced motion.
 *
 * @returns The function that stops the balloons.
 *
 * @example
 * ```ts
 * staBalFun(conDivEle, movValBoo) // => () => void
 * ```
 *
*/

const staBalFun = ( conDivEle : HTMLElement, movValBoo : boolean ) : () => void => { // What: Start Balloons Function. Why: Balloons float up behind the greeting until the card closes. How: This places them, moves them every frame, and returns the function that stops it.


	// #region Container Measuring

	let conHeiNum = conDivEle.clientHeight; // What: Container Height Number. Why: A balloon starts again once it floats past the top, from just below the bottom. How: This holds the container's height, measured again whenever it changes.
	let conWidNum = conDivEle.clientWidth;  // What: Container Width Number. Why: The balloons are spaced across the width. How: This holds the container's width, measured again whenever it changes.


	const resObsObj = new ResizeObserver( () => { // What: Resize Observer Object. Why: The balloons should fill the card after the window is resized. How: This measures it again whenever its size changes.


		conHeiNum = conDivEle.clientHeight; // What: Height Remeasure. Why: The bottom edge moved. How: This reads the new height.
		conWidNum = conDivEle.clientWidth;  // What: Width Remeasure. Why: The side edges moved. How: This reads the new width.


	} );


	resObsObj.observe( conDivEle ); // What: Container Observe Call. Why: Measuring only happens while the balloons are shown. How: This starts watching the container.

	// #endregion Container Measuring



	// #region Balloon Placing

	const svgEleArr = Array.from( conDivEle.children ) as SVGSVGElement[]; // What: SVG Element Array. Why: Every child of the container is a balloon. How: This lists them. // What: Type Assertion Note. Why: TypeScript reads children as plain elements. How: The card renders only balloon SVGs inside the container.


	const balRecArr : BalRecTyp[] = svgEleArr.map( ( balSvgEle ) => ( { // What: Balloon Record Array. Why: Every balloon keeps its own values between frames. How: This picks each balloon's size, rise, sway, and starting height.


		phaNum    : Math.random() * Math.PI * 2,                         // What: Phase Number. Why: The balloons sway out of step. How: This picks a start anywhere around a full swing, in radians.
		risDurNum : ranValFun( durMilFun( 'p15' ), durMilFun( 'p18' ) ), // What: Rise Duration Number. Why: Some balloons rise faster than others. How: This picks a crossing time from the Base Plus 15 to the Base Plus 18 step, about 10.7 to 24.9 seconds. // Duration Animation Base Plus 15 ~= 10,717.0ms, Duration Animation Base Plus 18 ~= 24,914.0ms
		scaNum    : ranValFun( SCA_MIN_NUM, 1 ),                         // What: Scale Number. Why: Balloons come in different sizes. How: This picks a scale from about 0.61 to full.
		svgEle    : balSvgEle,                                           // What: SVG Element. Why: The record moves its own balloon. How: This keeps the element.
		swaAmpNum : ranValFun( rhyPxlFun( 'bas' ), rhyPxlFun( 'p03' ) ), // What: Sway Amplitude Number. Why: Some balloons sway wider than others. How: This picks a swing from the Vertical Rhythm Base to the Base Plus 3 step, about 14.6 to 33.9px. // Vertical Rhythm Base ~= 14.572px, Vertical Rhythm Base Plus 3 ~= 33.876px
		swaPerNum : ranValFun( durMilFun( 'p10' ), durMilFun( 'p13' ) ), // What: Sway Period Number. Why: Some balloons sway faster than others. How: This picks one full swing's length from the Base Plus 10 to the Base Plus 13 step, about 2.6 to 6.1 seconds. // Duration Animation Base Plus 10 ~= 2,627.0ms, Duration Animation Base Plus 13 ~= 6,107.0ms

		ycoNum : movValBoo ? conHeiNum + ( Math.random() - 0.5 ) * balSvgEle.clientHeight : Math.random() * ( conHeiNum - balSvgEle.clientHeight ) // What: Y-Coordinate Number. Why: Rising balloons start around the bottom edge, staggered, while resting ones fill the sky. How: This picks a height within half a balloon of the bottom, or anywhere from the top to a balloon above the bottom.


	} ) );



	// #region draBalFun

	/**
	 * draBalFun = Draw Balloon Function
	 *
	 * @summary
	 * Places one balloon at a moment of its rise. Its column is the center of
	 * its own equal share of the container's width, less half its width, and
	 * its sway is the sine of the time over its period, offset by its phase.
	 * It moves the balloon by transform alone, scaled to its size from its
	 * own center.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param balRecObj - Balloon Record Object: {@link BalRecTyp}
	 * @param balIndNum - Balloon Index Number: The balloon's place in the row,
	 *                    which picks its column.
	 * @param elaTimNum - Elapsed Time Number: The time the balloons have been
	 *                    rising, in milliseconds, 0 for the first placement.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * draBalFun(balRecObj, balIndNum, elaTimNum) // => void
	 * ```
	 *
	*/

	const draBalFun = ( balRecObj : BalRecTyp, balIndNum : number, elaTimNum : number ) : void => { // What: Draw Balloon Function. Why: Every frame, and the resting placement, put each balloon in its place. How: This works out its column and sway and sets its transform.


		const colCenNum = ( balIndNum + 0.5 ) / balRecArr.length * conWidNum;                                                 // What: Column Center Number. Why: The balloons are spaced evenly across the card. How: This is the middle of the balloon's own share of the width.
		const swaOffNum = Math.sin( elaTimNum / balRecObj.swaPerNum * Math.PI * 2 + balRecObj.phaNum ) * balRecObj.swaAmpNum; // What: Sway Offset Number. Why: The balloon drifts side to side. How: This is the sine of its place in the swing, times its amplitude.
		const lefXcoNum = colCenNum - balRecObj.svgEle.clientWidth / 2 + swaOffNum;                                           // What: Left X-Coordinate Number. Why: The balloon hangs centered on its column, swayed. How: This is its left edge.


		balRecObj.svgEle.style.transform = `translate3d( ${ lefXcoNum }px, ${ balRecObj.ycoNum }px, 0 ) scale( ${ balRecObj.scaNum } )`; // What: Transform Assignment. Why: Moving by transform skips layout, so the balloons stay smooth. How: This places the balloon and scales it to its size.


	};

	// #endregion draBalFun



	balRecArr.forEach( ( balRecObj, balIndNum ) => draBalFun( balRecObj, balIndNum, 0 ) ); // What: First Placement Call. Why: The balloons should be in place before the card is first drawn. How: This draws each one at time 0.

	// #endregion Balloon Placing



	if ( !movValBoo ) return () => resObsObj.disconnect(); // What: Resting Balloons Guard. Why: Under reduced motion the balloons stay where they were placed. How: This returns a stop function that only stops measuring, starting no loop.



	// #region Frame Loop

	let aniFraNum = 0; // What: Animation Frame Number. Why: Stopping the balloons has to cancel the next frame. How: This holds the pending frame's id.
	let elaTimNum = 0; // What: Elapsed Time Number. Why: The sway picks up from the first placement without a jump. How: This holds the time the balloons have been rising, in milliseconds, counted from 0.
	let preTimNum = 0; // What: Previous Time Number. Why: Each step is scaled by the time since the last frame. How: This holds the last frame's timestamp, 0 before the first.


	const steFraFun = ( curTimNum : number ) : void => { // What: Step Frame Function. Why: The balloons move once per frame. How: This raises and sways every balloon by the time since the last frame, restarts any that left, and asks for the next frame.


		const fraMilNum = preTimNum === 0 ? 0 : Math.min( FRA_MAX_NUM, curTimNum - preTimNum ); // What: Frame Millisecond Number. Why: Each balloon rises by the time that passed, whatever the frame rate. How: This is the time since the last frame, 0 on the first, capped so a background tab doesn't jump.


		elaTimNum += fraMilNum; // What: Elapsed Time Increase. Why: The sway follows the time the balloons have been rising. How: This adds the frame's length.
		preTimNum  = curTimNum; // What: Previous Time Assignment. Why: The next frame measures from this one. How: This keeps its timestamp.



		balRecArr.forEach( ( balRecObj, balIndNum ) => { // What: Balloon Step Loop. Why: Every balloon moves each frame. How: This raises, restarts, and draws each one.


			const balHeiNum = balRecObj.svgEle.clientHeight; // What: Balloon Height Number. Why: A balloon crosses the card plus its own height at each end. How: This reads its height.


			balRecObj.ycoNum -= ( conHeiNum + balHeiNum * 2 ) * fraMilNum / balRecObj.risDurNum; // What: Y-Coordinate Decrease. Why: The balloon rises at its own pace. How: This takes off its share of the full crossing for the frame's length.


			if ( balRecObj.ycoNum < -balHeiNum ) balRecObj.ycoNum = conHeiNum + Math.random() * balHeiNum; // What: Balloon Restart Check. Why: A balloon that floats out the top comes round again. How: Once it's fully above the top, this starts it up to a balloon's height below the bottom.



			draBalFun( balRecObj, balIndNum, elaTimNum ); // What: Balloon Draw Call. Why: The balloon has to show its new place. How: This sets its transform for the time they've been rising.


		} );



		aniFraNum = requestAnimationFrame( steFraFun ); // What: Next Frame Request. Why: The balloons keep rising. How: This asks for the next frame and keeps its id.


	};


	aniFraNum = requestAnimationFrame( steFraFun ); // What: First Frame Request. Why: The balloons start rising. How: This asks for the first frame and keeps its id.

	// #endregion Frame Loop



	return () => { // What: Stop Balloons Return. Why: The card stops the balloons when it replays or closes. How: This returns the function that cancels the next frame and stops measuring.


		cancelAnimationFrame( aniFraNum ); // What: Frame Cancel Call. Why: The loop must not run after the card is gone. How: This cancels the pending frame.


		resObsObj.disconnect(); // What: Observer Disconnect Call. Why: The container no longer needs measuring. How: This stops watching it.


	};


};

// #endregion staBalFun

// #endregion Helpers



// #region Exports

export { staBalFun }; // What: Named Export. Why: The card starts the balloons. How: This exports the start function by name.

// #endregion Exports


