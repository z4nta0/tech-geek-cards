


/**
 * subset-font.d.ts = Subset Font Declaration
 *
 * @summary
 * Types for the subset-font package, which ships none, covering the one call
 * the pinned font script makes: it takes a font's bytes, the characters to
 * keep, and options naming the output format and how each variation axis is
 * pinned or narrowed, and resolves with the new font's bytes. The options
 * follow the package's README.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



declare module 'subset-font' { // What: Subset Font Module Declaration. Why: TypeScript needs the package's shape to type the script's call. How: This declares the module's default export.


	type AxiRanTyp = { default? : number, max : number, min : number }; // What: Axis Range Type. Why: An axis can be narrowed to a range rather than pinned. How: This names the range's ends and an optional default.

	type SubOptTyp = { targetFormat? : 'sfnt' | 'woff' | 'woff2', variationAxes? : Record< string, number | AxiRanTyp > }; // What: Subset Options Type. Why: The call names its output format and its axes. How: This types the options object, each axis a pinned value or a range.

	export default function subsetFont ( souBytObj : Buffer, chaLisStr : string, subOptObj? : SubOptTyp ) : Promise< Buffer >; // What: Subset Font Function Declaration. Why: The script awaits the new font's bytes. How: This types the default export's parameters and result.


}


