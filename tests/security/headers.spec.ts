


// #region Imports

import { CAR_DAT_ARR   } from '../../src/ui/card-data.ts'; // What: Card Data Array. Why: Each unlisted card has to stay out of search through its own header. How: This lists every card with its address and whether it's listed.
import { execFileSync  } from 'node:child_process';        // What: Exec File Sync. Why: The dependency check asks npm itself. How: This runs npm audit and returns its output.
import { expect        } from '@playwright/test';          // What: Expect. Why: Each check passes only when the policy and the build are what they should be. How: This asserts on what each check reads, such as the audit's counts.
import { fileURLToPath } from 'node:url';                  // What: File URL To Path. Why: The repo root npm works from sits two folders above this file, with the build folder, dist/, inside it. How: This turns each one's URL into a path.
import { heaAllFun     } from '../support/headers.ts';     // What: Headers All Function. Why: The checks test the policy Netlify really sends. How: This reads the /* block of public/_headers.
import { heaPatFun     } from '../support/headers.ts';     // What: Headers Path Function. Why: An unlisted card's noindex rule is added to the built headers file. How: This reads the headers dist/_headers sends with one path.
import { join          } from 'node:path';                 // What: Join. Why: A built file's path is its folder plus its name. How: This joins them with the right separator.
import { readdirSync   } from 'node:fs';                   // What: Read Directory Sync. Why: Every built text file is searched for secrets. How: This lists the build folder's entries, recursively.
import { readFileSync  } from 'node:fs';                   // What: Read File Sync. Why: Each built file's text is searched. How: This reads a built file.
import { relative      } from 'node:path';                 // What: Relative. Why: A match is reported by its path inside the build. How: This trims the build folder off a file's path.
import { test          } from '@playwright/test';          // What: Test. Why: Each part of the policy is its own test. How: This declares them.

// #endregion Imports



/**
 * headers.spec.ts = Headers Spec
 *
 * @summary
 * Checks the security policy and what ships rather than a page, so it runs in
 * the Chromium project only, since a file reads the same in every engine. The
 * headers public/_headers sends have to hold the site to its own strict
 * policy, such as refusing framing, and public/_redirects has to hand every
 * unknown path to the app with a 200, so the 404 page shows on the live site.
 * The production build, which the preview server builds before the run, has to
 * send a noindex header with every unlisted card's page and no other, and has
 * to hold no private key or provider token. npm audit has to find no high or
 * critical advisory in the shipped dependencies, and skips with a message when
 * npm can't be reached.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const BIN_EXT_REG = /\.(ico|jpg|png|webp|woff2)$/;                                          // What: Binary Extension Regular Expression. Why: Raster images and fonts hold no text to search, and their bytes could match a pattern by chance. How: This matches the built file types the secret search skips.
const DIS_DIR_STR = fileURLToPath( new URL( '../../dist/', import.meta.url ) );             // What: Distribution Directory String. Why: The secret search reads what visitors download. How: This resolves the build folder, dist/.
const RED_FIL_STR = fileURLToPath( new URL( '../../public/_redirects', import.meta.url ) ); // What: Redirects File String. Why: The 404 page is reached on the live site only through the host's fallback rule, which the dev and preview servers apply on their own. How: This resolves the path of Netlify's redirects file.
const ROO_DIR_STR = fileURLToPath( new URL( '../..', import.meta.url ) );                   // What: Root Directory String. Why: npm audit reads the repo's lockfile. How: This resolves the repo root.

const SEC_PAT_ARR = [ // What: Secret Pattern Array. Why: A key pasted into the source would ship to every visitor. How: Each entry matches one well-known kind of private key or provider token.


	/-----BEGIN [A-Z ]*PRIVATE KEY-----/, // What: Private Key Pattern. Why: A private key's file opens with this line. How: This matches it.
	/AIza[0-9A-Za-z_-]{35}/,              // What: Google Key Pattern. Why: The site uses no Google service, so any Google key here is a mistake. How: This matches a Google API key.
	/AKIA[0-9A-Z]{16}/,                   // What: AWS Key Pattern. Why: An AWS access key opens with AKIA. How: This matches one.
	/gh[opsu]_[0-9A-Za-z]{36}/,           // What: GitHub Token Pattern. Why: A GitHub token opens with a short type prefix. How: This matches a personal, OAuth, app, or user token.
	/sk_live_[0-9A-Za-z]{20,}/,           // What: Stripe Key Pattern. Why: A live Stripe secret key opens with sk_live_. How: This matches one.
	/xox[abprs]-[0-9A-Za-z-]{10,}/        // What: Slack Token Pattern. Why: A Slack token opens with xox and a type letter. How: This matches one.


];

// #endregion Constants



// #region Module Init

test.skip( ( { browserName : broNamStr } ) => broNamStr !== 'chromium', 'These checks read files, which are the same in every engine, so they run in Chromium only.' ); // What: Chromium Only Skip. Why: Running a file check three times proves nothing more. How: This skips every test in the file outside the Chromium project.



// #region Headers Checks

test( 'the content security policy allows only the site itself', () => { // What: Content Security Policy Test. Why: A strict policy stops injected or third-party script from running, which limits cross-site scripting. How: This reads the policy, checks each directive it depends on, and checks that it never allows inline or evaluated code or every origin.


	const cspValStr = heaAllFun()[ 'content-security-policy' ] ?? ''; // What: Content-Security-Policy Value String. Why: Each directive is checked in the policy's own text. How: This reads the header, or an empty string if it's missing.


	expect( cspValStr ).toContain( "default-src 'self'" );     // What: Default Source Assertion. Why: Every resource type the policy doesn't name falls back to this. How: This checks the policy names default-src 'self'.
	expect( cspValStr ).toContain( "base-uri 'self'" );        // What: Base URI Assertion. Why: An injected base tag could point every relative address at another site. How: This checks the policy names base-uri 'self'.
	expect( cspValStr ).toContain( "form-action 'self'" );     // What: Form Action Assertion. Why: An injected form could post a visitor's details elsewhere, while the contact form posts to the site itself. How: This checks the policy names form-action 'self'.
	expect( cspValStr ).toContain( "frame-ancestors 'none'" ); // What: Frame Ancestors Assertion. Why: A site framing this one could trick visitors into clicks. How: This checks no page may frame it.
	expect( cspValStr ).toContain( "object-src 'none'" );      // What: Object Source Assertion. Why: Plugins can run code outside the policy. How: This checks none can load.
	expect( cspValStr ).not.toContain( 'unsafe-inline' );      // What: No Unsafe Inline Assertion. Why: Allowing inline script or style lets injected markup run. How: This checks the policy never allows it.
	expect( cspValStr ).not.toContain( 'unsafe-eval' );        // What: No Unsafe Eval Assertion. Why: Evaluated strings run as code. How: This checks the policy never allows it.
	expect( cspValStr ).not.toMatch( /(^|\s)\*(\s|;|$)/ );     // What: No Wildcard Assertion. Why: A bare * would let any origin load resources. How: This checks no directive allows every origin.


	for ( const dirTexStr of cspValStr.split( ';' ).map( ( dirRawStr ) => dirRawStr.trim() ).filter( ( dirCurStr ) => dirCurStr.length > 0 ) ) { // What: Directive Loop. Why: The site loads everything from itself, so any source but its own origin or none would let another site's files in, a blob address included. How: This checks each directive in turn.


		const souLisArr = dirTexStr.split( /\s+/ ).slice( 1 ); // What: Source List Array. Why: The sources follow the directive's name. How: This splits the directive and drops its name.


		expect( souLisArr.filter( ( souCurStr ) => souCurStr !== "'self'" && souCurStr !== "'none'" ), dirTexStr ).toEqual( [] ); // What: Own Sources Assertion. Why: Only 'self' and 'none' keep every resource on the site's own origin, and the build ships every asset as its own file rather than a data address. How: This checks the directive lists no other source, and names the directive when it fails.


	}


} );



test( 'the other hardening headers are set', () => { // What: Hardening Headers Test. Why: Each header closes a different gap: plain HTTP, sniffed file types, framing, referrer leaks, and unused browser features. How: This reads the policy, checks HSTS's age and subdomain flag and the nosniff and DENY values, and checks that a referrer policy and a permissions policy are set.


	const heaAllObj = heaAllFun();                                    // What: Headers All Object. Why: Each header is looked up by name. How: This reads the /* block of public/_headers.
	const hstValStr = heaAllObj[ 'strict-transport-security' ] ?? ''; // What: HTTP-Strict-Transport Value String. Why: Its age and subdomain flag are checked separately. How: This reads the header, or an empty string if it's missing.


	expect( Number( hstValStr.match( /max-age=(\d+)/ )?.[ 1 ] ?? 0 ) ).toBeGreaterThanOrEqual( 31536000 ); // What: HSTS Age Assertion. Why: Browsers should stay on HTTPS for at least a year once they've seen the site. How: This checks max-age is at least 31,536,000 seconds.
	expect( hstValStr ).toContain( 'includeSubDomains' );                                                  // What: HSTS Subdomains Assertion. Why: A plain HTTP subdomain could still be used against the site. How: This checks HSTS covers every subdomain.
	expect( heaAllObj[ 'x-content-type-options' ] ).toBe( 'nosniff' );                                     // What: No Sniff Assertion. Why: A browser guessing a file's type could run a text file as script. How: This checks it's told not to guess.
	expect( heaAllObj[ 'x-frame-options' ] ).toBe( 'DENY' );                                               // What: Frame Options Assertion. Why: Older browsers ignore frame-ancestors. How: This checks framing is refused the older way too.
	expect( heaAllObj[ 'referrer-policy' ] ).toBeTruthy();                                                 // What: Referrer Policy Assertion. Why: A referrer policy states how much of the address other sites receive. How: This checks a policy is set.
	expect( heaAllObj[ 'permissions-policy' ] ).toBeTruthy();                                              // What: Permissions Policy Assertion. Why: Browser features the site never uses shouldn't be available to injected code. How: This checks a policy is set.


} );



test( 'every unknown path falls back to the app, which shows the 404 page', () => { // What: Fallback Rule Test. Why: Netlify answers a path with no file of its own with its own error page unless a rule hands it to the app, while the dev and preview servers fall back on their own, so the page suites can't tell. How: This reads public/_redirects and checks its last rule rewrites every path to index.html with a 200.


	const rulLisArr = readFileSync( RED_FIL_STR, 'utf8' ).split( '\n' ).map( ( linCurStr ) => linCurStr.trim() ).filter( ( linCurStr ) => linCurStr && !linCurStr.startsWith( '#' ) ); // What: Rule List Array. Why: Netlify reads the file's rules top to bottom and ignores comments and blank lines. How: This keeps each rule line, trimmed.


	expect( rulLisArr.at( -1 )?.split( /\s+/ ) ).toEqual( [ '/*', '/index.html', '200' ] ); // What: Fallback Rule Assertion. Why: The catch-all has to come last, so the rules above it still match first, and has to rewrite with a 200 rather than redirect, so the address stays and the app's router shows the 404 page. How: This checks the last rule's three fields.


} );

// #endregion Headers Checks



// #region Build Checks

test( 'every unlisted card sends a noindex header and every listed card none', () => { // What: Unlisted Noindex Test. Why: An unlisted card is kept off the Gallery and Home and reached only by its own address, so it has to stay out of search even for crawlers that never run its script. How: This reads the built headers for each card's address and its page's file name, and checks that the unlisted ones carry noindex and the listed ones no robots header.


	for ( const carDatObj of CAR_DAT_ARR ) for ( const pagPatStr of [ `/${ carDatObj.sluStr }`, `/${ carDatObj.sluStr }.html` ] ) expect( heaPatFun( pagPatStr )[ 'x-robots-tag' ], pagPatStr ).toBe( carDatObj.lisBoo ? undefined : 'noindex' ); // What: Card Path Loop. Why: Netlify can serve a card's page at its address or its file name. How: This checks each path's robots header, naming the path when it fails.


} );



test( 'the built site holds no secrets', () => { // What: Secret Search Test. Why: Anything in the build ships to every visitor, so a key there is public. How: This searches every built text file for each secret pattern and checks that no file matches any.


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every match is reported at once. How: This collects one entry per match.


	for ( const filEntObj of readdirSync( DIS_DIR_STR, { recursive : true, withFileTypes : true } ) ) { // What: Built Entry Loop. Why: Every built file could hold a secret. How: This walks every file and folder in the build.


		if ( !filEntObj.isFile() || BIN_EXT_REG.test( filEntObj.name ) ) continue; // What: Text File Guard. Why: Folders, raster images, and fonts hold no text to search. How: This skips folders and the built raster image and font files, so the rest are read.



		const filPatStr = join( filEntObj.parentPath, filEntObj.name ); // What: File Path String. Why: The file is read, and reported, by its path. How: This joins the entry's folder and name.
		const filTexStr = readFileSync( filPatStr, 'utf8' );            // What: File Text String. Why: Each pattern is searched in the file's text. How: This reads the built file.


		for ( const secPatReg of SEC_PAT_ARR ) if ( secPatReg.test( filTexStr ) ) proLisArr.push( `${ relative( DIS_DIR_STR, filPatStr ) } matches ${ secPatReg }` ); // What: Pattern Loop. Why: Each kind of secret is searched for. How: This records the file, relative to the build, and the pattern for every match.


	}



	expect( proLisArr ).toEqual( [] ); // What: No Secrets Assertion. Why: The build should hold none. How: This checks the list stayed empty.


} );



test( 'the shipped dependencies have no high or critical advisory', () => { // What: Dependency Audit Test. Why: A known hole in a library the site ships reaches every visitor. How: This runs npm audit on the production dependencies and checks the high and critical counts.


	let audTexStr = ''; // What: Audit Text String. Why: npm reports its findings as JSON on standard output, even when it exits with an error for finding some. How: This holds that output.



	try { // What: Audit Run Attempt. Why: npm audit exits with an error when it finds advisories, which would otherwise end the test. How: This runs the audit so a failed exit can be caught below.


		audTexStr = execFileSync( 'npm', [ 'audit', '--omit=dev', '--json' ], { cwd : ROO_DIR_STR, encoding : 'utf8' } ); // What: Audit Run Assignment. Why: The advisories come from npm's registry. How: This runs npm audit on the production dependencies.


	}

	catch ( errCatObj ) { // What: Audit Failure Catch. Why: A failed exit still carries the findings on its standard output. How: This reads that output into the audit text.


		audTexStr = String( ( errCatObj as { stdout? : string } ).stdout ?? '' ); // What: Failed Audit Output Assignment. Why: npm audit exits with an error when it finds advisories, and still prints them. How: This keeps the output the error carries. // What: Type Assertion Note. Why: A failed execFileSync throws an error carrying the command's output. How: The as reads its stdout field.


	}



	const audDatObj = JSON.parse( audTexStr || '{}' ) as { metadata? : { vulnerabilities? : Record< string, number > } }; // What: Audit Data Object. Why: The counts are read by severity. How: This parses npm's JSON, or an empty object when there was no output. // What: Type Assertion Note. Why: JSON.parse returns any. How: The as names only the fields read.
	const vulCouObj = audDatObj.metadata?.vulnerabilities;                                                                // What: Vulnerability Count Object. Why: Only a real report has counts. How: This reads them, or undefined when npm couldn't reach its registry.


	test.skip( !vulCouObj, 'npm audit could not reach the registry, so the dependencies went unchecked.' ); // What: Offline Skip. Why: Without a report there's nothing to check, and passing would hide that. How: This skips the test with a message saying why.



	expect( vulCouObj!.high + vulCouObj!.critical ).toBe( 0 ); // What: No Severe Advisory Assertion. Why: A high or critical advisory needs fixing before the site ships. How: This checks there are none. // What: Non-Null Note. Why: The skip above ends the test when the counts are missing. How: The ! says they're present here.


} );

// #endregion Build Checks

// #endregion Module Init


