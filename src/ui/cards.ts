


// #region Imports

import birPreUrl from '../assets/happy-birthday-card-preview-image.webp';     // What: Birthday Preview URL. Why: The Happy Birthday card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import chrPreUrl from '../assets/christmas-card-preview-image.webp';          // What: Christmas Preview URL. Why: The Merry Christmas card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import fatPreUrl from '../assets/fathers-day-card-preview-image.webp';        // What: Father's Preview URL. Why: The Father's Day cards' tiles show a still of them. How: Vite fingerprints the file and hands back its address.
import fouPreUrl from '../assets/fourth-of-july-card-preview-image.webp';     // What: Fourth Preview URL. Why: The Fourth of July card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import halPreUrl from '../assets/happy-halloween-card-preview-image.webp';    // What: Halloween Preview URL. Why: The Halloween card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import motPreUrl from '../assets/mothers-day-card-preview-image.webp';        // What: Mother's Preview URL. Why: The Mother's Day card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import thaPreUrl from '../assets/happy-thanksgiving-card-preview-image.webp'; // What: Thanksgiving Preview URL. Why: The Thanksgiving card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.


import { createElement } from 'react'; // What: Create Element. Why: The prank's catalog row renders the Christmas card with its prank flag set, and this file holds no JSX. How: This builds that element.
import { lazy          } from 'react'; // What: Lazy. Why: Each card is a large animation that only its own page needs. How: This loads a card's code the first time its page opens, keeping it out of every other page's download.


import type { ComponentType       } from 'react'; // What: Component Type. Why: A card record holds the card's component. How: This types the component a lazy import resolves to.
import type { LazyExoticComponent } from 'react'; // What: Lazy Exotic Component. Why: Each card's component is loaded on demand. How: This types the lazy wrapper around it.

// #endregion Imports



/**
 * cards.ts = Cards
 *
 * @summary
 * The catalog of every greeting card the site offers, in the order the
 * Gallery shows them, and the occasions they're grouped by. Home picks its
 * featured cards from it, the Gallery lists and filters it, the card route
 * finds a card by its address, and the share dialog builds a card's link
 * from it. A new card is added as one more row here, with its component in
 * src/cards/ and its preview in src/assets/.
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



type CarRecTyp = { // What: Card Record Type. Why: Every card is described the same way wherever it's shown. How: This names each field a card record holds.


	altStr : string,                               // What: Alternative String. Why: The preview needs a description for screen readers. How: Each tile's image reads it as its alt text.
	carCom : LazyExoticComponent< ComponentType >, // What: Card Component. Why: The card's own page renders the card itself. How: This is the card's component, loaded the first time its page opens.
	cusBoo : boolean,                              // What: Customizable Boolean. Why: Only some cards can show a recipient's name. How: The share dialog offers its name field when this is true, and adds the name to the card's link as ?name=.
	desStr : string,                               // What: Description String. Why: A tile says what the card is like. How: The tile shows it under the title.
	froBoo : boolean,                              // What: From Boolean. Why: Only some cards can be signed with the sender's name. How: The share dialog offers its sender field when this is true, and adds the name to the card's link as ?from=.
	imaStr : string,                               // What: Image String. Why: A tile shows a still of its card. How: This is the preview's fingerprinted address.
	lisBoo : boolean,                              // What: Listed Boolean. Why: A card can live at its own address without being shown in the Gallery or on Home. How: Only cards with this true are listed.
	occStr : OccNamTyp,                            // What: Occasion String. Why: The Gallery groups cards by occasion. How: This names the card's occasion.
	seaStr : string,                               // What: Search String. Why: A card's own page needs a search description of 100 to 125 characters, which the tile's shorter description doesn't fill. How: The card's page swaps it into the description tag while it shows.
	sluStr : string,                               // What: Slug String. Why: Every card has its own address. How: The card opens at this path, such as /happy-birthday.
	titStr : string                                // What: Title String. Why: Every card has a name. How: Tiles, the share dialog, and the card's page title show it.


};

// #endregion Types



// #region Constants

const OCC_NAM_ARR : OccNamTyp[] = [ 'Birthday', 'Family', 'Holiday' ]; // What: Occasion Name Array. Why: The Gallery's filter offers every occasion in a fixed order. How: The filter renders a button for each, after All.



// #region CAR_REC_ARR

/**
 * CAR_REC_ARR = Card Record Array
 *
 * @summary
 * Every card the site offers, one record per card in the order the Gallery
 * lists them. Each record has the same fields, described one by one on
 * CarRecTyp above: altStr, carCom, cusBoo, desStr, froBoo, imaStr, lisBoo,
 * occStr, seaStr, sluStr, and titStr. Both Father's Day cards share one
 * preview, and the special one stays unlisted, reachable only by its own
 * address, as it was on TechGeek.support. Both Christmas cards share one
 * component and one preview: the listed one is the snowy scene alone, and the
 * unlisted prank, made for the maker's own family, plays the fake hack first.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const CAR_REC_ARR : CarRecTyp[] = [ // What: Card Record Array. Why: Every page that shows or opens a card reads the same catalog. How: Each row describes one card.


	{ // What: Happy Birthday Card Row. Why: The birthday card is the only one that shows a recipient's name so far. How: Its link takes the name as ?name=.


		altStr : 'The Happy Birthday card, with its greeting over a festive scene.',
		carCom : lazy( () => import( '../cards/happy-birthday/happy-birthday-card.tsx' ).then( ( modObj ) => ( { default : modObj.BirCarCom } ) ) ),
		cusBoo : true,
		desStr : 'An animated birthday card with confetti, balloons, and a message, made out to them by name.',
		froBoo : false,
		imaStr : birPreUrl,
		lisBoo : true,
		occStr : 'Birthday',
		seaStr : 'Send an animated Happy Birthday card with confetti, balloons, and their own name on it. Free to share with a single link.',
		sluStr : 'happy-birthday',
		titStr : 'Happy Birthday'


	},

	{ // What: Mother's Day Card Row. Why: The Mother's Day card celebrates mothers. How: Its page plays the card full screen.


		altStr : "The Mother's Day card, with its illustrated thank-you to mothers.",
		carCom : lazy( () => import( '../cards/MothersDayCardWrapper.tsx' ) ),
		cusBoo : false,
		desStr : 'A heartfelt card that celebrates mothers, with gentle animations and illustrations.',
		froBoo : false,
		imaStr : motPreUrl,
		lisBoo : true,
		occStr : 'Family',
		seaStr : "Send an animated Mother's Day card that thanks mom for everything, with heartfelt words and illustrations. Free to share.",
		sluStr : 'mothers-day',
		titStr : "Mother's Day"


	},

	{ // What: Father's Day Card Row. Why: The Father's Day card celebrates fathers. How: Its page plays the card full screen.


		altStr : "The Father's Day card, with its illustrated thank-you to fathers.",
		carCom : lazy( () => import( '../cards/FathersDayCardWrapper.tsx' ) ),
		cusBoo : false,
		desStr : 'A heartfelt card that celebrates fathers, with bold animations and illustrations.',
		froBoo : false,
		imaStr : fatPreUrl,
		lisBoo : true,
		occStr : 'Family',
		seaStr : "Send an animated Father's Day card that thanks dad for everything, with heartfelt words and illustrations. Free to share.",
		sluStr : 'fathers-day',
		titStr : "Father's Day"


	},

	{ // What: Fourth Of July Card Row. Why: The Fourth of July card celebrates Independence Day. How: Its page plays the card full screen.


		altStr : 'The Fourth of July card, with its greeting under a sky of fireworks.',
		carCom : lazy( () => import( '../cards/fourth-of-july/fourth-of-july-card.tsx' ).then( ( modObj ) => ( { default : modObj.FojCarCom } ) ) ),
		cusBoo : false,
		desStr : 'An Independence Day celebration with fireworks and patriotic animations.',
		froBoo : false,
		imaStr : fouPreUrl,
		lisBoo : true,
		occStr : 'Holiday',
		seaStr : 'Send an animated Fourth of July card with fireworks and patriotic flair to celebrate Independence Day. Free to share.',
		sluStr : 'fourth-of-july',
		titStr : 'Fourth of July'


	},

	{ // What: Happy Halloween Card Row. Why: The Halloween card brings a spooky greeting. How: Its page plays the card full screen.


		altStr : 'The Happy Halloween card, with its greeting in a spooky night scene.',
		carCom : lazy( () => import( '../cards/happy-halloween/happy-halloween-card.tsx' ).then( ( modObj ) => ( { default : modObj.HalCarCom } ) ) ),
		cusBoo : false,
		desStr : 'A spooky Halloween card with eerie animations and effects.',
		froBoo : false,
		imaStr : halPreUrl,
		lisBoo : true,
		occStr : 'Holiday',
		seaStr : 'Send an animated Happy Halloween card with spooky effects and eerie animations to your favorite ghouls. Free to share.',
		sluStr : 'happy-halloween',
		titStr : 'Happy Halloween'


	},

	{ // What: Happy Thanksgiving Card Row. Why: The Thanksgiving card brings a festive greeting. How: Its page plays the card full screen.


		altStr : 'The Happy Thanksgiving card, with its greeting in an autumn scene.',
		carCom : lazy( () => import( '../cards/HappyThanksgivingCard.tsx' ) ),
		cusBoo : false,
		desStr : 'A festive Thanksgiving card with warm, autumn animations and effects.',
		froBoo : false,
		imaStr : thaPreUrl,
		lisBoo : true,
		occStr : 'Holiday',
		seaStr : 'Send an animated Happy Thanksgiving card with warm autumn colors and festive animations. Free to share with a link.',
		sluStr : 'happy-thanksgiving',
		titStr : 'Happy Thanksgiving'


	},

	{ // What: Merry Christmas Card Row. Why: The Christmas card's snowy scene is listed on its own, made out to them by name and signed with the sender's. How: Its link takes the names as ?name= and ?from=, and its component is a named export, so the lazy import hands it back as the default.


		altStr : 'The Merry Christmas card, with its greeting over a snowy cabin.',
		carCom : lazy( () => import( '../cards/christmas/christmas-card.tsx' ).then( ( modObj ) => ( { default : modObj.ChrCarCom } ) ) ),
		cusBoo : true,
		desStr : 'A snowy cabin with snow falling, wishing them a Merry Christmas by name and signed with yours.',
		froBoo : true,
		imaStr : chrPreUrl,
		lisBoo : true,
		occStr : 'Holiday',
		seaStr : 'Send an animated Merry Christmas card with snow falling over a cozy cabin, made out to them and signed by you. Free to share.',
		sluStr : 'merry-christmas',
		titStr : 'Merry Christmas'


	},

	{ // What: Father's Day Special Card Row. Why: A playful second Father's Day card was never listed in TechGeek.support's gallery. How: It keeps its own address but stays out of the Gallery and Home.


		altStr : "The special Father's Day card, with its playful thank-you to fathers.",
		carCom : lazy( () => import( '../cards/FathersDayCardWrapperSpecial.tsx' ) ),
		cusBoo : false,
		desStr : "A playful Father's Day card for a dad with a wild side.",
		froBoo : false,
		imaStr : fatPreUrl,
		lisBoo : false,
		occStr : 'Family',
		seaStr : "A playful animated Father's Day card for a dad with a wild side, coded by hand and shared with a single link. Free to send.",
		sluStr : 'fathers-day-prank',
		titStr : "Father's Day Special"


	},

	{ // What: Christmas Prank Card Row. Why: The full Christmas card, a fake hack before the snowy greeting, was made for the maker's own family, so it stays unlisted. How: It keeps its own address, and its lazy import renders the card with its prank flag set.


		altStr : 'The Christmas Prank card, with its greeting over a snowy cabin.',
		carCom : lazy( () => import( '../cards/christmas/christmas-card.tsx' ).then( ( modObj ) => ( { default : () => createElement( modObj.ChrCarCom, { prkBoo : true } ) } ) ) ),
		cusBoo : true,
		desStr : 'A prank Christmas card: a fake hacked screen that glitches into a snowy cabin, made out to them by name.',
		froBoo : true,
		imaStr : chrPreUrl,
		lisBoo : false,
		occStr : 'Holiday',
		seaStr : 'A prank Christmas card that opens on a fake hack and glitches into a snowy cabin greeting, coded by hand. Free to share.',
		sluStr : 'christmas-prank',
		titStr : 'Christmas Prank'


	}


];

// #endregion CAR_REC_ARR

// #endregion Constants



// #region Exports

export { CAR_REC_ARR, OCC_NAM_ARR, type CarRecTyp, type OccNamTyp }; // What: Named Exports. Why: Home, the Gallery, the card route, and the share dialog all read the catalog and its types. How: This exports the catalog, the occasion list, and both types.

// #endregion Exports


