


/**
 * card-data.ts = Card Data
 *
 * @summary
 * The catalog of every greeting card the site offers, in the order the
 * Gallery shows them, as plain data, and the occasions they're grouped by.
 * It holds no components or images, so the build can read it too: it writes
 * each card's own page from it, carrying the card's title, description, and
 * link preview. ui/cards.ts adds each card's component and tile preview to
 * make the catalog the pages read.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type OccNamTyp = 'Birthday' | 'Family' | 'Holiday'; // What: Occasion Name Type. Why: Every card belongs to one occasion the Gallery can filter by. How: This lists the three occasion names.



type CarDatTyp = { // What: Card Data Type. Why: Every card is described the same way wherever it's shown or built. How: This names each field a card's data holds.


	altStr : string,    // What: Alternative String. Why: The card's images need a description for screen readers. How: Each tile's preview and the card's link preview read it as their alt text.
	cusBoo : boolean,   // What: Customizable Boolean. Why: Only some cards can show a recipient's name. How: The share dialog offers its name field when this is true, and adds the name to the card's link as ?name=.
	desStr : string,    // What: Description String. Why: A tile says what the card is like. How: The tile shows it under the title.
	froBoo : boolean,   // What: From Boolean. Why: Only some cards can be signed with the sender's name. How: The share dialog offers its sender field when this is true, and adds the name to the card's link as ?from=.
	lisBoo : boolean,   // What: Listed Boolean. Why: A card can live at its own address without being shown in the Gallery or on Home. How: Only cards with this true are listed.
	occStr : OccNamTyp, // What: Occasion String. Why: The Gallery groups cards by occasion. How: This names the card's occasion.
	seaStr : string,    // What: Search String. Why: A card's own page needs a search and link preview description of 120 to 125 characters, which the tile's shorter description doesn't fill. How: The card's built page carries it, and the card's page swaps it into the description tag while it shows.
	sluStr : string,    // What: Slug String. Why: Every card has its own address. How: The card opens at this path, such as /happy-birthday, and its link preview image is named after it.
	titStr : string     // What: Title String. Why: Every card has a name. How: Tiles, the share dialog, the card's page title, and its link preview show it.


};

// #endregion Types



// #region Constants

const OCC_NAM_ARR : OccNamTyp[] = [ 'Birthday', 'Family', 'Holiday' ]; // What: Occasion Name Array. Why: The Gallery's filter offers every occasion in a fixed order. How: The filter renders a button for each, after All.



// #region CAR_DAT_ARR

/**
 * CAR_DAT_ARR = Card Data Array
 *
 * @summary
 * Every card the site offers, one row per card in the order the Gallery
 * lists them. Each row has the same fields, described one by one on
 * CarDatTyp above: altStr, cusBoo, desStr, froBoo, lisBoo, occStr, seaStr,
 * sluStr, and titStr. The Father's Day prank stays unlisted, reachable only
 * by its own address. Both Christmas cards play one component: the listed
 * one is the snowy scene alone, and the unlisted prank, made for the maker's
 * own family, plays the fake hack first.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const CAR_DAT_ARR : CarDatTyp[] = [ // What: Card Data Array. Why: Every page that shows or opens a card, and the build that writes each card's page, read the same catalog. How: Each row describes one card.


	{ // What: Happy Birthday Card Row. Why: The birthday card can greet its recipient by name. How: Its link takes the name as ?name=.


		altStr : 'The Happy Birthday card, with its greeting over a festive scene.',
		cusBoo : true,
		desStr : 'An animated birthday card with confetti, balloons, and a message, made out to them by name.',
		froBoo : false,
		lisBoo : true,
		occStr : 'Birthday',
		seaStr : 'Send an animated Happy Birthday card with confetti, balloons, and their own name on it. Free to share with a single link.',
		sluStr : 'happy-birthday',
		titStr : 'Happy Birthday'


	},

	{ // What: Mother's Day Card Row. Why: The Mother's Day card celebrates mothers. How: Its page plays the card full screen.


		altStr : "The Mother's Day card's closing mosaic of family photos under its greeting.",
		cusBoo : false,
		desStr : 'A heartfelt thank-you to mothers, typed line by line, with family photos opening in hearts.',
		froBoo : false,
		lisBoo : true,
		occStr : 'Family',
		seaStr : "Send an animated Mother's Day card that thanks mom for everything, with heartfelt words and family photos. Free to share.",
		sluStr : 'mothers-day',
		titStr : "Mother's Day"


	},

	{ // What: Father's Day Card Row. Why: The Father's Day card celebrates fathers. How: Its page plays the card full screen.


		altStr : "The Father's Day card's closing mosaic of family photos under its greeting.",
		cusBoo : false,
		desStr : 'A heartfelt thank-you to fathers, typed line by line, with family photos opening in hearts.',
		froBoo : false,
		lisBoo : true,
		occStr : 'Family',
		seaStr : "Send an animated Father's Day card that thanks dad for everything, with heartfelt words and family photos. Free to share.",
		sluStr : 'fathers-day',
		titStr : "Father's Day"


	},

	{ // What: Fourth Of July Card Row. Why: The Fourth of July card celebrates Independence Day. How: Its page plays the card full screen.


		altStr : 'The Fourth of July card, with its greeting under a sky of fireworks.',
		cusBoo : false,
		desStr : 'An Independence Day celebration with fireworks and patriotic animations.',
		froBoo : false,
		lisBoo : true,
		occStr : 'Holiday',
		seaStr : 'Send an animated Fourth of July card with fireworks and patriotic flair to celebrate Independence Day. Free to share by link.',
		sluStr : 'fourth-of-july',
		titStr : 'Fourth of July'


	},

	{ // What: Happy Halloween Card Row. Why: The Halloween card brings a spooky greeting. How: Its page plays the card full screen.


		altStr : 'The Happy Halloween card, with its greeting in a spooky night scene.',
		cusBoo : false,
		desStr : 'A spooky Halloween card with eerie animations and effects.',
		froBoo : false,
		lisBoo : true,
		occStr : 'Holiday',
		seaStr : 'Send an animated Happy Halloween card with spooky effects and eerie animations to all your favorite ghouls. Free to share.',
		sluStr : 'happy-halloween',
		titStr : 'Happy Halloween'


	},

	{ // What: Happy Thanksgiving Card Row. Why: The Thanksgiving card brings a festive greeting. How: Its page plays the card full screen.


		altStr : 'The Happy Thanksgiving card, with its greeting in an autumn scene.',
		cusBoo : false,
		desStr : 'A festive Thanksgiving card with warm, autumn animations and effects.',
		froBoo : false,
		lisBoo : true,
		occStr : 'Holiday',
		seaStr : 'Send an animated Happy Thanksgiving card with warm autumn colors and festive animations. Free to share with a single link.',
		sluStr : 'happy-thanksgiving',
		titStr : 'Happy Thanksgiving'


	},

	{ // What: Merry Christmas Card Row. Why: The Christmas card's snowy scene is listed on its own, made out to them by name and signed with the sender's. How: Its link takes the names as ?name= and ?from=.


		altStr : 'The Merry Christmas card, with its greeting over a snowy cabin.',
		cusBoo : true,
		desStr : 'A snowy cabin with snow falling, wishing them a Merry Christmas by name and signed with yours.',
		froBoo : true,
		lisBoo : true,
		occStr : 'Holiday',
		seaStr : 'Send an animated Merry Christmas card with snow falling over a cozy cabin, made out to them and signed by you. Free to share.',
		sluStr : 'merry-christmas',
		titStr : 'Merry Christmas'


	},

	{ // What: Father's Day Special Card Row. Why: A playful second Father's Day card was never listed in TechGeek.support's gallery. How: It keeps its own address but stays out of the Gallery and Home.


		altStr : "The special Father's Day card, with its playful thank-you to fathers.",
		cusBoo : false,
		desStr : "A playful Father's Day card for a dad with a wild side.",
		froBoo : false,
		lisBoo : false,
		occStr : 'Family',
		seaStr : "A playful animated Father's Day card for a dad with a wild side, coded by hand and shared with a single link. Free to send.",
		sluStr : 'fathers-day-prank',
		titStr : "Father's Day Special"


	},

	{ // What: Christmas Prank Card Row. Why: The full Christmas card, a fake hack before the snowy greeting, was made for the maker's own family, so it stays unlisted. How: It keeps its own address, and plays the Christmas card with its prank flag set.


		altStr : 'The Christmas Prank card, with its greeting over a snowy cabin.',
		cusBoo : true,
		desStr : 'A prank Christmas card: a fake hacked screen that glitches into a snowy cabin, made out to them by name.',
		froBoo : true,
		lisBoo : false,
		occStr : 'Holiday',
		seaStr : 'A prank Christmas card that opens on a fake hack and glitches into a snowy cabin greeting, coded by hand. Free to share.',
		sluStr : 'merry-christmas-prank',
		titStr : 'Christmas Prank'


	}


];

// #endregion CAR_DAT_ARR

// #endregion Constants



// #region Exports

export { CAR_DAT_ARR, OCC_NAM_ARR, type CarDatTyp, type OccNamTyp }; // What: Named Exports. Why: The card catalog, the Gallery, and the build all read the card data and its types. How: This exports the data, the occasion list, and both types.

// #endregion Exports


