


/**
 * snowfall.ts = Snowfall
 *
 * @summary
 * The Christmas card's falling snow. Each snowflake is a small round div that
 * falls at its own speed while swaying side to side, and starts again at the
 * top, with a new size, speed, and sway, once it falls past the bottom or
 * drifts past either side. The flakes move by transform alone, on
 * requestAnimationFrame, and each step is scaled by the time since the last
 * frame, so the snow falls at the same pace on a 60Hz or a 120Hz screen.
 * staSnoFun starts it and returns the function that stops it and removes
 * every flake, so the card can end it cleanly when it replays or closes.
 *
 * The animation began as a Codecademy holiday card tutorial
 * (https://s3.amazonaws.com/codecademy-content/courses/holiday-cards/
 * snowfall.min.js), no longer online, and has been rewritten since.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type FlaRecTyp = { // What: Flake Record Type. Why: Each flake keeps its own size, speed, sway, and position between frames. How: This holds its element and every value its next step reads.


	divEle    : HTMLDivElement, // What: Div Element. Why: The flake is drawn as a div. How: This holds it.
	oscNum    : number,         // What: Oscillation Number. Why: The sway follows a cosine of a growing angle. How: This holds the angle, in radians.
	oscSteNum : number,         // What: Oscillation Step Number. Why: Each flake sways at its own pace. How: This holds how much the angle grows per 60th of a second.
	sizNum    : number,         // What: Size Number. Why: Flakes come in different sizes. How: This holds its width and height, in pixels.
	speNum    : number,         // What: Speed Number. Why: Flakes fall at different speeds. How: This holds its fall per 60th of a second, in pixels.
	xcoNum    : number,         // What: X-Coordinate Number. Why: The flake drifts side to side. How: This holds its distance from the left edge, in pixels.
	ycoNum    : number          // What: Y-Coordinate Number. Why: The flake falls. How: This holds its distance from the top edge, in pixels.


};



type SnoSetTyp = { // What: Snowfall Settings Type. Why: The card picks how much snow falls and how fast for the screen it's on. How: This holds the flake count and the size and speed ranges.


	couNum    : number, // What: Count Number. Why: A narrow screen looks crowded with as many flakes as a wide one. How: This holds how many flakes fall.
	sizMaxNum : number, // What: Size Maximum Number. Why: Flake sizes vary within a range. How: This holds the largest, in pixels.
	sizMinNum : number, // What: Size Minimum Number. Why: Flake sizes vary within a range. How: This holds the smallest, in pixels.
	speMaxNum : number, // What: Speed Maximum Number. Why: A short screen makes fast flakes cross it too quickly. How: This holds the fastest fall per 60th of a second, in pixels.
	speMinNum : number  // What: Speed Minimum Number. Why: Flake speeds vary within a range. How: This holds the slowest fall per 60th of a second, in pixels.


};

// #endregion Types



// #region Constants

const FRA_MIL_NUM = 1000 / 60; // What: Frame Millisecond Number. Why: The flakes' speeds and sway were tuned for one step every 60th of a second. How: Each frame's step is scaled by how many of these have passed since the last one.
const FRA_MAX_NUM = 4;         // What: Frame Maximum Number. Why: A tab left in the background resumes after a long gap, which would throw every flake at once. How: This caps one frame's step at four 60ths of a second.

// #endregion Constants



// #region Helpers

const ranIntFun = ( minValNum : number, maxValNum : number ) : number => Math.round( minValNum + Math.random() * ( maxValNum - minValNum ) ); // What: Random Integer Function. Why: Every flake's size, speed, sway, and starting spot are picked at random within a range. How: This returns a whole number from the minimum to the maximum, both included.



// #region resFlaFun

/**
 * resFlaFun = Reset Flake Function
 *
 * @summary
 * Starts a flake again at the top of the snow once it has fallen past the
 * bottom or drifted past either side, with a new size, speed, and sway, so
 * the snow never repeats the same pattern. It places the flake at random
 * across the snow's current width, less its own size so it starts fully
 * inside, and resizes its element to match.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param flaRecObj - Flake Record Object: {@link FlaRecTyp}
 * @param snoSetObj - Snowfall Settings Object: {@link SnoSetTyp}
 * @param widValNum - Width Value Number: The snow's current width, in pixels.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * resFlaFun(flaRecObj, snoSetObj, widValNum) // => void
 * ```
 *
*/

const resFlaFun = ( flaRecObj : FlaRecTyp, snoSetObj : SnoSetTyp, widValNum : number ) : void => { // What: Reset Flake Function. Why: A flake that leaves the snow should fall again from the top. How: This picks a new size, speed, sway, and spot, and resizes the flake's element.


	flaRecObj.oscSteNum = ranIntFun( 1, 10 ) / 100;                                    // What: Oscillation Step Assignment. Why: Each flake sways at its own pace. How: This picks 0.01 to 0.1 radians per 60th of a second.
	flaRecObj.sizNum    = ranIntFun( snoSetObj.sizMinNum, snoSetObj.sizMaxNum );       // What: Size Assignment. Why: Each fall gets a new size. How: This picks one within the settings' range.
	flaRecObj.speNum    = ranIntFun( snoSetObj.speMinNum, snoSetObj.speMaxNum );       // What: Speed Assignment. Why: Each fall gets a new speed. How: This picks one within the settings' range.
	flaRecObj.xcoNum    = ranIntFun( 0, Math.max( 0, widValNum - flaRecObj.sizNum ) ); // What: X-Coordinate Assignment. Why: The flake starts anywhere across the top, fully inside. How: This picks a spot from the left edge to the width less its size.
	flaRecObj.ycoNum    = 0;                                                           // What: Y-Coordinate Assignment. Why: The flake starts again at the top. How: This puts it at the top edge.


	flaRecObj.divEle.style.height = `${ flaRecObj.sizNum }px`; // What: Height Assignment. Why: The element has to match the new size. How: This sets its height.
	flaRecObj.divEle.style.width  = `${ flaRecObj.sizNum }px`; // What: Width Assignment. Why: The element has to match the new size. How: This sets its width.


};

// #endregion resFlaFun



// #region staSnoFun

/**
 * staSnoFun = Start Snowfall Function
 *
 * @summary
 * Starts the snow falling inside a container: it creates the flakes, each a
 * div with the given class placed at random across the container, and moves
 * them every animation frame. A flake falls by its speed and sways by the
 * cosine of a growing angle, both scaled by the time since the last frame,
 * and starts again at the top once it leaves. The container's size is
 * measured whenever it changes, so the snow fills it after a resize. It
 * returns the function that stops the loop, stops measuring, and removes
 * every flake.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param conDivEle - Container Div Element: The element the snow falls in,
 *                    positioned so the flakes can sit inside it.
 * @param flaClaStr - Flake Class String: The class each flake takes, which
 *                    styles it as a small white circle.
 * @param snoSetObj - Snowfall Settings Object: {@link SnoSetTyp}
 *
 * @returns The function that stops the snow and removes every flake.
 *
 * @example
 * ```ts
 * staSnoFun(conDivEle, flaClaStr, snoSetObj) // => () => void
 * ```
 *
*/

const staSnoFun = ( conDivEle : HTMLElement, flaClaStr : string, snoSetObj : SnoSetTyp ) : () => void => { // What: Start Snowfall Function. Why: The card's last scene snows until it closes. How: This creates the flakes, moves them every frame, and returns the function that stops it.


	// #region Container Measuring

	let conHeiNum = conDivEle.clientHeight; // What: Container Height Number. Why: A flake starts again once it falls past the bottom. How: This holds the container's height, measured again whenever it changes.
	let conWidNum = conDivEle.clientWidth;  // What: Container Width Number. Why: A flake starts again once it drifts past either side. How: This holds the container's width, measured again whenever it changes.


	const resObsObj = new ResizeObserver( () => { // What: Resize Observer Object. Why: The snow should fill the container after the window is resized. How: This measures it again whenever its size changes.


		conHeiNum = conDivEle.clientHeight; // What: Height Remeasure. Why: The bottom edge moved. How: This reads the new height.
		conWidNum = conDivEle.clientWidth;  // What: Width Remeasure. Why: The side edges moved. How: This reads the new width.


	} );


	resObsObj.observe( conDivEle ); // What: Container Observe Call. Why: Measuring only happens while the snow falls. How: This starts watching the container.

	// #endregion Container Measuring



	// #region Flake Creation

	const flaRecArr : FlaRecTyp[] = Array.from( Array( snoSetObj.couNum ).keys(), () => { // What: Flake Record Array. Why: Every flake keeps its own values between frames. How: This creates one flake per count, already scattered across the container so the snow doesn't start as one row at the top.


		const flaRecObj : FlaRecTyp = { // What: Flake Record Object. Why: A new flake needs an element and starting values. How: This creates the element, picks its values, then scatters it from top to bottom.


			divEle    : document.createElement( 'div' ), // What: Div Element. Why: The flake is drawn as a div. How: This creates it.
			oscNum    : 0,                               // What: Oscillation Number. Why: Every flake's sway starts at angle 0. How: This starts it there.
			oscSteNum : 0,                               // What: Oscillation Step Number. Why: The reset below picks the real pace. How: This holds a placeholder until then.
			sizNum    : 0,                               // What: Size Number. Why: The reset below picks the real size. How: This holds a placeholder until then.
			speNum    : 0,                               // What: Speed Number. Why: The reset below picks the real speed. How: This holds a placeholder until then.
			xcoNum    : 0,                               // What: X-Coordinate Number. Why: The scatter below picks the real spot. How: This holds a placeholder until then.
			ycoNum    : 0                                // What: Y-Coordinate Number. Why: The scatter below picks the real spot. How: This holds a placeholder until then.


		};


		flaRecObj.divEle.className = flaClaStr; // What: Flake Class Assignment. Why: The card's stylesheet draws the flake. How: This gives it the card's flake class.


		resFlaFun( flaRecObj, snoSetObj, conWidNum ); // What: Flake Reset Call. Why: A new flake needs a size, speed, sway, and spot. How: This picks them the same way a falling flake's restart does.


		flaRecObj.xcoNum = ranIntFun( 0, conWidNum ); // What: X-Coordinate Scatter. Why: The first flakes should spread across the whole width. How: This places it anywhere from the left edge to the right.
		flaRecObj.ycoNum = ranIntFun( 0, conHeiNum ); // What: Y-Coordinate Scatter. Why: The first flakes should already fill the sky. How: This places it anywhere from the top to the bottom.


		conDivEle.appendChild( flaRecObj.divEle ); // What: Flake Append Call. Why: The flake has to be in the page to be seen. How: This adds it to the container.



		return flaRecObj;


	} );

	// #endregion Flake Creation



	// #region Frame Loop

	let aniFraNum = 0; // What: Animation Frame Number. Why: Stopping the snow has to cancel the next frame. How: This holds the pending frame's id.
	let preTimNum = 0; // What: Previous Time Number. Why: Each step is scaled by the time since the last frame. How: This holds the last frame's timestamp, 0 before the first.


	const steFraFun = ( curTimNum : number ) : void => { // What: Step Frame Function. Why: The flakes move once per frame. How: This moves every flake by the time since the last frame, restarts any that left, and asks for the next frame.


		const fraValNum = preTimNum === 0 ? 1 : Math.min( FRA_MAX_NUM, ( curTimNum - preTimNum ) / FRA_MIL_NUM ); // What: Frame Value Number. Why: Speeds were tuned per 60th of a second, so a faster or slower screen has to scale each step. How: This counts the 60ths since the last frame, one on the first, capped so a background tab doesn't jump.


		preTimNum = curTimNum; // What: Previous Time Assignment. Why: The next frame measures from this one. How: This keeps its timestamp.


		for ( const flaRecObj of flaRecArr ) { // What: Flake Step Loop. Why: Every flake moves each frame. How: This sways, drops, and draws each one, restarting any that left.


			flaRecObj.oscNum += flaRecObj.oscSteNum * fraValNum;          // What: Oscillation Increase. Why: The sway angle grows with time. How: This adds the flake's pace for the frame's length.
			flaRecObj.xcoNum += Math.cos( flaRecObj.oscNum ) * fraValNum; // What: X-Coordinate Increase. Why: The flake sways side to side. How: This adds the cosine of its angle, which swings between -1 and 1, for the frame's length.
			flaRecObj.ycoNum += flaRecObj.speNum * fraValNum;             // What: Y-Coordinate Increase. Why: The flake falls. How: This adds its speed for the frame's length.


			const xcoOutBoo = flaRecObj.xcoNum < 0 || flaRecObj.xcoNum > conWidNum - flaRecObj.sizNum; // What: X-Coordinate Outside Boolean. Why: A flake that drifts past either side should start again. How: This is true left of the left edge or past the right edge less its size.
			const ycoOutBoo = flaRecObj.ycoNum > conHeiNum - flaRecObj.sizNum;                         // What: Y-Coordinate Outside Boolean. Why: A flake that falls past the bottom should start again. How: This is true past the bottom edge less its size.


			if ( xcoOutBoo || ycoOutBoo ) resFlaFun( flaRecObj, snoSetObj, conWidNum ); // What: Flake Restart Check. Why: A flake that left the snow should fall again from the top. How: This restarts it when it's outside on either axis.



			flaRecObj.divEle.style.transform = `translate3d( ${ flaRecObj.xcoNum }px, ${ flaRecObj.ycoNum }px, 0 )`; // What: Transform Assignment. Why: Moving by transform skips layout, so a hundred flakes stay smooth. How: This places the flake at its new position.


		}


		aniFraNum = requestAnimationFrame( steFraFun ); // What: Next Frame Request. Why: The snow keeps falling. How: This asks for the next frame and keeps its id.


	};


	aniFraNum = requestAnimationFrame( steFraFun ); // What: First Frame Request. Why: The snow starts falling. How: This asks for the first frame and keeps its id.

	// #endregion Frame Loop



	return () => { // What: Stop Snowfall Return. Why: The card stops the snow when it replays or closes. How: This returns the function that cancels the next frame, stops measuring, and removes every flake.


		cancelAnimationFrame( aniFraNum ); // What: Frame Cancel Call. Why: The loop must not run after the card is gone. How: This cancels the pending frame.


		resObsObj.disconnect(); // What: Observer Disconnect Call. Why: The container no longer needs measuring. How: This stops watching it.


		for ( const flaRecObj of flaRecArr ) flaRecObj.divEle.remove(); // What: Flake Removal Loop. Why: A replay starts with fresh snow. How: This removes every flake from the page.


	};


};

// #endregion staSnoFun

// #endregion Helpers



// #region Exports

export { staSnoFun, type SnoSetTyp }; // What: Named Exports. Why: The card starts the snow and builds its settings. How: This exports the start function and the settings type by name.

// #endregion Exports


