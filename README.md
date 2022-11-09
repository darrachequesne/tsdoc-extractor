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
