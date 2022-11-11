# tsdoc-extractor

Extract documentation from TypeScript files. Based on [deno_doc](https://github.com/denoland/deno_doc).

## Installation

```
$ npm install tsdoc-extractor
```

## Usage

`product.ts`

```ts
/**
 * This is a product
 */
export interface Product {
  id: string;
}
```

Let's extract the documentation:

```js
import { doc } from "tsdoc-extractor";

const url = new URL("product.ts", import.meta.url).toString();
const nodes = await doc(url);

console.log(nodes[0]);
/*
{
  "kind": "interface",
  "name": "Product",
  "location": {
    "filename": "file:///tmp/product.ts",
    "line": 4,
    "col": 0
  },
  "declarationKind": "export",
  "jsDoc": {
    "doc": "This is a product"
  },
  "interfaceDef": {
    "extends": [],
    "methods": [],
    "properties": [
      {
        "name": "id",
        "location": {
          "filename": "file:///tmp/product.ts",
          "line": 5,
          "col": 2
        },
        "params": [],
        "computed": false,
        "optional": false,
        "tsType": {
          "repr": "string",
          "kind": "keyword",
          "keyword": "string"
        },
        "typeParams": []
      }
    ],
    "callSignatures": [],
    "indexSignatures": [],
    "typeParams": []
  }
}
*/
```

## Advanced

### Resolve types from a dependency

`product.ts`

```ts
import { Reference } from "my-dependency";

/**
 * This is a product
 */
export interface Product {
    id: string;
    ref: Reference;
}
```

To resolve the types from a dependency, you need to provide a custom `resolve` method:

```js
import { doc, defaultResolver } from "tsdoc-extractor";

const url = new URL("product.ts", import.meta.url).toString();
const nodes = await doc(url, {
  resolve: function (specifier, referrer) {
    if (specifier === "my-dependency") {
      return "file:///Projects/my-project/node_modules/my-dependency/dist/index.d.ts";
      // or "file:///Projects/my-project/node_modules/my-dependency/index.ts";
      // or "file:///Projects/my-project/node_modules/@types/my-dependency/index.d.ts";
    } else {
      return defaultResolver(specifier, referrer);
    }
  }
});
```
