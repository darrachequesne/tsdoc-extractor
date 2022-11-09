import { assert } from "chai";
import { doc } from "../src/index.js";

describe("tsdoc-extractor", () => {
  it("should work with local files", async () => {
    const url = new URL("product.ts", import.meta.url).toString();
    const nodes = await doc(url);

    assert.lengthOf(nodes, 1);

    const node = nodes[0];
    assert.equal(node.kind, "interface");
    assert.equal(node.name, "Product");
    assert.equal(node.declarationKind, "export");
  });

  it("should work with remote files", async () => {
    const nodes = await doc("https://deno.land/std@0.104.0/fmt/colors.ts");

    assert.lengthOf(nodes, 48);
  });
});
