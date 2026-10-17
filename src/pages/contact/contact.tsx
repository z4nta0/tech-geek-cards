


// #region Imports

import cssModObj from './contact.module.css'; // What: CSS Module Object. Why: Contact's hero, form, and sidebar are styled in its own module. How: This maps each class name in contact.module.css to its hashed module class.


import { ConCirCom    } from '../../ui/confetti-circuit.tsx';          // What: Confetti Circuit Component. Why: The hero carries the site's motif. How: The page sets it behind the hero.
import { usePagDesFun } from 'techgeek-design/ui/page-description.ts'; // What: Use Page Description Function. Why: Contact's search description differs from the home page's. How: The page calls it to swap the one description tag's text while it shows.
import { useState     } from 'react';                                  // What: Use State. Why: The page remembers the form's fields and whether a message is sending, sent, or failed. How: This holds each of them.


import type { ChangeEvent } from 'react'; // What: Change Event. Why: Every field shares one change handler. How: This types the event it receives.
import type { FormEvent   } from 'react'; // What: Form Event. Why: The form's submit handler sends the message. How: This types the event it receives.
import type { JSX         } from 'react'; // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * contact.tsx = Contact
 *
 * @summary
 * The page for getting in touch: a hero, then the contact form beside a
 * short sidebar with the email address and what to include when asking for
 * a custom card. The form sends through Netlify Forms, as TechGeek.dev's
 * does: a hidden copy in index.html registers its fields, and the page posts
 * them to the site's root as form contact, with a honeypot for bots. A sent
 * message swaps the form for a thank-you.
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

const EMP_FOR_OBJ = { 'bot-field' : '', email : '', message : '', name : '', topic : '' }; // What: Empty Form Object. Why: The form starts empty and empties again for another message. How: Its keys match each field's name attribute and the hidden form in index.html.



const TOP_OPT_ARR = [ 'A custom card', 'A question about a card', 'Something else' ]; // What: Topic Option Array. Why: Knowing what a message is about helps answer it. How: The topic menu offers each option.

// #endregion Constants



// #region Components

// #region ConPagCom

/**
 * ConPagCom = Contact Page Component
 *
 * @summary
 * Renders the Contact page and its title and canonical link, and swaps in
 * its search description. The fields are controlled through one change
 * handler keyed by each field's name. The browser checks the required
 * fields and the email format before the submit handler runs, which posts
 * the fields form-encoded to the site's root under the contact form's name,
 * with the topic or Not specified when none was chosen. Only an ok reply
 * counts as sent; a failed reply or a network failure is logged and shown
 * above the button. The button reads Sending while the message is on its
 * way. A sent message shows the thank-you, whose button empties the form for
 * another message.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The page's head tags and its wrapper div.
 *
 * @example
 * ```tsx
 * ConPagCom() // => <ConPagCom />
 * ```
 *
*/

function ConPagCom () : JSX.Element {


	const [ errMesStr, setErrMesStr ] = useState< string | null >( null ); // What: Error Message String And Setter. Why: A failed send has to say so. How: This starts with no error.
	const [ forDatObj, setForDatObj ] = useState( EMP_FOR_OBJ );           // What: Form Data Object And Setter. Why: The fields are controlled, so their values live here. How: This starts with every field empty.
	const [ isaLoaBoo, setIsaLoaBoo ] = useState( false );                 // What: Is-A Loading Boolean And Setter. Why: The button shows Sending while the message is on its way. How: This starts false.
	const [ isaSenBoo, setIsaSenBoo ] = useState( false );                 // What: Is-A Sent Boolean And Setter. Why: A sent message swaps the form for a thank-you. How: This starts false.



	usePagDesFun( 'Ask about a custom greeting card, or about a card in the gallery. Write to TechGeek.cards and z4nta0 will reply by email.' ); // What: Page Description Call. Why: Search listings should describe this page, not repeat the home page. How: This swaps the one description tag's text for the page's own while it shows.



	// #region chaFieFun

	/**
	 * chaFieFun = Change Field Function
	 *
	 * @summary
	 * Writes one field's edit into the form's state. The edited field's name
	 * attribute picks the key it writes, so every field's name has to match a
	 * key of EMP_FOR_OBJ (name, email, topic, message, or bot-field); a field
	 * named anything else would add a stray key that never posts. The previous
	 * fields are copied, so the other fields keep their values.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param chaEveObj - Change Event Object: The edited field's change event.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * chaFieFun(chaEveObj) // => void
	 * ```
	 *
	*/

	const chaFieFun = ( chaEveObj : ChangeEvent< HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement > ) => setForDatObj( ( preForObj ) => ( { ...preForObj, [ chaEveObj.target.name ] : chaEveObj.target.value } ) ); // What: Change Field Function. Why: Every field updates the same form object. How: This copies the form and sets the changed field by its name.

	// #endregion chaFieFun



	const resForFun = () => { // What: Reset Form Function. Why: The thank-you's button lets a visitor send another message. How: This hides the thank-you and empties the fields.


		setIsaSenBoo( false ); // What: Sent Flag Reset Call. Why: The form shows again in place of the thank-you. How: This clears the sent flag.

		setForDatObj( EMP_FOR_OBJ ); // What: Fields Reset Call. Why: The next message starts blank. How: This restores the empty form.


	};



	// #region subForFun

	/**
	 * subForFun = Submit Form Function
	 *
	 * @summary
	 * Sends the form through Netlify Forms, running only once the browser has
	 * passed the required fields and the email format. It stops the browser's
	 * own submission, marks the form as sending, and clears any earlier error,
	 * then posts the fields form-encoded to the site's root under the contact
	 * form's name, which Netlify matches to the hidden copy of the form in
	 * index.html. Only an ok reply counts as success; a failed reply or a
	 * network failure is logged and shown as an error. Sending ends either
	 * way.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param subEveObj - Submit Event Object: The form's submit event.
	 *
	 * @returns A promise that settles once the send has succeeded or failed,
	 *          with no value.
	 *
	 * @example
	 * ```ts
	 * subForFun(subEveObj) // => Promise<void>
	 * ```
	 *
	*/

	const subForFun = async ( subEveObj : FormEvent ) => { // What: Submit Form Function. Why: The form's submission sends the message. How: This posts the fields to Netlify Forms and records the outcome.


		subEveObj.preventDefault(); // What: Default Submission Prevention Call. Why: The browser would otherwise reload the page to submit the form. How: This stops it, so the message is sent in the background.

		setIsaLoaBoo( true ); // What: Loading Flag Set Call. Why: The button shows Sending while the message is on its way. How: This sets the loading flag.

		setErrMesStr( null ); // What: Error Clear Call. Why: A new attempt shouldn't show the last one's error. How: This clears it.



		try {


			const senResObj = await fetch( '/', { // What: Send Response Object. Why: Netlify Forms takes a form-encoded POST on any path of the site and matches it to a detected form by its form-name field. How: This posts the fields to the site's root.


				headers : { 'Content-Type' : 'application/x-www-form-urlencoded' }, // What: Headers. Why: Netlify only parses a form-encoded body. How: This sets the matching content type.
				method  : 'POST',                                                   // What: Method. Why: A form submission is a POST. How: This sets it.

				body : new URLSearchParams({ // What: Body. Why: Netlify reads a standard form-encoded body whose field names match the hidden form in index.html. How: This encodes the form's name, the honeypot, and the four real fields.


					'bot-field' : forDatObj[ 'bot-field' ],          // What: Bot Field. Why: Netlify drops a submission whose honeypot is filled, which a person never does. How: This posts the hidden field as it stands.
					email       : forDatObj.email,                   // What: Email. Why: Netlify sets a field named email as the notification's reply-to, so a reply goes straight back to the visitor. How: This sends the address they entered.
					'form-name' : 'contact',                         // What: Form Name. Why: Netlify matches the POST to its detected form by this field. How: This names the contact form.
					message     : forDatObj.message,                 // What: Message. Why: The message is the point of the email. How: This sends what they wrote.
					name        : forDatObj.name,                    // What: Name. Why: The email says who wrote. How: This sends the name they entered.
					topic       : forDatObj.topic || 'Not specified' // What: Topic. Why: The email says what the message is about. How: This sends the choice, or Not specified when none was made.


				}).toString() // What: Body String Call. Why: Netlify reads the fields as one form-encoded string. How: This serializes the URLSearchParams into it.


			} );


			if ( !senResObj.ok ) throw new Error( `Netlify Forms answered with status ${ senResObj.status }.` ); // What: Failed Reply Guard. Why: Netlify can take the connection yet reject the submission, which must not show the thank-you. How: This throws into the catch below.



			setIsaSenBoo( true ); // What: Sent Flag Set Call. Why: The message went out. How: This swaps the form for the thank-you.


		}

		catch ( errCatObj ) {


			console.warn( errCatObj ); // What: Error Warning Call. Why: A failed send should stay visible to anyone debugging. How: This logs the error.

			setErrMesStr( 'Something went wrong. Please try again or email contact@techgeek.cards directly.' ); // What: Error Message Set Call. Why: The visitor needs to know the message didn't go out and how else to reach z4nta0. How: This shows the error above the button.


		}

		finally { setIsaLoaBoo( false ); } // What: Loading Flag Clear Call. Why: Sending is over whether it worked or not. How: This clears the loading flag.


	};

	// #endregion subForFun



	return (


		<>{ /* What: Contact Fragment. Why: The page's head tags and its content render side by side. How: This groups them without adding an element. */ }


			<title>Contact | TechGeek.cards</title>{ /* What: Page Title Element. Why: A visitor's tab and history should name the page. How: React 19 moves this title into the document head while the page is shown. */ }

			<link
				href='https://techgeek.cards/contact'
				rel='canonical'
			/>{ /* What: Canonical Link Element. Why: Search engines should treat every address that reaches Contact as one page. How: React 19 moves this link into the head while the page is shown. */ }



			<div className={ cssModObj.pagEntDiv }>{ /* What: Page Enter Div Element. Why: The page fades up into view as it opens. How: This wraps every section and plays the shared entrance. */ }


				<section className={ cssModObj.conHerSec }>{ /* What: Contact Hero Section Element. Why: The page opens on its heading over the site's motif. How: This holds the motif and the hero's text, its bottom edge cut in scallops like a stamp's. */ }


					<ConCirCom patOpaStr='var( --cdn-pow-007-rec )' />{ /* What: Confetti Circuit Component. Why: The hero carries the site's motif behind its content. How: This draws the pattern at about 14% strength. */ }{ /* Core-Design-Number to the Power of 7 Reciprocal ~= 0.140 */ }



					<div className={ cssModObj.herInnDiv }>{ /* What: Hero Inner Div Element. Why: The hero's text sits in the site's centered column. How: This caps, centers, and stacks it. */ }


						<p className={ cssModObj.secEyePar }>Get in touch</p>{ /* What: Section Eyebrow Paragraph Element. Why: A small label names the page. How: This shows it in berry mono capitals. */ }

						<h1 className={ cssModObj.herTitHea }>Let's make something to celebrate</h1>{ /* What: Hero Title Heading Element. Why: The heading invites a message. How: This shows the page's h1. */ }

						<p className={ cssModObj.herLeaPar }>{ /* What: Hero Lead Paragraph Element. Why: A line says what a visitor can write about. How: This mentions custom cards and questions. */ }
							Have an idea for a custom card, or a question about one of these? Send a note and I'll get back to you.
						</p>


					</div>


				</section>



				<section className={ cssModObj.conBodSec }>{ /* What: Contact Body Section Element. Why: The form and the sidebar are the page's content. How: This holds them in the site's centered column. */ }


					<div className={ cssModObj.conInnDiv }>{ /* What: Contact Inner Div Element. Why: The form and the sidebar sit side by side on wide screens. How: This lays them out in two columns, stacking on phones. */ }


						{ isaSenBoo ? ( // What: Sent Check. Why: A sent message replaces the form with a thank-you. How: This renders the thank-you once sent, and the form until then.


							<div
								className={ cssModObj.thaYouDiv }

								role='status'
							>{ /* What: Thank You Div Element. Why: The visitor should know the message went out. How: This live region shows the thanks and a way to send another. */ }


								<h2 className={ cssModObj.thaTitHea }>Message sent!</h2>{ /* What: Thank Title Heading Element. Why: The headline confirms the send. How: This shows it as an h2. */ }

								<p className={ cssModObj.thaTexPar }>Thanks for writing. I'll reply to the email address you gave.</p>{ /* What: Thank Text Paragraph Element. Why: The visitor should know what happens next. How: This says a reply will come by email. */ }

								<button
									className={ cssModObj.butSecBut }

									type='button'

									onClick={ resForFun }
								>Send Another</button>{ /* What: Button Secondary Button Element. Why: A visitor may have more to say. How: This empties the form and shows it again. */ }


							</div>


						) : ( // What: Form Branch. Why: Until a message is sent, the form shows. How: This renders the form.


							<form
								className={ cssModObj.conForFor }

								name='contact'

								onSubmit={ subForFun }
							>{ /* What: Contact Form Form Element. Why: A visitor writes their message here. How: The browser first checks the required fields and the email format, then this sends the fields through Netlify Forms. */ }


								<p
									className={ cssModObj.botFiePar }

									aria-hidden='true'
								>{ /* What: Bot Field Paragraph Element. Why: The honeypot has to exist in the form without a person ever seeing it. How: This hides it off screen and from screen readers. */ }


									<label>{ /* What: Honeypot Label Element. Why: A hidden field still needs a label. How: This wraps the honeypot input in its label text. */ }


										Leave this field blank

										<input
											name='bot-field'

											autoComplete='off'
											value={ forDatObj[ 'bot-field' ] }

											tabIndex={ -1 }

											onChange={ chaFieFun }
										/>{ /* What: Bot Field Input Element. Why: A filled honeypot marks a bot. How: This writes into the form's bot-field through the shared change handler and posts with the other fields. */ }


									</label>


								</p>


								<div className={ cssModObj.fieRowDiv }>{ /* What: Field Row Div Element. Why: The name and email sit side by side on wide screens. How: This lays them out in two columns, stacking on phones. */ }


									<div className={ cssModObj.fieGroDiv }>{ /* What: Field Group Div Element. Why: A label and its field read as one unit. How: This stacks them. */ }


										<label
											className={ cssModObj.fieLabLab }

											htmlFor='conNamInp'
										>Your name</label>{ /* What: Field Label Label Element. Why: The name field needs a visible label. How: This labels conNamInp. */ }

										<input
											id='conNamInp'

											className={ cssModObj.fieTexInp }

											name='name'

											autoComplete='name'
											required
											type='text'
											value={ forDatObj.name }

											onChange={ chaFieFun }
										/>{ /* What: Field Text Input Element. Why: The name field takes the visitor's name, so the reply can greet the visitor by name. How: This takes their name, required. */ }


									</div>

									<div className={ cssModObj.fieGroDiv }>{ /* What: Field Group Div Element. Why: A label and its field read as one unit. How: This stacks them. */ }


										<label
											className={ cssModObj.fieLabLab }

											htmlFor='conEmaInp'
										>Your email</label>{ /* What: Field Label Label Element. Why: The email field needs a visible label. How: This labels conEmaInp. */ }

										<input
											id='conEmaInp'

											className={ cssModObj.fieTexInp }

											name='email'

											autoComplete='email'
											required
											type='email'
											value={ forDatObj.email }

											onChange={ chaFieFun }
										/>{ /* What: Field Text Input Element. Why: The email field takes the address the reply goes back to this address. How: This takes their email, required and checked for its format. */ }


									</div>


								</div>


								<div className={ cssModObj.fieGroDiv }>{ /* What: Field Group Div Element. Why: A label and its field read as one unit. How: This stacks them. */ }


									<label
										className={ cssModObj.fieLabLab }

										htmlFor='conTopSel'
									>What's it about?</label>{ /* What: Field Label Label Element. Why: The topic menu needs a visible label. How: This labels conTopSel. */ }

									<select
										id='conTopSel'

										className={ cssModObj.fieTopSel }

										name='topic'

										value={ forDatObj.topic }

										onChange={ chaFieFun }
									>{ /* What: Field Topic Select Element. Why: Knowing the topic helps answer the message. How: This offers the topics, starting unchosen. */ }


										<option value=''>Choose a topic</option>{ /* What: Placeholder Option Element. Why: The menu starts without a choice, since the topic is optional. How: This shows a prompt with an empty value. */ }

										{ TOP_OPT_ARR.map( ( topOptStr ) => ( // What: Topic Option Map Call. Why: Every topic gets an option. How: This renders one option per topic.


											<option
												key={ topOptStr }

												value={ topOptStr }
											>{ topOptStr }</option> // What: Topic Option Element. Why: Each topic is one choice. How: This offers the topic, its text as its value.


										))}


									</select>


								</div>

								<div className={ cssModObj.fieGroDiv }>{ /* What: Field Group Div Element. Why: A label and its field read as one unit. How: This stacks them. */ }


									<label
										className={ cssModObj.fieLabLab }

										htmlFor='conMesTex'
									>Message</label>{ /* What: Field Label Label Element. Why: The message field needs a visible label. How: This labels conMesTex. */ }

									<textarea
										id='conMesTex'

										className={ cssModObj.fieMesTex }

										name='message'

										placeholder='Tell me about the occasion, who the card is for, and when you need it.'
										required
										rows={ 6 }
										value={ forDatObj.message }

										onChange={ chaFieFun }
									/>{ /* What: Field Message Textarea Element. Why: The message is the point of the form. How: This takes it, required, six rows tall. */ }


								</div>

								{ errMesStr && ( // What: Error Message Check. Why: A failed send has to say so at once. How: This shows the error when there is one.


									<p
										className={ cssModObj.errMesPar }

										role='alert'
									>{ errMesStr }</p> // What: Error Message Paragraph Element. Why: The visitor needs to know the message didn't go out. How: This alert shows the error, announced at once.


								) }

								<button
									className={ cssModObj.subForBut }

									disabled={ isaLoaBoo }
									type='submit'
								>{ isaLoaBoo ? 'Sending…' : 'Send Message' }</button>{ /* What: Submit Form Button Element. Why: The visitor sends the message. How: This submits the form, reading Sending and turning off while the message is on its way. */ }


							</form>


						) }



						<aside className={ cssModObj.conSidAsi }>{ /* What: Contact Sidebar Aside Element. Why: The email and the tips for a custom card sit beside the form. How: This stacks them in a white card. */ }


							<h2 className={ cssModObj.sidTitHea }>Other ways to reach me</h2>{ /* What: Sidebar Title Heading Element. Why: The sidebar has its own heading. How: This shows it as an h2. */ }

							<a
								className={ cssModObj.sidEmaAnc }

								href='mailto:contact@techgeek.cards'
							>contact@techgeek.cards</a>{ /* What: Sidebar Email Anchor Element. Why: Some visitors would rather send an email. How: This opens their mail app addressed to the site. */ }

							<h3 className={ cssModObj.sidSubHea }>Asking for a custom card?</h3>{ /* What: Sidebar Subheading Heading Element. Why: Tips for a custom card get their own heading. How: This shows it as an h3. */ }

							<ul className={ cssModObj.sidTipUno }>{ /* What: Sidebar Tip Unordered Element. Why: A few details make a custom card easier to plan. How: This lists them. */ }


								<li className={ cssModObj.sidTipIte }>The occasion and the date you need it by</li>{ /* What: Sidebar Tip Item Element. Why: Timing shapes what can be built. How: This asks for the occasion and the date. */ }

								<li className={ cssModObj.sidTipIte }>Who it's for, and any names or words to include</li>{ /* What: Sidebar Tip Item Element. Why: A card feels personal through its details. How: This asks for names and words. */ }

								<li className={ cssModObj.sidTipIte }>A card from the Gallery you like the feel of</li>{ /* What: Sidebar Tip Item Element. Why: A favorite card is the quickest way to describe a style. How: This asks for one. */ }


							</ul>


						</aside>


					</div>


				</section>


			</div>


		</>


	);


}

// #endregion ConPagCom

// #endregion Components



// #region Exports

export { ConPagCom }; // What: Named Exports. Why: The router's contact route renders the Contact page. How: This exports ConPagCom.

// #endregion Exports


