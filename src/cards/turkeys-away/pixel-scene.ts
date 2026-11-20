


// #region Imports

import { CAR_ROW_ARR } from './pixel-art.ts';        // What: Car Row Array. Why: Parked cars fill the mall's lot. How: The scene paints the car's rows once per paint color.
import { draTexFun   } from './pixel-art.ts';        // What: Draw Text Function. Why: Words on the backdrop are spelled in pixels. How: The scene spells them on the canvas.
import { durSecFun   } from '../../utils/rhythm.ts'; // What: Duration Second Function. Why: The pointer's demo is timed on the duration scale. How: This returns a step's length in seconds.
import { FEA_ROW_ARR } from './pixel-art.ts';        // What: Feather Row Array. Why: Stray feathers drift down the studio. How: The scene paints the feather's rows once.
import { griCanFun   } from './pixel-art.ts';        // What: Grid Canvas Function. Why: Each sprite is drawn from a painted canvas. How: The scene paints every sprite when it starts.
import { gsaEasFun   } from '../../ui/gsap-ease.ts'; // What: GSAP Easing Function. Why: The pointer arrives and leaves on the stylesheet's curves. How: This registers a curve's token as a named GSAP ease.
import { gsap        } from 'gsap';                  // What: GSAP. Why: The scene draws its own frames, yet its pointer eases like the lettering. How: This turns an ease's name into a function of progress.
import { HAN_ROW_ARR } from './pixel-art.ts';        // What: Hand Row Array. Why: A pointing hand shows that a tap drops a turkey. How: The scene paints its rows once.
import { HEL_ROW_ARR } from './pixel-art.ts';        // What: Helicopter Row Array. Why: The station's helicopter crosses the sky. How: The scene paints its rows once.
import { manGriFun   } from './pixel-art.ts';        // What: Manager Grid Function. Why: The station manager stands in the studio. How: The scene paints his grid once.
import { rowGriFun   } from './pixel-art.ts';        // What: Row Grid Function. Why: Sprites written as rows are painted as grids. How: The scene turns each sprite's rows into a grid.
import { texWidFun   } from './pixel-art.ts';        // What: Text Width Function. Why: The mall's sign is sized to its words. How: The scene measures them.
import { turGriFun   } from './pixel-art.ts';        // What: Turkey Grid Function. Why: Each turkey flaps between two frames. How: The scene paints both.

// #endregion Imports



/**
 * pixel-scene.ts = Pixel Scene
 *
 * @summary
 * The Turkeys Away card's two pixel scenes on one canvas. In the first, the
 * station's helicopter crosses the sky over the Pinedale Shopping Mall and
 * drops live turkeys, which flap, tumble, bounce once in a puff of feathers,
 * and sit dazed in the parking lot. A burst of static then changes the channel
 * to the second, the station's studio, where the station manager stands with a
 * hand raised beside a dazed turkey while feathers drift down. A tap drops
 * another turkey from above the screen, in line with where it was tapped, and
 * once the card has rested a while, a pointing hand taps a random spot every
 * few seconds to show how, until the visitor taps, each of its turkeys
 * clearing three taps later. The scene runs on the
 * card's own clock, so its drawings and the card's lettering never drift
 * apart, and its turkeys follow a fixed seed, so their motion can be replayed
 * to the same state.
 *
 * The scene has a wide composition and a tall one, chosen by the canvas's
 * shape, and stretches the chosen one along a single side to match the
 * screen: the wide one widens or grows its sky, and the tall one widens or
 * grows its sky and lot. When the canvas changes size, as when a phone turns,
 * the scene rebuilds the current moment in the new composition, taps
 * included, each at its share of the width. Under reduced motion it draws the
 * finished studio once, and again only when its size changes.
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

type LayRecTyp = { // What: Layout Record Type. Why: The parts of both scenes that stand still sit where the chosen composition puts them. How: This names each position, in canvas pixels.


	carArr : [ number, number, number ][], // What: Car Array. Why: The lot holds a few parked cars. How: Each entry is a paint's index, then a car's left and top.
	cloArr : [ number, number ][],         // What: Cloud Array. Why: A few clouds drift across the sky. How: Each entry is a cloud's starting left and its top.
	cubNum : number,                       // What: Curb Number. Why: The lot begins at the curb. How: This is the curb's top.
	divNum : number,                       // What: Divider Number. Why: A painted line divides the lot's two rows of stalls. How: This is its top.
	dooNum : number,                       // What: Door Number. Why: The mall's glass doors sit in its middle. How: This is their left.
	feaArr : [ number, number ],           // What: Feather Array. Why: Feathers drift down the studio in a spread. How: This is the first feather's left, then the gap to each next one.
	floNum : number,                       // What: Floor Number. Why: The studio's wall meets its carpet. How: This is the carpet's top.
	heiNum : number,                       // What: Height Number. Why: The canvas is sized to the screen's shape. How: This is its height.
	helNum : number,                       // What: Helicopter Number. Why: The helicopter flies above the mall's sign. How: This is its top.
	lanArr : [ number, number ],           // What: Landing Array. Why: Dropped turkeys land across the lot's depth. How: This is the highest landing line, then how far below it they may land.
	linArr : [ number, number ][],         // What: Line Array. Why: Painted stall lines mark the lot. How: Each entry is a row of lines' top and height.
	malArr : [ number, number, number ],   // What: Mall Array. Why: The mall stands centered at the back of the lot. How: This is its left, its roof's top, and its width.
	manArr : [ number, number ],           // What: Manager Array. Why: The station manager stands on the studio's carpet. How: This is his left, then the line his feet stand on.
	onaArr : [ number, number ],           // What: On Air Array. Why: The "ON AIR" light hangs on the studio's wall. How: This is its left, then its top.
	polArr : number[],                     // What: Pole Array. Why: Lamp posts light the lot. How: Each entry is a post's left.
	skyNum : number,                       // What: Sky Number. Why: The sky lightens toward the horizon. How: This is where its upper band ends.
	tapArr : [ number, number ],           // What: Tap Array. Why: A turkey dropped in the studio lands on its carpet. How: This is the highest landing line, then how far below it.
	turNum : number,                       // What: Turkey Number. Why: A dazed turkey sits at the manager's feet. How: This is its center's left.
	widNum : number,                       // What: Width Number. Why: The canvas is sized to the screen's shape. How: This is its width.
	winArr : number[]                      // What: Window Array. Why: Shop windows line the mall's front. How: Each entry is a window's left.


};



type SceSchTyp = { // What: Scene Schedule Type. Why: The scene's events line up with the card's lettering. How: This names each event's time, in seconds from the card's start.


	demNum : number,   // What: Demo Number. Why: Once the card has rested a while, a pointer shows that a tap drops a turkey. How: This is when the first demo starts, each next one a cycle later.
	droArr : number[], // What: Drop Array. Why: The turkeys fall one after another. How: Each entry is when one leaves the helicopter.
	finNum : number,   // What: Finish Number. Why: Under reduced motion the scene shows its finished state. How: This is the moment it draws.
	hlaNum : number,   // What: Helicopter Arrival Number. Why: The helicopter enters after the card opens. How: This is when it starts across.
	hldNum : number,   // What: Helicopter Duration Number. Why: The helicopter takes a set time to cross. How: This is how long it takes.
	sceNum : number,   // What: Scene Number. Why: The studio follows the static. How: This is when the studio starts.
	staNum : number    // What: Static Number. Why: Static changes the channel between the scenes. How: This is when the static starts.


};



type SprSetTyp = { // What: Sprite Set Type. Why: Every sprite is painted once and drawn many times. How: This holds each painted canvas.


	carArr : HTMLCanvasElement[], // What: Car Array. Why: Each car paint is its own image. How: This holds one per paint.
	feaEle : HTMLCanvasElement,   // What: Feather Element. Why: The drifting feathers share one image. How: This holds it.
	hanEle : HTMLCanvasElement,   // What: Hand Element. Why: The demo's pointer is one image. How: This holds it.
	helEle : HTMLCanvasElement,   // What: Helicopter Element. Why: The helicopter is one image. How: This holds it.
	manEle : HTMLCanvasElement,   // What: Manager Element. Why: The station manager is one image. How: This holds it.
	tudEle : HTMLCanvasElement,   // What: Turkey-Down Element. Why: A turkey's wing is down in one frame. How: This holds that frame.
	tuuEle : HTMLCanvasElement    // What: Turkey-Up Element. Why: A turkey's wing is up in the other frame. How: This holds that frame.


};



type TapEveTyp = { fraXcoNum : number, timNum : number }; // What: Tap Event Type. Why: Taps are replayed when the scene rebuilds a moment. How: This holds a tap's time and its share of the width.



type TurStaTyp = { // What: Turkey State Type. Why: Each turkey falls, bounces, and sits on its own. How: This holds one turkey's motion.


	ageNum    : number,                    // What: Age Number. Why: A turkey flaps for its first moments, then tumbles. How: This is the seconds since the turkey appeared, restarted when it sits.
	angNum    : number,                    // What: Angle Number. Why: A tumbling turkey turns as it falls. How: This is its angle, in radians.
	expNum    : number,                    // What: Expiry Number. Why: The pointer's turkeys clear a few taps later, so they never pile up. How: This is when the turkey is gone, Infinity for one that stays.
	flaNum    : number,                    // What: Flap Number. Why: The wing alternates on a steady beat. How: This is the seconds since the turkey appeared.
	lanNum    : number,                    // What: Landing Number. Why: Each turkey lands at its own depth. How: This is the line its feet land on.
	spiNum    : number,                    // What: Spin Number. Why: Each turkey tumbles at its own pace and way. How: This is its turning speed, in radians a second.
	staStr    : 'bounce' | 'fall' | 'sit', // What: State String. Why: A turkey moves differently falling, bouncing, and sitting. How: This names its state.
	velXcoNum : number,                    // What: Velocity X-Coordinate Number. Why: A dropped turkey drifts with the helicopter. How: This is its sideways speed, in pixels a second.
	velYcoNum : number,                    // What: Velocity Y-Coordinate Number. Why: A turkey falls faster as it tumbles. How: This is its downward speed, in pixels a second.
	xcoNum    : number,                    // What: X-Coordinate Number. Why: The turkey is drawn where it is. How: This is its center's left.
	ycoNum    : number                     // What: Y-Coordinate Number. Why: The turkey is drawn where it is. How: This is its center's top.


};

type FeaStaTyp = { phaNum : number, xcoNum : number, ycoNum : number };                                                          // What: Feather State Type. Why: Each drifting feather sways on its own beat. How: This holds its sway's phase and its place.
type ParStaTyp = { colStr : string, lifNum : number, velXcoNum : number, velYcoNum : number, xcoNum : number, ycoNum : number }; // What: Particle State Type. Why: A landing turkey throws a puff of feathers. How: This holds one feather pixel's color, remaining life, velocity, and place.

type SimStaTyp = { // What: Simulation State Type. Why: The scene's motion is stepped forward from a known start. How: This holds everything that moves.


	feaArr : FeaStaTyp[],  // What: Feather Array. Why: Feathers drift down the studio. How: This lists them.
	malArr : TurStaTyp[],  // What: Mall Array. Why: The lot has its own turkeys. How: This lists them.
	parArr : ParStaTyp[],  // What: Particle Array. Why: Feather puffs fly from landing turkeys. How: This lists the pixels in flight.
	ranFun : () => number, // What: Random Function. Why: The turkeys' differences come from a seeded sequence. How: This returns the sequence's next number.
	simNum : number,       // What: Simulation Number. Why: The motion is stepped up to the card's time. How: This is how far it has been stepped, in seconds.
	stuArr : TurStaTyp[],  // What: Studio Array. Why: The studio has its own turkeys. How: This lists them.
	tapNum : number        // What: Tap Number. Why: Each tap is replayed once. How: This counts the taps already replayed.


};

// #endregion Types



// #region Constants

const CAR_TOK_ARR = [ '--tur-rus-col', '--tur-sag-col', '--tur-mus-col' ]; // What: Car Token Array. Why: The parked cars come in three 70s paints. How: Each car takes one of these tokens by its index. // Turkeys Rust Color = #a8402c, Turkeys Sage Color = #5f7f6a, Turkeys Mustard Color = #d9a441
const DEL_TIM_NUM = 1 / 120;                                               // What: Delta Time Number. Why: The motion steps by fixed slices, so a moment rebuilds the same on every screen. How: This is one slice, in seconds.
const DEM_ARR_NUM = durSecFun( 'p04' );                                    // What: Demo Arrival Number. Why: The pointer rises into place before it taps. How: This is a Base Plus 4 step, the length of its arrival. // Duration Animation Base Plus 4 ~= 486.1ms
const DEM_CYC_NUM = durSecFun( 'p13' );                                    // What: Demo Cycle Number. Why: The pointer taps again at a leisurely pace until the visitor taps. How: This is a Base Plus 13 step from one demo's start to the next. // Duration Animation Base Plus 13 ~= 6,107.0ms
const DEM_KEE_NUM = 3;                                                     // What: Demo Keep Number. Why: A few of the pointer's turkeys stay on the carpet, but no more. How: Each clears this many cycles after its tap.
const DEM_LEA_NUM = durSecFun( 'p04' );                                    // What: Demo Leaving Number. Why: The pointer fades away once it has tapped. How: This is a Base Plus 4 step, the length of its exit. // Duration Animation Base Plus 4 ~= 486.1ms
const DEM_MAR_NUM = 0.15;                                                  // What: Demo Margin Number. Why: The pointer taps clear of the screen's edges. How: This is the share of the width and height kept free on each side.
const DEM_PRE_NUM = durSecFun( 'p02' );                                    // What: Demo Press Number. Why: The pointer holds its press long enough to be seen. How: This is a Base Plus 2 step, from the tap until it lifts away. // Duration Animation Base Plus 2 ~= 277.0ms
const DEM_TAP_NUM = durSecFun( 'p06' );                                    // What: Demo Tap Number. Why: The pointer settles a moment before it taps. How: This is a Base Plus 6 step from the start of its arrival to its tap. // Duration Animation Base Plus 6 ~= 853.0ms
const FLA_TIM_NUM = 0.12;                                                  // What: Flap Time Number. Why: A falling turkey flaps on a steady beat. How: This is each wing frame's length, in seconds.
const RAN_SEE_NUM = 7;                                                     // What: Random Seed Number. Why: Without taps, the same turkeys fall the same way on every play. How: This seeds the scene's random numbers.



// #region SPR_TOK_OBJ

/**
 * SPR_TOK_OBJ = Sprite Token Object
 *
 * @summary
 * The color token each sprite key paints with, keyed by the letter the
 * sprites' rows use (pixel-art.ts names what each letter paints), so every
 * pixel takes a color from the card's stylesheet. A car's paint, C, is set
 * per car instead.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const SPR_TOK_OBJ : Record< string, string > = { // What: Sprite Token Object. Why: The sprites paint with the card's own colors. How: Each key names the token it reads.


	B : '--tur-bro-col',
	D : '--tur-win-col',
	E : '--tur-eye-col',
	G : '--tur-hel-col',
	g : '--tur-hes-col',
	H : '--tur-hai-col',
	K : '--tur-ink-col',
	L : '--tur-can-col',
	N : '--tur-sui-col',
	n : '--tur-pan-col',
	O : '--tur-ora-col',
	P : '--tur-ski-col',
	p : '--tur-sha-col',
	Q : '--tur-ink-col',
	R : '--tur-red-col',
	r : '--tur-tie-col',
	S : '--tur-hea-col',
	T : '--tur-tan-col',
	V : '--tur-ves-col',
	W : '--tur-ivo-col',
	Y : '--tur-gol-col',
	y : '--tur-gol-col',
	Z : '--tur-cre-col'


};

// #endregion SPR_TOK_OBJ



const TAL_BAS_ARR = [ 135, 240 ]; // What: Tall Base Array. Why: The tall composition is drawn for a phone held upright. How: This is its smallest width, then its smallest height.
const WID_BAS_ARR = [ 240, 135 ]; // What: Wide Base Array. Why: The wide composition is drawn for a 16:9 screen. How: This is its smallest width, then its smallest height.

// #endregion Constants



// #region Helpers

// #region demLivFun

/**
 * demLivFun = Demo Live Function
 *
 * @summary
 * Reports whether the pointer's demos still play at a moment: true while no
 * tap came before it. A visitor who has already tapped knows how, so their
 * first tap ends the demos, whether it came between them or partway through
 * one's arrival.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param tapEveArr - Tap Event Array: Every tap so far, in order.
 * @param limTimNum - Limit Time Number: The moment checked, in seconds.
 *
 * @returns True when no tap came before the moment.
 *
 * @example
 * ```ts
 * demLivFun([], 31.4) // => true
 * ```
 *
*/

const demLivFun = ( tapEveArr : TapEveTyp[], limTimNum : number ) : boolean => tapEveArr.every( ( tapCurObj ) => tapCurObj.timNum >= limTimNum ); // What: Demo Live Function. Why: The demo is only for a visitor who hasn't tapped yet. How: This checks every tap came at or after the moment.

// #endregion demLivFun



// #region draMalFun

/**
 * draMalFun = Draw Mall Function
 *
 * @summary
 * Draws the first scene's backdrop: the sky in two bands dithered where they
 * meet, three clouds drifting right and wrapping around, the brick mall with
 * its mortar lines, shop windows, glass doors, and its "PINEDALE MALL" sign on
 * posts, the curb, the asphalt with its stall lines and divider, the parked
 * cars, and two lamp posts.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param canCotObj - Canvas Context Object: The context to draw on.
 * @param layRecObj - Layout Record Object: {@link LayRecTyp}
 * @param sprSetObj - Sprite Set Object: {@link SprSetTyp}
 * @param colGetFun - Color Get Function: Returns a token's color.
 * @param curTimNum - Current Time Number: The scene's time, in seconds.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * draMalFun(canCotObj, layRecObj, sprSetObj, colGetFun, 2.4) // => void
 * ```
 *
*/

function draMalFun ( canCotObj : CanvasRenderingContext2D, layRecObj : LayRecTyp, sprSetObj : SprSetTyp, colGetFun : ( tokNamStr : string ) => string, curTimNum : number ) : void {


	const [ malLefNum, malTopNum, malWidNum ] = layRecObj.malArr; // What: Mall Left Number. Why: The mall's parts are placed from its left. How: This reads it. // What: Mall Top Number. Why: The mall's parts are placed from its roof. How: This reads it. // What: Mall Width Number. Why: The mall's rows span its width. How: This reads it.

	const sigWidNum = texWidFun( 'PINEDALE MALL' ) + 8;                   // What: Sign Width Number. Why: The sign is sized to its words. How: This is the words' width plus four pixels a side.
	const sigLefNum = Math.round( ( layRecObj.widNum - sigWidNum ) / 2 ); // What: Sign Left Number. Why: The sign is centered over the mall. How: This centers it on the canvas.



	const recFilFun = ( tokNamStr : string, recLefNum : number, recTopNum : number, recWidNum : number, recHeiNum : number ) : void => { // What: Rectangle Fill Function. Why: The backdrop is drawn as rectangles. How: This fills one in a token's color.


		canCotObj.fillStyle = colGetFun( tokNamStr ); // What: Fill Style Assignment. Why: Each rectangle takes its token's color. How: This sets the context's fill to the color.


		canCotObj.fillRect( recLefNum, recTopNum, recWidNum, recHeiNum ); // What: Rectangle Fill Call. Why: The backdrop is drawn as rectangles. How: This fills one at the given place and size.


	};



	// #region Sky

	recFilFun( '--tur-sky-col', 0, 0, layRecObj.widNum, layRecObj.skyNum );                                   // What: Upper Sky Fill Call. Why: The sky is deeper overhead. How: This fills its upper band. // Turkeys Sky Color = #8fb3c4
	recFilFun( '--tur-haz-col', 0, layRecObj.skyNum, layRecObj.widNum, layRecObj.cubNum - layRecObj.skyNum ); // What: Lower Sky Fill Call. Why: The sky pales toward the horizon. How: This fills its lower band down to the curb. // Turkeys Haze Color = #c9dcd6


	for ( let rowIndNum = layRecObj.skyNum - 4; rowIndNum < layRecObj.skyNum; rowIndNum++ ) for ( let colIndNum = rowIndNum & 1; colIndNum < layRecObj.widNum; colIndNum += 2 ) recFilFun( '--tur-haz-col', colIndNum, rowIndNum, 1, 1 ); // What: Sky Dither Loop. Why: Pixel art blends two colors with a checkerboard. How: This sets every other pixel of the four rows above the band's end to the haze. // Turkeys Haze Color = #c9dcd6



	for ( const [ cloLefNum, cloTopNum ] of layRecObj.cloArr ) { // What: Cloud Loop. Why: Each cloud drifts and wraps around. How: This draws each at its drifted place.


		const cloXcoNum = Math.round( ( cloLefNum + curTimNum * 3 ) % ( layRecObj.widNum + 30 ) ) - 30; // What: Cloud X-Coordinate Number. Why: The clouds drift right and come back from the left. How: This moves the cloud three pixels a second, wrapping past the right edge.


		recFilFun( '--tur-ivo-col', cloXcoNum, cloTopNum, 22, 4 );         // What: Cloud Base Fill Call. Why: A cloud has a flat base. How: This draws it. // Turkeys Ivory Color = #f6eedf
		recFilFun( '--tur-ivo-col', cloXcoNum + 4, cloTopNum - 3, 12, 3 ); // What: Cloud Puff Fill Call. Why: A cloud billows up. How: This draws its big puff. // Turkeys Ivory Color = #f6eedf
		recFilFun( '--tur-ivo-col', cloXcoNum + 14, cloTopNum - 2, 6, 2 ); // What: Cloud Tuft Fill Call. Why: A second puff breaks up its outline. How: This draws a smaller one. // Turkeys Ivory Color = #f6eedf


	}

	// #endregion Sky



	// #region Mall

	recFilFun( '--tur-mor-col', malLefNum, malTopNum, malWidNum, 3 );                                    // What: Roof Fill Call. Why: A dark roof line tops the mall. How: This draws it. // Turkeys Mortar Color = #7a3c20
	recFilFun( '--tur-bri-col', malLefNum, malTopNum + 3, malWidNum, layRecObj.cubNum - malTopNum - 3 ); // What: Wall Fill Call. Why: The mall is brick. How: This fills its wall down to the curb. // Turkeys Brick Color = #b8673a


	for ( let rowTopNum = malTopNum + 6; rowTopNum < layRecObj.cubNum - 1; rowTopNum += 4 ) recFilFun( '--tur-mor-col', malLefNum, rowTopNum, malWidNum, 1 ); // What: Mortar Line Loop. Why: Mortar lines read as brick courses. How: This draws one every four rows. // Turkeys Mortar Color = #7a3c20



	for ( const winLefNum of layRecObj.winArr ) { // What: Window Loop. Why: Each shop window has a mullion. How: This draws each pane and its divider.


		recFilFun( '--tur-gla-col', winLefNum, malTopNum + 10, 18, 12 );    // What: Pane Fill Call. Why: Shop windows are glass. How: This draws the pane. // Turkeys Glass Color = #a8cdd2
		recFilFun( '--tur-mor-col', winLefNum + 8, malTopNum + 10, 1, 12 ); // What: Mullion Fill Call. Why: A divider splits the window. How: This draws it. // Turkeys Mortar Color = #7a3c20


	}



	recFilFun( '--tur-gla-col', layRecObj.dooNum, malTopNum + 14, 28, layRecObj.cubNum - malTopNum - 14 ); // What: Door Fill Call. Why: Glass doors open onto the lot. How: This draws them down to the curb. // Turkeys Glass Color = #a8cdd2


	for ( const fraOffNum of [ 7, 14, 21 ] ) recFilFun( '--tur-mor-col', layRecObj.dooNum + fraOffNum, malTopNum + 14, 1, layRecObj.cubNum - malTopNum - 14 ); // What: Door Frame Loop. Why: Frames split the glass into four doors. How: This draws three dividers. // Turkeys Mortar Color = #7a3c20



	recFilFun( '--tur-mor-col', sigLefNum + 6, malTopNum - 4, 2, 4 );             // What: Left Post Fill Call. Why: The sign stands on posts. How: This draws the left one. // Turkeys Mortar Color = #7a3c20
	recFilFun( '--tur-mor-col', sigLefNum + sigWidNum - 8, malTopNum - 4, 2, 4 ); // What: Right Post Fill Call. Why: The sign stands on posts. How: This draws the right one. // Turkeys Mortar Color = #7a3c20
	recFilFun( '--tur-cre-col', sigLefNum, malTopNum - 12, sigWidNum, 9 );        // What: Sign Fill Call. Why: The mall's name is on a cream board. How: This draws the board. // Turkeys Cream Color = #f6dfb6

	draTexFun( canCotObj, 'PINEDALE MALL', sigLefNum + 4, malTopNum - 10, colGetFun( '--tur-ink-col' ) ); // What: Sign Text Call. Why: The sign says where this is. How: This spells the name in ink. // Turkeys Ink Color = #2a1d17

	// #endregion Mall



	// #region Lot

	recFilFun( '--tur-cub-col', 0, layRecObj.cubNum, layRecObj.widNum, 2 );                                           // What: Curb Fill Call. Why: A curb edges the lot. How: This draws it. // Turkeys Curb Color = #8c7f73
	recFilFun( '--tur-asp-col', 0, layRecObj.cubNum + 2, layRecObj.widNum, layRecObj.heiNum - layRecObj.cubNum - 2 ); // What: Asphalt Fill Call. Why: The lot is asphalt. How: This fills it to the bottom. // Turkeys Asphalt Color = #4a4340


	for ( let rowIndNum = layRecObj.cubNum + 2; rowIndNum < layRecObj.cubNum + 4; rowIndNum++ ) for ( let colIndNum = rowIndNum & 1; colIndNum < layRecObj.widNum; colIndNum += 2 ) recFilFun( '--tur-tar-col', colIndNum, rowIndNum, 1, 1 ); // What: Curb Shadow Loop. Why: The curb casts a soft shadow. How: This dithers the two rows below it with darker tar. // Turkeys Tar Color = #3d3633



	for ( const [ linTopNum, linHeiNum ] of layRecObj.linArr ) for ( let linLefNum = 6; linLefNum < layRecObj.widNum; linLefNum += 16 ) recFilFun( '--tur-pai-col', linLefNum, linTopNum, 1, linHeiNum ); // What: Stall Line Loop. Why: Painted lines mark the stalls. How: This draws one every sixteen pixels in each row. // Turkeys Paint Color = #f3e3c3



	recFilFun( '--tur-pai-col', 0, layRecObj.divNum, layRecObj.widNum, 1 ); // What: Divider Fill Call. Why: A painted line divides the rows. How: This draws it across. // Turkeys Paint Color = #f3e3c3



	for ( const [ paiIndNum, carLefNum, carTopNum ] of layRecObj.carArr ) canCotObj.drawImage( sprSetObj.carArr[ paiIndNum ], carLefNum, carTopNum ); // What: Car Draw Loop. Why: Parked cars fill the lot. How: This draws each in its paint.



	for ( const polLefNum of layRecObj.polArr ) { // What: Lamp Post Loop. Why: Lamp posts rise from the lot. How: This draws each post, arm, and lamps.


		recFilFun( '--tur-ink-col', polLefNum, layRecObj.cubNum - 19, 1, 30 );    // What: Post Fill Call. Why: A thin post rises past the mall's front. How: This draws it. // Turkeys Ink Color = #2a1d17
		recFilFun( '--tur-ink-col', polLefNum - 3, layRecObj.cubNum - 19, 7, 1 ); // What: Arm Fill Call. Why: An arm holds the lamps. How: This draws it across the top. // Turkeys Ink Color = #2a1d17
		recFilFun( '--tur-lam-col', polLefNum - 3, layRecObj.cubNum - 18, 2, 1 ); // What: Left Lamp Fill Call. Why: A lamp hangs from each end. How: This draws the left one. // Turkeys Lamp Color = #f3d27a
		recFilFun( '--tur-lam-col', polLefNum + 2, layRecObj.cubNum - 18, 2, 1 ); // What: Right Lamp Fill Call. Why: A lamp hangs from each end. How: This draws the right one. // Turkeys Lamp Color = #f3d27a


	}

	// #endregion Lot


}

// #endregion draMalFun



// #region draStuFun

/**
 * draStuFun = Draw Studio Function
 *
 * @summary
 * Draws the second scene's backdrop: wood paneling in alternating planks
 * with grooves between them, a baseboard, a dithered 70s carpet, the "ON AIR"
 * light blinking between lit and unlit, and the station manager standing on
 * the carpet.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param canCotObj - Canvas Context Object: The context to draw on.
 * @param layRecObj - Layout Record Object: {@link LayRecTyp}
 * @param sprSetObj - Sprite Set Object: {@link SprSetTyp}
 * @param colGetFun - Color Get Function: Returns a token's color.
 * @param curTimNum - Current Time Number: The scene's time, in seconds.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * draStuFun(canCotObj, layRecObj, sprSetObj, colGetFun, 12.6) // => void
 * ```
 *
*/

function draStuFun ( canCotObj : CanvasRenderingContext2D, layRecObj : LayRecTyp, sprSetObj : SprSetTyp, colGetFun : ( tokNamStr : string ) => string, curTimNum : number ) : void {


	const [ onaLefNum, onaTopNum ] = layRecObj.onaArr; // What: On Air Left Number. Why: The light is placed from its left. How: This reads it. // What: On Air Top Number. Why: The light is placed from its top. How: This reads it.

	const onaLitBoo = Math.floor( curTimNum * 1.2 ) % 2 === 0; // What: On Air Lit Boolean. Why: The "ON AIR" light blinks. How: This is true on every other beat, a little under a second each.



	const recFilFun = ( tokNamStr : string, recLefNum : number, recTopNum : number, recWidNum : number, recHeiNum : number ) : void => { // What: Rectangle Fill Function. Why: The backdrop is drawn as rectangles. How: This fills one in a token's color.


		canCotObj.fillStyle = colGetFun( tokNamStr ); // What: Fill Style Assignment. Why: Each rectangle takes its token's color. How: This sets the context's fill to the color.


		canCotObj.fillRect( recLefNum, recTopNum, recWidNum, recHeiNum ); // What: Rectangle Fill Call. Why: The backdrop is drawn as rectangles. How: This fills one at the given place and size.


	};


	for ( let plaLefNum = 0; plaLefNum < layRecObj.widNum; plaLefNum += 8 ) { // What: Plank Loop. Why: The studio is wood paneled. How: This draws each eight-pixel plank and its groove.


		recFilFun( ( plaLefNum / 8 ) % 2 ? '--tur-oak-col' : '--tur-wal-col', plaLefNum, 0, 8, layRecObj.floNum ); // What: Plank Fill Call. Why: Planks alternate between two woods. How: This draws the plank in oak or walnut. // Turkeys Oak Color = #7a4b2a, Turkeys Walnut Color = #6b4024
		recFilFun( '--tur-gro-col', plaLefNum, 0, 1, layRecObj.floNum );                                           // What: Groove Fill Call. Why: A dark groove separates planks. How: This draws it at the plank's left edge. // Turkeys Groove Color = #4f2e19


	}



	recFilFun( '--tur-gro-col', 0, layRecObj.floNum - 2, layRecObj.widNum, 2 );                               // What: Baseboard Fill Call. Why: A baseboard meets the carpet. How: This draws it. // Turkeys Groove Color = #4f2e19
	recFilFun( '--tur-cap-col', 0, layRecObj.floNum, layRecObj.widNum, layRecObj.heiNum - layRecObj.floNum ); // What: Carpet Fill Call. Why: The studio has 70s orange carpet. How: This fills it to the bottom. // Turkeys Carpet Color = #c8622e


	for ( let rowIndNum = layRecObj.floNum; rowIndNum < layRecObj.heiNum; rowIndNum++ ) for ( let colIndNum = rowIndNum & 1; colIndNum < layRecObj.widNum; colIndNum += 2 ) recFilFun( '--tur-pil-col', colIndNum, rowIndNum, 1, 1 ); // What: Carpet Pile Loop. Why: Shag carpet has texture. How: This dithers every other pixel with the darker pile. // Turkeys Pile Color = #b5571f



	recFilFun( '--tur-ink-col', onaLefNum, onaTopNum, 34, 11 );                                      // What: Light Frame Fill Call. Why: The light sits in a dark frame. How: This draws it. // Turkeys Ink Color = #2a1d17
	recFilFun( onaLitBoo ? '--tur-red-col' : '--tur-unl-col', onaLefNum + 1, onaTopNum + 1, 32, 9 ); // What: Light Face Fill Call. Why: The light glows red when lit. How: This draws its face lit or unlit. // Turkeys Red Color = #b8402c, Turkeys Unlit Color = #4a1d14

	draTexFun( canCotObj, 'ON AIR', onaLefNum + 4, onaTopNum + 3, colGetFun( onaLitBoo ? '--tur-pap-col' : '--tur-red-col' ) ); // What: Light Text Call. Why: The light says the station is live. How: This spells it in paper white when lit, or dim red when not. // Turkeys Paper Color = #fff3dc, Turkeys Red Color = #b8402c

	canCotObj.drawImage( sprSetObj.manEle, layRecObj.manArr[ 0 ], layRecObj.manArr[ 1 ] - sprSetObj.manEle.height ); // What: Manager Draw Call. Why: The station manager stands in his studio. How: This draws him with his feet on the carpet line.


}

// #endregion draStuFun



// #region draTurFun

/**
 * draTurFun = Draw Turkey Function
 *
 * @summary
 * Draws one turkey at its place and angle: a falling turkey alternates its
 * wing on the flap beat, and a sitting one keeps its wing down, flapping
 * once now and then, with three gold stars circling its head.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param canCotObj - Canvas Context Object: The context to draw on.
 * @param turCurObj - Turkey Current Object: {@link TurStaTyp}
 * @param sprSetObj - Sprite Set Object: {@link SprSetTyp}
 * @param staColStr - Star Color String: The dazed stars' color.
 * @param curTimNum - Current Time Number: The scene's time, in seconds.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * draTurFun(canCotObj, turCurObj, sprSetObj, staColStr, 4.2) // => void
 * ```
 *
*/

function draTurFun ( canCotObj : CanvasRenderingContext2D, turCurObj : TurStaTyp, sprSetObj : SprSetTyp, staColStr : string, curTimNum : number ) : void {


	const falFlaBoo = turCurObj.staStr === 'fall' && Math.floor( turCurObj.flaNum / FLA_TIM_NUM ) % 2 === 0; // What: Falling Flap Boolean. Why: A falling turkey flaps on a steady beat. How: This is true on every other beat.
	const sitFlaBoo = turCurObj.staStr === 'sit' && Math.floor( curTimNum * 2 ) % 7 === 0;                   // What: Sitting Flap Boolean. Why: A dazed turkey flaps now and then. How: This is true for half a second in every three and a half.
	const winRaiBoo = falFlaBoo || sitFlaBoo;                                                                // What: Wing Raised Boolean. Why: The wing is up whenever the turkey flaps, falling or sitting. How: This combines the falling and sitting flap booleans.
	const sprCanEle = winRaiBoo ? sprSetObj.tuuEle : sprSetObj.tudEle;                                       // What: Sprite Canvas Element. Why: Each frame has its own image. How: This picks the wing-up or wing-down frame.


	canCotObj.save(); // What: Context Save Call. Why: The turkey's turn mustn't affect what's drawn after it. How: This saves the drawing state.

	canCotObj.translate( Math.round( turCurObj.xcoNum ), Math.round( turCurObj.ycoNum ) ); // What: Context Translate Call. Why: The turkey turns around its own middle. How: This moves the origin to its center, on whole pixels.

	canCotObj.rotate( turCurObj.angNum ); // What: Context Rotate Call. Why: A tumbling turkey is drawn at its angle. How: This turns the drawing.

	canCotObj.drawImage( sprCanEle, -Math.floor( sprCanEle.width / 2 ), -Math.floor( sprCanEle.height / 2 ) ); // What: Turkey Draw Call. Why: The turkey appears at its place. How: This draws the frame centered on the origin.

	canCotObj.restore(); // What: Context Restore Call. Why: Later drawings go back to the plain origin. How: This restores the saved state.



	if ( turCurObj.staStr !== 'sit' ) return; // What: Not Sitting Guard. Why: Only a sitting turkey sees stars. How: This stops for any other.



	canCotObj.fillStyle = staColStr; // What: Star Fill Assignment. Why: The stars are gold. How: This sets their color.


	for ( let staIndNum = 0; staIndNum < 3; staIndNum++ ) canCotObj.fillRect( Math.round( turCurObj.xcoNum + 2 + Math.cos( curTimNum * 4 + staIndNum * 2.09 ) * 6 ), Math.round( turCurObj.ycoNum - 12 + Math.sin( curTimNum * 4 + staIndNum * 2.09 ) * 2 ), 1, 1 ); // What: Dazed Star Loop. Why: Three stars circle the dazed turkey's head. How: This places each a third of a turn apart on a flat circle above it.


}

// #endregion draTurFun



// #region helXcoFun

/**
 * helXcoFun = Helicopter X-Coordinate Function
 *
 * @summary
 * Returns the helicopter's left edge at a moment, in canvas pixels. It starts
 * 60 pixels off the left edge as it arrives and moves at a steady pace, ending
 * 5 pixels past the right edge when its crossing time is up.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param layRecObj - Layout Record Object: {@link LayRecTyp}
 * @param schRecObj - Schedule Record Object: {@link SceSchTyp}
 * @param curTimNum - Current Time Number: The moment, in seconds.
 *
 * @returns The helicopter's left edge.
 *
 * @example
 * ```ts
 * helXcoFun(layRecObj, schRecObj, 3) // => its left edge 3 seconds in
 * ```
 *
*/

const helXcoFun = ( layRecObj : LayRecTyp, schRecObj : SceSchTyp, curTimNum : number ) : number => -60 + ( curTimNum - schRecObj.hlaNum ) / schRecObj.hldNum * ( layRecObj.widNum + 65 ); // What: Helicopter X-Coordinate Function. Why: The helicopter crosses the whole width in its set time. How: This returns its left, moving from just off the left edge to just off the right.

// #endregion helXcoFun



// #region layRecFun

/**
 * layRecFun = Layout Record Function
 *
 * @summary
 * Works out the canvas's size and where everything sits for a canvas of a
 * given shape. A canvas wider than it is tall takes the wide composition, any
 * other the tall one. The composition keeps its drawn size along one side and
 * stretches along the other until it matches the shape, to whole pixels: wider
 * than its own shape, it widens, keeping the mall centered and placing the
 * studio's parts across the width; narrower, it grows taller, the wide one
 * adding the height to its sky and the tall one sharing it between its sky and
 * its lot.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param aspRatNum - Aspect Ratio Number: The canvas's width over its height.
 *
 * @returns The canvas's size and every position, in canvas pixels.
 *
 * @example
 * ```ts
 * layRecFun(16 / 9) // => { heiNum : 135, widNum : 240, ... }
 * ```
 *
*/

function layRecFun ( aspRatNum : number ) : LayRecTyp {


	const talLayBoo = aspRatNum <= 1; // What: Tall Layout Boolean. Why: A screen that isn't wider than tall gets the tall composition, as the lettering's upright layout does. How: This compares the width to the height.

	const [ basWidNum, basHeiNum ] = talLayBoo ? TAL_BAS_ARR : WID_BAS_ARR; // What: Base Width Number. Why: The composition is drawn at this width at least. How: This reads the chosen composition's width. // What: Base Height Number. Why: The composition is drawn at this height at least. How: This reads its height.

	const widBigBoo = aspRatNum >= basWidNum / basHeiNum;                          // What: Width Bigger Boolean. Why: A wider screen stretches the width, a narrower one the height. How: This compares the screen's shape to the composition's.
	const layHeiNum = widBigBoo ? basHeiNum : Math.round( basWidNum / aspRatNum ); // What: Layout Height Number. Why: The canvas matches the screen's shape. How: This stretches the height on a narrower screen, or keeps the drawn height.
	const layWidNum = widBigBoo ? Math.round( basHeiNum * aspRatNum ) : basWidNum; // What: Layout Width Number. Why: The canvas matches the screen's shape. How: This stretches the width on a wider screen, or keeps the drawn width.
	const offXcoNum = Math.round( ( layWidNum - basWidNum ) / 2 );                 // What: Offset X-Coordinate Number. Why: Centered elements move to the middle of a wider canvas. How: This is half the extra width.


	if ( !talLayBoo ) { // What: Wide Layout Branch. Why: The wide composition puts all its extra height in the sky. How: This returns the wide positions, the mall's and lot's parts and the studio's carpet moved down by the extra height.


		const offYcoNum = layHeiNum - basHeiNum;          // What: Offset Y-Coordinate Number. Why: Extra height goes to the sky. How: This is the extra height.
		const manLefNum = Math.round( layWidNum * 0.11 ); // What: Manager Left Number. Why: The station manager stands at the studio's left, the greeting to his right. How: This is a share of the width.



		return { // What: Wide Layout Return. Why: The caller draws the wide composition. How: This returns its positions.


			cubNum : offYcoNum + 85,                                                       // What: Curb Number. Why: The curb sits under the mall. How: This is its drawn place, moved down.
			divNum : offYcoNum + 108,                                                      // What: Divider Number. Why: The divider splits the lot's rows. How: This is its drawn place, moved down.
			dooNum : offXcoNum + 106,                                                      // What: Door Number. Why: The doors sit in the mall's middle. How: This is their drawn place, moved with the mall.
			feaArr : [ Math.round( layWidNum * 0.46 ), Math.round( layWidNum * 0.09 ) ],   // What: Feather Array. Why: Feathers drift down the studio's right side, beside the greeting. How: This starts them near the middle, spaced by a share of the width.
			floNum : offYcoNum + 98,                                                       // What: Floor Number. Why: The carpet starts below the wall. How: This is its drawn place, moved down.
			heiNum : layHeiNum,                                                            // What: Height Number. Why: The canvas takes the screen's shape. How: This is the layout's height.
			helNum : offYcoNum + 29,                                                       // What: Helicopter Number. Why: The helicopter flies above the sign. How: This is its drawn place, moved down.
			lanArr : [ offYcoNum + 93, 14 ],                                               // What: Landing Array. Why: Turkeys land in the lot's upper row, above the divider. How: This is its drawn landing line, moved down, and its depth.
			linArr : [ [ offYcoNum + 90, 9 ], [ offYcoNum + 116, 10 ] ],                   // What: Line Array. Why: Two rows of stall lines mark the lot. How: Each row is at its drawn place, moved down.
			malArr : [ offXcoNum + 28, offYcoNum + 56, 184 ],                              // What: Mall Array. Why: The mall stands centered at the back of the lot. How: This is its drawn place, moved, and its width.
			manArr : [ manLefNum, offYcoNum + 129 ],                                       // What: Manager Array. Why: The station manager stands on the carpet. How: This is his left, then his drawn footing, moved down.
			onaArr : [ 10, 10 ],                                                           // What: On Air Array. Why: The "ON AIR" light hangs at the wall's top left. How: This is its drawn place.
			polArr : [ offXcoNum + 92, offXcoNum + 184 ],                                  // What: Pole Array. Why: Two lamp posts light the lot. How: Each is at its drawn place, moved with the mall.
			skyNum : offYcoNum + 40,                                                       // What: Sky Number. Why: The sky's upper band grows with extra height. How: This is its drawn end, moved down.
			tapArr : [ offYcoNum + 122, 8 ],                                               // What: Tap Array. Why: A turkey tapped in the studio lands on the carpet. How: This is the carpet's landing line, moved down, and its depth.
			turNum : manLefNum + 44,                                                       // What: Turkey Number. Why: The dazed turkey sits beside the manager. How: This is his left plus a set distance that clears his width.
			widNum : layWidNum,                                                            // What: Width Number. Why: The canvas takes the screen's shape. How: This is the layout's width.
			winArr : [ offXcoNum + 38, offXcoNum + 62, offXcoNum + 150, offXcoNum + 174 ], // What: Window Array. Why: Four shop windows line the mall. How: Each is at its drawn place, moved with the mall.

			carArr : [ [ 0, offXcoNum + 9, offYcoNum + 91 ], [ 1, offXcoNum + 57, offYcoNum + 91 ], [ 2, offXcoNum + 152, offYcoNum + 91 ], [ 1, offXcoNum + 25, offYcoNum + 118 ], [ 0, offXcoNum + 200, offYcoNum + 118 ] ], // What: Car Array. Why: Five cars park in both rows. How: Each sits at its drawn place, moved with the mall.
			cloArr : [ [ Math.round( layWidNum * 0.08 ), offYcoNum + 44 ], [ Math.round( layWidNum * 0.62 ), offYcoNum + 30 ], [ Math.round( layWidNum * 0.85 ), offYcoNum + 48 ] ]                                            // What: Cloud Array. Why: Three clouds spread across the sky. How: Each starts at its share of the width, at its drawn height moved down.


		};


	}



	const offYcoNum = Math.round( ( layHeiNum - basHeiNum ) / 2 ); // What: Offset Y-Coordinate Number. Why: The tall composition shares its extra height between the sky and the lot. How: This is half the extra height.



	return { // What: Tall Layout Return. Why: The caller draws the tall composition. How: This returns its positions.


		cubNum : offYcoNum + 125,                                                     // What: Curb Number. Why: The curb sits under the mall. How: This is its drawn place, moved down.
		divNum : offYcoNum + 148,                                                     // What: Divider Number. Why: The divider splits the lot's rows. How: This is its drawn place, moved down.
		dooNum : offXcoNum + 54,                                                      // What: Door Number. Why: The doors sit in the mall's middle. How: This is their drawn place, moved with the mall.
		feaArr : [ offXcoNum + 20, 20 ],                                              // What: Feather Array. Why: Feathers drift down the whole studio. How: This starts them near the left, spaced evenly.
		floNum : offYcoNum + 150,                                                     // What: Floor Number. Why: The carpet starts below the wall. How: This is its drawn place, moved down.
		heiNum : layHeiNum,                                                           // What: Height Number. Why: The canvas takes the screen's shape. How: This is the layout's height.
		helNum : offYcoNum + 60,                                                      // What: Helicopter Number. Why: The helicopter flies above the sign. How: This is its drawn place, moved down.
		lanArr : [ offYcoNum + 133, 34 ],                                             // What: Landing Array. Why: Turkeys land across the taller lot. How: This is its drawn landing line, moved down, and its depth.
		linArr : [ [ offYcoNum + 130, 9 ], [ offYcoNum + 156, 10 ] ],                 // What: Line Array. Why: Two rows of stall lines mark the lot. How: Each row is at its drawn place, moved down.
		malArr : [ offXcoNum + 6, offYcoNum + 96, 123 ],                              // What: Mall Array. Why: The tall composition's mall is narrower. How: This is its drawn place, moved, and its width.
		manArr : [ offXcoNum + 14, offYcoNum + 186 ],                                 // What: Manager Array. Why: The station manager stands at the studio's left, below the greeting. How: This is his drawn place, moved with the extra size.
		onaArr : [ offXcoNum + 92, offYcoNum + 112 ],                                 // What: On Air Array. Why: The "ON AIR" light hangs on the wall to the manager's right. How: This is its drawn place, moved with the extra size.
		polArr : [ offXcoNum + 46, offXcoNum + 92 ],                                  // What: Pole Array. Why: Two lamp posts light the lot. How: Each is at its drawn place, moved with the mall.
		skyNum : offYcoNum + 70,                                                      // What: Sky Number. Why: The sky's upper band grows with extra height. How: This is its drawn end, moved down.
		tapArr : [ offYcoNum + 176, 10 ],                                             // What: Tap Array. Why: A turkey tapped in the studio lands on the carpet. How: This is the carpet's landing line, moved down, and its depth.
		turNum : offXcoNum + 66,                                                      // What: Turkey Number. Why: The dazed turkey sits beside the manager. How: This is its drawn place, moved with the extra width.
		widNum : layWidNum,                                                           // What: Width Number. Why: The canvas takes the screen's shape. How: This is the layout's width.
		winArr : [ offXcoNum + 12, offXcoNum + 32, offXcoNum + 85, offXcoNum + 105 ], // What: Window Array. Why: Four shop windows line the mall. How: Each is at its drawn place, moved with the mall.

		carArr : [ [ 0, offXcoNum + 2, offYcoNum + 131 ], [ 2, offXcoNum + 104, offYcoNum + 131 ], [ 1, offXcoNum + 60, offYcoNum + 158 ] ],                                    // What: Car Array. Why: Three cars park in both rows. How: Each sits at its drawn place, moved with the extra size.
		cloArr : [ [ Math.round( layWidNum * 0.07 ), offYcoNum + 74 ], [ Math.round( layWidNum * 0.59 ), offYcoNum + 62 ], [ Math.round( layWidNum * 0.89 ), offYcoNum + 84 ] ] // What: Cloud Array. Why: Three clouds spread across the sky. How: Each starts at its share of the width, at its drawn height moved down.


	};


}

// #endregion layRecFun



// #region ranGenFun

/**
 * ranGenFun = Random Generator Function
 *
 * @summary
 * Returns a seeded random number generator, Mulberry32, whose every call
 * gives the next number from 0 up to 1. The same seed always gives the same
 * numbers, so the scene's motion can be replayed to the same state.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param seeValNum - Seed Value Number: The number the sequence starts from.
 *
 * @returns The generator, a function returning the next number.
 *
 * @example
 * ```ts
 * ranGenFun(7)() // => the same number between 0 and 1 every time
 * ```
 *
*/

function ranGenFun ( seeValNum : number ) : () => number {


	let staValNum = seeValNum; // What: State Value Number. Why: Each number follows from the last. How: This holds the generator's state, starting at the seed.



	return () => { // What: Next Number Return. Why: The caller draws numbers one at a time. How: This returns the function that advances the state and scrambles it into a number from 0 up to 1.


		staValNum = ( staValNum + 0x6D2B79F5 ) | 0; // What: State Advance Assignment. Why: Each call moves the sequence on. How: This adds Mulberry32's constant, kept to 32 bits.


		let mixValNum = Math.imul( staValNum ^ ( staValNum >>> 15 ), 1 | staValNum ); // What: Mix Value Number. Why: The state is scrambled so nearby states give unrelated numbers. How: This is Mulberry32's first mixing step.


		mixValNum = ( mixValNum + Math.imul( mixValNum ^ ( mixValNum >>> 7 ), 61 | mixValNum ) ) ^ mixValNum; // What: Second Mix Assignment. Why: One step leaves patterns. How: This is Mulberry32's second mixing step.



		return ( ( mixValNum ^ ( mixValNum >>> 14 ) ) >>> 0 ) / 4294967296; // What: Fraction Return. Why: The caller wants a number from 0 up to 1. How: This finishes the mix and divides by 2 to the 32nd.


	};


}

// #endregion ranGenFun



// #region demPlaFun

/**
 * demPlaFun = Demo Place Function
 *
 * @summary
 * Returns where a pointer demo taps, in canvas pixels: the fingertip's left
 * and top, at a random spot inside the screen less a margin on each side.
 * Each demo's spot comes from a generator seeded by its cycle, so the same
 * demo always taps the same share of the screen, and a rebuilt moment or a
 * turned phone puts it back in place.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param layRecObj - Layout Record Object: {@link LayRecTyp}
 * @param demCycNum - Demo Cycle Number: Which demo, counting from 0.
 *
 * @returns The fingertip's left, then its top.
 *
 * @example
 * ```ts
 * demPlaFun(layRecObj, 2) // => [ 141, 63 ]
 * ```
 *
*/

const demPlaFun = ( layRecObj : LayRecTyp, demCycNum : number ) : [ number, number ] => { // What: Demo Place Function. Why: Each demo taps its own random spot, the same every time it's rebuilt. How: This draws two shares from a generator seeded by the demo's cycle and scales them inside the margins.


	const plaRanFun = ranGenFun( RAN_SEE_NUM + demCycNum + 1 ); // What: Place Random Function. Why: A demo's spot is random but fixed. How: This seeds a generator with the demo's cycle, past the scene's own seed.
	const spaShaNum = 1 - DEM_MAR_NUM * 2;                       // What: Space Share Number. Why: The spot falls between the margins. How: This is the share of each side left between them.



	return [ Math.round( layRecObj.widNum * ( DEM_MAR_NUM + plaRanFun() * spaShaNum ) ), Math.round( layRecObj.heiNum * ( DEM_MAR_NUM + plaRanFun() * spaShaNum ) ) ]; // What: Place Return. Why: The pointer and its turkey use the spot. How: This scales the first share to the width and the second to the height, each inside the margins.


};

// #endregion demPlaFun



// #region spaTurFun

/**
 * spaTurFun = Spawn Turkey Function
 *
 * @summary
 * Adds a falling turkey to a list at a point, moving sideways at a given
 * speed, that clears at a given moment. Its landing line is drawn from a band
 * given as its top line and its depth, and its spin from the seeded sequence,
 * so it takes three numbers from the sequence.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param simStaObj - Simulation State Object: {@link SimStaTyp}
 * @param lisTurArr - List Turkey Array: The turkeys to add to.
 * @param spaXcoNum - Spawn X-Coordinate Number: Where it starts, across.
 * @param spaYcoNum - Spawn Y-Coordinate Number: Where it starts, down.
 * @param velXcoNum - Velocity X-Coordinate Number: Its sideways speed.
 * @param spaLanArr - Spawn Landing Array: The landing band's top and depth.
 * @param expTimNum - Expiry Time Number: When it clears, Infinity for one
 *                    that stays.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * spaTurFun(simStaObj, malTurArr, 120, -10, 0, [93, 14], Infinity) // => void
 * ```
 *
*/

const spaTurFun = ( simStaObj : SimStaTyp, lisTurArr : TurStaTyp[], spaXcoNum : number, spaYcoNum : number, velXcoNum : number, spaLanArr : [ number, number ], expTimNum : number ) : void => { // What: Spawn Turkey Function. Why: Each dropped turkey starts falling from a point. How: This adds a falling turkey there, with a landing depth and tumble drawn from the seeded sequence.


	lisTurArr.push({ // What: Turkey Push Call. Why: The new turkey joins the list it falls in. How: This adds it with its starting state.


		velXcoNum, // What: Velocity X-Coordinate Number. Why: A dropped turkey drifts with the helicopter. How: This is the sideways speed passed in.

		ageNum    : 0,                                                                      // What: Age Number. Why: A new turkey has just appeared. How: Its age starts at zero.
		angNum    : 0,                                                                      // What: Angle Number. Why: A falling turkey starts upright. How: Its tumble starts at zero.
		expNum    : expTimNum,                                                              // What: Expiry Number. Why: A turkey may clear later. How: This is the moment passed in.
		flaNum    : 0,                                                                      // What: Flap Number. Why: Its wing beat starts fresh. How: This starts at zero.
		lanNum    : spaLanArr[ 0 ] + simStaObj.ranFun() * spaLanArr[ 1 ],                   // What: Landing Number. Why: Turkeys land at different depths. How: This draws a line inside the landing band from the seeded sequence.
		spiNum    : ( simStaObj.ranFun() < 0.5 ? -1 : 1 ) * ( 5 + simStaObj.ranFun() * 4 ), // What: Spin Number. Why: Each turkey tumbles its own way. How: This draws a direction and a speed from the seeded sequence.
		staStr    : 'fall',                                                                 // What: State String. Why: A new turkey is falling. How: This starts its fall.
		velYcoNum : 0,                                                                      // What: Velocity Y-Coordinate Number. Why: A turkey starts its fall at rest. How: Its falling speed starts at zero.
		xcoNum    : spaXcoNum,                                                              // What: X-Coordinate Number. Why: The turkey starts at the spawn point. How: This is its place across.
		ycoNum    : spaYcoNum                                                               // What: Y-Coordinate Number. Why: The turkey starts at the spawn point. How: This is its place down.


	});


};

// #endregion spaTurFun



// #region steTurFun

/**
 * steTurFun = Step Turkeys Function
 *
 * @summary
 * Moves a list of turkeys forward by one slice of time. A falling turkey
 * flaps for its first 0.9 seconds, sinking slowly, then tumbles and drops
 * fast. On reaching its landing line it bounces once, throwing a puff of nine
 * feather pixels in its two feather colors, and on landing again it sits.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param simStaObj - Simulation State Object: {@link SimStaTyp}
 * @param lisTurArr - List Turkey Array: The turkeys to move.
 * @param pufColArr - Puff Color Array: The colors a puff's pixels take.
 * @param delTimNum - Delta Time Number: The slice of time, in seconds.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * steTurFun(simStaObj, simStaObj.malArr, pufColArr, DEL_TIM_NUM) // => void
 * ```
 *
*/

function steTurFun ( simStaObj : SimStaTyp, lisTurArr : TurStaTyp[], pufColArr : string[], delTimNum : number ) : void {


	for ( const turCurObj of lisTurArr ) { // What: Turkey Loop. Why: Each turkey moves on its own. How: This walks the list.


		turCurObj.ageNum += delTimNum; // What: Age Advance Assignment. Why: The turkey's state changes with time. How: This adds the slice.
		turCurObj.flaNum += delTimNum; // What: Flap Advance Assignment. Why: The wing beat runs on. How: This adds the slice.


		if ( turCurObj.staStr === 'fall' ) { // What: Falling Branch. Why: A falling turkey flaps, then tumbles. How: This moves it, landing it at its line.


			if ( turCurObj.ageNum < 0.9 ) turCurObj.velYcoNum = Math.min( turCurObj.velYcoNum + 30 * delTimNum, 22 ); // What: Flapping Fall Branch. Why: The turkey tries to fly at first, sinking slowly. How: This speeds its fall gently, capped low.

			else { // What: Tumbling Fall Branch. Why: The flapping doesn't work. How: This speeds its fall and turns it.


				turCurObj.velYcoNum += 150 * delTimNum;              // What: Tumble Speed Assignment. Why: The turkey drops fast once it gives up. How: This adds its gravity.
				turCurObj.angNum    += turCurObj.spiNum * delTimNum; // What: Tumble Angle Assignment. Why: The turkey turns as it drops. How: This adds its spin.


			}



			turCurObj.velXcoNum *= 1 - 0.8 * delTimNum;             // What: Drift Slow Assignment. Why: The helicopter's push fades. How: This damps the sideways speed.
			turCurObj.xcoNum    += turCurObj.velXcoNum * delTimNum; // What: Drift Assignment. Why: The turkey drifts sideways. How: This moves it by its sideways speed.
			turCurObj.ycoNum    += turCurObj.velYcoNum * delTimNum; // What: Fall Assignment. Why: The turkey falls. How: This moves it by its downward speed.


			if ( turCurObj.ycoNum + 8 >= turCurObj.lanNum ) { // What: Landing Branch. Why: A turkey stops at its landing line, bouncing once. How: This sets it upright on the line, throws a puff, and starts its bounce.


				turCurObj.angNum    = 0;                    // What: Upright Assignment. Why: The turkey lands on its feet. How: This clears its angle.
				turCurObj.staStr    = 'bounce';             // What: Bounce State Assignment. Why: The turkey hops up from the impact. How: This switches it to bouncing.
				turCurObj.velYcoNum = -38;                  // What: Bounce Speed Assignment. Why: The hop rises a little before it falls. How: This throws it up.
				turCurObj.ycoNum    = turCurObj.lanNum - 8; // What: Landing Place Assignment. Why: The turkey's feet sit on its line. How: This places its center eight pixels above.


				for ( let parIndNum = 0; parIndNum < 9; parIndNum++ ) { // What: Feather Puff Loop. Why: Feathers fly from the impact. How: This throws nine pixels up and out, alternating the puff's colors.


					simStaObj.parArr.push({ // What: Puff Pixel Push Call. Why: Each pixel joins the puff. How: This adds it with its color, life, speed, and place.


						colStr    : pufColArr[ parIndNum % pufColArr.length ], // What: Color String. Why: The puff mixes its colors. How: This cycles through them.
						lifNum    : 0.7 + simStaObj.ranFun() * 0.4,            // What: Life Number. Why: The pixels fade at different times. How: Each lasts 0.7 to 1.1 seconds.
						velXcoNum : ( simStaObj.ranFun() - 0.5 ) * 70,         // What: Velocity X-Coordinate Number. Why: The pixels fly out both ways. How: This draws a sideways speed.
						velYcoNum : -20 - simStaObj.ranFun() * 35,             // What: Velocity Y-Coordinate Number. Why: The pixels fly up first. How: This draws an upward speed.
						xcoNum    : turCurObj.xcoNum,                          // What: X-Coordinate Number. Why: The puff starts at the turkey. How: This is its place across.
						ycoNum    : turCurObj.lanNum                           // What: Y-Coordinate Number. Why: The puff starts on the ground. How: This is the turkey's landing line.


					});


				}


			}


		}

		else if ( turCurObj.staStr === 'bounce' ) { // What: Bouncing Branch. Why: The hop rises and falls back. How: This moves it under gravity, sitting it on landing.


			turCurObj.velYcoNum += 220 * delTimNum;                 // What: Hop Gravity Assignment. Why: The hop slows and falls back. How: This adds gravity.
			turCurObj.ycoNum    += turCurObj.velYcoNum * delTimNum; // What: Hop Move Assignment. Why: The turkey rises and falls. How: This moves it by its speed.


			if ( turCurObj.ycoNum + 8 >= turCurObj.lanNum ) { // What: Sit Branch. Why: The turkey settles on landing again. How: This sits it once its feet reach its line.


				Object.assign( turCurObj, { // What: Sit Assignment. Why: The turkey settles on landing again. How: This sits it on its line and restarts its age.


					ageNum : 0,                   // What: Age Number. Why: Its sitting starts now. How: This restarts its age.
					staStr : 'sit',               // What: State String. Why: The turkey stops bouncing. How: This sits it.
					ycoNum : turCurObj.lanNum - 8 // What: Y-Coordinate Number. Why: Its feet rest on its line. How: This sets its middle 8 pixels above the line.


				} );


			}


		}


	}


}

// #endregion steTurFun



// #region simSteFun

/**
 * simSteFun = Simulation Step Function
 *
 * @summary
 * Moves the whole scene forward by one slice of time: releases each turkey
 * whose drop time the slice crosses, replays each tap whose time it crosses,
 * spawning a turkey for those in the mall or the studio, drops a turkey for
 * a pointer demo's tap the slice crosses when no tap came first, sets up
 * the studio's dazed turkey and feathers when the studio starts, moves the
 * turkeys of whichever scene is showing, drifts the feathers, and moves and
 * ages the puff pixels, clearing the studio turkeys whose time is up.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param simStaObj - Simulation State Object: {@link SimStaTyp}
 * @param layRecObj - Layout Record Object: {@link LayRecTyp}
 * @param schRecObj - Schedule Record Object: {@link SceSchTyp}
 * @param tapEveArr - Tap Event Array: Every tap so far, in order.
 * @param pufColArr - Puff Color Array: The colors a puff's pixels take.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * simSteFun(simStaObj, layRecObj, schRecObj, tapEveArr, pufColArr) // => void
 * ```
 *
*/

function simSteFun ( simStaObj : SimStaTyp, layRecObj : LayRecTyp, schRecObj : SceSchTyp, tapEveArr : TapEveTyp[], pufColArr : string[] ) : void {


	const preTimNum = simStaObj.simNum;        // What: Previous Time Number. Why: An event happens in the slice its time falls in. How: This is the slice's start.
	const nexTimNum = preTimNum + DEL_TIM_NUM; // What: Next Time Number. Why: An event happens in the slice its time falls in. How: This is the slice's end.


	simStaObj.simNum = nexTimNum; // What: Time Advance Assignment. Why: The step moves the scene to the slice's end. How: This records the new time.



	for ( const droTimNum of schRecObj.droArr ) if ( preTimNum < droTimNum && nexTimNum >= droTimNum ) spaTurFun( simStaObj, simStaObj.malArr, helXcoFun( layRecObj, schRecObj, droTimNum ) + 30, layRecObj.helNum + 12, ( layRecObj.widNum + 65 ) / schRecObj.hldNum * 0.3, layRecObj.lanArr, Infinity ); // What: Drop Loop. Why: A turkey leaves the helicopter's door at each drop time. How: This spawns it at the door, drifting with a share of the helicopter's speed.



	while ( simStaObj.tapNum < tapEveArr.length && tapEveArr[ simStaObj.tapNum ].timNum < nexTimNum ) { // What: Tap Replay Loop. Why: A tap drops a turkey at its moment, and replays the same way when a moment is rebuilt. How: This spawns each tap due in the slice, in the scene showing then.


		const tapCurObj = tapEveArr[ simStaObj.tapNum ];          // What: Tap Current Object. Why: The tap's time decides its scene, and its share its place. How: This reads the next tap.
		const tapXcoNum = tapCurObj.fraXcoNum * layRecObj.widNum; // What: Tap X-Coordinate Number. Why: A tap keeps its share of the width when the layout changes. How: This scales the share to the canvas.


		if ( tapCurObj.timNum < schRecObj.staNum ) spaTurFun( simStaObj, simStaObj.malArr, tapXcoNum, -10, 0, layRecObj.lanArr, Infinity ); // What: Lot Tap Branch. Why: A tap over the mall drops a turkey into the lot. How: This spawns it above the screen.

		else if ( tapCurObj.timNum >= schRecObj.sceNum ) spaTurFun( simStaObj, simStaObj.stuArr, tapXcoNum, -10, 0, layRecObj.tapArr, Infinity ); // What: Studio Tap Branch. Why: A tap in the studio drops a turkey onto the carpet. How: This spawns it above the screen.



		simStaObj.tapNum++; // What: Tap Count Increment. Why: Each tap is replayed once. How: This moves past it.


	}



	const demCycNum = Math.floor( ( nexTimNum - schRecObj.demNum - DEM_TAP_NUM ) / DEM_CYC_NUM ); // What: Demo Cycle Number. Why: The pointer taps once a cycle, and the slice may hold one of its taps. How: This counts the cycles whose tap comes by the slice's end, less one, below 0 before the first tap.
	const demTapNum = schRecObj.demNum + DEM_TAP_NUM + demCycNum * DEM_CYC_NUM;                // What: Demo Tap Number. Why: The pointer's tap drops a turkey of its own. How: This is the latest demo tap's moment by the slice's end.
	const demCroBoo = demCycNum >= 0 && preTimNum < demTapNum;                                 // What: Demo Cross Boolean. Why: A demo's turkey drops in the slice its tap falls in. How: This is true when that tap comes after the slice's start.


	if ( demCroBoo && demLivFun( tapEveArr, demTapNum ) ) spaTurFun( simStaObj, simStaObj.stuArr, demPlaFun( layRecObj, demCycNum )[ 0 ], -10, 0, layRecObj.tapArr, demTapNum + DEM_KEE_NUM * DEM_CYC_NUM ); // What: Demo Drop Branch. Why: Each of the pointer's taps drops a turkey as a real tap would, until the visitor taps. How: This spawns it above the screen at the demo's spot, clearing three cycles after its tap.



	if ( preTimNum < schRecObj.sceNum && nexTimNum >= schRecObj.sceNum ) { // What: Studio Start Branch. Why: The studio opens with a dazed turkey and drifting feathers. How: This sets them up as the studio starts.


		simStaObj.stuArr.push({ // What: Dazed Turkey Push Call. Why: A turkey sits dazed at the manager's feet. How: This seats it beside him.


			ageNum    : 9,                        // What: Age Number. Why: The dazed turkey landed long before the studio opens. How: This starts it well past its first flaps.
			angNum    : 0,                        // What: Angle Number. Why: The dazed turkey sits upright. How: This is no tumble.
			expNum    : Infinity,                 // What: Expiry Number. Why: The dazed turkey stays with the manager. How: It never clears.
			flaNum    : 0,                        // What: Flap Number. Why: Its wing beat starts fresh. How: This starts at zero.
			lanNum    : layRecObj.manArr[ 1 ],    // What: Landing Number. Why: It sits at the station manager's feet. How: This is his line.
			spiNum    : 0,                        // What: Spin Number. Why: A sitting turkey doesn't tumble. How: This is no spin.
			staStr    : 'sit',                    // What: State String. Why: The turkey is dazed on the carpet. How: This sits it.
			velXcoNum : 0,                        // What: Velocity X-Coordinate Number. Why: A sitting turkey stays put. How: This is no sideways speed.
			velYcoNum : 0,                        // What: Velocity Y-Coordinate Number. Why: A sitting turkey stays put. How: This is no falling speed.
			xcoNum    : layRecObj.turNum,         // What: X-Coordinate Number. Why: The turkey sits beside the manager. How: This is its drawn place across.
			ycoNum    : layRecObj.manArr[ 1 ] - 8 // What: Y-Coordinate Number. Why: Its feet rest on his line. How: This sets its middle 8 pixels above the line.


		});


		simStaObj.feaArr = Array.from( Array( 6 ).keys(), ( feaIndNum ) => ( { // What: Feather Setup Assignment. Why: Six feathers drift down the studio at staggered heights. How: This spaces them across and above the top.


			phaNum : feaIndNum,                                                 // What: Phase Number. Why: Each feather sways out of step. How: This offsets its sway by its place.
			xcoNum : layRecObj.feaArr[ 0 ] + feaIndNum * layRecObj.feaArr[ 1 ], // What: X-Coordinate Number. Why: The feathers spread across the studio. How: This steps each from the first by the spacing.
			ycoNum : -10 - feaIndNum * 24                                       // What: Y-Coordinate Number. Why: The feathers enter one after another. How: This starts each higher above the top.


		} ) );


	}



	if ( nexTimNum < schRecObj.staNum ) steTurFun( simStaObj, simStaObj.malArr, pufColArr, DEL_TIM_NUM ); // What: Lot Turkey Step Call. Why: The lot's turkeys move while the mall shows. How: This steps them.



	if ( nexTimNum >= schRecObj.sceNum ) steTurFun( simStaObj, simStaObj.stuArr, pufColArr, DEL_TIM_NUM ); // What: Studio Turkey Step Call. Why: The studio's turkeys move once it shows. How: This steps them.



	for ( const feaCurObj of simStaObj.feaArr ) feaCurObj.ycoNum = feaCurObj.ycoNum + 9 * DEL_TIM_NUM > layRecObj.heiNum ? -6 : feaCurObj.ycoNum + 9 * DEL_TIM_NUM; // What: Feather Drift Loop. Why: The feathers drift down and start again at the top. How: This moves each down slowly, returning it above the top once it passes the bottom.



	for ( const parCurObj of simStaObj.parArr ) { // What: Puff Move Loop. Why: The puff's pixels fly and fall. How: This moves each by its speed, adds gravity, and ages it.


		Object.assign( parCurObj, { // What: Puff Move Assignment. Why: Every value steps from the same moment. How: This sets them together, each worked out from the old values.


			lifNum    : parCurObj.lifNum - DEL_TIM_NUM,                       // What: Life Number. Why: The pixels fade out. How: This ages each by the slice.
			velYcoNum : parCurObj.velYcoNum + 90 * DEL_TIM_NUM,               // What: Velocity Y-Coordinate Number. Why: Gravity pulls the pixels down. How: This adds to the falling speed.
			xcoNum    : parCurObj.xcoNum + parCurObj.velXcoNum * DEL_TIM_NUM, // What: X-Coordinate Number. Why: The pixels fly sideways. How: This moves each by its sideways speed.
			ycoNum    : parCurObj.ycoNum + parCurObj.velYcoNum * DEL_TIM_NUM  // What: Y-Coordinate Number. Why: The pixels rise and fall. How: This moves each by its falling speed before gravity adds to it.


		} );


	}



	simStaObj.parArr = simStaObj.parArr.filter( ( parCurObj ) => parCurObj.lifNum > 0 );         // What: Puff Expiry Assignment. Why: A puff fades away. How: This drops the pixels whose life has run out.
	simStaObj.stuArr = simStaObj.stuArr.filter( ( turCurObj ) => turCurObj.expNum > nexTimNum ); // What: Turkey Expiry Assignment. Why: The pointer's turkeys clear a few taps later. How: This drops the studio turkeys whose expiry has passed.


}

// #endregion simSteFun



type SceOptTyp = { // What: Scene Options Type. Why: The card hands the scene its clock, schedule, and colors. How: This names each option.


	redMotBoo : boolean,     // What: Reduced Motion Boolean. Why: Under reduced motion the scene draws the finished studio still. How: This is true when the visitor asked for less motion.
	rooEle    : HTMLElement, // What: Root Element. Why: The card's colors are tokens on its root. How: The scene reads each token from this element.
	schObj    : SceSchTyp,   // What: Schedule Object. Why: The scene's events line up with the card's lettering. How: This holds their times.
	timFun    : () => number // What: Time Function. Why: The scene runs on the card's clock. How: This returns the card's time, in seconds.


};



type SceSysTyp = { stoFun : () => void, tapFun : ( fraXcoNum : number ) => void }; // What: Scene System Type. Why: The card stops the scene when it leaves and hands it taps. How: This names the stop and tap functions.

// #region staSceFun

/**
 * staSceFun = Start Scene Function
 *
 * @summary
 * Starts the pixel scenes on a canvas and returns the functions that stop
 * them and hand them a tap. It reads the card's color tokens from its root,
 * paints every sprite once, and sizes the canvas to its box, one canvas pixel
 * per scene pixel, picking the composition from the box's shape and doing so
 * again whenever the box changes size. While motion is allowed it draws every
 * frame at the card's time, and keeps each tap as an event replayed at its
 * moment, so a rebuilt moment comes out the same. Under reduced motion it
 * draws the finished studio, ignores taps, and draws again only when the box
 * changes size. It expects the canvas in the page, sized by its stylesheet.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param canEleObj - Canvas Element Object: The canvas the scenes draw on.
 * @param sceOptObj - Scene Options Object: {@link SceOptTyp}
 *
 * @returns The scene's stop and tap functions.
 *
 * @example
 * ```ts
 * staSceFun(canEleObj, sceOptObj) // => { stoFun, tapFun }
 * ```
 *
*/

function staSceFun ( canEleObj : HTMLCanvasElement, sceOptObj : SceOptTyp ) : SceSysTyp {


	const canCotObj = canEleObj.getContext( '2d' )!; // What: Canvas Context Object. Why: The scenes are painted through the canvas's drawing context. How: This gets it. // What: Non-Null Note. Why: TypeScript can't see the context exists. How: Nothing else asks this canvas for a context, and a canvas returns a 2D context unless another kind was asked for first.
	const schRecObj = sceOptObj.schObj;              // What: Schedule Record Object. Why: The scene's events are read every frame. How: This keeps the schedule close at hand.



	// #region Color And Sprite Painting

	const colCacMap = new Map< string, string >();          // What: Color Cache Map. Why: Each token is read once, not every frame. How: This keeps each token's color by name.
	const rooStyObj = getComputedStyle( sceOptObj.rooEle ); // What: Root Style Object. Why: The colors are tokens on the card's root. How: This reads its computed styles.



	// #region colGetFun

	/**
	 * colGetFun = Color Get Function
	 *
	 * @summary
	 * Returns a color token's value as the card's root computes it, trimmed,
	 * so the canvas can paint with the card's own colors. The first read of
	 * each token is kept in the color cache, and later calls answer from it,
	 * so a token is read once rather than every frame.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param tokNamStr - Token Name String: The custom property's name.
	 *
	 * @returns The token's color.
	 *
	 * @example
	 * ```ts
	 * colGetFun('--tur-ink-col') // => '#2a1d17'
	 * ```
	 *
	*/

	const colGetFun = ( tokNamStr : string ) : string => colCacMap.get( tokNamStr ) ?? colCacMap.set( tokNamStr, rooStyObj.getPropertyValue( tokNamStr ).trim() ).get( tokNamStr )!; // What: Color Get Function. Why: The canvas can't read a token, so each color is looked up by its token's name. How: This returns the cached color, reading and caching it the first time. // What: Non-Null Note. Why: TypeScript can't see the value was just set. How: The map holds the key it was given on the same line.

	// #endregion colGetFun


	const palColObj = Object.fromEntries( Object.entries( SPR_TOK_OBJ ).map( ( [ keyCurStr, tokNamStr ] ) => [ keyCurStr, colGetFun( tokNamStr ) ] ) ); // What: Palette Color Object. Why: The sprites paint with the card's colors. How: This reads each sprite key's token.
	const pufColArr = [ colGetFun( '--tur-ora-col' ), colGetFun( '--tur-tan-col' ) ];                                                                   // What: Puff Color Array. Why: A puff's feathers are the turkey's orange and tan. How: This reads both. // Turkeys Orange Color = #d9792b, Turkeys Tan Color = #f0c48a
	const staColStr = colGetFun( '--tur-gol-col' );                                                                                                     // What: Star Color String. Why: A dazed turkey's stars are gold. How: This reads the token. // Turkeys Gold Color = #e9b94a

	const sprSetObj : SprSetTyp = { // What: Sprite Set Object. Why: Every sprite is painted once and drawn many times. How: This paints each from its rows.


		feaEle : griCanFun( rowGriFun( FEA_ROW_ARR ), palColObj ), // What: Feather Element. Why: The drifting feathers share one image. How: This paints it.
		hanEle : griCanFun( rowGriFun( HAN_ROW_ARR ), palColObj ), // What: Hand Element. Why: The demo's pointer is one image. How: This paints it.
		helEle : griCanFun( rowGriFun( HEL_ROW_ARR ), palColObj ), // What: Helicopter Element. Why: The helicopter is one image. How: This paints it.
		manEle : griCanFun( manGriFun(), palColObj ),              // What: Manager Element. Why: The station manager is one image. How: This paints him.
		tudEle : griCanFun( turGriFun( false ), palColObj ),       // What: Turkey-Down Element. Why: A turkey's wing is down in one frame. How: This paints that frame.
		tuuEle : griCanFun( turGriFun( true ), palColObj ),        // What: Turkey-Up Element. Why: A turkey's wing is up in the other frame. How: This paints that frame.

		carArr : CAR_TOK_ARR.map( ( tokNamStr ) => griCanFun( rowGriFun( CAR_ROW_ARR ), { // What: Car Array. Why: Each car is painted in its own color, its windows in the mall's glass. How: This paints the car once per paint. // Turkeys Glass Color = #a8cdd2


			...palColObj, // What: Palette Spread. Why: A car shares the scene's palette. How: This starts from every key's color.

			C : colGetFun( tokNamStr ),      // What: Car Paint Color. Why: Each car takes its own paint. How: This reads the car's token.
			L : colGetFun( '--tur-gla-col' ) // What: Window Color. Why: Every car's windows are glass. How: This reads the glass token. // Turkeys Glass Color = #a8cdd2


		} ) )


	};

	// #endregion Color And Sprite Painting



	// #region Pointer Easing

	const accEasFun = gsap.parseEase( gsaEasFun( 'acc' ) ); // What: Accelerate Easing Function. Why: The pointer speeds up as it leaves, like anything leaving the card. How: This turns the accelerate token's curve into a function of progress.
	const decEasFun = gsap.parseEase( gsaEasFun( 'dec' ) ); // What: Decelerate Easing Function. Why: The pointer slows as it arrives, like anything arriving on the card. How: This turns the decelerate token's curve into a function of progress.

	// #endregion Pointer Easing



	// #region Replay State

	const tapEveArr : TapEveTyp[] = []; // What: Tap Event Array. Why: Taps are replayed when a moment is rebuilt. How: This lists each tap in order.



	const simNewFun = () : SimStaTyp => ( { // What: Simulation New Function. Why: A moment is rebuilt from the start. How: This returns a fresh state with the seeded sequence restarted.


		feaArr : [],                       // What: Feather Array. Why: The feathers appear with the studio. How: This starts empty.
		malArr : [],                       // What: Mall Array. Why: The mall's turkeys drop with the helicopter. How: This starts empty.
		parArr : [],                       // What: Particle Array. Why: Puffs come with landings. How: This starts empty.
		ranFun : ranGenFun( RAN_SEE_NUM ), // What: Random Function. Why: The same moment always rebuilds the same way. How: This restarts the seeded sequence.
		simNum : 0,                        // What: Simulation Number. Why: The motion starts at the card's start. How: This is the stepped time, in seconds.
		stuArr : [],                       // What: Studio Array. Why: The studio's turkeys appear when it opens. How: This starts empty.
		tapNum : 0                         // What: Tap Number. Why: No tap has been replayed yet. How: This is the next tap to replay.


	} );


	let layRecObj = layRecFun( 16 / 9 );               // What: Layout Record Object. Why: The positions depend on the canvas's shape. How: This starts on the wide composition until the box is measured.
	let looIdeNum = 0;                                 // What: Loop Identifier Number. Why: The frame loop is cancelled when the scene stops. How: This holds the pending frame's ID.
	let simStaObj = simNewFun();                       // What: Simulation State Object. Why: The motion is stepped from a known start. How: This holds the current state.
	let staImaObj = canCotObj.createImageData( 1, 1 ); // What: Static Image Object. Why: The static is drawn from a buffer the canvas's size. How: This holds the buffer, remade when the canvas resizes.

	// #endregion Replay State



	// #region draFraFun

	/**
	 * draFraFun = Draw Frame Function
	 *
	 * @summary
	 * Draws the scene at a moment, first stepping the motion up to it in
	 * fixed slices, starting over when the moment is earlier than the last.
	 * Before the static it draws the mall, its turkeys, the helicopter with
	 * its flickering rotors while it's on screen, and the feather puffs;
	 * during the static, random gray pixels; and after it, the studio, its
	 * turkeys, the drifting feathers, the puffs, and the pointer's demo while
	 * it plays.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param curTimNum - Current Time Number: The moment to draw, in seconds.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * draFraFun(4.2) // => void
	 * ```
	 *
	*/

	const draFraFun = ( curTimNum : number ) : void => { // What: Draw Frame Function. Why: Each frame shows the scene at the card's time. How: This steps the motion to the moment and draws it.


		if ( curTimNum < simStaObj.simNum ) simStaObj = simNewFun(); // What: Rewind Branch. Why: The motion only steps forward. How: This starts over when the moment is earlier.



		while ( simStaObj.simNum + DEL_TIM_NUM <= curTimNum ) simSteFun( simStaObj, layRecObj, schRecObj, tapEveArr, pufColArr ); // What: Simulation Catch-Up Loop. Why: The motion steps in fixed slices up to the moment. How: This steps until the next slice would pass it.



		if ( curTimNum >= schRecObj.staNum && curTimNum < schRecObj.sceNum ) { // What: Static Branch. Why: Static changes the channel. How: This fills the canvas with random grays.


			const staDatArr = staImaObj.data; // What: Static Data Array. Why: Each pixel's red, green, blue, and alpha are set directly. How: This reads the buffer's bytes.


			for ( let bytIndNum = 0; bytIndNum < staDatArr.length; bytIndNum += 4 ) staDatArr.fill( Math.random() * 255, bytIndNum, bytIndNum + 3 ).fill( 255, bytIndNum + 3, bytIndNum + 4 ); // What: Static Noise Loop. Why: Static is random gray. How: This sets each pixel's three colors to one random level and its alpha to full.



			canCotObj.putImageData( staImaObj, 0, 0 ); // What: Static Put Call. Why: The noise fills the screen. How: This copies the buffer onto the canvas.



			return; // What: Static Return. Why: Nothing else shows through the static. How: This ends the frame.


		}



		const malShoBoo = curTimNum < schRecObj.staNum; // What: Mall Showing Boolean. Why: The mall shows before the static. How: This compares the moment to the static's start.


		if ( malShoBoo ) draMalFun( canCotObj, layRecObj, sprSetObj, colGetFun, curTimNum ); // What: Mall Draw Branch. Why: The first scene shows the mall. How: This draws its backdrop.

		else draStuFun( canCotObj, layRecObj, sprSetObj, colGetFun, curTimNum ); // What: Studio Draw Branch. Why: The second scene shows the studio. How: This draws its backdrop.



		[ ...( malShoBoo ? simStaObj.malArr : simStaObj.stuArr ) ].sort( ( turOneObj, turTwoObj ) => turOneObj.lanNum - turTwoObj.lanNum ).forEach( ( turCurObj ) => { // What: Turkey Draw Loop. Why: Each scene shows its own turkeys, nearer ones overlapping farther ones, and a clearing turkey fades out. How: This draws the showing scene's turkeys from the farthest landing line to the nearest, each at its opacity.


			canCotObj.globalAlpha = 1 - accEasFun( Math.min( Math.max( 1 - ( turCurObj.expNum - curTimNum ) / DEM_LEA_NUM, 0 ), 1 ) ); // What: Turkey Alpha Assignment. Why: A clearing turkey fades out, speeding up as it goes, rather than vanishing. How: This eases the share of its fade that has passed, which is 0, and the turkey opaque, until its expiry is near.


			draTurFun( canCotObj, turCurObj, sprSetObj, staColStr, curTimNum ); // What: Turkey Draw Call. Why: The turkey appears where it is. How: This draws it, its stars included.


		} );



		canCotObj.globalAlpha = 1; // What: Turkey Alpha Reset Assignment. Why: Everything after the turkeys draws opaque. How: This restores full opacity.



		if ( malShoBoo ) { // What: Helicopter Branch. Why: The helicopter crosses only the mall's sky. How: This draws it and its rotors while it's on screen.


			const helLefNum = Math.round( helXcoFun( layRecObj, schRecObj, curTimNum ) ); // What: Helicopter Left Number. Why: The helicopter is drawn on whole pixels. How: This rounds its place.
			const helTopNum = layRecObj.helNum + Math.round( Math.sin( curTimNum * 3 ) ); // What: Helicopter Top Number. Why: A hovering helicopter bobs. How: This rises and sinks a pixel on a slow wave.
			const rotLonBoo = Math.floor( curTimNum * 20 ) % 2 === 0;                     // What: Rotor Long Boolean. Why: Spinning blades flicker between two lengths. How: This alternates twenty times a second.


			if ( helLefNum > -60 && helLefNum < layRecObj.widNum + 5 ) { // What: On Screen Branch. Why: The helicopter is drawn only while it's near the canvas. How: This draws its body, main rotor, and tail rotor.


				canCotObj.drawImage( sprSetObj.helEle, helLefNum, helTopNum ); // What: Helicopter Draw Call. Why: The helicopter crosses the sky. How: This draws its body.


				canCotObj.fillStyle = colGetFun( '--tur-ink-col' ); // What: Rotor Fill Assignment. Why: The rotors are dark. How: This sets their color. // Turkeys Ink Color = #2a1d17


				canCotObj.fillRect( helLefNum + ( rotLonBoo ? 8 : 24 ), helTopNum - 1, rotLonBoo ? 54 : 22, 1 ); // What: Main Rotor Fill Call. Why: The main rotor spins over the cabin. How: This draws it long or short by turns.
				canCotObj.fillRect( helLefNum + 1, helTopNum + ( rotLonBoo ? 1 : 3 ), 1, rotLonBoo ? 6 : 2 );    // What: Tail Rotor Fill Call. Why: The tail rotor spins too. How: This draws it long or short by turns.


			}


		}

		else for ( const feaCurObj of simStaObj.feaArr ) canCotObj.drawImage( sprSetObj.feaEle, Math.round( feaCurObj.xcoNum + Math.sin( curTimNum * 1.5 + feaCurObj.phaNum ) * 4 ), Math.round( feaCurObj.ycoNum ) ); // What: Feather Draw Loop. Why: Feathers drift down the studio, swaying. How: This draws each a few pixels either side of its line.



		for ( const parCurObj of simStaObj.parArr ) { // What: Puff Draw Loop. Why: The puff's pixels fly from the impact. How: This draws each in its color.


			canCotObj.fillStyle = parCurObj.colStr; // What: Pixel Fill Assignment. Why: Each pixel has its own color. How: This sets it.


			canCotObj.fillRect( Math.round( parCurObj.xcoNum ), Math.round( parCurObj.ycoNum ), 1, 1 ); // What: Pixel Fill Call. Why: The pixel appears where it is. How: This fills it.


		}



		const demCycNum = Math.floor( ( curTimNum - schRecObj.demNum ) / DEM_CYC_NUM );                                         // What: Demo Cycle Number. Why: The pointer repeats its demo each cycle. How: This counts the cycles started, less one, below 0 before the first.
		const demLivBoo = demLivFun( tapEveArr, Math.min( curTimNum, schRecObj.demNum + demCycNum * DEM_CYC_NUM + DEM_TAP_NUM ) ); // What: Demo Live Boolean. Why: A tap ends the demos, while one after this demo's tap leaves it to finish. How: This checks for taps before the moment or this demo's tap, whichever comes first.
		const demTimNum = curTimNum - schRecObj.demNum - demCycNum * DEM_CYC_NUM;                                               // What: Demo Time Number. Why: The pointer's look follows its own demo's clock. How: This is the seconds since the current demo started.
		const demRunBoo = demCycNum >= 0 && demTimNum < DEM_TAP_NUM + DEM_PRE_NUM + DEM_LEA_NUM;                                // What: Demo Running Boolean. Why: The pointer shows only from its arrival until it has faded away. How: This checks the demo has started and its clock is within its settling, press, and exit.


		if ( demLivBoo && demRunBoo ) { // What: Pointer Draw Branch. Why: The pointer taps to show that a tap drops a turkey. How: This draws it rising into place, pressing with a spark as it taps, and fading away.


			const [ demXcoNum, demYcoNum ] = demPlaFun( layRecObj, demCycNum ); // What: Demo X-Coordinate Number. Why: The pointer taps the demo's own spot. How: This is the fingertip's left. // What: Demo Y-Coordinate Number. Why: The pointer taps the demo's own spot. How: This is the fingertip's top.

			const arrProNum = decEasFun( Math.min( demTimNum / DEM_ARR_NUM, 1 ) );                                                // What: Arrival Progress Number. Why: The pointer rises and fades in, slowing as it arrives. How: This eases its arrival's share of time on the decelerating curve.
			const hanLefNum = demXcoNum - 2;                                                                                      // What: Hand Left Number. Why: The fingertip marks where the demo's turkey drops. How: This sets the hand's left two pixels before the demo's spot, the tip's own columns.
			const leaProNum = accEasFun( Math.min( Math.max( ( demTimNum - DEM_TAP_NUM - DEM_PRE_NUM ) / DEM_LEA_NUM, 0 ), 1 ) ); // What: Leaving Progress Number. Why: The pointer fades away once it lifts from the press, speeding up as it goes. How: This eases its exit's share of time on the accelerating curve.
			const preNowBoo = demTimNum >= DEM_TAP_NUM && demTimNum < DEM_TAP_NUM + DEM_PRE_NUM;                                  // What: Press Now Boolean. Why: The pointer holds its press for a moment after the tap. How: This is true from the tap until it lifts.
			const hanTopNum = demYcoNum + Math.round( ( 1 - arrProNum ) * 3 ) + ( preNowBoo ? 1 : 0 );                            // What: Hand Top Number. Why: The pointer stands at the demo's spot, rising 3 pixels as it arrives and dipping 1 as it presses. How: This adds both to the spot's top.


			canCotObj.globalAlpha = arrProNum * ( 1 - leaProNum ); // What: Pointer Alpha Assignment. Why: The pointer fades in as it arrives and out as it leaves. How: This multiplies the two progresses.


			canCotObj.drawImage( sprSetObj.hanEle, hanLefNum, hanTopNum ); // What: Pointer Draw Call. Why: The pointer shows where the tap lands. How: This draws the hand there.


			if ( preNowBoo ) { // What: Press Spark Branch. Why: A burst around the fingertip says the tap happened. How: This draws three gold sparks above the tip while the press holds.


				canCotObj.fillStyle = staColStr; // What: Spark Fill Assignment. Why: The sparks match the dazed turkey's gold stars. How: This sets their color.


				canCotObj.fillRect( hanLefNum + 2, hanTopNum - 3, 2, 1 ); // What: Top Spark Fill Call. Why: A spark flies up from the tip. How: This draws it above the tip's two columns.
				canCotObj.fillRect( hanLefNum, hanTopNum - 2, 1, 1 );     // What: Left Spark Fill Call. Why: A spark flies up and left. How: This draws it beside the tip.
				canCotObj.fillRect( hanLefNum + 5, hanTopNum - 2, 1, 1 ); // What: Right Spark Fill Call. Why: A spark flies up and right. How: This draws it beside the tip.


			}



			canCotObj.globalAlpha = 1; // What: Alpha Reset Assignment. Why: The next frame draws everything else opaque. How: This restores full opacity.


		}


	};

	// #endregion draFraFun



	// #region Canvas Sizing

	// #region sizCanFun

	/**
	 * sizCanFun = Size Canvas Function
	 *
	 * @summary
	 * Matches the canvas to its box's current shape: picks the layout, sets
	 * the canvas's pixel size and its static buffer to the layout's, turns
	 * smoothing off again (a resize resets it), starts the motion over so the
	 * next draw rebuilds the moment in the new layout, and draws, the
	 * finished studio under reduced motion or the card's moment otherwise. A
	 * box with no size is left until the next resize.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param void - This function takes no parameters.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * sizCanFun() // => void
	 * ```
	 *
	*/

	const sizCanFun = () : void => { // What: Size Canvas Function. Why: The canvas matches its box's shape, and a new shape rebuilds the moment. How: This resizes the canvas and its buffer, restarts the motion, and draws.


		const boxRecObj = canEleObj.getBoundingClientRect(); // What: Box Rect Object. Why: The composition follows the box's shape. How: This measures the box.


		if ( !boxRecObj.width || !boxRecObj.height ) return; // What: Empty Box Guard. Why: A box with no size has no shape. How: This waits for the next resize.



		layRecObj = layRecFun( boxRecObj.width / boxRecObj.height ); // What: Layout Assignment. Why: The positions follow the new shape. How: This works out the layout.

		canEleObj.height = layRecObj.heiNum; // What: Canvas Height Assignment. Why: One canvas pixel stands for one scene pixel. How: This sets the layout's height.
		canEleObj.width  = layRecObj.widNum; // What: Canvas Width Assignment. Why: One canvas pixel stands for one scene pixel. How: This sets the layout's width.

		canCotObj.imageSmoothingEnabled = false; // What: Smoothing Off Assignment. Why: A resize resets the context, and a turned turkey would blur. How: This keeps pixels sharp.

		simStaObj = simNewFun(); // What: Simulation Reset Assignment. Why: The motion is rebuilt in the new layout. How: This starts it over, replaying to the moment on the next draw.

		staImaObj = canCotObj.createImageData( layRecObj.widNum, layRecObj.heiNum ); // What: Static Buffer Assignment. Why: The static fills the whole canvas. How: This makes a buffer its new size.


		draFraFun( sceOptObj.redMotBoo ? schRecObj.finNum : sceOptObj.timFun() ); // What: Resize Draw Call. Why: The canvas is blank after resizing. How: This draws the finished studio under reduced motion, or the current moment.


	};

	// #endregion sizCanFun


	const resObsObj = new ResizeObserver( sizCanFun ); // What: Resize Observer Object. Why: The box changes size when the screen does, as when a phone turns. How: This sizes the canvas again each time.


	resObsObj.observe( canEleObj ); // What: Resize Observe Call. Why: The canvas's box is the one watched. How: This starts watching it, which also sizes it once.

	// #endregion Canvas Sizing



	// #region Frame Loop

	const looFraFun = () : void => { // What: Loop Frame Function. Why: The scene animates every frame. How: This draws the card's moment and asks for the next frame.


		draFraFun( sceOptObj.timFun() ); // What: Frame Draw Call. Why: Each frame shows the card's moment. How: This draws it.


		looIdeNum = requestAnimationFrame( looFraFun ); // What: Next Frame Assignment. Why: The loop runs until the scene stops. How: This asks for the next frame and keeps its ID.


	};


	if ( !sceOptObj.redMotBoo ) looIdeNum = requestAnimationFrame( looFraFun ); // What: Loop Start Branch. Why: The scene animates only while motion is allowed. How: This starts the frame loop.

	// #endregion Frame Loop



	return { // What: Scene System Return. Why: The card stops the scene and hands it taps. How: This returns the two functions.


		stoFun : () => { // What: Stop Function. Why: The scene stops when the card leaves or replays. How: This cancels the frame loop and stops watching the box.


			cancelAnimationFrame( looIdeNum ); // What: Loop Cancel Call. Why: No more frames should be drawn. How: This cancels the pending one.

			resObsObj.disconnect(); // What: Observer Disconnect Call. Why: No more resizes should be handled. How: This stops watching the box.


		},

		tapFun : ( fraXcoNum : number ) => { // What: Tap Function. Why: A tap drops a turkey, except under reduced motion. How: This records the tap's moment and share of the width, which the next frame replays.


			if ( sceOptObj.redMotBoo ) return; // What: Reduced Motion Guard. Why: Under reduced motion a tap drops nothing. How: This leaves before recording it.



			tapEveArr.push({ // What: Tap Push Call. Why: The tap is replayed on the next frame. How: This records it.


				fraXcoNum, // What: Fraction X-Coordinate Number. Why: A tap keeps its share of the width when the layout changes. How: This is the tap's share across.

				timNum : sceOptObj.timFun() // What: Time Number. Why: The tap replays at its moment. How: This is the card's time, in seconds.


			});


		}


	};


}

// #endregion staSceFun

// #endregion Helpers



// #region Exports

export { staSceFun, type SceSchTyp }; // What: Named Exports. Why: The card starts the scene and builds its schedule. How: This exports the start function and the schedule's type.

// #endregion Exports


