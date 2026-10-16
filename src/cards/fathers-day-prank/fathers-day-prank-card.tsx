


// #region Imports

import appPhoUrl from './appreciate.webp';                   // What: Appreciate Photo URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import cssModObj from './fathers-day-prank-card.module.css'; // What: CSS Module Object. Why: The card's colors and font are set in its own module. How: This maps each class name in fathers-day-prank-card.module.css to its scoped name.
import extOneUrl from './extra-1.webp';                      // What: Extra One URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import extTwoUrl from './extra-2.webp';                      // What: Extra Two URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import fecFliUrl from './feces-flinging.webp';               // What: Feces Flinging URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import lovPhoUrl from './love.webp';                         // What: Love Photo URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import monAroUrl from './monkeying-around.webp';             // What: Monkeying Around URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import neeYouUrl from './need-your.webp';                    // What: Need Your URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import proForUrl from './provide-for-us.webp';               // What: Provide For URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import simOffUrl from './through-the-simian-offspring.webp'; // What: Simian Offspring URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import simRolUrl from './simian-role.webp';                  // What: Simian Role URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import speDayUrl from './special-day.webp';                  // What: Special Day URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.
import thaYouUrl from './thank-you.webp';                    // What: Thank You URL. Why: The card shows this photo. How: This is the optimized image's address, fingerprinted by Vite.


import { FamCarCom } from '../../ui/family-card.tsx'; // What: Family Card Component. Why: Every Family card plays the same way. How: This is the shared engine the card hands its record and theme.


import type { FamCarTyp } from '../../ui/family-card.tsx'; // What: Family Card Type. Why: The card's record has to hold everything the engine plays. How: This types it.
import type { JSX       } from 'react';                    // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * fathers-day-prank-card.tsx = Father's Day Prank Card
 *
 * @summary
 * The Father's Day prank, unlisted: the Father's Day card's warm thank-you
 * turned into a tribute to simian fathers, with an orangutan standing in for
 * dad in every photo. It's a record handed to the shared Family engine
 * (ui/family-card.tsx), which plays every Family card the same way, and its
 * own module gives it the Father's Day card's sky blue, navy, and Permanent
 * Marker, so the joke lands only once the first photo opens.
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

// #region FDP_CAR_OBJ

/**
 * FDP_CAR_OBJ = Father's-Day-Prank Card Object
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

const FDP_CAR_OBJ : FamCarTyp = { // What: Father's-Day-Prank Card Object. Why: The engine plays the card from one record. How: This holds its lines, photos, grid order, and greeting.


	behStr    : 'On behalf of the rest of our troop...',  // What: Behalf String. Why: The card closes on everyone's behalf. How: The engine types and erases it before the greeting.
	finPowArr : [ 2, 2, 1, 0 ],                           // What: Final Power Array. Why: The greeting grows less on a smaller screen. How: These are the powers of the core design number it grows by above 1,024px, at 1,024px, 768px, and 640px and below.
	greStr    : "Happy Simian Father's Day!",             // What: Greeting String. Why: The card ends on its greeting. How: The engine types it last and makes it the card's heading.
	griIndArr : [ 6, 2, 9, 7, 3, 11, 10, 4, 5, 1, 0, 8 ], // What: Grid Index Array. Why: The photo grid mixes the photos up. How: These are the photos' places, cell by cell.

	phoRecArr : [ // What: Photo Record Array. Why: The scenes and the grid share one set of photos. How: These are the ten scenes' photos, then the grid's two extras.


		{ altStr : 'An orangutan carrying a baby on its shoulders in front of an old shed.', imaStr : thaYouUrl },
		{ altStr : 'An orangutan napping on a striped couch with a toddler asleep against it.', imaStr : monAroUrl },
		{ altStr : 'An orangutan in bed with two little girls under a blue blanket.', imaStr : fecFliUrl },
		{ altStr : 'An orangutan helping a little boy into a white tuxedo beside a man in a matching one.', imaStr : simRolUrl },
		{ altStr : 'An orangutan in jeans building a wooden frame beside a smiling toddler.', imaStr : proForUrl },
		{ altStr : 'An orangutan in green shutter shades leaning back in an office.', imaStr : simOffUrl },
		{ altStr : 'An orangutan in a straw hat riding a lawn mower across a yard.', imaStr : speDayUrl },
		{ altStr : 'An orangutan in a cowboy hat and fringed vest holding a rifle in a living room.', imaStr : lovPhoUrl },
		{ altStr : 'An orangutan in a shirt, tie, and sunglasses standing on a porch.', imaStr : appPhoUrl },
		{ altStr : 'An orangutan in a straw hat and overalls standing in a dining hall.', imaStr : neeYouUrl },
		{ altStr : 'An orangutan holding a baby up to its cheek.', imaStr : extOneUrl },
		{ altStr : 'An orangutan lying on a shag carpet beside a sleeping toddler.', imaStr : extTwoUrl }


	],

	sceRecArr : [ // What: Scene Record Array. Why: The card plays ten lines in order. How: Each row is one line's three parts.


		{ aftStr : ' out there, thank you!', befStr : 'To all of the ', higStr : 'simian fathers' },
		{ aftStr : ' that you do for us.',   befStr : 'For all of the ', higStr : 'monkeying around' },
		{ aftStr : '.',                      befStr : 'Especially the ', higStr : 'feces flinging' },
		{ aftStr : ' in our lives.',         befStr : 'You play such a ', higStr : 'simian role' },
		{ aftStr : '!',                      befStr : 'What simian fathers provide for us goes beyond ', higStr : 'sign language' },
		{ aftStr : '.',                      befStr : 'And gets passed down through the ', higStr : 'simian offspring' },
		{ aftStr : '.',                      befStr : 'So on this special day we celebrate our ', higStr : 'simian alphas' },
		{ aftStr : '.',                      befStr : 'We do love that you always ', higStr : 'protect us from the jungle' },
		{ aftStr : ' you do.',               befStr : 'We do appreciate all of the ', higStr : 'allogrooming' },
		{ aftStr : ' in our lives.',         befStr : 'And we will always need your ', higStr : 'long calls' }


	]


};

// #endregion FDP_CAR_OBJ

// #endregion Constants



// #region Components

// #region FdpCarCom

/**
 * FdpCarCom = Father's-Day-Prank Card Component
 *
 * @summary
 * Plays the Father's Day Prank card through the shared Family engine, handing
 * it the card's record and the theme class from its own module.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The engine playing the card.
 *
 * @example
 * ```tsx
 * FdpCarCom() // => <FdpCarCom />
 * ```
 *
*/

const FdpCarCom = () : JSX.Element => ( // What: Father's-Day-Prank Card Component. Why: The catalog plays the card from its page. How: This renders the Family engine with the card's record and theme.


	<FamCarCom
		famCarObj={ FDP_CAR_OBJ }
		theClaStr={ cssModObj.fdpCarDiv }
	/> // What: Family Card Component. Why: The engine plays the card. How: This hands it the card's record and its theme class.


);

// #endregion FdpCarCom

// #endregion Components



// #region Exports

export { FdpCarCom }; // What: Named Export. Why: The catalog lazily loads the card by name. How: This exports FdpCarCom.

// #endregion Exports


