


// #region Imports

import react from '@vitejs/plugin-react'; // What: React. Why: Vite needs the React plugin to compile JSX. How: This is called first in the plugins array.


import { CAR_DAT_ARR  } from './src/ui/card-data.ts'; // What: Card Data Array. Why: Every card gets its own page carrying its title, description, and link preview. How: The card pages plugin writes one per row.
import { defineConfig } from 'vite';                  // What: Define Config. Why: Vite's config helper passes the config through with its types. How: This wraps VIT_CON_OBJ.
import { readFile     } from 'node:fs/promises';      // What: Read File. Why: The card pages are copies of the built page. How: This reads the built index.html and _redirects.
import { resolve      } from 'node:path';             // What: Resolve. Why: The card pages are written beside the built index.html. How: This joins the build folder with each file name.
import { writeFile    } from 'node:fs/promises';      // What: Write File. Why: Each card's page and the rewrite rules are files in the build. How: This writes them.


import type { CarDatTyp } from './src/ui/card-data.ts'; // What: Card Data Type. Why: A card's page is written from its data. How: This types the card carTagFun reads.
import type { Plugin    } from 'vite';                  // What: Plugin. Why: The page minifier and the card pages are Vite plugins. How: This types their returns, which types their hooks.

// #endregion Imports



/**
 * vite.config.ts = Vite Config
 *
 * @summary
 * The build and dev server config. It compiles React, ships every asset as
 * its own file rather than inlining small ones as data: URIs, which the
 * site's Content-Security-Policy blocks, reads CSS module class names as
 * camelCase keys, and, for production builds only, compacts
 * index.html, which Vite processes but never minifies, so the page's comments
 * and indentation stay out of what visitors download. It also gives every
 * card a page of its own, a copy of index.html carrying the card's title,
 * description, and link preview tags, since link scrapers read only a page's
 * raw HTML: the dev server serves each card's address that way, and the
 * build writes the copies with the rewrite rules that serve them. Every other
 * setting stays at Vite's default, including copying the files in public/
 * (the icons, the social images, the crawler files, and Netlify's _headers
 * and _redirects) into the build untouched.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const LIV_URL_STR = 'https://techgeek.cards/'; // What: Live URL String. Why: Link preview tags need absolute addresses. How: Each card's address and image are built on the live site's root.

// #endregion Constants



// #region Helpers

const htmEscFun = ( rawTexStr : string ) : string => rawTexStr.replace( /&/g, '&amp;' ).replace( /"/g, '&quot;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ); // What: HTML Escape Function. Why: A card's text goes into double-quoted attributes, and some holds apostrophes and could hold quotes. How: This escapes the characters that would break out of the attribute.



// #region carTagFun

/**
 * carTagFun = Card Tag Function
 *
 * @summary
 * Rewrites the home page's head tags for one card: the title, the
 * description, and every Open Graph and Twitter tag that names the page,
 * its address, or its image. Each tag is found by its name or property,
 * whichever quotes it uses and whether or not the page has been compacted,
 * and replaced whole, so the result is the same in the dev server's page
 * and the built one. A card's link preview image is its own JPEG in
 * public/social/, named after its address. The canonical link and an
 * unlisted card's noindex stay with the card's page in React, and Netlify
 * keeps unlisted cards out of search with a header.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param htmTexStr - HTML Text String: The home page's HTML.
 * @param carDatObj - Card Data Object: {@link CarDatTyp}
 *
 * @returns The page's HTML with the card's tags in place of the home page's.
 *
 * @example
 * ```ts
 * carTagFun(htmTexStr, carDatObj) // => the card's page
 * ```
 *
*/

const carTagFun = ( htmTexStr : string, carDatObj : CarDatTyp ) : string => { // What: Card Tag Function. Why: Each card's page has to name the card to link scrapers. How: This swaps each of the home page's tags for the card's.


	const carDesStr = htmEscFun( carDatObj.seaStr );                              // What: Card Description String. Why: The card's search description is its preview's summary too. How: This escapes it for an attribute.
	const carImaStr = `${ LIV_URL_STR }social/${ carDatObj.sluStr }.jpg`;         // What: Card Image String. Why: Each card's preview shows its own image. How: This is its JPEG's absolute address.
	const carAltStr = htmEscFun( carDatObj.altStr );                              // What: Card Alternative String. Why: The preview image needs a description. How: This escapes the card's alt text.
	const carTitStr = htmEscFun( `${ carDatObj.titStr } Card | TechGeek.cards` ); // What: Card Title String. Why: The page's title and preview title match the card page's own title. How: This builds and escapes it.
	const carUrlStr = `${ LIV_URL_STR }${ carDatObj.sluStr }`;                    // What: Card URL String. Why: The preview links to the card's own address. How: This is its absolute address.


	const tagRowArr : [ string, string ][] = [ // What: Tag Row Array. Why: Every tag the card changes is found and replaced the same way. How: Each row pairs a tag's name or property with its card value.


		[ 'description', carDesStr ],         // What: Description Row. Why: Search listings and many previews read the plain description. How: This sets the card's.
		[ 'og:description', carDesStr ],      // What: Open Graph Description Row. Why: Most previews show this summary. How: This sets the card's.
		[ 'og:image', carImaStr ],            // What: Open Graph Image Row. Why: Most previews show this picture. How: This points at the card's own image.
		[ 'og:image:alt', carAltStr ],        // What: Open Graph Image Alt Row. Why: The picture needs a description. How: This sets the card's alt text.
		[ 'og:image:type', 'image/jpeg' ],    // What: Open Graph Image Type Row. Why: A card's image is a JPEG, where the site's card is a PNG. How: This names its type.
		[ 'og:title', carTitStr ],            // What: Open Graph Title Row. Why: Most previews lead with this title. How: This sets the card's.
		[ 'og:url', carUrlStr ],              // What: Open Graph URL Row. Why: The preview points at the card's address. How: This sets it.
		[ 'twitter:description', carDesStr ], // What: Twitter Description Row. Why: X shows this summary. How: This sets the card's.
		[ 'twitter:image', carImaStr ],       // What: Twitter Image Row. Why: X shows this picture. How: This points at the card's own image.
		[ 'twitter:image:alt', carAltStr ],   // What: Twitter Image Alt Row. Why: X describes the picture with this. How: This sets the card's alt text.
		[ 'twitter:title', carTitStr ]        // What: Twitter Title Row. Why: X leads with this title. How: This sets the card's.


	];



	return tagRowArr.reduce( ( curHtmStr, [ tagKeyStr, tagValStr ] ) => curHtmStr.replace( new RegExp( `<meta\\s+(name|property)=['"]${ tagKeyStr.replace( /:/g, '\\:' ) }['"][^>]*>` ), `<meta $1="${ tagKeyStr }" content="${ tagValStr }" />` ), htmTexStr.replace( /<title>[^<]*<\/title>/, `<title>${ carTitStr }</title>` ) ); // What: Tagged Page Return. Why: The page's title and every listed tag carry the card's values. How: This replaces the title, then each tag in turn, keeping whether it used name or property.


};

// #endregion carTagFun



// #region carPagFun

/**
 * carPagFun = Card Pages Function
 *
 * @summary
 * Builds the Vite plugin that gives every card a page of its own. On the dev
 * server it rewrites the page it serves for a card's address, so the SEO
 * suite can read each card's raw tags. After a production build it writes
 * one copy of the built index.html per card, as <address>.html, through
 * carTagFun, and puts a rewrite rule for each card's address ahead of the
 * site's catch-all in _redirects, so Netlify serves the card's own page,
 * query and all, while every other path still loads index.html. It also
 * adds a noindex header rule for each unlisted card to _headers, for
 * crawlers that never run the page's script.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The plugin object, for the config's plugins array.
 *
 * @example
 * ```ts
 * carPagFun() // => { closeBundle, configResolved, name, transformIndexHtml }
 * ```
 *
*/

const carPagFun = () : Plugin => { // What: Card Pages Function. Why: Link scrapers read only a page's raw HTML, so each card needs a page of its own. How: This returns a plugin that serves and writes them.


	let buiRecObj = { buiBoo : false, outStr : '' }; // What: Build Record Object. Why: The pages are written only after a production build, into its output folder. How: This holds whether the run is a build and where it writes, once Vite has resolved its config.



	return { // What: Plugin Return. Why: Vite runs each hook at its own stage. How: This returns the plugin's hooks.


		name : 'card-pages', // What: Name. Why: Vite reports a plugin's warnings and errors under its name. How: This names the plugin.

		closeBundle : async () => { // What: Close Bundle Hook. Why: The card pages copy the built page, which exists only once the build is written. How: This writes each card's page and its rewrite rules after the build.


			if ( !buiRecObj.buiBoo ) return; // What: Build Guard. Why: The dev server writes nothing. How: This returns early outside a build.



			const indHtmStr = await readFile( resolve( buiRecObj.outStr, 'index.html' ), 'utf8' );                                             // What: Index HTML String. Why: Every card page starts from the built page, bundle tags and all. How: This reads it.
			const redPatStr = resolve( buiRecObj.outStr, '_redirects' );                                                                       // What: Redirects Path String. Why: The rewrite rules go into the built copy of _redirects. How: This is its path.
			const redTexStr = await readFile( redPatStr, 'utf8' );                                                                             // What: Redirects Text String. Why: The card rules go ahead of the site's existing rules. How: This reads the built copy.
			const carRulStr = CAR_DAT_ARR.map( ( carDatObj ) => `/${ carDatObj.sluStr }    /${ carDatObj.sluStr }.html    200` ).join( '\n' ); // What: Card Rules String. Why: Each card's address has to serve its own page rather than index.html. How: This writes a rewrite rule per card.
			const heaPatStr = resolve( buiRecObj.outStr, '_headers' );                                                                         // What: Headers Path String. Why: The unlisted cards' rules go into the built copy of _headers. How: This is its path.
			const heaTexStr = await readFile( heaPatStr, 'utf8' );                                                                             // What: Headers Text String. Why: The card rules follow the site's existing rules. How: This reads the built copy.
			const unlRulStr = CAR_DAT_ARR.filter( ( carDatObj ) => !carDatObj.lisBoo ).flatMap( ( carDatObj ) => [ `/${ carDatObj.sluStr }`, `/${ carDatObj.sluStr }.html` ] ).map( ( pagPatStr ) => `${ pagPatStr }\n\tX-Robots-Tag: noindex` ).join( '\n' ); // What: Unlisted Rules String. Why: An unlisted card stays out of search even for crawlers that never run its script, which never see the card page's noindex tag. How: This writes a noindex header rule for each unlisted card's address and file name.


			await Promise.all( CAR_DAT_ARR.map( ( carDatObj ) => writeFile( resolve( buiRecObj.outStr, `${ carDatObj.sluStr }.html` ), carTagFun( indHtmStr, carDatObj ) ) ) ); // What: Card Pages Write. Why: Each card needs its own page. How: This writes one tagged copy of the built page per card.

			await writeFile( heaPatStr, `${ heaTexStr }\n\n\n\n# What: Unlisted Card Rules. Why: An unlisted card is made for one person and should stay out of search. How: These send a noindex header with each unlisted card's page.\n${ unlRulStr }\n` ); // What: Headers Write. Why: The unlisted cards' noindex rules join the site's headers. How: This appends them.

			await writeFile( redPatStr, `# What: Card Page Rules. Why: Each card's address serves its own page, which carries its link preview. How: These rewrite each card's address to its page, ahead of the catch-all.\n${ carRulStr }\n\n\n\n${ redTexStr }` ); // What: Redirects Write. Why: The card rules must come before the catch-all, which would otherwise answer every card's address. How: This writes them ahead of the existing rules.


		},

		configResolved : ( conResObj ) => { // What: Config Resolved Hook. Why: The pages are written only after a build, into its output folder. How: This records both once Vite has resolved its config.


			buiRecObj = { // What: Build Record Assignment. Why: closeBundle needs both. How: This stores whether this is a build and its output folder.


				buiBoo : conResObj.command === 'build',                    // What: Build Boolean. Why: The dev server writes nothing. How: This is true only for a production build.
				outStr : resolve( conResObj.root, conResObj.build.outDir ) // What: Output String. Why: The pages are written beside the built index.html. How: This is the build's resolved output folder.


			};


		},

		transformIndexHtml : ( htmTexStr, ctxIndObj ) => { // What: Transform Index HTML Hook. Why: On the dev server, a card's address should serve the card's own tags, as the built site does. How: This rewrites the page for a card's address and leaves every other page alone.


			const reqSluStr = new URL( ctxIndObj.originalUrl ?? '/', LIV_URL_STR ).pathname.slice( 1 ); // What: Requested Slug String. Why: The requested address names the card, if any. How: This reads the path without its slash or query.
			const carDatObj = CAR_DAT_ARR.find( ( carCurObj ) => carCurObj.sluStr === reqSluStr );      // What: Card Data Object. Why: Only a card's address gets a card's tags. How: This finds the card, if the address names one.



			return carDatObj ? carTagFun( htmTexStr, carDatObj ) : htmTexStr; // What: Page Return. Why: Every other page keeps the home page's tags. How: This returns the card's page or the page as it was.


		}


	};


};

// #endregion carPagFun



// #region minHtmFun

/**
 * minHtmFun = Minify HTML Function
 *
 * @summary
 * Builds the Vite plugin that compacts the shipped index.html. Vite injects
 * the bundle's script and stylesheet tags into the page but otherwise ships
 * it as written, with every comment and indentation level the formatting
 * rules give it. For production builds only, this re-serializes any JSON-LD
 * the page holds on one line, which also fails the build if that JSON is ever
 * invalid, strips the page's HTML comments and the comment inside its
 * external script tag, trims every line, and drops blank lines. The newlines
 * between lines are kept, so text wrapped across lines keeps the space
 * between its words. It runs after Vite's own transforms, so the tags Vite
 * injects are compacted too. The dev server serves the page as written.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The plugin object, for the config's plugins array.
 *
 * @example
 * ```ts
 * minHtmFun() // => { apply, name, transformIndexHtml }
 * ```
 *
*/

const minHtmFun = () : Plugin => ({ // What: Minify HTML Function. Why: index.html ships as written unless something minifies it. How: This returns a build-only Vite plugin that does.


	apply : 'build',               // What: Apply. Why: The dev server should serve the page as written. How: This runs the plugin only during npm run build.
	name  : 'minify-shipped-page', // What: Name. Why: Vite reports a plugin's warnings and errors under its name. How: This names the plugin.

	transformIndexHtml : { // What: Transform Index HTML Hook. Why: Vite processes index.html but doesn't minify it. How: This compacts the page after Vite's own changes.


		order : 'post', // What: Order. Why: The page should be compacted only after Vite has injected the bundle's script and stylesheet tags. How: This runs after Vite's own transforms.

		handler : ( htmTexStr ) => { // What: Handler. Why: This is the plugin's actual work. How: This compacts any structured data, strips comments, then drops indentation and blank lines.


			return htmTexStr                                                                               // What: Compacted Page Return. Why: Vite writes whatever this returns as the shipped page. How: This chains each compaction over the page's text.
				.replace( /(?<=<script type='application\/ld\+json'>)[\s\S]*?(?=<\/script>)/g, ( jsoTexStr ) => JSON.stringify( JSON.parse( jsoTexStr ) ) ) // What: JSON-LD Compaction. Why: Structured data reads the same without its indentation, and invalid JSON should stop the build rather than ship. How: This parses each JSON-LD script's contents and writes them back on one line.
				.replace( /(<script\b[^>]*\bsrc=[^>]*>)\s*(?:\/\*[\s\S]*?\*\/\s*)+(<\/script>)/g, '$1$2' ) // What: External Script Comment Strip. Why: An external script's only content is its comment. How: This empties the tag.
				.replace( /<!--[\s\S]*?-->/g, '' )                                                         // What: HTML Comment Strip. Why: Comments mean nothing to the browser. How: This removes every HTML comment.
				.split( '\n' )                                                                             // What: Line Split. Why: Indentation and blank lines are dropped line by line. How: This splits the page into lines.
				.map( ( linTexStr ) => linTexStr.trim() )                                                  // What: Indentation Trim. Why: Indentation means nothing to the browser. How: This trims each line.
				.filter( Boolean )                                                                         // What: Blank Line Filter. Why: Blank lines mean nothing to the browser. How: This drops every empty line.
				.join( '\n' );                                                                             // What: Line Join. Why: The page has to be one string again. How: This rejoins the remaining lines with newlines, which keep the spaces between words in wrapped text.


		}


	}


});

// #endregion minHtmFun



const VIT_CON_OBJ = defineConfig({ // What: Vite Config Object. Why: Vite reads its whole configuration from this file's default export. How: This builds the config, including the minHtmFun plugin above.


	build   : { assetsInlineLimit : 0 },                            // What: Build. Why: Vite inlines any asset under 4 KB as a data: URI, which the Content-Security-Policy blocks as an image from another origin, hiding the bar's mark and the Family cards' heart mask. How: This turns inlining off, so every asset ships as its own file on the site's own origin.
	css     : { modules : { localsConvention : 'camelCaseOnly' } }, // What: CSS. Why: CSS modules expose each class name as a camelCase key only, so every module reads the same way, per the CSS modules rules. How: This sets the locals convention.
	plugins : [ react(), minHtmFun(), carPagFun() ]                 // What: Plugins. Why: Vite builds the site through these plugins, in this order. How: This lists React, the page minifier, and the card pages.


});

// #endregion Helpers



// #region Exports

export default VIT_CON_OBJ; // What: Default Export. Why: Vite reads its config from this file's default export. How: This exports VIT_CON_OBJ.

// #endregion Exports


