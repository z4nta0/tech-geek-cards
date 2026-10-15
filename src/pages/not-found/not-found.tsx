


// #region Imports

import cssModObj from './not-found.module.css'; // What: CSS Module Object. Why: The 404 page's own layout, drawing, and button styles live in its own module. How: This maps each class name in not-found.module.css to its hashed module class.


import { Link } from 'react-router'; // What: Link. Why: The page's buttons move to the home page and the Gallery without a full page load. How: This renders them as router links.


import type { JSX } from 'react'; // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * not-found.tsx = Not Found
 *
 * @summary
 * The page every unknown address shows, themed as a card lost in the mail: a
 * tipped envelope stamped Return to Sender, a large quiet 404 behind it, a
 * heading and a line saying the page doesn't exist, and two ways onward,
 * back home and to the Gallery. Its own title and a noindex robots tag keep
 * search engines from indexing it under every mistyped address. The
 * router's catch-all route renders it.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region NotFouCom

/**
 * NotFouCom = Not Found Component
 *
 * @summary
 * Renders the 404 page's title and its noindex robots tag, which React moves
 * into the document head, and the page itself. The large 404 and the
 * envelope drawing are hidden from screen readers as decoration, since the
 * heading already says the page wasn't found. Go Home routes to the root
 * path, and Browse the Gallery to the Gallery, the site's main action.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The 404 page's title, robots tag, and wrapper div.
 *
 * @example
 * ```tsx
 * NotFouCom() // => <NotFouCom />
 * ```
 *
*/

function NotFouCom () : JSX.Element {


	return (


		<>{ /* What: Not Found Fragment. Why: The page's head tags and its content render side by side. How: This groups them without adding an element. */ }


			<title>Page Not Found | TechGeek.cards</title>{ /* What: Page Title Element. Why: A visitor's tab and history should say the address they tried doesn't exist. How: React 19 moves this title into the document head while the page is shown. */ }

			<meta
				name='robots'

				content='noindex'
			/>{ /* What: Robots Meta Element. Why: The host answers every unknown path with the site and a 200 status, so search engines would otherwise index this page under every mistyped address. How: React 19 moves this tag into the document head while the page is shown. */ }



			<div className={ cssModObj.pagEntDiv }>{ /* What: Page Enter Div Element. Why: The 404 content sits centered in the page. How: This fills the screen above the footer, centering its content, and fades in like every page. */ }


				<div className={ cssModObj.nofInnDiv }>{ /* What: Not-Found Inner Div Element. Why: The number, the drawing, the text, and the buttons read as one centered block. How: This stacks them. */ }


					<div
						className={ cssModObj.errCodDiv }

						aria-hidden='true'
					>404</div>{ /* What: Error Code Div Element. Why: A large 404 tells a visitor at a glance what happened. How: This shows the number, hidden from screen readers since the heading says the same. */ }



					<svg
						className={ cssModObj.envDraSvg }

						fill='none'
						viewBox='0 0 200 140'

						aria-hidden='true'
					>{ /* What: Envelope Drawing SVG Element. Why: A lost envelope stamped Return to Sender gives the missing page the site's mail theme. How: This draws the envelope, its flap, a stamp, and a Return to Sender rubber stamp over the number, hidden from screen readers as decoration. */ }


						<rect
							className={ cssModObj.envBodRec }

							height='100'
							rx='6'
							strokeWidth='3'
							width='160'
							x='20'
							y='30'
						/>{ /* What: Envelope Body Rect Element. Why: The envelope's body is a white rounded rectangle. How: This draws it with an ink outline. */ }

						<path
							className={ cssModObj.envFlaPat }

							d='M 22 34 L 100 88 L 178 34'
							strokeLinejoin='round'
							strokeWidth='3'
						/>{ /* What: Envelope Flap Path Element. Why: The closed flap's fold marks the envelope's front. How: This draws the V of the fold in ink. */ }

						<rect
							className={ cssModObj.envStaRec }

							height='30'
							strokeDasharray='3 2'
							strokeWidth='2'
							width='26'
							x='144'
							y='40'
						/>{ /* What: Envelope Stamp Rect Element. Why: A stamp sits in the corner, its dashed edge standing for perforations. How: This draws a berry stamp in the upper right. */ }



						<g transform='rotate( -8 92 108 )'>{ /* What: Stamp Tilt Group Element. Why: A rubber stamp lands at an angle. How: This tips the stamp eight degrees around its own center, inside the envelope's lower half. */ }


							<g className={ cssModObj.retSenGro }>{ /* What: Return Sender Group Element. Why: The stamp's frame and words land together, the page's flair. How: This thunks both down once after the page arrives. */ }


								<rect
									className={ cssModObj.retSenRec }

									height='20'
									rx='2'
									strokeWidth='2'
									width='128'
									x='28'
									y='98'
								/>{ /* What: Return Sender Rect Element. Why: A rubber stamp's words sit in a ruled box. How: This draws the berry box, sized to fit inside the envelope even when tipped. */ }

								<text
									className={ cssModObj.retSenTex }

									dominantBaseline='central'
									fontSize='10'
									letterSpacing='1.2'
									textAnchor='middle'
									x='92'
									y='108.5'
								>RETURN TO SENDER</text>{ /* What: Return Sender Text Element. Why: The stamp says why the letter came back. How: This centers the words in the box in berry mono capitals. */ }


							</g>


						</g>


					</svg>



					<h1 className={ cssModObj.nofTitHea }>Lost in the mail</h1>{ /* What: Not-Found Title Heading Element. Why: The page's heading says what went wrong, in the site's mail theme. How: This shows it as the page's h1. */ }

					<p className={ cssModObj.nofDesPar }>{ /* What: Not-Found Description Paragraph Element. Why: A short line explains why the page is missing. How: This says the address doesn't exist or has moved. */ }
						The page you're looking for doesn't exist or has moved.
					</p>

					<div className={ cssModObj.nofActDiv }>{ /* What: Not-Found Actions Div Element. Why: A visitor who lands here gets two ways onward side by side. How: This sets the buttons in a row that wraps. */ }


						<Link
							className={ cssModObj.butPriAnc }

							to='/'
						>Go Home</Link>{ /* What: Go Home Link. Why: Home is the natural place to start over. How: This routes to the home page as a button. */ }



						<Link
							className={ cssModObj.butSecAnc }

							to='/gallery'
						>Browse the Gallery</Link>{ /* What: Browse Gallery Link. Why: Browsing cards is the site's main action. How: This routes to the Gallery as an outlined button. */ }


					</div>


				</div>


			</div>


		</>


	);


}

// #endregion NotFouCom

// #endregion Components



// #region Exports

export { NotFouCom }; // What: Named Exports. Why: The router's catch-all route renders the 404 page. How: This exports NotFouCom.

// #endregion Exports


