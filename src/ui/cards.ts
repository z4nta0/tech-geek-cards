


// #region Imports

import birPreUrl from '../assets/happy-birthday-card-preview-image.webp';     // What: Birthday Preview URL. Why: The Happy Birthday card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import chrPreUrl from '../assets/christmas-card-preview-image.webp';          // What: Christmas Preview URL. Why: The Christmas cards' tiles show a still of them. How: Vite fingerprints the file and hands back its address.
import fatPreUrl from '../assets/fathers-day-card-preview-image.webp';        // What: Father's Preview URL. Why: The Father's Day cards' tiles show a still of them. How: Vite fingerprints the file and hands back its address.
import fouPreUrl from '../assets/fourth-of-july-card-preview-image.webp';     // What: Fourth Preview URL. Why: The Fourth of July card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import halPreUrl from '../assets/happy-halloween-card-preview-image.webp';    // What: Halloween Preview URL. Why: The Halloween card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import motPreUrl from '../assets/mothers-day-card-preview-image.webp';        // What: Mother's Preview URL. Why: The Mother's Day card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.
import thaPreUrl from '../assets/happy-thanksgiving-card-preview-image.webp'; // What: Thanksgiving Preview URL. Why: The Thanksgiving card's tile shows a still of it. How: Vite fingerprints the file and hands back its address.


import { CAR_DAT_ARR   } from './card-data.ts'; // What: Card Data Array. Why: The catalog is built on the cards' plain data. How: Each data row gains its component and preview here.
import { createElement } from 'react';          // What: Create Element. Why: The Christmas prank renders the Christmas card with its prank flag set, and this file holds no JSX. How: This builds that element.
import { lazy          } from 'react';          // What: Lazy. Why: Each card is a large animation that only its own page needs. How: This loads a card's code the first time its page opens, keeping it out of every other page's download.


import type { CarDatTyp           } from './card-data.ts'; // What: Card Data Type. Why: A card record is a card's data plus its component and preview. How: This types the data part.
import type { ComponentType       } from 'react';          // What: Component Type. Why: A card record holds the card's component. How: This types the component a lazy import resolves to.
import type { LazyExoticComponent } from 'react';          // What: Lazy Exotic Component. Why: Each card's component is loaded on demand. How: This types the lazy wrapper around it.

// #endregion Imports



/**
 * cards.ts = Cards
 *
 * @summary
 * The catalog every page reads: each card's plain data from card-data.ts,
 * in the same order, joined with its component and its tile preview by its
 * address. Home picks its featured cards from it, the Gallery lists and
 * filters it, the card route finds a card by its address, and the share
 * dialog builds a card's link from it. A new card is a row in card-data.ts
 * plus an entry in each lookup here, with its component in src/cards/ and
 * its preview in src/assets/.
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

type CarRecTyp = CarDatTyp & { // What: Card Record Type. Why: The pages need a card's data, component, and preview together. How: This adds the two to the card's data.


	carCom : LazyExoticComponent< ComponentType >, // What: Card Component. Why: The card's own page renders the card itself. How: This is the card's component, loaded the first time its page opens.
	imaStr : string                                // What: Image String. Why: A tile shows a still of its card. How: This is the preview's fingerprinted address.


};

// #endregion Types



// #region Constants

// #region CAR_COM_OBJ

/**
 * CAR_COM_OBJ = Card Component Object
 *
 * @summary
 * Every card's component, keyed by its address. Every row is a lazy import
 * of the card's own file, mapping its named export to the default React.lazy
 * needs, so a card's code downloads only when its page opens. Both Christmas
 * cards play one component, the prank with its prank flag set.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const CAR_COM_OBJ : Record< string, LazyExoticComponent< ComponentType > > = { // What: Card Component Object. Why: Each card's page plays its own component. How: Each key is a card's address.


	'fathers-day'           : lazy( () => import( '../cards/fathers-day/fathers-day-card.tsx' ).then( ( modObj ) => ( { default : modObj.FatCarCom } ) ) ),
	'fathers-day-prank'     : lazy( () => import( '../cards/fathers-day-prank/fathers-day-prank-card.tsx' ).then( ( modObj ) => ( { default : modObj.FdpCarCom } ) ) ),
	'fourth-of-july'        : lazy( () => import( '../cards/fourth-of-july/fourth-of-july-card.tsx' ).then( ( modObj ) => ( { default : modObj.FojCarCom } ) ) ),
	'happy-birthday'        : lazy( () => import( '../cards/happy-birthday/happy-birthday-card.tsx' ).then( ( modObj ) => ( { default : modObj.BirCarCom } ) ) ),
	'happy-halloween'       : lazy( () => import( '../cards/happy-halloween/happy-halloween-card.tsx' ).then( ( modObj ) => ( { default : modObj.HalCarCom } ) ) ),
	'happy-thanksgiving'    : lazy( () => import( '../cards/happy-thanksgiving/happy-thanksgiving-card.tsx' ).then( ( modObj ) => ( { default : modObj.ThaCarCom } ) ) ),
	'merry-christmas'       : lazy( () => import( '../cards/christmas/christmas-card.tsx' ).then( ( modObj ) => ( { default : modObj.ChrCarCom } ) ) ),
	'merry-christmas-prank' : lazy( () => import( '../cards/christmas/christmas-card.tsx' ).then( ( modObj ) => ( { default : () => createElement( modObj.ChrCarCom, { prkBoo : true } ) } ) ) ),
	'mothers-day'           : lazy( () => import( '../cards/mothers-day/mothers-day-card.tsx' ).then( ( modObj ) => ( { default : modObj.MotCarCom } ) ) )


};

// #endregion CAR_COM_OBJ



// #region CAR_IMA_OBJ

/**
 * CAR_IMA_OBJ = Card Image Object
 *
 * @summary
 * Every card's tile preview, keyed by its address. Every row is a preview's
 * fingerprinted address. Each prank shares its listed card's preview.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const CAR_IMA_OBJ : Record< string, string > = { // What: Card Image Object. Why: Each card's tile shows a still of it. How: Each key is a card's address.


	'fathers-day'           : fatPreUrl,
	'fathers-day-prank'     : fatPreUrl,
	'fourth-of-july'        : fouPreUrl,
	'happy-birthday'        : birPreUrl,
	'happy-halloween'       : halPreUrl,
	'happy-thanksgiving'    : thaPreUrl,
	'merry-christmas'       : chrPreUrl,
	'merry-christmas-prank' : chrPreUrl,
	'mothers-day'           : motPreUrl


};

// #endregion CAR_IMA_OBJ



const CAR_REC_ARR : CarRecTyp[] = CAR_DAT_ARR.map( ( carDatObj ) => ( { ...carDatObj, carCom : CAR_COM_OBJ[ carDatObj.sluStr ], imaStr : CAR_IMA_OBJ[ carDatObj.sluStr ] } ) ); // What: Card Record Array. Why: Every page that shows or opens a card reads one catalog. How: This joins each card's data with its component and preview by its address, in the data's order.

// #endregion Constants



// #region Exports

export { CAR_REC_ARR, type CarRecTyp }; // What: Named Exports. Why: Home, the Gallery, the card route, and the share dialog read the catalog and its type. How: This exports the catalog and its record type.

// #endregion Exports


