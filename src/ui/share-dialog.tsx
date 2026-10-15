



// #region Imports

import cssModObj from './share-dialog.module.css'; // What: CSS Module Object. Why: The dialog's panel, fields, and buttons are styled in its own module. How: This maps each class name in share-dialog.module.css to its hashed module class.


import { Link      } from 'react-router'; // What: Link. Why: The dialog's preview link opens the card without a full page load. How: This renders it as a router link.
import { useEffect } from 'react';        // What: Use Effect. Why: The dialog has to open as a modal once it's on the page. How: This calls showModal after the first render.
import { useRef    } from 'react';        // What: Use Ref. Why: Opening and closing a dialog are methods on its element. How: This holds the dialog element.
import { useState  } from 'react';        // What: Use State. Why: The dialog remembers the name typed, whether the link was copied, and whether it's closing. How: This holds each of them.


import type { CarRecTyp      } from './cards.ts'; // What: Card Record Type. Why: The dialog shares one card. How: This types its card prop.
import type { JSX            } from 'react';      // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.
import type { SyntheticEvent } from 'react';      // What: Synthetic Event. Why: The dialog's cancel event is handled. How: This types the event its handler receives.

// #endregion Imports



/**
 * share-dialog.tsx = Share Dialog
 *
 * @summary
 * The dialog that sends a card: the card's name, a field for the
 * recipient's name on a card that shows one, the card's link (with the
 * name added to it), a Copy Link button, the device's own share sheet where
 * the browser offers one, and a link to preview the card exactly as it will
 * arrive. It's the browser's native modal dialog, so focus stays inside it,
 * the page behind is inert, and Escape closes it; Escape, a click on the
 * backdrop, and the close button all play a short closing animation first.
 * A page mounts it, keyed by the card, when a Share button is pressed, and
 * unmounts it when it calls back that it has closed, so every opening starts
 * fresh.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

type SdcProTyp = { carRecObj : CarRecTyp, onCloFun : () => void }; // What: Share-Dialog-Component Props Type. Why: The dialog shares one card and tells its page when it has closed. How: This types ShaDiaCom's props.

// #region ShaDiaCom

/**
 * ShaDiaCom = Share Dialog Component
 *
 * @summary
 * Renders the share dialog for one card and opens it as a modal as soon as
 * it mounts. The link is the card's address on this site, plus ?name= with
 * the trimmed name for a card that takes one. Copy Link writes the link to
 * the clipboard and says so (or, if the browser refuses, says to copy it by
 * hand); typing a new name resets that message. The share sheet button only
 * renders where navigator.share exists, and a dismissed sheet is ignored.
 * Closing sets the closing class, whose animation's end closes the element
 * and calls onCloFun, so the page can unmount the dialog; under reduced
 * motion that animation runs for a hundredth of a millisecond, so its end
 * still fires.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.carRecObj - Card Record Object: The card being shared.
 * @param props.onCloFun  - On Close Function: Called once the dialog has
 *                          finished closing.
 *
 * @returns The dialog element.
 *
 * @example
 * ```tsx
 * ShaDiaCom({ carRecObj, onCloFun }) // => <ShaDiaCom />
 * ```
 *
*/

function ShaDiaCom ( { carRecObj, onCloFun } : SdcProTyp ) : JSX.Element {


	const diaEleRef = useRef< HTMLDialogElement >( null ); // What: Dialog Element Reference. Why: Opening and closing are methods on the dialog element. How: This holds the rendered dialog.


	const [ cloBoo,    setCloBoo    ] = useState( false );                                  // What: Closing Boolean And Setter. Why: The dialog plays its closing animation before it actually closes. How: This turns the closing class on.
	const [ copStaStr, setCopStaStr ] = useState< 'copied' | 'failed' | 'idle' >( 'idle' ); // What: Copy Status String And Setter. Why: The dialog says whether the link was copied. How: This starts idle, and Copy Link sets it.
	const [ namValStr, setNamValStr ] = useState( '' );                                     // What: Name Value String And Setter. Why: A customizable card's link carries the name typed. How: This holds the name field's text.



	useEffect( () => { // What: Open Effect. Why: A dialog only becomes modal, with its inert backdrop and trapped focus, through showModal. How: This opens it once it's on the page.


		if ( diaEleRef.current && !diaEleRef.current.open ) diaEleRef.current.showModal(); // What: Show Modal Call. Why: The dialog mounts closed. How: This opens it as a modal, unless development's double effect already has.


	}, [] ); // What: Effect Dependency Array. Why: The dialog opens once per mount. How: The page remounts it, keyed by the card, for each new share.



	const triNamStr = namValStr.trim();                                            // What: Trimmed Name String. Why: Stray spaces shouldn't end up on the card. How: This trims the name field's text.
	const linUrlObj = new URL( `/${ carRecObj.sluStr }`, window.location.origin ); // What: Link URL Object. Why: The link points at the card on whichever address the site is served from. How: This builds the card's absolute address.


	if ( carRecObj.cusBoo && triNamStr ) linUrlObj.searchParams.set( 'name', triNamStr ); // What: Name Parameter Set. Why: A customizable card reads the recipient's name from its address. How: This adds the trimmed name as ?name=, encoded, when there is one.



	const canShaBoo = typeof navigator.share === 'function';          // What: Can Share Boolean. Why: Only some browsers, mostly on phones, offer a share sheet. How: This checks whether navigator.share exists.
	const prePatStr = `${ linUrlObj.pathname }${ linUrlObj.search }`; // What: Preview Path String. Why: The preview link should open the card exactly as it will arrive. How: This keeps the link's path and its name parameter.



	const cloDiaFun = () => setCloBoo( true ); // What: Close Dialog Function. Why: Every way of closing plays the closing animation first. How: This turns the closing class on, and the animation's end does the rest.



	// #region copLinFun

	/**
	 * copLinFun = Copy Link Function
	 *
	 * @summary
	 * Writes the card's link to the clipboard and records whether it worked.
	 * The clipboard can refuse, for example in an older browser or a page
	 * without permission, and then the status asks the visitor to copy the
	 * link by hand from its field.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param void - This function takes no parameters.
	 *
	 * @returns A promise that settles once the copy is tried and the status is
	 *          set, with no value.
	 *
	 * @example
	 * ```ts
	 * copLinFun() // => Promise<void>
	 * ```
	 *
	*/

	const copLinFun = async () : Promise< void > => { // What: Copy Link Function. Why: Copying the link is the main way to send a card. How: This writes the link to the clipboard and sets the copy status.


		try {


			await navigator.clipboard.writeText( linUrlObj.href ); // What: Clipboard Write Call. Why: The visitor pastes the link into a message. How: This writes the full link.

			setCopStaStr( 'copied' ); // What: Copied Status Set. Why: The visitor should know it worked. How: This switches the button and status to Copied.


		}

		catch { setCopStaStr( 'failed' ); }


	};

	// #endregion copLinFun



	// #region natShaFun

	/**
	 * natShaFun = Native Share Function
	 *
	 * @summary
	 * Opens the device's own share sheet with the card's title and link, so a
	 * visitor on a phone can send it straight to a message or an app. Closing
	 * the sheet without sharing rejects the promise, which is expected and
	 * ignored.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param void - This function takes no parameters.
	 *
	 * @returns A promise that settles once the sheet closes, with no value.
	 *
	 * @example
	 * ```ts
	 * natShaFun() // => Promise<void>
	 * ```
	 *
	*/

	const natShaFun = async () : Promise< void > => { // What: Native Share Function. Why: Phones can send a link straight to an app. How: This opens the share sheet with the card's title and link.


		try { await navigator.share( { text : `A ${ carRecObj.titStr } card for you!`, title : carRecObj.titStr, url : linUrlObj.href } ); }

		catch { return; }


	};

	// #endregion natShaFun



	return (


		<dialog
			ref={ diaEleRef }

			className={ ` ${ cssModObj.shaDiaDia }   ${ cloBoo ? cssModObj.shaDiaDiaClosing : '' } ` }

			aria-labelledby='shaTitHea'

			onAnimationEnd={ ( aniEveObj ) => { if ( aniEveObj.animationName === cssModObj.shaDiaDiaCloseFadeOut ) { diaEleRef.current?.close(); onCloFun(); } } } // What: Closing Animation End Handler. Why: The dialog should only close once its panel's closing animation has played. How: When the panel's own closing keyframe ends, this closes the element and tells the page, which unmounts it; every other animation's end, the backdrop's and the copy label's included, is ignored.
			onCancel={ ( canEveObj : SyntheticEvent ) => { canEveObj.preventDefault(); cloDiaFun(); } } // What: Cancel Handler. Why: Escape would close the dialog at once, skipping its animation. How: This stops the browser's own close and starts the animated one.
			onClick={ ( cliEveObj ) => { if ( cliEveObj.target === cliEveObj.currentTarget ) cloDiaFun(); } } // What: Backdrop Click Handler. Why: A click outside the panel should close the dialog. How: The panel fills the dialog, so a click landing on the dialog element itself was on the backdrop, and this closes it.
		>{ /* What: Share Dialog Element. Why: Sharing a card happens in a modal over the page. How: This is the native dialog ShaDiaCom opens as a modal, styled as a rounded panel. */ }


			<div className={ cssModObj.shaInnDiv }>{ /* What: Share Inner Div Element. Why: The panel's content fills the dialog, so clicks inside it never count as backdrop clicks. How: This stacks the dialog's content with padding. */ }


				<button
					className={ cssModObj.shaCloBut }

					type='button'

					aria-label='Close'

					onClick={ cloDiaFun }
				>{ /* What: Share Close Button Element. Why: The dialog needs a visible way to close. How: This plays the closing animation and closes it. */ }


					<svg
						fill='none'
						height='16'
						stroke='currentColor'
						strokeLinecap='round'
						strokeWidth='2'
						viewBox='0 0 16 16'
						width='16'

						aria-hidden='true'
					>{ /* What: Close Icon SVG Element. Why: A cross reads as close. How: This draws two crossing lines, hidden from screen readers since the button is labelled. */ }


						<path d='M 3 3 L 13 13 M 13 3 L 3 13' />{ /* What: Close Cross Path Element. Why: The cross is the icon. How: This draws both strokes. */ }


					</svg>


				</button>

				<p className={ cssModObj.shaEyePar }>Ready to send</p>{ /* What: Share Eyebrow Paragraph Element. Why: A small label sets the dialog's purpose above its title. How: This shows it in berry mono capitals. */ }

				<h2
					id='shaTitHea' // What: Share Title Heading Identifier. Why: The dialog is named by its heading. How: The dialog's aria-labelledby points here, and only one share dialog exists at a time.

					className={ cssModObj.shaTitHea }
				>{ carRecObj.titStr }</h2>{ /* What: Share Title Heading Element. Why: The dialog says which card is being sent. How: This shows the card's title. */ }

				{ carRecObj.cusBoo && ( // What: Name Field Check. Why: Only a card that shows a name should ask for one. How: This renders the name field when the card is customizable.


					<div className={ cssModObj.fieGroDiv }>{ /* What: Field Group Div Element. Why: The name's label, field, and hint read as one unit. How: This stacks them. */ }


						<label
							className={ cssModObj.fieLabLab }

							htmlFor='recNamInp'
						>Their name (optional)</label>{ /* What: Field Label Label Element. Why: The name field needs a visible label. How: This labels recNamInp. */ }

						<input
							id='recNamInp'

							className={ cssModObj.fieTexInp }

							autoComplete='off'
							maxLength={ 30 }
							placeholder='Alex'
							spellCheck={ false }
							type='text'
							value={ namValStr }

							aria-describedby='recNamHin'

							onChange={ ( chaEveObj ) => { setNamValStr( chaEveObj.target.value ); setCopStaStr( 'idle' ); } } // What: Name Change Handler. Why: A changed name makes a new link, so an earlier Copied no longer applies. How: This stores the text and resets the copy status.
						/>{ /* What: Recipient Name Input Element. Why: The card can greet its recipient by name. How: This takes up to 30 characters, added to the link as it's typed. */ }

						<p
							id='recNamHin'

							className={ cssModObj.fieHinPar }
						>It appears on the card as it opens.</p>{ /* What: Recipient Name Hint Paragraph Element. Why: The visitor should know where the name shows up. How: This explains it under the field, read with it by screen readers. */ }


					</div>


				) }

				<div className={ cssModObj.fieGroDiv }>{ /* What: Field Group Div Element. Why: The link's label and field read as one unit. How: This stacks them. */ }


					<label
						className={ cssModObj.fieLabLab }

						htmlFor='carLinInp'
					>Card link</label>{ /* What: Field Label Label Element. Why: The link field needs a visible label. How: This labels carLinInp. */ }

					<input
						id='carLinInp'

						className={ ` ${ cssModObj.fieTexInp }   ${ cssModObj.fieLinInp } ` }

						readOnly
						type='text'
						value={ linUrlObj.href }

						onFocus={ ( focEveObj ) => focEveObj.currentTarget.select() } // What: Link Focus Handler. Why: Someone copying by hand wants the whole link. How: This selects it all when the field gains focus.
					/>{ /* What: Card Link Input Element. Why: The link should be visible, and copyable by hand if the button can't. How: This shows the link read-only in mono. */ }


				</div>

				<div className={ cssModObj.shaActDiv }>{ /* What: Share Actions Div Element. Why: The ways to send the card sit together. How: This sets the buttons and the preview link in a wrapping row. */ }


					<button
						className={ cssModObj.copLinBut }

						type='button'

						onClick={ copLinFun }
					>{ /* What: Copy Link Button Element. Why: Copying the link is the main way to send a card. How: This copies it and swaps its label to Copied. */ }


						<span
							key={ copStaStr } // What: Copy Label Key. Why: The label should fade in afresh each time it changes. How: A new key remounts the span, replaying its entrance.

							className={ cssModObj.copLabSpa }
						>{ copStaStr === 'copied' ? 'Copied!' : 'Copy Link' }</span>{ /* What: Copy Label Span Element. Why: The button says when the link is on the clipboard. How: This shows Copied after a copy, and Copy Link otherwise. */ }


					</button>

					{ canShaBoo && ( // What: Share Sheet Check. Why: Only browsers with a share sheet can open one. How: This renders the button when navigator.share exists.


						<button
							className={ cssModObj.natShaBut }

							type='button'

							onClick={ natShaFun }
						>Share To…</button> // What: Native Share Button Element. Why: On a phone, sending straight to an app is quickest. How: This opens the device's share sheet.


					) }

					<Link
						className={ cssModObj.shaPreAnc }

						to={ prePatStr }
					>Preview card <span className={ cssModObj.shaArrSpa } aria-hidden='true'>→</span></Link>{ /* What: Share Preview Anchor Element. Why: The sender may want to see the card as it will arrive. How: This opens the card with the same name in its address, its arrow hidden from screen readers. */ }


				</div>

				<p
					className={ cssModObj.shaStaPar }

					role='status'
				>{ copStaStr === 'copied' ? 'Link copied. Paste it into a text, an email, or a message.' : copStaStr === 'failed' ? 'Your browser blocked copying. Select the link above and copy it.' : '' }</p>{ /* What: Share Status Paragraph Element. Why: The result of a copy should be announced and seen. How: This live region says the link was copied, or how to copy it by hand. */ }


			</div>


		</dialog>


	);


}

// #endregion ShaDiaCom

// #endregion Components



// #region Exports

export { ShaDiaCom }; // What: Named Exports. Why: Home, the Gallery, and the card pages open the share dialog. How: This exports ShaDiaCom.

// #endregion Exports


