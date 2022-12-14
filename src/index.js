import { instantiate } from "./deno_doc/deno_doc.generated.js";
import { readFile } from "node:fs/promises";
import { parse } from "node:path";

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
export async function doc(specifier, options = {}) {
  const {
    load = defaultLoader,
    includeAll = false,
    resolve = defaultResolver,
    importMap,
  } = options;
  const wasm = await instantiate();
  return wasm.doc(specifier, includeAll, load, resolve, importMap);
}

async function defaultLoader(specifier) {
  const url = new URL(specifier);
  switch (url.protocol) {
    case "file:": {
      const content = await readFile(url, { encoding: "utf-8" });
      return {
        kind: "module",
        specifier,
        content,
      };
    }
    case "http:":
    case "https:": {
      if (!globalThis.fetch) {
        console.warn("fetch is not available, please use Node.js 18 or above");
        return;
      }
      const response = await fetch(url.toString(), { redirect: "follow" });
      if (response.status !== 200) {
        throw new Error(
          `error while fetching ${url.toString()}, HTTP response ${
            response.status
          }`
        );
      }
      const content = await response.text();
      const headers = {};
      for (const [key, value] of response.headers) {
        headers[key.toLowerCase()] = value;
      }
      return {
        kind: "module",
        specifier: response.url,
        headers,
        content,
      };
    }
  }
}

function normalize(specifier) {
  const path = parse(specifier);
  switch (path.ext) {
    case ".js":
      return specifier.slice(0, -3) + ".ts";
    case ".ts":
      return specifier;
    default:
      return specifier + ".ts";
  }
}

export function defaultResolver(specifier, referrer) {
  const isRelativeImport = specifier.startsWith(".");
  if (isRelativeImport) {
    return new URL(normalize(specifier), referrer).toString();
  } else {
    // note: we could also point towards the dependency in the node_modules directory (or use the definitions from the
    // "@types/<module>" package), but the resolution mechanism is a bit tricky
    return new URL("dummy.js", import.meta.url).toString();
  }
}
