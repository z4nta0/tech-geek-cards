


// #region Imports

import cssModObj from './confetti-circuit.module.css'; // What: CSS Module Object. Why: The pattern's positioning and confetti colors live in its own module. How: This maps each class name in confetti-circuit.module.css to its hashed module class.


import { useId } from 'react'; // What: Use ID. Why: Each pattern needs an id no other pattern on the page shares. How: This gives every instance its own stable id.


import type { JSX } from 'react'; // What: JSX. Why: The component declares the element it returns. How: This types its return as a JSX element.

// #endregion Imports



/**
 * confetti-circuit.tsx = Confetti Circuit
 *
 * @summary
 * TechGeek.cards' own background motif: circuit board traces, the family's
 * tech side, that end in bursts of confetti, this site's celebration side.
 * One 120px tile of blue traces and pads, finished with orange, blue, and
 * berry confetti pieces and a sparkle, repeats across its section behind the
 * content, faded to the strength the section asks for. It's decoration only,
 * so it's hidden from screen readers.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

type CccProTyp = { patOpaStr : string }; // What: Confetti-Circuit-Component Props Type. Why: Each section picks how strongly the pattern shows. How: This types ConCirCom's props.

// #region ConCirCom

/**
 * ConCirCom = Confetti Circuit Component
 *
 * @summary
 * Renders the confetti circuit pattern across its positioned parent: an SVG
 * filled with a pattern tile of traces, pads, confetti pieces, and a
 * sparkle. The traces and pads draw in the wrapper's strong blue through
 * currentColor, and each confetti piece fills with its own color role. The
 * pattern's id comes from useId, so two patterns on one page never clash.
 * The wrapper is hidden from screen readers and lets every click through.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props.patOpaStr - Pattern Opacity String: How strongly the pattern
 *                          shows, a reciprocal power token where one sits
 *                          within 10% of the strength wanted, or a plain
 *                          number from 0 to 1 where none does.
 *
 * @returns The pattern's wrapper div.
 *
 * @example
 * ```tsx
 * ConCirCom({ patOpaStr }) // => <ConCirCom />
 * ```
 *
*/

function ConCirCom ( { patOpaStr } : CccProTyp ) : JSX.Element {


	const patIdeStr = `conCirPat${ useId().replace( /[^a-zA-Z0-9]/g, '' ) }`; // What: Pattern Identifier String. Why: A pattern is filled by its id, which has to be unique on the page. How: This joins the pattern's name with React's id for this instance, keeping only letters and digits so it reads cleanly inside url().



	return (


		<div
			className={ cssModObj.conCirDiv }

			style={{ opacity : patOpaStr }}

			data-element-name-hook='conCirDiv' // What: Pattern Hook. Why: The rendering suite hides the faint patterns, which some engines tile a few color levels differently from run to run. How: The suite's stylesheet finds the pattern by this hook.

			aria-hidden='true'
		>{ /* What: Confetti Circuit Div Element. Why: The pattern fills its section behind the content. How: This pins the pattern over its parent, faded to the strength asked for. */ }


			<svg
				height='100%'
				width='100%'
				xmlns='http://www.w3.org/2000/svg'
			>{ /* What: Confetti Circuit SVG Element. Why: The motif is drawn as a repeating SVG pattern. How: This fills the wrapper with the pattern below. */ }


				<defs>{ /* What: Confetti Circuit Definitions Element. Why: A pattern has to be defined before a shape can fill with it. How: This holds the tile. */ }


					<pattern
						id={ patIdeStr }

						height='120'
						patternUnits='userSpaceOnUse'
						width='120'
						x='0'
						y='0'
					>{ /* What: Confetti Circuit Pattern Element. Why: The motif repeats one 120px tile. How: This draws the tile once, tiled in page units. */ }


						<path
							d='M 0 30 H 36 V 10'
							fill='none'
							stroke='currentColor'
							strokeWidth='0.8'
						/>{ /* What: Circuit Trace Path Element. Why: The tile's traces run like a circuit board's, each ending in a burst of confetti. How: This draws a bent trace in the wrapper's blue up to the orange piece. */ }

						<circle
							className={ cssModObj.oraConCir }

							cx='36'
							cy='7'
							r='3'
						/>{ /* What: Orange Confetti Circle Element. Why: The first trace ends in a round piece of confetti. How: This draws an orange dot at its end. */ }

						<path
							d='M 60 0 V 46 H 98'
							fill='none'
							stroke='currentColor'
							strokeWidth='0.8'
						/>{ /* What: Circuit Trace Path Element. Why: The tile's traces run like a circuit board's, each ending in a burst of confetti. How: This draws a bent trace in the wrapper's blue across to the berry piece. */ }

						<circle
							cx='60'
							cy='46'
							fill='none'
							r='2.5'
							stroke='currentColor'
							strokeWidth='0.8'
						/>{ /* What: Circuit Pad Circle Element. Why: A trace bends at a pad, as on a circuit board. How: This draws a ring at the second trace's bend. */ }

						<rect
							className={ cssModObj.berConRec }

							height='6'
							transform='rotate( 30 104 46 )'
							width='6'
							x='101'
							y='43'
						/>{ /* What: Berry Confetti Rect Element. Why: The second trace ends in a square piece of confetti, tumbling. How: This draws a tilted berry square at its end. */ }

						<path
							d='M 22 120 V 90 H 50'
							fill='none'
							stroke='currentColor'
							strokeWidth='0.8'
						/>{ /* What: Circuit Trace Path Element. Why: The tile's traces run like a circuit board's, each ending in a burst of confetti. How: This draws a bent trace in the wrapper's blue across to the sparkle. */ }

						<circle
							cx='22'
							cy='90'
							fill='none'
							r='2.5'
							stroke='currentColor'
							strokeWidth='0.8'
						/>{ /* What: Circuit Pad Circle Element. Why: A trace bends at a pad, as on a circuit board. How: This draws a ring at the third trace's bend. */ }

						<path
							className={ cssModObj.oraSpaPat }

							d='M 57 83 L 58.6 88.4 L 64 90 L 58.6 91.6 L 57 97 L 55.4 91.6 L 50 90 L 55.4 88.4 Z'
						/>{ /* What: Orange Sparkle Path Element. Why: The third trace ends in a sparkle, the moment a card comes alive. How: This draws a four-pointed orange star at its end. */ }

						<path
							className={ cssModObj.berSquPat }

							d='M 86 92 Q 90 86 94 92 T 102 92'
							fill='none'
							strokeLinecap='round'
							strokeWidth='2'
						/>{ /* What: Berry Squiggle Path Element. Why: A loose streamer of confetti drifts between the traces. How: This draws a short berry wave. */ }

						<circle
							className={ cssModObj.bluConCir }

							cx='10'
							cy='66'
							r='2.5'
						/>{ /* What: Blue Confetti Circle Element. Why: A loose piece of confetti drifts between the traces. How: This draws a blue dot. */ }


					</pattern>


				</defs>

				<rect
					fill={ `url(#${ patIdeStr })` }
					height='100%'
					width='100%'
				/>{ /* What: Pattern Fill Rect Element. Why: The pattern only shows once a shape is filled with it. How: This fills the whole wrapper with the tile. */ }


			</svg>


		</div>


	);


}

// #endregion ConCirCom

// #endregion Components



// #region Exports

export { ConCirCom }; // What: Named Exports. Why: Home, the Gallery, About, and Contact set the motif behind their sections. How: This exports ConCirCom.

// #endregion Exports


