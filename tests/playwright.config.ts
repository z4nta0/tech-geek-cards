


// #region Imports

import { defineConfig  } from '@playwright/test'; // What: Define Config. Why: Playwright's config helper passes the config through with its types. How: This wraps the exported config object.
import { fileURLToPath } from 'node:url';         // What: File URL To Path. Why: The servers have to start from the repo root, one folder above this file. How: This turns that folder's URL into a path for each server's cwd.

// #endregion Imports



/**
 * playwright.config.ts = Playwright Config
 *
 * @summary
 * The config behind npm test and its suites, each run against the real site in
 * all three of Playwright's engines (Chromium, Firefox, and WebKit), one
 * project per suite and engine, since a check that passes in one engine proves
 * nothing about the others. The suites are accessibility, which the pre-commit
 * check runs, interaction, rendering, responsive, security, and seo.
 * Playwright starts the Vite dev server on port 5195 for the run, and a build
 * served by vite preview on 5205 for the security suite, and stops both
 * afterwards, so a dev server already running on the usual 5173, or a sibling
 * project's suites on their own ports, are never touched. Reports and failure
 * screenshots land in tests/output, which git ignores, while the rendering
 * suite's approved screenshots live in tests/rendering/baselines and are
 * committed.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const ENG_NAM_ARR = [ // What: Engine Name Array. Why: Every suite runs in all three engines. How: Each entry is a Playwright browser name, crossed with each suite into one project apiece. // What: Type Assertion Note. Why: Each name has to type as one of Playwright's browser names, not a plain string. How: The closing as const keeps each entry's literal type for the projects' browserName.


	'chromium', // What: Chromium Engine. Why: Chrome and Edge render with it. How: This is Playwright's Chromium build.
	'firefox',  // What: Firefox Engine. Why: Firefox renders with its own engine, Gecko. How: This is Playwright's Firefox build.
	'webkit'    // What: WebKit Engine. Why: Safari, and every browser on iOS, renders with it. How: This is Playwright's WebKit build.


] as const;



const PRE_URL_STR = 'http://localhost:5205';                           // What: Preview URL String. Why: The security suite loads the production build, since the dev server injects inline scripts the security policy would block. How: This is the address the preview server answers on, the security projects' baseURL.
const ROO_DIR_STR = fileURLToPath( new URL( '..', import.meta.url ) ); // What: Root Directory String. Why: Both servers must run from the repo root, where vite.config.ts lives. How: This resolves the folder above tests/.
const SER_URL_STR = 'http://localhost:5195';                           // What: Server URL String. Why: Every project but the security ones opens its pages from the dev server through its baseURL. How: This is the address Playwright waits on and the baseURL of every project but the security ones.



const SUI_NAM_ARR = [ // What: Suite Name Array. Why: Each suite lives in its own folder and runs as its own projects. How: Each entry names a folder under tests/, crossed with each engine into one project apiece.


	'accessibility', // What: Accessibility Suite. Why: The pre-commit accessibility scan runs from here. How: This names tests/accessibility.
	'interaction',   // What: Interaction Suite. Why: How moving between pages and using controls behaves is checked from here. How: This names tests/interaction.
	'rendering',     // What: Rendering Suite. Why: Each page state is compared with its approved screenshot from here. How: This names tests/rendering.
	'responsive',    // What: Responsive Suite. Why: Each page is measured across screen widths from here. How: This names tests/responsive.
	'security',      // What: Security Suite. Why: The site's security policy, its build, and its dependencies are checked from here. How: This names tests/security.
	'seo'            // What: SEO Suite. Why: Each page's head tags and the crawler files are checked from here. How: This names tests/seo.


];



const PLA_CON_OBJ = defineConfig({ // What: Playwright Config Object. Why: Playwright reads its whole setup from this file's default export. How: This holds the shared page settings, one project per suite and engine, the reporters, and the two servers.


	fullyParallel        : false,                                              // What: Fully Parallel. Why: Each spec file walks its states in order. How: This keeps a file's tests running in sequence, while separate files may still run in parallel.
	outputDir            : 'output/results',                                   // What: Output Directory. Why: Failure screenshots and traces need a home git ignores. How: This writes them under tests/output/results.
	snapshotPathTemplate : '{testFileDir}/baselines/{arg}-{projectName}{ext}', // What: Snapshot Path Template. Why: The rendering suite's approved screenshots belong in the repo beside their spec, one per state and engine. How: This writes each to tests/rendering/baselines, named after its state and project.
	testDir              : '.',                                                // What: Test Directory. Why: Each project picks its own folder below. How: This roots test discovery at tests/.
	workers              : 3,                                                  // What: Workers. Why: The engines are independent, but each worker drives a full browser. How: This runs up to three spec files at once.

	projects : SUI_NAM_ARR.flatMap( ( suiNamStr ) => ENG_NAM_ARR.map( ( engNamStr ) => ({ // What: Projects. Why: Each suite runs on its own in each engine. How: This crosses every suite with every engine into a project named after both, runnable alone with --project.


		name      : `${ suiNamStr }-${ engNamStr }`, // What: Name. Why: A failure has to say which suite and engine it came from. How: This names the project after both.
		testMatch : `${ suiNamStr }/**/*.spec.ts`,   // What: Test Match. Why: Each suite lives in its own folder. How: This runs every spec in the suite's folder under tests/.

		use : { // What: Use. Why: The project has to launch its own engine, and the security suite its own server. How: This sets the browser it runs in, which build of it, and the server its pages open from, the preview for the security suite and the dev server for every other project.


			baseURL     : suiNamStr === 'security' ? PRE_URL_STR : SER_URL_STR, // What: Base URL. Why: The security suite loads its pages from the production build, while every other project's baseURL is the dev server. How: This points each project's page.goto at its server.
			browserName : engNamStr,                                            // What: Browser Name. Why: Each project runs in one engine. How: This names that engine's Playwright browser.
			channel     : engNamStr === 'chromium' ? 'chromium' : undefined     // What: Channel. Why: Chromium's default headless shell sometimes opens a modified click's new tab without Playwright ever reporting it, failing about 1 run in 10 in a sibling project. How: This runs Chromium as Chrome's full headless mode instead, and leaves Firefox and WebKit on their default builds.


		}


	}) ) ),

	reporter : [ // What: Reporter. Why: A run needs a live summary in the terminal and a browsable report afterwards. How: This prints a line per test and writes an HTML report to tests/output/report.


		[ 'list' ],                                                    // What: List Reporter. Why: The terminal shows each test as it finishes. How: This is Playwright's list reporter.
		[ 'html', { open : 'never', outputFolder : 'output/report' } ] // What: HTML Reporter. Why: A failure is easier to read with its screenshot and trace. How: This writes the report to tests/output/report without opening a browser.


	],

	use : { // What: Use. Why: Every suite shares the same page setup. How: This sets the locale and the failure artifacts.


		locale     : 'en-US',            // What: Locale. Why: The site is written in US English. How: This runs every page in it.
		screenshot : 'only-on-failure',  // What: Screenshot. Why: A failing check is easier to diagnose from what was on screen. How: This saves a screenshot only when a test fails.
		trace      : 'retain-on-failure' // What: Trace. Why: A failure can be stepped through afterwards. How: This keeps the Playwright trace only for failing tests.


	},

	webServer : [ // What: Web Server. Why: The suites need the site running, without touching any dev server already open. How: This starts the dev server and the production preview, each on its own strict port from the repo root, and stops both when the run ends.


		{ // What: Dev Server. Why: Every project but the security ones points its baseURL at the site as it's developed. How: This starts the Vite dev server on 5195.


			command             : 'npx vite --port 5195 --strictPort', // What: Command. Why: A strict port fails loudly instead of drifting onto another server's port. How: This starts the Vite dev server on 5195.
			cwd                 : ROO_DIR_STR,                         // What: Current Working Directory. Why: Vite reads its config from the repo root. How: This starts the command there.
			reuseExistingServer : false,                               // What: Reuse Existing Server. Why: A leftover server could be running other code. How: This always starts a fresh one.
			timeout             : 60000,                               // What: Timeout. Why: The first start can take a while on a cold cache. How: This waits up to a minute for the server to answer.
			url                 : SER_URL_STR                          // What: URL. Why: Playwright starts the tests only once the site answers. How: This is the address it polls.


		},

		{ // What: Preview Server. Why: The security suite reads what ships, and the dev server's inline scripts would break a strict policy. How: This builds the site and serves the build on 5205.


			command             : 'npm run build && npx vite preview --port 5205 --strictPort', // What: Command. Why: The preview serves only a fresh build, and a strict port fails loudly. How: This type checks and builds the site, then serves dist/ on 5205.
			cwd                 : ROO_DIR_STR,                                                  // What: Current Working Directory. Why: The build and Vite read their config from the repo root. How: This starts the command there.
			reuseExistingServer : false,                                                        // What: Reuse Existing Server. Why: A leftover server could be serving an older build. How: This always starts a fresh one.
			timeout             : 120000,                                                       // What: Timeout. Why: The type check and build run before the server starts. How: This waits up to two minutes for it to answer.
			url                 : PRE_URL_STR                                                   // What: URL. Why: Playwright starts the tests only once the build is served. How: This is the address it polls.


		}


	]


});

// #endregion Constants



// #region Exports

export default PLA_CON_OBJ; // What: Default Export. Why: Playwright reads its config from this file's default export. How: This exports PLA_CON_OBJ.

// #endregion Exports


