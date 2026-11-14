


/**
 * feedback.ts = Feedback
 *
 * @summary
 * The shared pieces of the interaction feedback probe, for a spec that
 * checks a control's hover, press, and focus: the property lists a look is
 * read with, the helpers that snapshot an element's look and turn two
 * snapshots into problems, and the click block that keeps a press from acting
 * mid-check. A spec collects and drives its own elements.
 * Adapted from TechGeek.dev's own.
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

type SnaRecTyp = { // What: Snapshot Record Type. Why: An element's look, and whether each part of it would ease, is compared between two moments the same way. How: This holds one value and one duration per probed property.


	durArr : number[], // What: Duration Array. Why: A property that changes has to ease rather than snap. How: This holds each probed property's transition duration in milliseconds, or 0 when no transition covers it, with a color matching its parent's taking the longer of its own duration and the parent's and a currentColor border taking the color's when that's longer.
	valArr : string[]  // What: Value Array. Why: Two moments are compared property by property. How: This holds each probed property's computed value.


};

// #endregion Types



// #region Constants

const CON_PRO_ARR = [ 'color', 'background-color', 'border-color', 'box-shadow', 'filter', 'transform', 'scale', 'translate', 'rotate', 'opacity' ]; // What: Control Property Array. Why: Hover, press, and toggle feedback changes these, on a control and on what's inside it, such as a bar link's underline. How: Each is compared between moments, and each that changes has to be transitioned, the separate scale, translate, and rotate properties included, since this site's buttons and tiles move through them.
const FOC_PRO_ARR = [ ...CON_PRO_ARR, 'outline-color', 'outline-offset', 'outline-width' ];                                                          // What: Focus Property Array. Why: A control's focus can change its look as well as draw its ring. How: Each is compared between unfocused and focused, and each that changes has to be transitioned.

// #endregion Constants



// #region Helpers

// #region cliBloFun

/**
 * cliBloFun = Click Block Function
 *
 * @summary
 * Runs inside the page and cancels every click before the app handles it, so
 * pressing a control during a check never follows a link, opens an email, or
 * closes the menu. It listens on the document in the capture phase,
 * ahead of React's own listener on the app's root, and both prevents the
 * click's default and stops it from going any further. Passed to Playwright's
 * evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * page.evaluate(cliBloFun) // => void
 * ```
 *
*/

function cliBloFun () : void {


	document.addEventListener( 'click', ( cliEveObj ) => { // What: Click Block Listener. Why: A press during a check shouldn't do anything. How: This cancels every click in the capture phase, before the page or React sees it.


		cliEveObj.preventDefault(); // What: Default Prevention Call. Why: A link shouldn't navigate mid-check. How: This cancels the click's default.

		cliEveObj.stopPropagation(); // What: Propagation Stop Call. Why: React's handlers, such as a menu link closing the menu, shouldn't run either. How: This keeps the click from reaching the app's root.


	}, true ); // What: Capture Phase Flag. Why: The block has to run ahead of the app's own handlers. How: This registers the listener for the capture phase.


}

// #endregion cliBloFun



// #region movProFun

/**
 * movProFun = Moving Problems Function
 *
 * @summary
 * The reduced-motion counterpart of {@link snaProFun}: compares two snapshots
 * of the same element, taken before and after a change, and returns one
 * problem for each probed property that changed on the element or anything
 * inside it while a transition still eases it, read from the later snapshot.
 * A property that eases on several inner elements is one problem.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param froRecArr - From Record Array: The snapshot before the change.
 * @param tarRecArr - Target Record Array: The snapshot after the change.
 * @param proNamArr - Property Name Array: The probed property names, in the
 *                    snapshots' order.
 * @param desLabStr - Description Label String: The element's name in each
 *                    problem.
 * @param staNamStr - State Name String: The change in each problem, such as
 *                    'when toggled on'.
 *
 * @returns One problem per eased property.
 *
 * @example
 * ```ts
 * movProFun(inaSnaArr, actSnaArr, CON_PRO_ARR, 'button "Toggle menu"',
 *   'when toggled on')
 * // => []
 * ```
 *
*/

function movProFun ( froRecArr : SnaRecTyp[], tarRecArr : SnaRecTyp[], proNamArr : string[], desLabStr : string, staNamStr : string ) : string[] {


	const movNamSet = new Set< string >(); // What: Moving Name Set. Why: A property that eases on several inner elements is one problem. How: This collects each eased property's name once.


	for ( const [ recIndNum, tarCurObj ] of tarRecArr.entries() ) { // What: Record Compare Loop. Why: Every element of the snapshot has to switch its changes at once. How: This compares each later record with the earlier one in its place.


		const froCurObj = froRecArr[ recIndNum ]; // What: From Current Object. Why: The change is read against the same element's earlier record. How: This finds it by place.


		if ( !froCurObj ) continue; // What: Missing Record Guard. Why: An element that appeared with the change has nothing to compare with. How: This skips it.



		for ( const [ proIndNum, proNamStr ] of proNamArr.entries() ) if ( froCurObj.valArr[ proIndNum ] !== tarCurObj.valArr[ proIndNum ] && tarCurObj.durArr[ proIndNum ] > 0 ) movNamSet.add( proNamStr ); // What: Property Compare Loop. Why: Under reduced motion a change should switch rather than ease. How: This records each one whose value changed while its later duration is above 0.


	}



	return [ ...movNamSet ].map( ( proNamStr ) => `${ desLabStr } eases its ${ proNamStr } ${ staNamStr } under reduced motion` ); // What: Motion Problems Return. Why: Each eased property should be reported plainly. How: This turns each name into a problem line.


}

// #endregion movProFun



// #region snaEleFun

/**
 * snaEleFun = Snapshot Element Function
 *
 * @summary
 * Runs inside the page and records how an element looks right now, and whether
 * each part of that look would ease if it changed: for the element, every
 * element inside it, and the ::before and ::after each of them draws, each
 * probed property's computed value and the duration of the transition covering
 * it, listed by its own name, by a shorthand holding it (such as background
 * for background-color), or by all, or 0 when none is. Every element takes
 * three records in a row, its own then its ::before's and its ::after's, and a
 * pseudo-element it doesn't draw is recorded empty, so two snapshots line up
 * place by place even when a state draws one. The border color reads only the
 * sides actually drawn, those with a width above zero, as one color when they
 * all share it, since an undrawn side's color can change without anything
 * showing. A record whose color matches its parent's takes the longer of its
 * own duration for it and the parent's, since an inherited color eases with
 * the parent's transition, a pseudo-element's parent being the element drawing
 * it, and a border color matching the record's own color takes the longer of
 * its own duration and the color's, since an unset border color is
 * currentColor and follows the color as it eases. An identity matrix reads as
 * none, since the two draw the same, and a property an animation that repeats
 * forever drives reads as looping, since the loop moves it whatever the state.
 * Passed to Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param eleCurEle - Element Current Element: The element to record.
 * @param proNamArr - Property Name Array: The property names to probe.
 *
 * @returns Three records per element, the element itself first.
 * @see {@link snaRecArr}
 *
 * @example
 * ```ts
 * handle.evaluate(snaEleFun, CON_PRO_ARR) // => [ { durArr, valArr }, ... ]
 * ```
 *
*/

function snaEleFun ( eleCurEle : Element, proNamArr : string[] ) : SnaRecTyp[] {


	const parNamObj : Record< string, string > = { 'background-color' : 'background', 'border-color' : 'border', 'outline-color' : 'outline', 'outline-width' : 'outline' }; // What: Parent Name Object. Why: A transition listed by a shorthand covers the longhands inside it. How: This maps each probed longhand that has a shorthand to it.



	const borValFun = ( styCurObj : CSSStyleDeclaration ) : string => [ ...new Set( [ 'top', 'right', 'bottom', 'left' ].filter( ( sidNamStr ) => styCurObj.getPropertyValue( `border-${ sidNamStr }-width` ) !== '0px' ).map( ( sidNamStr ) => styCurObj.getPropertyValue( `border-${ sidNamStr }-color` ) ) ) ].join( ' ' ); // What: Border Value Function. Why: Only a drawn border's color shows, so an undrawn side changing color isn't feedback. How: This joins the distinct colors of the sides wider than zero, one color when they share it.



	const snaStyFun = ( styCurObj : CSSStyleDeclaration | null ) : SnaRecTyp => { // What: Snapshot Style Function. Why: Each element and pseudo-element is recorded the same way. How: This reads its probed values and the duration covering each, or an empty record for a pseudo-element that isn't drawn.


		if ( !styCurObj ) return { durArr : proNamArr.map( () => 0 ), valArr : proNamArr.map( () => '' ) }; // What: Undrawn Pseudo Guard. Why: A pseudo-element that isn't drawn has no look, but still holds its place so the snapshots line up. How: This returns a record of empty values and zero durations.



		const traDurArr = styCurObj.transitionDuration.split( ',' ).map( ( traDurStr ) => parseFloat( traDurStr ) * ( traDurStr.trim().endsWith( 'ms' ) ? 1 : 1000 ) ); // What: Transition Duration Array. Why: A covered property eases only with a duration above zero. How: This reads each listed duration in milliseconds.
		const traNamArr = styCurObj.transitionProperty.split( ',' ).map( ( traNamStr ) => traNamStr.trim() );                                                           // What: Transition Name Array. Why: A property eases only when its transition lists it. How: This reads each listed property name.


		const durProFun = ( proNamStr : string ) : number => { // What: Duration Property Function. Why: Each probed property needs the duration of whichever transition covers it. How: This finds the first listing by its name, its shorthand, or all, and reads its duration, which repeats when fewer durations than names are listed.


			const traIndNum = traNamArr.findIndex( ( traNamStr ) => [ proNamStr, 'all', parNamObj[ proNamStr ] ].includes( traNamStr ) ); // What: Transition Index Number. Why: The covering transition's place picks its duration. How: This finds the first name that covers the property.



			return traIndNum < 0 ? 0 : traDurArr[ traIndNum % traDurArr.length ]; // What: Covering Duration Return. Why: An uncovered property has no transition at all. How: This returns 0 for one, or its listing's duration.


		};



		return { // What: Snapshot Record Return. Why: Each record holds its values and durations side by side. How: This reads both for every probed property.


			durArr : proNamArr.map( durProFun ), // What: Duration Array. Why: A property that changes has to ease rather than snap. How: This reads the duration of the transition covering each probed property, or 0 when none does.

			valArr : proNamArr.map( ( proNamStr ) => ( proNamStr === 'border-color' ? borValFun( styCurObj ) : styCurObj.getPropertyValue( proNamStr ).replace( /^matrix\(1, 0, 0, 1, 0, 0\)$/, 'none' ) ) ) // What: Value Array. Why: Two moments are compared property by property. How: This reads each probed property's computed value, taking the border color from its drawn sides only and reading an identity matrix as none, since a transform settled at translateY( 0 ) draws the same as no transform.


		};


	};



	const borIndNum = proNamArr.indexOf( 'border-color' );                 // What: Border Index Number. Why: An unset border color follows the color, so its place is checked against color's. How: This finds its place, or -1 when it isn't probed.
	const colIndNum = proNamArr.indexOf( 'color' );                        // What: Color Index Number. Why: Only color is inherited among the probed properties. How: This finds its place, or -1 when it isn't probed.
	const borColBoo = borIndNum >= 0 && colIndNum >= 0;                    // What: Border Color Boolean. Why: The currentColor check needs both properties probed. How: This is true when the border color and the color are both in the list.
	const eleLisArr = [ eleCurEle, ...eleCurEle.querySelectorAll( '*' ) ]; // What: Element List Array. Why: A change to an inner element counts as the element's own. How: This lists the element and everything inside it, parents before children.
	const styLisArr = eleLisArr.flatMap( ( lisCurEle ) => [ getComputedStyle( lisCurEle ), ...[ '::before', '::after' ].map( ( pseNamStr ) => getComputedStyle( lisCurEle, pseNamStr ) ).map( ( pseStyObj ) => ( /^(none|normal)$/.test( pseStyObj.content ) ? null : pseStyObj ) ) ] ); // What: Style List Array. Why: A card's or button's shadow layers are drawn by its pseudo-elements, and their fade is part of its look. How: This lists each element's computed styles followed by its ::before's and its ::after's, null for one with no content, which isn't drawn.
	const snaRecArr = styLisArr.map( snaStyFun );                          // What: Snapshot Record Array. Why: Each element and pseudo-element is recorded. How: This snapshots every listed style.


	for ( const [ lisIndNum, lisCurEle ] of eleLisArr.entries() ) { // What: Looping Property Loop. Why: An animation that repeats forever, such as the Family cards' blinking cursor, changes its properties on its own, so reading them would count a loop as a snapped change. How: This replaces each property an endless animation on an element drives with one fixed word in that element's record.


		const looNamArr = lisCurEle.getAnimations().flatMap( ( aniCurObj ) => ( aniCurObj.effect instanceof KeyframeEffect && aniCurObj.effect.getTiming().iterations === Infinity ? aniCurObj.effect.getKeyframes() : [] ) ).flatMap( ( keyCurObj ) => Object.keys( keyCurObj ) ); // What: Looping Name Array. Why: Only the properties an endless animation drives are set aside. How: This lists the keys of every keyframe of the element's endless animations, written in camel case.


		for ( const [ proIndNum, proNamStr ] of proNamArr.entries() ) if ( looNamArr.includes( proNamStr.replace( /-[a-z]/g, ( matCurStr ) => matCurStr[ 1 ].toUpperCase() ) ) ) snaRecArr[ lisIndNum * 3 ].valArr[ proIndNum ] = 'looping'; // What: Looping Value Loop. Why: A looping property should read the same at every moment. How: This turns each probed name into camel case and, when an endless animation drives it, records it as looping.


	}



	for ( const [ recIndNum, snaRecObj ] of snaRecArr.entries() ) { // What: Inherited Color Loop. Why: A record whose color comes from its parent eases with the parent's transition. How: This gives each one whose color matches its parent's the parent's duration, in document order, so it passes down every level.


		const hosCurEle = eleLisArr[ Math.floor( recIndNum / 3 ) ];                                        // What: Host Current Element. Why: Each element's three records sit together, so the record's place names the element it belongs to. How: This finds that element.
		const hosParNum = hosCurEle.parentElement ? eleLisArr.indexOf( hosCurEle.parentElement ) * 3 : -1; // What: Host Parent Number. Why: An element inherits from its parent element, whose own record leads its three. How: This finds that record's place, or a negative number when the parent sits outside the element.
		const parIndNum = recIndNum % 3 ? recIndNum - recIndNum % 3 : hosParNum;                           // What: Parent Index Number. Why: A pseudo-element inherits from the element drawing it, and an element from its parent. How: This picks the element's own record for a pseudo-element, or its parent's record for an element.


		if ( parIndNum < 0 || colIndNum < 0 ) continue; // What: No Parent Guard. Why: The element itself, and every record when color isn't probed, keeps its own duration. How: This skips them.



		if ( snaRecObj.valArr[ colIndNum ] === snaRecArr[ parIndNum ].valArr[ colIndNum ] ) snaRecObj.durArr[ colIndNum ] = Math.max( snaRecObj.durArr[ colIndNum ], snaRecArr[ parIndNum ].durArr[ colIndNum ] ); // What: Inherited Duration Assignment. Why: A color matching the parent's may be the parent's, eased by the parent's transition, while a color the record sets itself, such as the wordmark's hover color landing on its link's, still eases with its own. How: This takes the longer of its own color duration and the parent's.


	}



	for ( const snaRecObj of snaRecArr ) if ( borColBoo && snaRecObj.valArr[ borIndNum ] === snaRecObj.valArr[ colIndNum ] ) snaRecObj.durArr[ borIndNum ] = Math.max( snaRecObj.durArr[ borIndNum ], snaRecObj.durArr[ colIndNum ] ); // What: Current Color Border Loop. Why: A border color matching the record's own color is currentColor, which follows the color as it eases. How: This gives each such border color the longer of its own duration and the color's.



	return snaRecArr; // What: Snapshot Records Return. Why: Two moments' records are compared. How: This hands back every record.


}

// #endregion snaEleFun



// #region snaProFun

/**
 * snaProFun = Snap Problems Function
 *
 * @summary
 * Compares two snapshots of the same element, taken before and after a
 * change, and returns one problem for each probed property that changed on
 * the element or anything inside it without a transition to ease it, read
 * from the later snapshot, since a change eases with the transition of the
 * state it moves into. A property that snaps on several inner elements is one
 * problem.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param froRecArr - From Record Array: The snapshot before the change.
 * @param tarRecArr - Target Record Array: The snapshot after the change.
 * @param proNamArr - Property Name Array: The probed property names, in the
 *                    snapshots' order.
 * @param desLabStr - Description Label String: The element's name in each
 *                    problem.
 * @param staNamStr - State Name String: The change in each problem, such as
 *                    'when hovered'.
 *
 * @returns One problem per snapped property.
 *
 * @example
 * ```ts
 * snaProFun(resSnaArr, hovSnaArr, CON_PRO_ARR, 'a "Gallery"', 'when hovered')
 * // => []
 * ```
 *
*/

function snaProFun ( froRecArr : SnaRecTyp[], tarRecArr : SnaRecTyp[], proNamArr : string[], desLabStr : string, staNamStr : string ) : string[] {


	const snaNamSet = new Set< string >(); // What: Snapped Name Set. Why: A property that snaps on several inner elements is one problem. How: This collects each snapped property's name once.


	for ( const [ recIndNum, tarCurObj ] of tarRecArr.entries() ) { // What: Record Compare Loop. Why: Every element of the snapshot has to ease its own probed changes. How: This compares each later record with the earlier one in its place.


		const froCurObj = froRecArr[ recIndNum ]; // What: From Current Object. Why: The change is read against the same element's earlier record. How: This finds it by place.


		if ( !froCurObj ) continue; // What: Missing Record Guard. Why: An element that appeared with the change has nothing to compare with. How: This skips it.



		for ( const [ proIndNum, proNamStr ] of proNamArr.entries() ) if ( froCurObj.valArr[ proIndNum ] !== tarCurObj.valArr[ proIndNum ] && tarCurObj.durArr[ proIndNum ] === 0 ) snaNamSet.add( proNamStr ); // What: Property Compare Loop. Why: A property that changed with nothing to ease it snaps. How: This records each one whose value changed while its later duration is 0.


	}



	return [ ...snaNamSet ].map( ( proNamStr ) => `${ desLabStr } snaps its ${ proNamStr } ${ staNamStr }` ); // What: Snap Problems Return. Why: Each snapped property should be reported plainly. How: This turns each name into a problem line.


}

// #endregion snaProFun



// #region valSigFun

/**
 * valSigFun = Value Signature Function
 *
 * @summary
 * Joins every probed value of a snapshot into one string, so two looks are
 * the same only when every value of every element in them matches. The
 * durations are left out, since only the look is compared.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param snaRecArr - Snapshot Record Array: The snapshot to sign.
 *
 * @returns The snapshot's values as one string.
 *
 * @example
 * ```ts
 * valSigFun(resSnaArr) // => '[["rgb(232, 168, 152)", ...]]'
 * ```
 *
*/

const valSigFun = ( snaRecArr : SnaRecTyp[] ) : string => JSON.stringify( snaRecArr.map( ( snaRecObj ) => snaRecObj.valArr ) ); // What: Value Signature Function. Why: A look is the same between two moments only when every probed value matches. How: This joins every record's values into one string to compare.

// #endregion valSigFun

// #endregion Helpers



// #region Exports

export { cliBloFun, CON_PRO_ARR, FOC_PRO_ARR, movProFun, snaEleFun, snaProFun, valSigFun }; // What: Named Exports. Why: The probe's shared pieces live apart from the spec that reads them. How: This exports the property lists, the snapshot and comparison helpers, and the click block.

// #endregion Exports


