


// #region Imports

import { cdnPowFun } from '../../utils/rhythm.ts'; // What: Core-Design-Number Power Function. Why: The confetti's spin, slowing, and fading cutoffs sit on the scale as powers of the core design number. How: This returns that power.
import { durMilFun } from '../../utils/rhythm.ts'; // What: Duration Millisecond Function. Why: How fast the confetti slows and fades are steps on the duration scale. How: This returns a step's length in milliseconds.
import { ranValFun } from '../../utils/random.ts'; // What: Random Value Function. Why: Pieces are sized, paced, and placed at random within set bounds. How: This returns a random number between two bounds.
import { rhyPxlFun } from '../../utils/rhythm.ts'; // What: Rhythm Pixel Function. Why: The confetti's sizes, speeds, and pull are rhythm steps. How: This returns a step's size in pixels.

// #endregion Imports



/**
 * confetti.ts = Confetti
 *
 * @summary
 * The birthday card's confetti, drawn on one canvas. A burst throws pieces out
 * in every direction from a point, with a kick upward, as rectangles, circles,
 * and stars in the card's party colors; each spins, drifts, slows sideways,
 * falls under a steady pull, and fades out once it passes the lower part of
 * the canvas. The loop runs on requestAnimationFrame only while pieces are in
 * the air, and each step is scaled by the time since the last frame, so the
 * confetti flies at the same pace on a 60Hz or a 120Hz screen. The canvas
 * matches its box and the screen's pixel density whenever either changes.
 * Every size, speed, and pull is a rhythm step, the slowing and fading
 * duration steps, and the spin and cutoffs powers of the core design number.
 * staConFun starts it and returns the burst function and the function that
 * stops it, so the card can end it cleanly when it replays or closes.
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

const FRA_MAX_NUM = 4;                                                                                                                                          // What: Frame Maximum Number. Why: A tab left in the background resumes after a long gap, which would throw every piece at once. How: This caps one frame's step at four 60ths of a second.
const FRA_MIL_NUM = 1000 / 60;                                                                                                                                  // What: Frame Millisecond Number. Why: The confetti's speeds were tuned for one step every 60th of a second. How: Each frame's step is scaled by how many of these have passed since the last one.
const PAR_TOK_ARR = [ '--bir-red-col', '--bir-yel-col', '--bir-gre-col', '--bir-blu-col', '--bir-pin-col', '--bir-ora-col', '--bir-pur-col', '--bir-eme-col' ]; // What: Party Token Array. Why: The confetti and the balloons share one bright palette, whose colors are the card's own tokens. How: The confetti reads each token's color once it starts and each piece picks one at random, while each balloon takes one in turn. // Birthday Red Color = #FF6B6B, Birthday Yellow Color = #FFD93D, Birthday Green Color = #6BCB77, Birthday Blue Color = #4D96FF, Birthday Pink Color = #FF6FCF, Birthday Orange Color = #FF9A3C, Birthday Purple Color = #A78BFA, Birthday Emerald Color = #34D399
const SHA_NAM_ARR = [ 'circle', 'rect', 'star' ] as const;                                                                                                      // What: Shape Name Array. Why: Each piece takes one of three shapes. How: A piece picks one at random.

// #endregion Constants



// #region Helpers

// #region draStaFun

/**
 * draStaFun = Draw Star Function
 *
 * @summary
 * Fills a five-pointed star centered on the canvas's current origin, its
 * points at the given radius and its inner corners at 0.45 of it. The ratio
 * is the shape's own drawing, like a path's coordinates, so it stays literal.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param canConObj - Canvas Context Object: The canvas's 2D drawing context, already
 *                    moved and turned to the piece.
 * @param radValNum - Radius Value Number: The distance from the center to
 *                    each point, in pixels.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * draStaFun(canConObj, radValNum) // => void
 * ```
 *
*/

const draStaFun = ( canConObj : CanvasRenderingContext2D, radValNum : number ) : void => { // What: Draw Star Function. Why: A third of the pieces are stars. How: This traces the star's ten corners and fills it.


	canConObj.beginPath(); // What: Path Start Call. Why: The star is drawn as one closed path. How: This starts a new one.


	for ( let poiIndNum = 0; poiIndNum < 5; poiIndNum++ ) { // What: Point Loop. Why: The star has five points, each with an inner corner after it. How: This adds both corners for each point.


		const outAngNum = Math.PI * 2 * poiIndNum / 5 - Math.PI / 2; // What: Outer Angle Number. Why: The points sit a fifth of a turn apart, the first straight up. How: This is the point's angle, in radians.
		const innAngNum = outAngNum + Math.PI / 5;                   // What: Inner Angle Number. Why: Each inner corner sits halfway to the next point. How: This is a tenth of a turn past the point.


		canConObj.lineTo( Math.cos( outAngNum ) * radValNum, Math.sin( outAngNum ) * radValNum );               // What: Point Line Call. Why: The star reaches out to each point. How: This draws to the point, the first call starting the path there.
		canConObj.lineTo( Math.cos( innAngNum ) * radValNum * 0.45, Math.sin( innAngNum ) * radValNum * 0.45 ); // What: Corner Line Call. Why: The star dips in between its points. How: This draws to the inner corner, at 0.45 of the radius.


	}



	canConObj.closePath(); // What: Path Close Call. Why: The last corner joins the first point. How: This closes the path.
	canConObj.fill();      // What: Fill Call. Why: The star is solid. How: This fills it in the piece's color.


};

// #endregion draStaFun



type PieRecTyp = { // What: Piece Record Type. Why: Each piece keeps its own place, speed, spin, and fade between frames. How: This holds every value its next step reads.


	alpNum    : number,                     // What: Alpha Number. Why: A piece fades out near the bottom. How: This holds its opacity, from 1 down.
	colStr    : string,                     // What: Color String. Why: Each piece is one of the party colors. How: This holds its fill.
	rotNum    : number,                     // What: Rotation Number. Why: Each piece spins as it flies. How: This holds its angle, in degrees.
	shaStr    : 'circle' | 'rect' | 'star', // What: Shape String. Why: The confetti mixes three shapes. How: This names the piece's.
	sizNum    : number,                     // What: Size Number. Why: Pieces come in different sizes. How: This holds its width, in pixels.
	spiNum    : number,                     // What: Spin Number. Why: Each piece spins at its own pace and direction. How: This holds its turn per 60th of a second, in degrees.
	velXcoNum : number,                     // What: Velocity X-Coordinate Number. Why: The piece drifts sideways, slowing as it goes. How: This holds its sideways speed per 60th of a second, in pixels.
	velYcoNum : number,                     // What: Velocity Y-Coordinate Number. Why: The piece is thrown up and pulled down. How: This holds its downward speed per 60th of a second, in pixels.
	xcoNum    : number,                     // What: X-Coordinate Number. Why: The piece flies sideways. How: This holds its distance from the canvas's left edge, in pixels.
	ycoNum    : number                      // What: Y-Coordinate Number. Why: The piece rises and falls. How: This holds its distance from the canvas's top edge, in pixels.


};



type ConSysTyp = { // What: Confetti System Type. Why: The card throws bursts while the confetti runs and stops it when it leaves. How: This holds both functions staConFun returns.


	burFun : ( burXcoNum : number, burYcoNum : number, pieCouNum : number ) => void, // What: Burst Function. Why: A burst starts the celebration, and every tap throws another. How: This throws a number of pieces from a point on the canvas.
	stoFun : () => void                                                              // What: Stop Function. Why: The confetti must stop when the card replays or closes. How: This cancels the loop, stops measuring, and drops every piece.


};

// #region staConFun

/**
 * staConFun = Start Confetti Function
 *
 * @summary
 * Readies the confetti on a canvas and returns its burst and stop functions.
 * The canvas is measured whenever its box changes and drawn at the screen's
 * pixel density, so pieces stay crisp. A burst adds pieces at a point, each
 * thrown at a random angle and speed, from the rhythm's Base Minus 6 step to
 * the Base Minus 1 step per 60th of a second, with an upward kick of the Base
 * Minus 3 step, and starts the loop if it isn't running. Each frame moves the
 * pieces by just over half their speed, pulls them down by the Base Minus 12
 * step, slows their drift with a time constant of the duration scale's Base
 * Plus 6 step, about 853ms, and spins them up to about 5.4 degrees either
 * way. Below about three quarters of the canvas's height a piece fades out
 * over the same step, and a piece that has faded or fallen past the bottom
 * is dropped. The loop stops itself once no pieces are left. The party
 * colors are read once, as it starts, from the card's tokens, which the
 * canvas inherits.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param conCanEle - Confetti Canvas Element: The canvas the confetti is
 *                    drawn on, covering the card.
 *
 * @returns The burst and stop functions.
 *
 * @example
 * ```ts
 * staConFun(conCanEle) // => { burFun, stoFun }
 * ```
 *
*/

const staConFun = ( conCanEle : HTMLCanvasElement ) : ConSysTyp => { // What: Start Confetti Function. Why: The card throws confetti when it opens and whenever it's tapped. How: This readies the canvas and returns the functions that throw a burst and stop it all.


	const canConObj = conCanEle.getContext( '2d' )!; // What: Canvas Context Object. Why: The pieces are drawn with the canvas's 2D tools. How: This gets its drawing context. // What: Non-Null Note. Why: TypeScript can't see that a 2D context is always available. How: A canvas element that hasn't handed out another kind of context always returns one.

	const pieRecArr : PieRecTyp[] = []; // What: Piece Record Array. Why: Every piece in the air keeps its own values between frames. How: Bursts add to it, and each frame drops the pieces that are done.



	const canStyObj = getComputedStyle( conCanEle );                                                      // What: Canvas Style Object. Why: The party colors are tokens set on the card, which the canvas inherits. How: This reads the canvas's computed style once, as the confetti starts.
	const parColArr = PAR_TOK_ARR.map( ( tokNamStr ) => canStyObj.getPropertyValue( tokNamStr ).trim() ); // What: Party Color Array. Why: The canvas can't read a token, so each piece needs a plain color. How: This looks up each party token's value, in the token array's order.



	// #region Canvas Measuring

	let canHeiNum = 0; // What: Canvas Height Number. Why: Pieces fade and drop out relative to the canvas's height. How: This holds its height in CSS pixels, measured again whenever it changes.
	let canWidNum = 0; // What: Canvas Width Number. Why: Each frame clears the whole canvas. How: This holds its width in CSS pixels, measured again whenever it changes.


	const meaCanFun = () : void => { // What: Measure Canvas Function. Why: The canvas has to match its box and the screen's density to draw crisply. How: This reads the box, sizes the drawing surface to it at the device pixel ratio, and scales drawing to CSS pixels.


		const pixRatNum = window.devicePixelRatio || 1; // What: Pixel Ratio Number. Why: A dense screen has more device pixels than CSS pixels. How: This reads the ratio, 1 if the browser doesn't say.


		canHeiNum = conCanEle.clientHeight;                         // What: Height Remeasure. Why: The canvas's box may have changed. How: This reads its height.
		canWidNum = conCanEle.clientWidth;                          // What: Width Remeasure. Why: The canvas's box may have changed. How: This reads its width.
		conCanEle.height = Math.round( canHeiNum * pixRatNum );     // What: Surface Height Assignment. Why: The drawing surface should have a device pixel for every one on screen. How: This sets it to the box's height at the ratio.
		conCanEle.width  = Math.round( canWidNum * pixRatNum );     // What: Surface Width Assignment. Why: The drawing surface should have a device pixel for every one on screen. How: This sets it to the box's width at the ratio.
		canConObj.setTransform( pixRatNum, 0, 0, pixRatNum, 0, 0 ); // What: Scale Transform Call. Why: The pieces are placed in CSS pixels. How: This scales every drawing by the ratio, resizing having reset it.


	};


	const resObsObj = new ResizeObserver( meaCanFun ); // What: Resize Observer Object. Why: The confetti should fill the card after the window is resized. How: This measures the canvas again whenever its box changes.


	resObsObj.observe( conCanEle ); // What: Canvas Observe Call. Why: Measuring only happens while the confetti is ready. How: This starts watching the canvas, which also measures it once.


	meaCanFun(); // What: First Measure Call. Why: A burst can come before the observer's first report. How: This measures the canvas right away.

	// #endregion Canvas Measuring



	// #region Frame Loop

	const draDecNum = durMilFun( 'p06' ); // What: Drag Decay Number. Why: A piece's drift slows smoothly over time. How: This is the duration scale's Base Plus 6 step, about 853ms, the time constant of the slowing. // Duration Animation Base Plus 6 ~= 853.0ms
	const fadDurNum = durMilFun( 'p06' ); // What: Fade Duration Number. Why: A piece fades out over a moment once it's low. How: This is the duration scale's Base Plus 6 step, about 853ms, from full to gone. // Duration Animation Base Plus 6 ~= 853.0ms
	const fadFraNum = cdnPowFun( -1 );    // What: Fade Fraction Number. Why: Pieces start fading in the lower part of the canvas. How: This is the core design number to the power of -1, about 0.755 of the height. // Core-Design-Number to the Power of -1 ~= 0.755
	const graPxlNum = rhyPxlFun( 'm12' ); // What: Gravity Pixel Number. Why: Every piece is pulled down. How: This is the Vertical Rhythm Base Minus 12 step, about 0.499px, added to its downward speed per 60th of a second. // Vertical Rhythm Base Minus 12 ~= 0.499px
	const minAlpNum = cdnPowFun( -11 );   // What: Minimum Alpha Number. Why: A piece too faint to see is dropped. How: This is the core design number to the power of -11, about 0.045. // Core-Design-Number to the Power of -11 ~= 0.045
	const outPxlNum = rhyPxlFun( 'p01' ); // What: Out Pixel Number. Why: A piece is dropped once it has fallen past the bottom. How: This is the Vertical Rhythm Base Plus 1 step, about 19.3px, below the bottom edge. // Vertical Rhythm Base Plus 1 ~= 19.304px
	const velMulNum = cdnPowFun( -2 );    // What: Velocity Multiplier Number. Why: The pieces were tuned to move at just over half their speed. How: This is the core design number to the power of -2, about 0.570. // Core-Design-Number to the Power of -2 ~= 0.570

	let aniFraNum = 0; // What: Animation Frame Number. Why: Stopping the confetti has to cancel the next frame, and a burst has to know whether the loop is running. How: This holds the pending frame's id, 0 while the loop is idle.
	let preTimNum = 0; // What: Previous Time Number. Why: Each step is scaled by the time since the last frame. How: This holds the last frame's timestamp, 0 before the first.



	// #region steFraFun

	/**
	 * steFraFun = Step Frame Function
	 *
	 * @summary
	 * Moves and draws every piece for one frame. It counts the 60ths of a
	 * second since the last frame, one on a fresh start and capped so a
	 * background tab doesn't jump, then clears the canvas, drops pieces that
	 * have faded or fallen out, and steps each one left: moved by its speed,
	 * pulled down, slowed sideways, turned, faded once it's low, and drawn in
	 * its shape. It asks for the next frame only while pieces are left, and
	 * otherwise marks the loop idle so the next burst starts it again.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param curTimNum - Current Time Number: The frame's timestamp, in
	 *                    milliseconds.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * steFraFun(curTimNum) // => void
	 * ```
	 *
	*/

	const steFraFun = ( curTimNum : number ) : void => { // What: Step Frame Function. Why: The confetti moves once per frame. How: This steps, draws, and drops the pieces, then asks for the next frame while any are left.


		const fraValNum = preTimNum === 0 ? 1 : Math.min( FRA_MAX_NUM, ( curTimNum - preTimNum ) / FRA_MIL_NUM ); // What: Frame Value Number. Why: Speeds were tuned per 60th of a second, so a faster or slower screen has to scale each step. How: This counts the 60ths since the last frame, one on the first, capped so a background tab doesn't jump.
		const draFacNum = Math.exp( -fraValNum * FRA_MIL_NUM / draDecNum );                                       // What: Drag Factor Number. Why: The drift slows by the same amount each second, whatever the frame rate. How: This is the share of sideways speed left after the frame's length.


		preTimNum = curTimNum; // What: Previous Time Assignment. Why: The next frame measures from this one. How: This keeps its timestamp.


		canConObj.clearRect( 0, 0, canWidNum, canHeiNum ); // What: Canvas Clear Call. Why: Each frame draws the pieces afresh. How: This wipes the whole canvas.



		for ( let pieIndNum = pieRecArr.length - 1; pieIndNum >= 0; pieIndNum-- ) { // What: Piece Drop Loop. Why: Faded and fallen pieces are done. How: This walks the pieces backward, so removing one doesn't skip the next.


			const pieRecObj = pieRecArr[ pieIndNum ]; // What: Piece Record Object. Why: The checks read the piece's values. How: This takes the piece at the index.


			if ( pieRecObj.alpNum <= minAlpNum || pieRecObj.ycoNum >= canHeiNum + outPxlNum ) pieRecArr.splice( pieIndNum, 1 ); // What: Piece Drop Check. Why: A piece too faint to see or past the bottom is done. How: This removes it from the array.


		}



		for ( const pieRecObj of pieRecArr ) { // What: Piece Step Loop. Why: Every piece moves each frame. How: This moves, pulls, slows, turns, fades, and draws each one.


			pieRecObj.xcoNum += pieRecObj.velXcoNum * velMulNum * fraValNum; // What: X-Coordinate Increase. Why: The piece drifts sideways. How: This adds its scaled sideways speed for the frame's length.
			pieRecObj.ycoNum += pieRecObj.velYcoNum * velMulNum * fraValNum; // What: Y-Coordinate Increase. Why: The piece rises or falls. How: This adds its scaled downward speed for the frame's length.
			pieRecObj.velYcoNum += graPxlNum * fraValNum;                    // What: Velocity Y-Coordinate Increase. Why: The pull bends every piece back down. How: This adds the pull for the frame's length.
			pieRecObj.velXcoNum *= draFacNum;                                // What: Velocity X-Coordinate Decrease. Why: The sideways drift dies away. How: This keeps the frame's share of it.
			pieRecObj.rotNum += pieRecObj.spiNum * fraValNum;                // What: Rotation Increase. Why: The piece tumbles. How: This adds its spin for the frame's length.


			if ( pieRecObj.ycoNum > canHeiNum * fadFraNum ) pieRecObj.alpNum -= fraValNum * FRA_MIL_NUM / fadDurNum; // What: Fade Check. Why: Pieces fade out as they near the bottom rather than vanish. How: Below the fade line, this takes off the frame's share of the fade.



			canConObj.save();                                          // What: Context Save Call. Why: Each piece is moved and turned on its own. How: This saves the context before changing it.
			canConObj.globalAlpha = Math.max( 0, pieRecObj.alpNum );   // What: Alpha Assignment. Why: The piece draws at its own fade. How: This sets the context's opacity, never below 0.
			canConObj.fillStyle   = pieRecObj.colStr;                  // What: Fill Assignment. Why: The piece draws in its own color. How: This sets the fill.
			canConObj.translate( pieRecObj.xcoNum, pieRecObj.ycoNum ); // What: Translate Call. Why: The shape is drawn around its own center. How: This moves the origin to the piece.
			canConObj.rotate( pieRecObj.rotNum * Math.PI / 180 );      // What: Rotate Call. Why: The shape is drawn at its own angle. How: This turns the context by the piece's rotation, in radians.


			if ( pieRecObj.shaStr === 'rect' ) canConObj.fillRect( -pieRecObj.sizNum / 2, -pieRecObj.sizNum / 4, pieRecObj.sizNum, pieRecObj.sizNum / 2 ); // What: Rectangle Draw Check. Why: Some pieces are paper strips. How: This fills a rectangle half as tall as it is wide.

			else if ( pieRecObj.shaStr === 'circle' ) { // What: Circle Draw Branch. Why: Some pieces are dots. How: This fills a circle as wide as the piece.


				canConObj.beginPath();                                       // What: Path Start Call. Why: The dot is a path of its own. How: This starts a new one.
				canConObj.arc( 0, 0, pieRecObj.sizNum / 2, 0, Math.PI * 2 ); // What: Arc Call. Why: A dot is a full circle. How: This traces one at half the piece's size.
				canConObj.fill();                                            // What: Fill Call. Why: The dot is solid. How: This fills it.


			}

			else draStaFun( canConObj, pieRecObj.sizNum / 2 ); // What: Star Draw Branch. Why: The rest are stars. How: This fills a star at half the piece's size.



			canConObj.restore(); // What: Context Restore Call. Why: The next piece starts from the plain context. How: This undoes the move, turn, and opacity.


		}



		aniFraNum = pieRecArr.length > 0 ? requestAnimationFrame( steFraFun ) : 0; // What: Next Frame Request. Why: The loop runs only while pieces are in the air. How: This asks for the next frame while any are left, or marks the loop idle.


		if ( aniFraNum === 0 ) preTimNum = 0; // What: Idle Reset Check. Why: The next burst shouldn't count the idle gap as one long frame. How: This forgets the last timestamp once the loop goes idle.


	};

	// #endregion steFraFun

	// #endregion Frame Loop



	// #region burFun

	/**
	 * burFun = Burst Function
	 *
	 * @summary
	 * Throws a number of pieces from a point on the canvas. Each is thrown at
	 * a random angle and at a random speed from the rhythm's Base Minus 6 step
	 * to the Base Minus 1 step, with an extra upward kick of the Base Minus 3
	 * step, takes a random color and shape, a size from the Base Minus 3 step
	 * to the Base step, a random starting angle, and a spin of up to about 5.4
	 * degrees either way per 60th of a second. It starts the loop if the
	 * confetti was idle.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param burXcoNum - Burst X-Coordinate Number: The point's distance from
	 *                    the canvas's left edge, in pixels.
	 * @param burYcoNum - Burst Y-Coordinate Number: The point's distance from
	 *                    the canvas's top edge, in pixels.
	 * @param pieCouNum - Piece Count Number: How many pieces to throw.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * burFun(burXcoNum, burYcoNum, pieCouNum) // => void
	 * ```
	 *
	*/

	const burFun = ( burXcoNum : number, burYcoNum : number, pieCouNum : number ) : void => { // What: Burst Function. Why: The card throws confetti when it opens and wherever it's tapped. How: This adds pieces at the point and starts the loop if it's idle.


		const kicPxlNum = rhyPxlFun( 'm03' ); // What: Kick Pixel Number. Why: A burst throws upward before it falls. How: This is the Vertical Rhythm Base Minus 3 step, about 6.27px, taken off every piece's downward speed. // Vertical Rhythm Base Minus 3 ~= 6.268px
		const sizMaxNum = rhyPxlFun( 'bas' ); // What: Size Maximum Number. Why: Piece sizes vary within a range. How: This is the Vertical Rhythm Base step, about 14.6px. // Vertical Rhythm Base ~= 14.572px
		const sizMinNum = rhyPxlFun( 'm03' ); // What: Size Minimum Number. Why: Piece sizes vary within a range. How: This is the Vertical Rhythm Base Minus 3 step, about 6.27px. // Vertical Rhythm Base Minus 3 ~= 6.268px
		const speMaxNum = rhyPxlFun( 'm01' ); // What: Speed Maximum Number. Why: Piece speeds vary within a range. How: This is the Vertical Rhythm Base Minus 1 step, 11px per 60th of a second. // Vertical Rhythm Base Minus 1 = 11px
		const speMinNum = rhyPxlFun( 'm06' ); // What: Speed Minimum Number. Why: Piece speeds vary within a range. How: This is the Vertical Rhythm Base Minus 6 step, about 2.70px per 60th of a second. // Vertical Rhythm Base Minus 6 ~= 2.696px
		const spiMaxNum = cdnPowFun( 6 );     // What: Spin Maximum Number. Why: Pieces spin up to a limit either way. How: This is the core design number to the power of 6, about 5.40 degrees per 60th of a second. // Core-Design-Number to the Power of 6 ~= 5.404



		for ( let pieIndNum = 0; pieIndNum < pieCouNum; pieIndNum++ ) { // What: Piece Creation Loop. Why: A burst throws many pieces at once. How: This adds one piece per count.


			const angValNum = Math.random() * Math.PI * 2;       // What: Angle Value Number. Why: Pieces fly out in every direction. How: This picks an angle anywhere around the circle, in radians.
			const speValNum = ranValFun( speMinNum, speMaxNum ); // What: Speed Value Number. Why: Some pieces fly farther than others. How: This picks a speed within the range.


			pieRecArr.push({ // What: Piece Push Call. Why: Each new piece joins the ones in the air. How: This adds its starting values to the array.


				alpNum    : 1,                                                               // What: Alpha Number. Why: A piece starts fully visible. How: This starts it at 1.
				colStr    : parColArr[ Math.floor( Math.random() * parColArr.length ) ],     // What: Color String. Why: The burst mixes the party colors. How: This picks one at random.
				rotNum    : Math.random() * 360,                                             // What: Rotation Number. Why: Pieces start at every angle. How: This picks one anywhere around a full turn, in degrees.
				shaStr    : SHA_NAM_ARR[ Math.floor( Math.random() * SHA_NAM_ARR.length ) ], // What: Shape String. Why: The burst mixes three shapes. How: This picks one at random.
				sizNum    : ranValFun( sizMinNum, sizMaxNum ),                               // What: Size Number. Why: Pieces come in different sizes. How: This picks one within the range.
				spiNum    : ranValFun( -spiMaxNum, spiMaxNum ),                              // What: Spin Number. Why: Pieces spin either way at their own pace. How: This picks a spin from the limit one way to the limit the other.
				velXcoNum : Math.cos( angValNum ) * speValNum,                               // What: Velocity X-Coordinate Number. Why: The piece flies along its angle. How: This is the speed's sideways share.
				velYcoNum : Math.sin( angValNum ) * speValNum - kicPxlNum,                   // What: Velocity Y-Coordinate Number. Why: The piece flies along its angle, kicked upward. How: This is the speed's downward share less the kick.
				xcoNum    : burXcoNum,                                                       // What: X-Coordinate Number. Why: Every piece starts at the burst's point. How: This takes its distance from the left edge.
				ycoNum    : burYcoNum                                                        // What: Y-Coordinate Number. Why: Every piece starts at the burst's point. How: This takes its distance from the top edge.


			});


		}



		if ( aniFraNum === 0 ) aniFraNum = requestAnimationFrame( steFraFun ); // What: Loop Start Check. Why: An idle loop has to start again for the new pieces. How: This asks for a frame only when none is pending.


	};

	// #endregion burFun



	return { // What: Confetti System Return. Why: The card throws bursts and stops the confetti later. How: This returns both functions.


		burFun, // What: Burst Function. Why: The card throws bursts. How: This hands over the burst function.

		stoFun : () => { // What: Stop Function. Why: The confetti must stop when the card replays or closes. How: This cancels the next frame, stops measuring, and drops every piece.


			cancelAnimationFrame( aniFraNum ); // What: Frame Cancel Call. Why: The loop must not run after the card is gone. How: This cancels the pending frame.

			aniFraNum = 0; // What: Idle Assignment. Why: A stopped loop is idle. How: This clears the frame's id.


			resObsObj.disconnect(); // What: Observer Disconnect Call. Why: The canvas no longer needs measuring. How: This stops watching it.


			pieRecArr.length = 0; // What: Piece Clear Assignment. Why: A replay starts with no confetti. How: This empties the array.


		}


	};


};

// #endregion staConFun

// #endregion Helpers



// #region Exports

export { PAR_TOK_ARR, staConFun, type ConSysTyp }; // What: Named Exports. Why: The card starts the confetti, keeps its functions, and colors its balloons from the same palette. How: This exports the palette's tokens, the start function, and the system type by name.

// #endregion Exports


