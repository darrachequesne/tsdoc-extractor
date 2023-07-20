import { DocNode } from "./deno_doc/types";

export interface DocOptions {
  /** An optional URL string which provides a location of an import map to be
   * loaded and used to resolve module specifiers. This should be an absolute
   * value.
   *
   * When a `resolve()` function is also specified, a warning will be issued
   * and the import map will be used instead of the `resolve()` function. */
  importMap?: string;
  /** If `true` include all documentation nodes in the output, included private
   * (non-exported) nodes. The default is `false`.  Use the `declarationKind`
   * of the `DocNode` to determine if the doc node is private, exported,
   * imported, or declared. */
  includeAll?: boolean;
  /**
   * An optional callback that is called with the URL string of the resource to
   * be loaded and a flag indicating if the module was required dynamically. The
   * callback should resolve with a `LoadResponse` or `undefined` if the module
   * is not found. If there are other errors encountered, a rejected promise
   * should be returned.
   *
   * This defaults to a load function which will use `fetch()` and
   * `Deno.readFile()` to load modules, and requires the appropriate permissions
   * to function. If the permissions are note available at startup, the default
   * function will prompt for them.
   *
   * @param specifier The URL string of the resource to be loaded and resolved
   * @param isDynamic A flag that indicates if the module was being loaded
   *                  dynamically
   */
  load?(specifier: string, isDynamic: boolean): Promise<unknown | undefined>;
  /** An optional callback that allows the default resolution logic of the
   * module graph to be "overridden". This is intended to allow items like an
   * import map to be used with the module graph. The callback takes the string
   * of the module specifier from the referrer and the string URL of the
   * referrer. The callback then returns a resolved URL string specifier.
   *
   * When an `importMap` URL string and this method is specifier, a warning
   * will be issued and the import map will be used. */
  resolve?(specifier: string, referrer: string): string;
}
/**
 * Asynchronously generate an array of documentation nodes for the supplied
 * module.
 *
 * ### Example
 *
 * ```ts
 * import { doc } from "tsdoc-extractor";
 *
 * const entries = await doc("https://deno.land/std/fmt/colors.ts");
 *
 * for (const entry of entries) {
 *   console.log(`name: ${entry.name} kind: ${entry.kind}`);
 * }
 * ```
 *
 * @param specifier The URL string of the specifier to document
 * @param options A set of options for generating the documentation
 * @returns A promise that resolves with an array of documentation nodes
 */
export declare function doc(
  specifier: any,
  options?: DocOptions
): Promise<Array<DocNode>>;

export declare function defaultResolver(
  specifier: string,
  referrer: string
): string;

export * from "./deno_doc/types";
