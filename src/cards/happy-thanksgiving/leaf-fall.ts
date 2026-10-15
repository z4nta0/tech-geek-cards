


/**
 * leaf-fall.ts = Leaf Fall
 *
 * @summary
 * The Thanksgiving card's falling leaves. Each leaf is a copy of a small SVG
 * leaf the card draws once and hides, tinted an autumn color, that waits a
 * moment at the top, then falls the whole height of the screen while drifting
 * sideways, spinning, and fading in, and starts again at the top with a new
 * size, color, spot, and pace once it falls past the bottom. The leaves move
 * by transform alone, on requestAnimationFrame, and every step is scaled by
 * the milliseconds since the last frame, so they fall at the same pace on a
 * 60Hz or a 120Hz screen. staLeaFun starts them and returns the function that
 * stops them and removes every leaf, so the card can end them cleanly when it
 * replays or closes. Rewritten from TechGeek.support's GSAP tweens, which
 * restarted themselves outside the card's GSAP context and kept running after
 * the card closed.
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

type LeaRecTyp = { // What: Leaf Record Type. Why: Each leaf keeps its own size, pace, and position between frames. How: This holds its element and every value its next step reads.


	rotNum    : number,        // What: Rotation Number. Why: The leaf spins as it falls. How: This holds its angle, in degrees.
	rotSpeNum : number,        // What: Rotation Speed Number. Why: Each leaf spins at its own pace, either way. How: This holds its turn per millisecond, in degrees.
	sizNum    : number,        // What: Size Number. Why: Leaves come in different sizes. How: This holds its width and height, in pixels.
	svgEle    : SVGSVGElement, // What: SVG Element. Why: The leaf is drawn as an SVG. How: This holds the copy of the card's leaf.
	waiNum    : number,        // What: Wait Number. Why: Leaves start falling at different times, so they never fall as one row. How: This holds the milliseconds left before it starts.
	xcoNum    : number,        // What: X-Coordinate Number. Why: The leaf drifts sideways. How: This holds its distance from the left edge, in pixels.
	xcoSpeNum : number,        // What: X-Coordinate Speed Number. Why: Each leaf drifts its own way. How: This holds its sideways move per millisecond, in pixels.
	ycoNum    : number,        // What: Y-Coordinate Number. Why: The leaf falls. How: This holds its distance from the top edge, in pixels.
	ycoSpeNum : number         // What: Y-Coordinate Speed Number. Why: Each leaf falls at its own pace. How: This holds its fall per millisecond, in pixels.


};



type LeaSetTyp = { // What: Leaf Settings Type. Why: The card picks the leaves' colors, amount, and ranges. How: This holds every setting a leaf's restart reads.


	colStrArr : string[], // What: Color String Array. Why: The leaves come in several autumn colors. How: This holds the colors a leaf picks from.
	couNum    : number,   // What: Count Number. Why: The card decides how many leaves fall. How: This holds the count.
	driMaxNum : number,   // What: Drift Maximum Number. Why: A leaf drifts sideways as it falls, either way. How: This holds the farthest drift over one fall, in pixels.
	durMaxNum : number,   // What: Duration Maximum Number. Why: Fall times vary within a range. How: This holds the slowest fall, in milliseconds.
	durMinNum : number,   // What: Duration Minimum Number. Why: Fall times vary within a range. How: This holds the quickest fall, in milliseconds.
	sizMaxNum : number,   // What: Size Maximum Number. Why: Leaf sizes vary within a range. How: This holds the largest, in pixels.
	sizMinNum : number,   // What: Size Minimum Number. Why: Leaf sizes vary within a range. How: This holds the smallest, in pixels.
	spiMaxNum : number,   // What: Spin Maximum Number. Why: A leaf spins as it falls, either way. How: This holds the most it turns over one fall, in degrees.
	waiMaxNum : number    // What: Wait Maximum Number. Why: A leaf waits a moment before each fall. How: This holds the longest wait, in milliseconds.


};

// #endregion Types



// #region Constants

const ELA_MAX_NUM = 1000 / 15; // What: Elapsed Maximum Number. Why: A tab left in the background resumes after a long gap, which would throw every leaf at once. How: This caps one frame's step at four 60ths of a second, in milliseconds.
const FUL_TUR_NUM = 360;       // What: Full Turn Number. Why: A leaf starts at any angle. How: This is a whole turn in degrees, a geometric constant rather than a step on the scale.

// #endregion Constants



// #region Helpers

const ranNumFun = ( minValNum : number, maxValNum : number ) : number => minValNum + Math.random() * ( maxValNum - minValNum ); // What: Random Number Function. Why: Every leaf's size, pace, spot, and wait are picked at random within a range. How: This returns a number from the minimum up to the maximum.



// #region resLeaFun

/**
 * resLeaFun = Reset Leaf Function
 *
 * @summary
 * Starts a leaf again just above the top of the container once it has fallen
 * past the bottom, with a new size, color, angle, spot, and pace, and a new
 * wait before it falls. Its fall time is picked first, and its fall, drift,
 * and spin are each spread over that time, so a slow leaf also drifts and
 * spins slowly. It places the leaf at random across the container's width,
 * less its own size, hides it until it starts to fall, and resizes its
 * element to match.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param leaRecObj - Leaf Record Object: {@link LeaRecTyp}
 * @param leaSetObj - Leaf Settings Object: {@link LeaSetTyp}
 * @param conWidNum - Container Width Number: The container's width, in
 *                    pixels.
 * @param conHeiNum - Container Height Number: The container's height, in
 *                    pixels.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * resLeaFun(leaRecObj, leaSetObj, conWidNum, conHeiNum) // => void
 * ```
 *
*/

const resLeaFun = ( leaRecObj : LeaRecTyp, leaSetObj : LeaSetTyp, conWidNum : number, conHeiNum : number ) : void => { // What: Reset Leaf Function. Why: A leaf that falls past the bottom should fall again from the top. How: This picks its new values and resizes and recolors its element.


	const colIndNum = Math.floor( Math.random() * leaSetObj.colStrArr.length ); // What: Color Index Number. Why: Each fall gets a new color. How: This picks a position in the color list.
	const durValNum = ranNumFun( leaSetObj.durMinNum, leaSetObj.durMaxNum );    // What: Duration Value Number. Why: The fall, drift, and spin are spread over one fall time. How: This picks it within the settings' range, in milliseconds.
	const sizValNum = ranNumFun( leaSetObj.sizMinNum, leaSetObj.sizMaxNum );    // What: Size Value Number. Why: Each fall gets a new size. How: This picks it within the settings' range, in pixels.


	leaRecObj.rotNum    = ranNumFun( 0, FUL_TUR_NUM );                                            // What: Rotation Assignment. Why: The leaf starts at any angle. How: This picks one within a whole turn.
	leaRecObj.rotSpeNum = ranNumFun( leaSetObj.spiMaxNum * -1, leaSetObj.spiMaxNum ) / durValNum; // What: Rotation Speed Assignment. Why: The leaf spins either way over its fall. How: This picks a turn within the spin range and spreads it over the fall time.
	leaRecObj.sizNum    = sizValNum;                                                              // What: Size Assignment. Why: The frame loop reads the size. How: This keeps it.
	leaRecObj.waiNum    = ranNumFun( 0, leaSetObj.waiMaxNum );                                    // What: Wait Assignment. Why: The leaf waits a moment before it falls. How: This picks a wait within the settings' range.
	leaRecObj.xcoNum    = ranNumFun( 0, Math.max( 0, conWidNum - sizValNum ) );                   // What: X-Coordinate Assignment. Why: The leaf starts anywhere across the top, fully inside. How: This picks a spot from the left edge to the width less its size.
	leaRecObj.xcoSpeNum = ranNumFun( leaSetObj.driMaxNum * -1, leaSetObj.driMaxNum ) / durValNum; // What: X-Coordinate Speed Assignment. Why: The leaf drifts either way over its fall. How: This picks a drift within the range and spreads it over the fall time.
	leaRecObj.ycoNum    = sizValNum * -1;                                                         // What: Y-Coordinate Assignment. Why: The leaf starts just out of sight. How: This puts it its own size above the top edge.
	leaRecObj.ycoSpeNum = ( conHeiNum + sizValNum * 2 ) / durValNum;                              // What: Y-Coordinate Speed Assignment. Why: The leaf falls from above the top to below the bottom in its fall time. How: This spreads the container's height plus twice its size over the fall time.


	leaRecObj.svgEle.setAttribute( 'height', String( sizValNum ) ); // What: Height Attribute Call. Why: The element has to match the new size. How: This sets its height.
	leaRecObj.svgEle.setAttribute( 'width', String( sizValNum ) );  // What: Width Attribute Call. Why: The element has to match the new size. How: This sets its width.

	leaRecObj.svgEle.style.color   = leaSetObj.colStrArr[ colIndNum ]; // What: Color Assignment. Why: The leaf's shapes fill with the current color. How: This tints it the picked color.
	leaRecObj.svgEle.style.opacity = '0';                              // What: Opacity Assignment. Why: The leaf stays hidden while it waits. How: This hides it until the frame loop fades it in.


};

// #endregion resLeaFun



// #region staLeaFun

/**
 * staLeaFun = Start Leaf Function
 *
 * @summary
 * Starts the leaves falling inside a container: it copies the card's hidden
 * leaf drawing once per leaf, gives each copy the falling leaf's class and
 * its first size, color, spot, and wait, and moves them every animation
 * frame. A waiting leaf counts down its wait; a falling leaf falls, drifts,
 * and spins by its pace times the milliseconds since the last frame, fades in
 * as it falls, and starts again at the top once it passes the bottom. The
 * container's size is measured whenever it changes, so the leaves fill it
 * after a resize. It returns the function that stops the loop, stops
 * measuring, and removes every leaf.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param conDivEle - Container Div Element: The element the leaves fall in,
 *                    positioned so the leaves can sit inside it.
 * @param temSvgEle - Template SVG Element: The hidden leaf drawing each leaf
 *                    copies.
 * @param leaClaStr - Leaf Class String: The class each leaf takes, which
 *                    places and shows it.
 * @param leaSetObj - Leaf Settings Object: {@link LeaSetTyp}
 *
 * @returns The function that stops the leaves and removes every one.
 *
 * @example
 * ```ts
 * staLeaFun(conDivEle, temSvgEle, leaClaStr, leaSetObj) // => () => void
 * ```
 *
*/

const staLeaFun = ( conDivEle : HTMLElement, temSvgEle : SVGSVGElement, leaClaStr : string, leaSetObj : LeaSetTyp ) : () => void => { // What: Start Leaf Function. Why: Leaves fall over the card until it closes. How: This creates the leaves, moves them every frame, and returns the function that stops them.


	// #region Container Measuring

	let conHeiNum = conDivEle.clientHeight; // What: Container Height Number. Why: A leaf falls the container's height. How: This holds it, measured again whenever it changes.
	let conWidNum = conDivEle.clientWidth;  // What: Container Width Number. Why: A leaf starts anywhere across the container. How: This holds its width, measured again whenever it changes.


	const resObsObj = new ResizeObserver( () => { // What: Resize Observer Object. Why: The leaves should fill the container after the window is resized. How: This measures it again whenever its size changes.


		conHeiNum = conDivEle.clientHeight; // What: Height Remeasure. Why: The bottom edge moved. How: This reads the new height.
		conWidNum = conDivEle.clientWidth;  // What: Width Remeasure. Why: The side edge moved. How: This reads the new width.


	} );


	resObsObj.observe( conDivEle ); // What: Container Observe Call. Why: Measuring only happens while the leaves fall. How: This starts watching the container.

	// #endregion Container Measuring



	// #region Leaf Creation

	const leaRecArr : LeaRecTyp[] = Array.from( Array( leaSetObj.couNum ).keys(), () => { // What: Leaf Record Array. Why: Every leaf keeps its own values between frames. How: This creates one leaf per count, each waiting a different time before its first fall.


		const leaRecObj : LeaRecTyp = { // What: Leaf Record Object. Why: A new leaf needs an element and starting values. How: This copies the drawing, then the reset below picks its real values.


			rotNum    : 0,                                            // What: Rotation Number. Why: The reset below picks the real angle. How: This holds a placeholder until then.
			rotSpeNum : 0,                                            // What: Rotation Speed Number. Why: The reset below picks the real spin. How: This holds a placeholder until then.
			sizNum    : 0,                                            // What: Size Number. Why: The reset below picks the real size. How: This holds a placeholder until then.
			svgEle    : temSvgEle.cloneNode( true ) as SVGSVGElement, // What: SVG Element. Why: Each leaf is a copy of the card's drawing. How: This copies the template with its shapes. // What: Type Assertion Note. Why: cloneNode is typed as returning any Node. How: A copy of an SVG element is always an SVG element.
			waiNum    : 0,                                            // What: Wait Number. Why: The reset below picks the real wait. How: This holds a placeholder until then.
			xcoNum    : 0,                                            // What: X-Coordinate Number. Why: The reset below picks the real spot. How: This holds a placeholder until then.
			xcoSpeNum : 0,                                            // What: X-Coordinate Speed Number. Why: The reset below picks the real drift. How: This holds a placeholder until then.
			ycoNum    : 0,                                            // What: Y-Coordinate Number. Why: The reset below picks the real spot. How: This holds a placeholder until then.
			ycoSpeNum : 0                                             // What: Y-Coordinate Speed Number. Why: The reset below picks the real pace. How: This holds a placeholder until then.


		};


		leaRecObj.svgEle.setAttribute( 'class', leaClaStr ); // What: Leaf Class Assignment. Why: The copy keeps the template's hiding class, which the leaf mustn't. How: This replaces it with the falling leaf's class.


		resLeaFun( leaRecObj, leaSetObj, conWidNum, conHeiNum ); // What: Leaf Reset Call. Why: A new leaf needs a size, color, spot, pace, and wait. How: This picks them the same way a fallen leaf's restart does.


		conDivEle.appendChild( leaRecObj.svgEle ); // What: Leaf Append Call. Why: The leaf has to be in the page to be seen. How: This adds it to the container.



		return leaRecObj;


	} );

	// #endregion Leaf Creation



	// #region Frame Loop

	let aniFraNum = 0; // What: Animation Frame Number. Why: Stopping the leaves has to cancel the next frame. How: This holds the pending frame's id.
	let preTimNum = 0; // What: Previous Time Number. Why: Each step is scaled by the time since the last frame. How: This holds the last frame's timestamp, 0 before the first.


	const steFraFun = ( curTimNum : number ) : void => { // What: Step Frame Function. Why: The leaves move once per frame. How: This counts down each waiting leaf, moves each falling one by the time since the last frame, restarts any that passed the bottom, and asks for the next frame.


		const elaMilNum = preTimNum === 0 ? 0 : Math.min( ELA_MAX_NUM, curTimNum - preTimNum ); // What: Elapsed Millisecond Number. Why: Every pace is per millisecond, so a faster or slower screen moves the leaves the same amount per second. How: This is the time since the last frame, 0 on the first, capped so a background tab doesn't jump.


		preTimNum = curTimNum; // What: Previous Time Assignment. Why: The next frame measures from this one. How: This keeps its timestamp.


		for ( const leaRecObj of leaRecArr ) { // What: Leaf Step Loop. Why: Every leaf waits or moves each frame. How: This steps and draws each one, restarting any that passed the bottom.


			leaRecObj.waiNum -= elaMilNum; // What: Wait Decrease. Why: A waiting leaf counts down to its fall. How: This takes off the frame's length.



			if ( leaRecObj.waiNum > 0 ) continue; // What: Waiting Leaf Check. Why: A leaf still waiting stays hidden above the top. How: This skips it until its wait runs out.



			leaRecObj.rotNum += leaRecObj.rotSpeNum * elaMilNum; // What: Rotation Increase. Why: The leaf spins. How: This adds its spin for the frame's length.
			leaRecObj.xcoNum += leaRecObj.xcoSpeNum * elaMilNum; // What: X-Coordinate Increase. Why: The leaf drifts sideways. How: This adds its drift for the frame's length.
			leaRecObj.ycoNum += leaRecObj.ycoSpeNum * elaMilNum; // What: Y-Coordinate Increase. Why: The leaf falls. How: This adds its fall for the frame's length.


			if ( leaRecObj.ycoNum > conHeiNum + leaRecObj.sizNum ) resLeaFun( leaRecObj, leaSetObj, conWidNum, conHeiNum ); // What: Leaf Restart Check. Why: A leaf that falls past the bottom should fall again from the top. How: This restarts it once it's fully below the bottom edge.



			const falFraNum = ( leaRecObj.ycoNum + leaRecObj.sizNum ) / ( conHeiNum + leaRecObj.sizNum * 2 ); // What: Fall Fraction Number. Why: The leaf fades in as it falls, as the original did. How: This is how far through its fall it is, 0 just above the top and 1 just below the bottom.


			leaRecObj.svgEle.style.opacity   = String( Math.min( 1, Math.max( 0, falFraNum ) ) );                                                       // What: Opacity Assignment. Why: The leaf fades in as it falls. How: This sets its opacity to its fall fraction, kept between 0 and 1.
			leaRecObj.svgEle.style.transform = `translate3d( ${ leaRecObj.xcoNum }px, ${ leaRecObj.ycoNum }px, 0 ) rotate( ${ leaRecObj.rotNum }deg )`; // What: Transform Assignment. Why: Moving by transform skips layout, so thirty leaves stay smooth. How: This places and turns the leaf.


		}


		aniFraNum = requestAnimationFrame( steFraFun ); // What: Next Frame Request. Why: The leaves keep falling. How: This asks for the next frame and keeps its id.


	};


	aniFraNum = requestAnimationFrame( steFraFun ); // What: First Frame Request. Why: The leaves start falling. How: This asks for the first frame and keeps its id.

	// #endregion Frame Loop



	return () => { // What: Stop Leaf Return. Why: The card stops the leaves when it replays or closes. How: This returns the function that cancels the next frame, stops measuring, and removes every leaf.


		cancelAnimationFrame( aniFraNum ); // What: Frame Cancel Call. Why: The loop must not run after the card is gone. How: This cancels the pending frame.


		resObsObj.disconnect(); // What: Observer Disconnect Call. Why: The container no longer needs measuring. How: This stops watching it.


		for ( const leaRecObj of leaRecArr ) leaRecObj.svgEle.remove(); // What: Leaf Removal Loop. Why: A replay starts with fresh leaves. How: This removes every leaf from the page.


	};


};

// #endregion staLeaFun

// #endregion Helpers



// #region Exports

export { staLeaFun, type LeaSetTyp }; // What: Named Exports. Why: The card starts the leaves and builds their settings. How: This exports the start function and the settings type by name.

// #endregion Exports


