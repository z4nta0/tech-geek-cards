


// #region Imports

import appPhoUrl from './appreciate.webp';              // What: Appreciate Photo URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import cssModObj from './fathers-day-card.module.css';  // What: CSS Module Object. Why: The card's colors and font are set in its own module. How: This maps each class name in fathers-day-card.module.css to its scoped name.
import evePhoUrl from './everything.webp';              // What: Everything Photo URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import extOneUrl from './extra-1.webp';                 // What: Extra One URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import extTwoUrl from './extra-2.webp';                 // What: Extra Two URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import impRolUrl from './important-role.webp';          // What: Important Role URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import litThiUrl from './little-things.webp';           // What: Little Things URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import lovYouUrl from './love-you.webp';                // What: Love You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import neeYouUrl from './need-you.webp';                // What: Need You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import proForUrl from './provide-for-us.webp';          // What: Provide For URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import speDayUrl from './special-day.webp';             // What: Special Day URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import thaYouUrl from './thank-you.webp';               // What: Thank You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import thrGenUrl from './through-the-generations.webp'; // What: Through Generations URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.


import { FamCarCom } from '../../ui/family-card.tsx'; // What: Family Card Component. Why: Every Family card plays the same way. How: This is the shared engine the card hands its record and theme.


import type { FamCarTyp } from '../../ui/family-card.tsx'; // What: Family Card Type. Why: The card's record has to hold everything the engine plays. How: This types it.
import type { JSX       } from 'react';                    // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * fathers-day-card.tsx = Father's Day Card
 *
 * @summary
 * The Father's Day card, a thank-you to fathers told in ten typed lines, each
 * revealing a family photo through a heart, before the greeting grows and the
 * photos settle into a mosaic. It's a record handed to the shared Family
 * engine (ui/family-card.tsx), which plays every Family card the same way, and
 * its own module gives it a pale sky background, navy lettering, and
 * Permanent Marker, a bold hand.
 *
 * Sections:
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

// #region FAT_CAR_OBJ

/**
 * FAT_CAR_OBJ = Father's Card Object
 *
 * @summary
 * Everything the card plays. Every photo row is { altStr, imaStr }: altStr,
 * the description a screen reader gives for the photo, and imaStr, its
 * fingerprinted address. The ten scenes' photos come first, in scene order,
 * then the two the photo grid adds. Every scene row is { aftStr, befStr,
 * higStr }: the parts of its line typed before its key words, the key words
 * that get underlined, and the part typed after them.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const FAT_CAR_OBJ : FamCarTyp = { // What: Father's Card Object. Why: The engine plays the card from one record. How: This holds its lines, photos, grid order, and greeting.


	behStr    : 'On behalf of the rest of us...',         // What: Behalf String. Why: The card closes on everyone's behalf. How: The engine types and erases it before the greeting.
	finPowArr : [ 2, 2, 1, 0 ],                           // What: Final Power Array. Why: The greeting grows less on a smaller screen. How: These are the powers of the core design number it grows by above 1,024px, at 1,024px, 768px, and 640px and below.
	greStr    : "Happy Father's Day!",                    // What: Greeting String. Why: The card ends on its greeting. How: The engine types it last and makes it the card's heading.
	griIndArr : [ 6, 2, 9, 7, 3, 11, 10, 4, 5, 1, 0, 8 ], // What: Grid Index Array. Why: The photo grid mixes the photos up. How: These are the photos' places, cell by cell.

	phoRecArr : [ // What: Photo Record Array. Why: The scenes and the grid share one set of photos. How: These are the ten scenes' photos, then the grid's two extras.


		{ altStr : 'A young father carrying his baby on his shoulders in front of an old shed.', imaStr : thaYouUrl },
		{ altStr : 'A father napping on a striped couch with his toddler asleep on his chest.', imaStr : evePhoUrl },
		{ altStr : 'A father in bed with his two young daughters under a blue blanket.', imaStr : litThiUrl },
		{ altStr : 'A father in a white tuxedo helping his little son into a matching one.', imaStr : impRolUrl },
		{ altStr : 'A father building a wooden frame while his toddler daughter smiles beside him.', imaStr : proForUrl },
		{ altStr : 'A father in sunglasses with his three young sons beside a race car.', imaStr : thrGenUrl },
		{ altStr : 'A family laughing together around a grandfather in overalls.', imaStr : speDayUrl },
		{ altStr : 'A father in a gray suit hugging his son on his wedding day.', imaStr : lovYouUrl },
		{ altStr : 'Three grown men on a couch, one kissing the father in the middle on the cheek.', imaStr : appPhoUrl },
		{ altStr : 'A grandfather in an armchair holding two babies on his lap.', imaStr : neeYouUrl },
		{ altStr : 'A smiling father holding his baby daughter up to his cheek.', imaStr : extOneUrl },
		{ altStr : 'A father lying on a shag carpet beside his sleeping toddler.', imaStr : extTwoUrl }


	],

	sceRecArr : [ // What: Scene Record Array. Why: The card plays ten lines in order. How: Each row is one line's three parts.


		{ aftStr : '!',                                          befStr : 'To all of the fathers out there, ', higStr : 'thank you' },
		{ aftStr : ' that you do for us.',                       befStr : 'For ', higStr : 'everything' },
		{ aftStr : '.',                                          befStr : 'Especially the ', higStr : 'little things' },
		{ aftStr : ' in our lives.',                             befStr : 'You play such an ', higStr : 'important role' },
		{ aftStr : ' goes beyond words!',                        befStr : 'What fathers ', higStr : 'provide for us' },
		{ aftStr : '.',                                          befStr : 'And gets passed down ', higStr : 'through the generations' },
		{ aftStr : ' we take great delight in celebrating you.', befStr : 'So on this ', higStr : 'special day' },
		{ aftStr : ' always and unconditionally.',               befStr : 'We do ', higStr : 'love you' },
		{ aftStr : ' all that you do.',                          befStr : 'We do ', higStr : 'appreciate' },
		{ aftStr : ' in our lives.',                             befStr : 'And we will always ', higStr : 'need you' }


	]


};

// #endregion FAT_CAR_OBJ

// #endregion Constants



// #region Components

// #region FatCarCom

/**
 * FatCarCom = Father's Card Component
 *
 * @summary
 * Plays the Father's Day card through the shared Family engine, handing it the
 * card's record and the theme class from its own module.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The engine playing the card.
 *
 * @example
 * ```tsx
 * FatCarCom() // => <FatCarCom />
 * ```
 *
*/

const FatCarCom = () : JSX.Element => ( // What: Father's Card Component. Why: The catalog plays the card from its page. How: This renders the Family engine with the card's record and theme.


	<FamCarCom
		famCarObj={ FAT_CAR_OBJ }
		theClaStr={ cssModObj.fatCarDiv }
	/> // What: Family Card Component. Why: The engine plays the card. How: This hands it the card's record and its theme class.


);

// #endregion FatCarCom

// #endregion Components



// #region Exports

export { FatCarCom }; // What: Named Export. Why: The catalog lazily loads the card by name. How: This exports FatCarCom.

// #endregion Exports


