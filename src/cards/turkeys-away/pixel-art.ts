


/**
 * pixel-art.ts = Pixel Art
 *
 * @summary
 * The Turkeys Away card's drawings as pixel grids, and the helpers that turn
 * them into images. Each sprite is written as rows of characters, one
 * character a pixel and each letter a color key the card's palette resolves:
 * the turkey with its wing up or down, the news helicopter with a turkey
 * peeking out of its open door, a parked car, a stray feather, and the
 * station manager, built from rectangles since he's too big to write out by
 * row. A tiny pixel font spells the mall's sign and the studio's ON AIR light.
 * A grid becomes a small canvas the scene draws from.
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

type PixGriTyp = string[][]; // What: Pixel Grid Type. Why: A sprite is edited pixel by pixel before it's drawn. How: This holds its rows of keys, a dot for a clear pixel.

// #endregion Types



// #region Constants

// #region Sprite Rows Subsystem

/**
 * pixel-art.ts = Sprite Rows Subsystem
 *
 * @summary
 * Each sprite below is a list of rows, every row a string of the same kind:
 * one character per pixel, a dot for a clear pixel and a letter for a color
 * key. The keys are B, the turkey's brown body; D, its darker wing; E, its
 * eye; O, its orange feathers; R, its red wattle; S, the pale skin of its
 * head; T, its tan feather tips; Y, its yellow beak and legs; G and g, the
 * helicopter's paint and its shade; L, windows such as the helicopter's; Q,
 * its dark doorway; Z, its cream stripe; C, a car's paint, which each car
 * sets; and K, dark ink such as a car's tires and the helicopter's skids.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



const CAR_ROW_ARR = [ // What: Car Row Array. Why: Parked cars set the scene as a mall's parking lot. How: Each row is one line of the sprite, its paint key filled per car.


	'....CCCCCCCC.......',
	'...CLLLCCLLLC......',
	'.CCCCCCCCCCCCCCC...',
	'CCCCCCCCCCCCCCCCC..',
	'CKKCCCCCCCCCKKCCC..',
	'.KK.........KK.....'


];

const FEA_ROW_ARR = [ // What: Feather Row Array. Why: Stray feathers drift down the studio after the drop. How: Each row is one line of the tiny sprite.


	'.O',
	'OT',
	'T.'


];

const HEL_ROW_ARR = [ // What: Helicopter Row Array. Why: The station's helicopter carries the turkeys over the mall, one peeking out of its open door. How: Each row is one line of the sprite, its rotor drawn separately so it can spin.


	'..................................KK................',
	'..............................GGGGGGGGGGGG..........',
	'...........................GGGGGGGGGGGGGGGGGG.......',
	'KK.......................GGGGGGGGGGGGGGLLLLLLLLG....',
	'KKK....................GGGGGGGGGGGGGGGLLLLLLLLLLGG..',
	'.KKK..................GGGGgggggggGGGGGLLLLLLLLLLLGG.',
	'..KGGGGGGGGGGGGGGGGGGGGGGGgQQQSSgGGGGGLLLLLLLLLLLGG.',
	'..GGGGGGGGGGGGGGGGGGGGGGGGgQQSESYGGGGGGLLLLLLLLLLGG.',
	'...ZZZZZZZZZZZZZZZZZZZZGGGgQQQRQgGGGGGGGGGGGGGGGGGG.',
	'....gggggggggggggggggGGGGGgQQQQQgGGGGGZZZZZZZZZZZZ..',
	'.....................GGGGGgggggggGGGGGGGGGGGGGGGGG..',
	'......................GGGGGGGGGGGGGGGGGGGGGGGGGGG...',
	'.......................ggggggggggggggggggggggggg....',
	'..........................K...........K.............',
	'..........................K...........K.............',
	'.....................KKKKKKKKKKKKKKKKKKKKKKKKKK.....'


];

const TUR_ROW_ARR = [ // What: Turkey Row Array. Why: The turkey is the card's star, drawn side on with its tail fanned behind it. How: Each row is one line of the sprite, the wing added on top by turGriFun.


	'....OOOOO.........',
	'..OOTTTTTOO...SS..',
	'.OTTOOOOOTTO.SSSS.',
	'OTOOBBBBBOOTOSESSY',
	'OTOBBBBBBBOTOSSSYY',
	'OTOBBBBBBBBOSSRR..',
	'OTOBBBBBBBBBBSRR..',
	'.OOBBBBBBBBBBBR...',
	'..OBBBBBBBBBBB....',
	'...BBBBBBBBBBB....',
	'...BBBBBBBBBBB....',
	'....BBBBBBBBB.....',
	'.....BBBBBBB......',
	'......Y...Y.......',
	'......Y...Y.......',
	'.....YY..YY.......'


];

const WIN_DOW_ARR = [ // What: Wing Down Array. Why: A flapping turkey alternates its wing between two frames. How: Each row is one line of the lowered wing.


	'.DDDDD..',
	'DDDDDDD.',
	'.DDDDDD.',
	'..DDDD..'


];

const WIN_RAI_ARR = [ // What: Wing Raised Array. Why: A flapping turkey alternates its wing between two frames. How: Each row is one line of the raised wing.


	'..DDDD..',
	'.DDDDDD.',
	'DDDDDDD.',
	'.DDDDD..'


];

// #endregion Sprite Rows Subsystem



// #region GLY_ROW_OBJ

/**
 * GLY_ROW_OBJ = Glyph Row Object
 *
 * @summary
 * The letters the scene's signs spell, each a list of five rows of the same
 * kind: one character per pixel, a 1 for ink and a 0 for a gap. Most letters
 * are three pixels wide, and the wide ones (M and N) take more.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const GLY_ROW_OBJ : Record< string, string[] > = { // What: Glyph Row Object. Why: The mall's sign and the ON AIR light are spelled in pixels. How: Each key is a letter, holding its five rows.


	' ' : [ '00',    '00',    '00',    '00',    '00'    ],
	A   : [ '010',   '101',   '111',   '101',   '101'   ],
	D   : [ '110',   '101',   '101',   '101',   '110'   ],
	E   : [ '111',   '100',   '110',   '100',   '111'   ],
	I   : [ '111',   '010',   '010',   '010',   '111'   ],
	L   : [ '100',   '100',   '100',   '100',   '111'   ],
	M   : [ '10001', '11011', '10101', '10001', '10001' ],
	N   : [ '1001',  '1101',  '1011',  '1001',  '1001'  ],
	O   : [ '111',   '101',   '101',   '101',   '111'   ],
	P   : [ '111',   '101',   '111',   '100',   '100'   ],
	R   : [ '110',   '101',   '110',   '101',   '101'   ]


};

// #endregion GLY_ROW_OBJ

// #endregion Constants



// #region Helpers

// #region draTexFun

/**
 * draTexFun = Draw Text Function
 *
 * @summary
 * Spells a word in the pixel font on a canvas, one letter after another with
 * a one-pixel gap, its top left corner at the point given. It spells only the
 * letters GLY_ROW_OBJ holds.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param canCotObj - Canvas Context Object: The context to draw on.
 * @param texCurStr - Text Current String: The word to spell.
 * @param lefPixNum - Left Pixel Number: Where the text starts across.
 * @param topPixNum - Top Pixel Number: Where the text starts down.
 * @param texColStr - Text Color String: The color the letters are drawn in.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * draTexFun(canCotObj, 'ON AIR', 14, 13, '#ffffff') // => void
 * ```
 *
*/

function draTexFun ( canCotObj : CanvasRenderingContext2D, texCurStr : string, lefPixNum : number, topPixNum : number, texColStr : string ) : void {


	canCotObj.fillStyle = texColStr; // What: Fill Style Assignment. Why: Every letter shares the text's color. How: This sets it once.



	let curXcoNum = lefPixNum; // What: Current X-Coordinate Number. Why: Each letter starts where the last one ended. How: This starts at the text's left edge.


	for ( const chaCurStr of texCurStr ) { // What: Letter Loop. Why: The word is spelled one letter at a time. How: This walks its characters.


		const glyRowArr = GLY_ROW_OBJ[ chaCurStr ]; // What: Glyph Row Array. Why: Each letter has its own rows. How: This looks them up.


		glyRowArr.forEach( ( rowCurStr, rowIndNum ) => [ ...rowCurStr ].forEach( ( bitCurStr, colIndNum ) => { if ( bitCurStr === '1' ) canCotObj.fillRect( curXcoNum + colIndNum, topPixNum + rowIndNum, 1, 1 ); } ) ); // What: Glyph Fill Call. Why: The letter's ink pixels are drawn. How: This fills each 1 in its rows.


		curXcoNum += glyRowArr[ 0 ].length + 1; // What: Next Letter Assignment. Why: The next letter follows after a gap. How: This moves past the letter's width and one pixel.


	}


}

// #endregion draTexFun



const empGriFun = ( widPixNum : number, heiPixNum : number ) : PixGriTyp => Array.from( { length : heiPixNum }, () => Array< string >( widPixNum ).fill( '.' ) ); // What: Empty Grid Function. Why: Some sprites are built up from a blank grid. How: This returns a grid of clear pixels at the size given.



type PalColTyp = Record< string, string >; // What: Palette Color Type. Why: Every grid key resolves to one color. How: This maps a key to a CSS color.

// #region griCanFun

/**
 * griCanFun = Grid Canvas Function
 *
 * @summary
 * Paints a grid onto a new canvas its own size, one canvas pixel per grid
 * pixel, each key in the palette's color and clear pixels left transparent.
 * A key missing from the palette paints magenta, so a typo shows at once.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param souGriArr - Source Grid Array: The sprite to paint.
 * @param palColObj - Palette Color Object: The color each key resolves to.
 *
 * @returns The painted canvas.
 * @see {@link sprCanEle}
 *
 * @example
 * ```ts
 * griCanFun(rowGriFun(FEA_ROW_ARR), palColObj) // => a 2 by 3 canvas
 * ```
 *
*/

function griCanFun ( souGriArr : PixGriTyp, palColObj : PalColTyp ) : HTMLCanvasElement {


	const sprCanEle = document.createElement( 'canvas' ); // What: Sprite Canvas Element. Why: The scene draws each sprite from a ready-made image. How: This creates the canvas it's painted on.


	sprCanEle.width  = souGriArr[ 0 ].length; // What: Canvas Width Assignment. Why: One canvas pixel stands for one grid pixel. How: This matches the grid's width.
	sprCanEle.height = souGriArr.length;      // What: Canvas Height Assignment. Why: One canvas pixel stands for one grid pixel. How: This matches the grid's height.


	const sprCotObj = sprCanEle.getContext( '2d' )!; // What: Sprite Context Object. Why: The pixels are painted through the canvas's drawing context. How: This gets it. // What: Non-Null Note. Why: TypeScript can't see the context exists. How: A new canvas always offers a 2D context.


	souGriArr.forEach( ( rowCurArr, rowIndNum ) => rowCurArr.forEach( ( keyCurStr, colIndNum ) => { // What: Pixel Paint Call. Why: Each colored pixel is filled in its palette's color. How: This walks the grid, skipping clear pixels.


		if ( keyCurStr === '.' ) return; // What: Clear Pixel Guard. Why: A clear pixel stays transparent. How: This skips it.



		sprCotObj.fillStyle = palColObj[ keyCurStr ] ?? '#ff00ff'; // What: Fill Style Assignment. Why: Each key paints its own color, and a missing key should stand out. How: This picks the palette's color, or magenta.


		sprCotObj.fillRect( colIndNum, rowIndNum, 1, 1 ); // What: Pixel Fill Call. Why: The pixel takes its color. How: This fills one canvas pixel.


	} ) );



	return sprCanEle; // What: Sprite Canvas Return. Why: The scene draws from the painted canvas. How: This returns it.


}

// #endregion griCanFun



// #region manGriFun

/**
 * manGriFun = Manager Grid Function
 *
 * @summary
 * Returns the station manager's grid, 28 pixels wide and 56 tall, built from
 * rectangles in drawing order: one hand raised as if swearing an oath, a bald
 * head with a gray fringe, worried brows and a sheepish mouth, a three-piece
 * suit with a red tie, a vest, buttons, and a watch chain, his other arm at
 * his side, trousers, shoes, and a stray turkey feather on his head. His keys
 * are P, his skin; p, its shade; H, his hair; W, his shirt; r, his tie; N,
 * his suit; n, its shade; V, his vest; y, his watch chain; and K, his dark
 * details, with O and T for the feather.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The station manager's grid.
 * @see {@link manGriArr}
 *
 * @example
 * ```ts
 * manGriFun() // => a 28 by 56 grid
 * ```
 *
*/

function manGriFun () : PixGriTyp {


	const manGriArr = empGriFun( 28, 56 ); // What: Manager Grid Array. Why: The station manager is built up on a blank grid. How: This makes one his size.


	const recFilFun = ( keyCurStr : string, lefEdgNum : number, topEdgNum : number, rigEdgNum : number, botEdgNum : number ) => { for ( let rowIndNum = topEdgNum; rowIndNum <= botEdgNum; rowIndNum++ ) for ( let colIndNum = lefEdgNum; colIndNum <= rigEdgNum; colIndNum++ ) manGriArr[ rowIndNum ][ colIndNum ] = keyCurStr; }; // What: Rectangle Fill Function. Why: The figure is drawn as rectangles. How: This fills every pixel from the left and top edges to the right and bottom ones, inclusive.



	// #region Raised Arm

	recFilFun( 'N', 1, 8, 4, 25 ); // What: Sleeve Fill Call. Why: His raised arm is in his suit. How: This draws the sleeve up from his shoulder.
	recFilFun( 'n', 4, 8, 4, 25 ); // What: Sleeve Shade Fill Call. Why: The sleeve's inner edge is in shadow. How: This shades its right column.
	recFilFun( 'W', 1, 7, 4, 7 );  // What: Cuff Fill Call. Why: A shirt cuff shows at his wrist. How: This draws one white row above the sleeve.
	recFilFun( 'P', 1, 2, 4, 6 );  // What: Hand Fill Call. Why: His palm is raised as if swearing an oath. How: This draws the hand above the cuff.
	recFilFun( 'P', 1, 1, 1, 1 );  // What: First Finger Fill Call. Why: Fingers part the hand's top edge. How: This adds one fingertip.
	recFilFun( 'P', 3, 1, 3, 1 );  // What: Second Finger Fill Call. Why: Fingers part the hand's top edge. How: This adds a second fingertip.
	recFilFun( 'P', 5, 4, 5, 5 );  // What: Thumb Fill Call. Why: A thumb juts from the hand's side. How: This adds two pixels beside it.

	// #endregion Raised Arm



	// #region Head

	recFilFun( 'P', 9, 2, 18, 3 );    // What: Dome Fill Call. Why: His bald head rounds off at the top. How: This draws the top of the dome.
	recFilFun( 'P', 8, 4, 19, 19 );   // What: Head Fill Call. Why: The head is the figure's focus. How: This draws its main block.
	recFilFun( 'P', 7, 12, 20, 17 );  // What: Jowl Fill Call. Why: His cheeks widen toward the jaw. How: This widens the lower face by a pixel each side.
	recFilFun( '.', 8, 4, 8, 4 );     // What: Top Left Corner Clear Call. Why: A head has no square corners. How: This clears the block's top left pixel.
	recFilFun( '.', 19, 4, 19, 4 );   // What: Top Right Corner Clear Call. Why: A head has no square corners. How: This clears the block's top right pixel.
	recFilFun( '.', 8, 19, 8, 19 );   // What: Bottom Left Corner Clear Call. Why: A head has no square corners. How: This clears the block's bottom left pixel.
	recFilFun( '.', 19, 19, 19, 19 ); // What: Bottom Right Corner Clear Call. Why: A head has no square corners. How: This clears the block's bottom right pixel.
	recFilFun( 'H', 7, 8, 8, 12 );    // What: Left Fringe Fill Call. Why: A gray fringe rings the bald top. How: This draws the left side's hair.
	recFilFun( 'H', 19, 8, 20, 12 );  // What: Right Fringe Fill Call. Why: A gray fringe rings the bald top. How: This draws the right side's hair.
	recFilFun( 'p', 6, 10, 6, 14 );   // What: Left Ear Fill Call. Why: His ears stick out past the fringe. How: This draws the left ear in the skin's shade.
	recFilFun( 'p', 21, 10, 21, 14 ); // What: Right Ear Fill Call. Why: His ears stick out past the fringe. How: This draws the right ear in the skin's shade.
	recFilFun( 'H', 10, 8, 12, 8 );   // What: Left Brow Fill Call. Why: Worried brows sell his sheepish look. How: This draws the left brow.
	recFilFun( 'H', 15, 8, 17, 8 );   // What: Right Brow Fill Call. Why: Worried brows sell his sheepish look. How: This draws the right brow.
	recFilFun( 'H', 12, 7, 12, 7 );   // What: Left Brow Lift Fill Call. Why: Brows raised at their inner ends read as worry. How: This lifts the left brow's inner end.
	recFilFun( 'H', 15, 7, 15, 7 );   // What: Right Brow Lift Fill Call. Why: Brows raised at their inner ends read as worry. How: This lifts the right brow's inner end.
	recFilFun( 'W', 10, 10, 12, 11 ); // What: Left Eye White Fill Call. Why: Wide eyes look caught out. How: This draws the left eye's white.
	recFilFun( 'K', 11, 10, 11, 11 ); // What: Left Pupil Fill Call. Why: He looks straight out of the screen. How: This centers the left pupil.
	recFilFun( 'W', 15, 10, 17, 11 ); // What: Right Eye White Fill Call. Why: Wide eyes look caught out. How: This draws the right eye's white.
	recFilFun( 'K', 16, 10, 16, 11 ); // What: Right Pupil Fill Call. Why: He looks straight out of the screen. How: This centers the right pupil.
	recFilFun( 'p', 13, 12, 14, 14 ); // What: Nose Fill Call. Why: A nose gives the face shape. How: This draws its bridge in the skin's shade.
	recFilFun( 'p', 12, 14, 12, 14 ); // What: Left Nostril Fill Call. Why: The nose widens at its base. How: This adds its left side.
	recFilFun( 'p', 15, 14, 15, 14 ); // What: Right Nostril Fill Call. Why: The nose widens at its base. How: This adds its right side.
	recFilFun( 'K', 11, 16, 16, 16 ); // What: Mouth Fill Call. Why: A flat, tight mouth reads as sheepish. How: This draws a line across the lower face.
	recFilFun( 'K', 10, 17, 10, 17 ); // What: Left Mouth Corner Fill Call. Why: Corners turned down finish the look. How: This drops the mouth's left end.
	recFilFun( 'K', 17, 17, 17, 17 ); // What: Right Mouth Corner Fill Call. Why: Corners turned down finish the look. How: This drops the mouth's right end.
	recFilFun( 'p', 9, 18, 18, 18 );  // What: Jaw Shade Fill Call. Why: A shaded jawline sets the head apart from the collar. How: This shades the row above the chin's corners.

	// #endregion Head



	// #region Suit

	recFilFun( 'W', 11, 20, 16, 22 ); // What: Collar Fill Call. Why: His shirt collar shows under the chin. How: This draws it.
	recFilFun( 'r', 13, 21, 14, 22 ); // What: Knot Fill Call. Why: A tie knot sits in the collar. How: This draws it in the tie's red.
	recFilFun( 'N', 3, 22, 24, 40 );  // What: Jacket Fill Call. Why: He's in a three-piece suit. How: This draws the jacket's body.
	recFilFun( 'N', 2, 28, 25, 38 );  // What: Belly Fill Call. Why: A station manager has a comfortable middle. How: This widens the jacket by a pixel each side.
	recFilFun( '.', 3, 22, 3, 22 );   // What: Left Shoulder Clear Call. Why: Shoulders slope rather than square off. How: This clears the jacket's top left pixel.
	recFilFun( '.', 24, 22, 24, 22 ); // What: Right Shoulder Clear Call. Why: Shoulders slope rather than square off. How: This clears the jacket's top right pixel.
	recFilFun( 'V', 9, 23, 18, 39 );  // What: Vest Fill Call. Why: The vest is the suit's third piece. How: This draws it inside the jacket's opening.
	recFilFun( 'W', 11, 23, 16, 26 ); // What: Shirt Fill Call. Why: His shirt shows above the vest. How: This draws a white block of shirt.
	recFilFun( 'r', 13, 23, 14, 34 ); // What: Tie Fill Call. Why: The red tie runs down his front. How: This draws its narrow length.
	recFilFun( 'r', 12, 28, 15, 32 ); // What: Tie Blade Fill Call. Why: A tie widens toward its end. How: This draws the wide blade.
	recFilFun( 'n', 8, 23, 8, 39 );   // What: Left Lapel Fill Call. Why: The jacket's lapels frame the vest. How: This draws the left edge in the suit's shade.
	recFilFun( 'n', 19, 23, 19, 39 ); // What: Right Lapel Fill Call. Why: The jacket's lapels frame the vest. How: This draws the right edge in the suit's shade.
	recFilFun( 'K', 17, 28, 17, 28 ); // What: Top Button Fill Call. Why: The vest buttons up. How: This draws its top button.
	recFilFun( 'K', 17, 32, 17, 32 ); // What: Middle Button Fill Call. Why: The vest buttons up. How: This draws its middle button.
	recFilFun( 'K', 17, 36, 17, 36 ); // What: Bottom Button Fill Call. Why: The vest buttons up. How: This draws its bottom button.
	recFilFun( 'y', 10, 34, 12, 34 ); // What: Watch Chain Fill Call. Why: A gold watch chain suits an old-fashioned boss. How: This draws it across the vest.
	recFilFun( 'y', 10, 33, 10, 33 ); // What: Watch Chain Hook Fill Call. Why: The chain hangs from a button hole. How: This draws its end rising.
	recFilFun( 'N', 23, 23, 26, 42 ); // What: Hanging Sleeve Fill Call. Why: His other arm hangs at his side. How: This draws the sleeve down the jacket's right.
	recFilFun( 'n', 23, 23, 23, 42 ); // What: Hanging Sleeve Shade Fill Call. Why: The arm's inner edge is in shadow. How: This shades its left column.
	recFilFun( 'W', 23, 42, 26, 42 ); // What: Hanging Cuff Fill Call. Why: A shirt cuff shows at his wrist. How: This draws one white row.
	recFilFun( 'P', 23, 43, 26, 46 ); // What: Hanging Hand Fill Call. Why: His hand rests at his side. How: This draws it below the cuff.
	recFilFun( 'K', 7, 40, 20, 40 );  // What: Belt Fill Call. Why: A belt marks where the vest meets his trousers. How: This draws a dark line across.
	recFilFun( 'n', 7, 41, 12, 52 );  // What: Left Leg Fill Call. Why: His trousers match the suit's shade. How: This draws the left leg.
	recFilFun( 'n', 15, 41, 20, 52 ); // What: Right Leg Fill Call. Why: His trousers match the suit's shade. How: This draws the right leg.
	recFilFun( 'K', 6, 53, 12, 55 );  // What: Left Shoe Fill Call. Why: Dark shoes ground the figure. How: This draws the left shoe.
	recFilFun( 'K', 15, 53, 21, 55 ); // What: Right Shoe Fill Call. Why: Dark shoes ground the figure. How: This draws the right shoe.

	// #endregion Suit



	// #region Feather

	recFilFun( 'O', 17, 0, 17, 0 ); // What: Feather Tip Fill Call. Why: A stray turkey feather landed on his head. How: This draws the feather's tip.
	recFilFun( 'O', 16, 1, 17, 2 ); // What: Feather Fill Call. Why: A stray turkey feather landed on his head. How: This draws the feather's body.
	recFilFun( 'T', 16, 3, 16, 3 ); // What: Feather Quill Fill Call. Why: The feather's quill sticks into the dome. How: This draws it in the feathers' tan.

	// #endregion Feather



	return manGriArr; // What: Manager Grid Return. Why: The caller paints the figure. How: This returns the grid.


}

// #endregion manGriFun



// #region rowGriFun

/**
 * rowGriFun = Row Grid Function
 *
 * @summary
 * Turns a sprite's rows of keys into a grid, one cell per character, padding
 * each row shorter than the longest with clear pixels (dots).
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param rowStrArr - Row String Array: The sprite's rows.
 *
 * @returns The sprite's grid.
 *
 * @example
 * ```ts
 * rowGriFun(FEA_ROW_ARR) // => a 2 by 3 grid
 * ```
 *
*/

const rowGriFun = ( rowStrArr : string[] ) : PixGriTyp => rowStrArr.map( ( rowCurStr ) => rowCurStr.padEnd( Math.max( ...rowStrArr.map( ( rowLenStr ) => rowLenStr.length ) ), '.' ).split( '' ) ); // What: Row Grid Function. Why: A sprite written as rows is edited as a grid. How: This splits each row into its keys, padding short rows with clear pixels.

// #endregion rowGriFun



// #region texWidFun

/**
 * texWidFun = Text Width Function
 *
 * @summary
 * Returns a word's width in the pixel font: each letter's width plus a
 * one-pixel gap between letters, none after the last. It expects every
 * letter to have a glyph.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param texCurStr - Text Current String: The word to measure.
 *
 * @returns The word's width, in pixels.
 *
 * @example
 * ```ts
 * texWidFun('ON AIR') // => the sign's width in pixels
 * ```
 *
*/

const texWidFun = ( texCurStr : string ) : number => [ ...texCurStr ].reduce( ( widSumNum, chaCurStr ) => widSumNum + GLY_ROW_OBJ[ chaCurStr ][ 0 ].length + 1, 0 ) - 1; // What: Text Width Function. Why: A sign is sized to its words. How: This adds each letter's width and a one-pixel gap between letters.

// #endregion texWidFun



// #region turGriFun

/**
 * turGriFun = Turkey Grid Function
 *
 * @summary
 * Returns the turkey's grid with its wing drawn on, raised or lowered, the two
 * frames a flapping turkey alternates between. The raised wing reaches past
 * the turkey's back.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param winRaiBoo - Wing Raised Boolean: Whether the wing is raised.
 *
 * @returns The turkey's grid, wing drawn on.
 * @see {@link turGriArr}
 *
 * @example
 * ```ts
 * turGriFun(true) // => the turkey with its wing up
 * ```
 *
*/

function turGriFun ( winRaiBoo : boolean ) : PixGriTyp {


	const turGriArr = rowGriFun( TUR_ROW_ARR );                           // What: Turkey Grid Array. Why: The wing is drawn onto the turkey's body. How: This turns the turkey's rows into a grid.
	const winGriArr = rowGriFun( winRaiBoo ? WIN_RAI_ARR : WIN_DOW_ARR ); // What: Wing Grid Array. Why: Each frame has its own wing. How: This turns the chosen wing's rows into a grid.
	const winTopNum = winRaiBoo ? 1 : 7;                                  // What: Wing Top Number. Why: A raised wing sits high on the back, a lowered one on the side. How: This is the row the wing starts on.


	winGriArr.forEach( ( rowCurArr, rowIndNum ) => rowCurArr.forEach( ( keyCurStr, colIndNum ) => { if ( keyCurStr !== '.' ) turGriArr[ winTopNum + rowIndNum ][ 5 + colIndNum ] = keyCurStr; } ) ); // What: Wing Draw Call. Why: The wing covers part of the body. How: This copies the wing's colored pixels onto the turkey, five columns in.


	if ( winRaiBoo ) turGriArr[ 0 ].splice( 6, 2, 'D', 'D' ); // What: Wing Tip Call. Why: A raised wing pokes above the turkey's back. How: This overwrites two pixels of the top row with wing pixels.



	return turGriArr; // What: Turkey Grid Return. Why: The caller paints this frame. How: This returns the grid.


}

// #endregion turGriFun

// #endregion Helpers



// #region Exports

export { CAR_ROW_ARR, draTexFun, FEA_ROW_ARR, griCanFun, HEL_ROW_ARR, manGriFun, rowGriFun, texWidFun, turGriFun }; // What: Named Exports. Why: The scene draws the card's sprites and signs. How: This exports the sprite rows, the grid builders and painters, and the pixel font's helpers.

// #endregion Exports


