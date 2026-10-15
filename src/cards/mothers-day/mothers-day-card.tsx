


// #region Imports

import appYouUrl from './appreciate-you.webp';         // What: Appreciate You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import celPhoUrl from './celebration.webp';            // What: Celebration Photo URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import cssModObj from './mothers-day-card.module.css'; // What: CSS Module Object. Why: The card's colors and font are set in its own module. How: This maps each class name in mothers-day-card.module.css to its scoped name.
import eveYouUrl from './everything-you-do.webp';      // What: Everything You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import extOneUrl from './extra-image-1.webp';          // What: Extra One URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import extTwoUrl from './extra-image-2.webp';          // What: Extra Two URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import litThiUrl from './little-things.webp';          // What: Little Things URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import lovYouUrl from './love-you.webp';               // What: Love You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import motLovUrl from './mothers-love.webp';           // What: Mother's Love URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import neeYouUrl from './need-you.webp';               // What: Need You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import ourResUrl from './our-responsibility.webp';     // What: Our Responsibility URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import ourWorUrl from './our-world.webp';              // What: Our World URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import thaYouUrl from './thank-you.webp';              // What: Thank You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.


import { FamCarCom } from '../../ui/family-card.tsx'; // What: Family Card Component. Why: Every Family card plays the same way. How: This is the shared engine the card hands its record and theme.


import type { FamCarTyp } from '../../ui/family-card.tsx'; // What: Family Card Type. Why: The card's record has to hold everything the engine plays. How: This types it.
import type { JSX       } from 'react';                    // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * mothers-day-card.tsx = Mother's Day Card
 *
 * @summary
 * The Mother's Day card, a thank-you to mothers told in ten typed lines, each
 * revealing a family photo through a heart, before the greeting grows and the
 * photos settle into a mosaic. It's a record handed to the shared Family
 * engine (ui/family-card.tsx), which plays every Family card the same way, and
 * its own module gives it a blush background, deep rose lettering, and Great
 * Vibes, a flowing script.
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

// #region MOT_CAR_OBJ

/**
 * MOT_CAR_OBJ = Mother's Card Object
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

const MOT_CAR_OBJ : FamCarTyp = { // What: Mother's Card Object. Why: The engine plays the card from one record. How: This holds its lines, photos, grid order, and greeting.


	behStr    : 'On behalf of the rest of us...',         // What: Behalf String. Why: The card closes on everyone's behalf. How: The engine types and erases it before the greeting.
	finPowArr : [ 4, 2, 1, 1 ],                           // What: Final Power Array. Why: The greeting grows less on a smaller screen. How: These are the powers of the core design number it grows by above 1,024px, at 1,024px, 768px, and 640px and below.
	greStr    : "Happy Mother's Day!",                    // What: Greeting String. Why: The card ends on its greeting. How: The engine types it last and makes it the card's heading.
	griIndArr : [ 6, 2, 9, 7, 4, 11, 10, 3, 5, 1, 0, 8 ], // What: Grid Index Array. Why: The photo grid mixes the photos up. How: These are the photos' places, cell by cell.

	phoRecArr : [ // What: Photo Record Array. Why: The scenes and the grid share one set of photos. How: These are the ten scenes' photos, then the grid's two extras.


		{ altStr : 'A mother in a patterned headscarf kissing her baby daughter in a field by a fence.', imaStr : thaYouUrl },
		{ altStr : 'A mother on a floral couch holding her baby beside a big teddy bear.', imaStr : eveYouUrl },
		{ altStr : 'A grandmother on a plaid couch sharing a snack with a toddler in red.', imaStr : litThiUrl },
		{ altStr : 'A smiling mother hugging her laughing toddler son on a floral couch.', imaStr : ourWorUrl },
		{ altStr : 'A mother on snowy steps watching her bundled-up toddler and a toy bunny.', imaStr : motLovUrl },
		{ altStr : 'A mother helping a little girl in a party hat blow out her birthday candles.', imaStr : celPhoUrl },
		{ altStr : 'A big family gathered on the floor in front of a Christmas tree.', imaStr : ourResUrl },
		{ altStr : 'A woman hugging her elderly mother from behind in a kitchen.', imaStr : lovYouUrl },
		{ altStr : 'A woman and her elderly mother, wearing a red rose corsage, hugging and smiling.', imaStr : appYouUrl },
		{ altStr : 'A grown son hugging his elderly mother in a garden.', imaStr : neeYouUrl },
		{ altStr : 'A mother cradling her newborn in an armchair.', imaStr : extOneUrl },
		{ altStr : 'A grandmother holding a baby while a little girl brings her a big box of presents.', imaStr : extTwoUrl }


	],

	sceRecArr : [ // What: Scene Record Array. Why: The card plays ten lines in order. How: Each row is one line's three parts.


		{ aftStr : '!',                                  befStr : 'To all of the mothers out there, ', higStr : 'thank you' },
		{ aftStr : ' that you do for us.',               befStr : 'For ', higStr : 'everything' },
		{ aftStr : '.',                                  befStr : 'Especially the ', higStr : 'little things' },
		{ aftStr : '.',                                  befStr : 'To the world you are a mother, but to us you are ', higStr : 'our world' },
		{ aftStr : ' thing indeed!',                     befStr : "A mother's love is a ", higStr : 'special' },
		{ aftStr : '.',                                  befStr : 'You definitely deserve more than one day of ', higStr : 'celebration' },
		{ aftStr : ' to make the most of this one day.', befStr : 'So it is ', higStr : 'our responsibility' },
		{ aftStr : " (even when we don't show it).",     befStr : 'You are ', higStr : 'loved' },
		{ aftStr : " (even when we don't give it).",     befStr : 'And you are ', higStr : 'appreciated' },
		{ aftStr : ' in our lives.',                     befStr : 'So please never get discouraged, because we ', higStr : 'need you' }


	]


};

// #endregion MOT_CAR_OBJ

// #endregion Constants



// #region Components

// #region MotCarCom

/**
 * MotCarCom = Mother's Card Component
 *
 * @summary
 * Plays the Mother's Day card through the shared Family engine, handing it the
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
 * MotCarCom() // => <MotCarCom />
 * ```
 *
*/

const MotCarCom = () : JSX.Element => ( // What: Mother's Card Component. Why: The catalog plays the card from its page. How: This renders the Family engine with the card's record and theme.


	<FamCarCom
		famCarObj={ MOT_CAR_OBJ }
		theClaStr={ cssModObj.motCarDiv }
	/> // What: Family Card Component. Why: The engine plays the card. How: This hands it the card's record and its theme class.


);

// #endregion MotCarCom

// #endregion Components



// #region Exports

export { MotCarCom }; // What: Named Export. Why: The catalog lazily loads the card by name. How: This exports MotCarCom.

// #endregion Exports


