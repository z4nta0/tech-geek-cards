


// #region Imports

import { redMotFun   } from '../utils/motion.ts'; // What: Reduced Motion Function. Why: A section link's smooth scroll has to respect the reduced-motion preference. How: visSecFun asks it before choosing the scroll behavior.
import { useNavigate } from 'react-router';       // What: Use Navigate. Why: A section link on any page but Home has to take the visitor to Home first. How: This returns the router's navigate function.

// #endregion Imports



/**
 * section-link.ts = Section Link
 *
 * @summary
 * The one way a link reaches a section of the Home page, such as the hero's
 * "How It Works" button leading to the steps below it. On Home the section is
 * already there, so the link scrolls to it in place, smoothly unless the
 * visitor asked for reduced motion. On any other page the section doesn't
 * exist yet, so the link navigates to Home with the section's ID as the hash,
 * and Home scrolls to it on arrival and then clears the hash, so the address
 * bar stays free of hashes either way. Each link keeps its real address
 * (/#how-it-works), so a Ctrl, Cmd, Shift, Alt, or middle click is left to
 * the browser, which opens Home at that section. The modified click check is
 * shared with the card page's skip link. Adapted from hair-designs' own.
 *
 * Sections:
 *  - Helpers
 *  - Hooks
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region modCliFun

/**
 * modCliFun = Modified Click Function
 *
 * @summary
 * Whether a click on a link should be left to the browser: one made with a
 * modifier key held (Ctrl or Cmd to open a new tab, Shift for a new window,
 * Alt to download) or with any button but the main one. A link's click
 * handler returns early when this is true, so the link's own address opens
 * the browser's own way.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param cliEveObj - Click Event Object: The link's click event.
 *
 * @returns Whether the browser should handle the click itself.
 * @see {@link modCliBoo}
 *
 * @example
 * ```ts
 * modCliFun(cliEveObj) // => false for a plain click
 * ```
 *
*/

function modCliFun ( cliEveObj : React.MouseEvent< HTMLAnchorElement > ) : boolean {


	const altKeyBoo = cliEveObj.altKey;       // What: Alt Key Boolean. Why: An Alt click is one the browser handles its own way. How: This reads whether Alt was held.
	const conKeyBoo = cliEveObj.ctrlKey;      // What: Control Key Boolean. Why: Ctrl-click opens a new tab elsewhere. How: This reads whether Ctrl was held.
	const metKeyBoo = cliEveObj.metaKey;      // What: Meta Key Boolean. Why: Cmd-click opens a new tab on a Mac. How: This reads whether Cmd was held.
	const othButBoo = cliEveObj.button !== 0; // What: Other Button Boolean. Why: A middle click opens a new tab. How: This checks the click wasn't made with the main button.
	const shiKeyBoo = cliEveObj.shiftKey;     // What: Shift Key Boolean. Why: Shift-click opens a new window. How: This reads whether Shift was held.

	const modCliBoo = altKeyBoo || conKeyBoo || metKeyBoo || othButBoo || shiKeyBoo; // What: Modified Click Boolean. Why: Any one of these means the visitor asked the browser to open the link its own way. How: This combines them.



	return modCliBoo; // What: Modified Click Return. Why: The link's handler decides from this whether to step aside. How: This hands back the combined answer.


}

// #endregion modCliFun

// #endregion Helpers



// #region Hooks

// #region useSecLinFun

/**
 * useSecLinFun = Use Section Link Function
 *
 * @summary
 * Returns visSecFun, the function a section link calls with its section's ID.
 * When an element with that ID is on the page, visSecFun scrolls it into view,
 * jumping instead of gliding under reduced motion. When there isn't one,
 * visSecFun navigates to Home with the ID as the hash, inside the site
 * without a full page load, where Home scrolls to it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The function a section link calls with its section's ID.
 *
 * @example
 * ```ts
 * useSecLinFun() // => visSecFun, the function a section link calls with an ID
 * ```
 *
*/

function useSecLinFun () : ( secIdeStr : string ) => void {


	const navRouFun = useNavigate(); // What: Navigate Router Function. Why: A link on another page has to go to Home. How: This is the router's navigate function.



	return ( secIdeStr : string ) => { // What: Visit Section Function. Why: Every section link shares one way to reach its section. How: This scrolls to the section if it's on the page, or navigates to Home with its ID as the hash.


		const secCurEle = document.getElementById( secIdeStr ); // What: Section Current Element. Why: The section only exists on Home. How: This looks it up by its ID.


		if ( secCurEle ) { secCurEle.scrollIntoView( { behavior : redMotFun() ? 'auto' : 'smooth' } ); return; } // What: In-Page Scroll Guard. Why: On Home the section is already there. How: This scrolls it into view, jumping instead of gliding under reduced motion, and stops.



		void navRouFun( { hash : secIdeStr, pathname : '/' } ); // What: Home Navigation Call. Why: On any other page the section has to be loaded first. How: This navigates to Home with the section's ID as the hash, and Home scrolls to it on arrival; void marks the returned promise as deliberately unawaited.


	};


}

// #endregion useSecLinFun



// #region useSecCliFun

/**
 * useSecCliFun = Use Section Click Function
 *
 * @summary
 * Returns secCliFun, the click handler every section link shares. A Ctrl,
 * Cmd, Shift, Alt, or middle click is left to the browser, which opens the
 * link's own address. Any other click stops the browser's jump to the hash
 * and hands the section's ID to visSecFun, which scrolls to it on Home or
 * navigates to Home and the section from any other page. It reports whether
 * it handled the click, so a caller can react to the result.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The click handler, which takes the click event and the section's
 *          ID and returns whether it handled the click.
 *
 * @example
 * ```ts
 * useSecCliFun() // => secCliFun, the shared click handler
 * ```
 *
*/

function useSecCliFun () : ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => boolean {


	const visSecFun = useSecLinFun(); // What: Visit Section Function. Why: A plain click reaches its section through the shared path. How: This scrolls to the section on Home, or navigates to Home and the section.



	return ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Section Click Function. Why: Every section link handles a click the same way. How: This leaves a modified click to the browser and otherwise cancels the jump and visits the section.


		if ( modCliFun( cliEveObj ) ) return false; // What: Modified Click Guard. Why: A Ctrl, Cmd, Shift, Alt, or middle click asks the browser to open the link its own way. How: This leaves the click alone and reports it unhandled.



		cliEveObj.preventDefault(); // What: Default Navigation Cancel. Why: The browser would otherwise jump and leave the hash in the address. How: This stops the link's own navigation.

		visSecFun( secIdeStr ); // What: Section Visit Call. Why: The visitor should land on the section they chose. How: This scrolls to it, or navigates to Home and the section from another page.



		return true; // What: Handled Click Return. Why: A caller may want to react to a handled click. How: This reports the click handled.


	};


}

// #endregion useSecCliFun

// #endregion Hooks



// #region Exports

export { modCliFun, useSecCliFun, useSecLinFun }; // What: Named Exports. Why: Section links reach their sections through these, and the card page's skip link shares the modified click check. How: This exports the modified click check, the shared click handler, and useSecLinFun.

// #endregion Exports


