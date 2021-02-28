import { readdirSync } from "fs";
import { join } from "path";
import _difference from "lodash/difference";
import { treeToFlatMap } from "tree-to-flat-map";

describe("Translation files", () => {
  it("have all the same keys", async () => {
    const translationsFolderPath = join(__dirname, "translations");

    const translationFilePaths = readdirSync(
      translationsFolderPath,
    ).map((fileName) => join(translationsFolderPath, fileName));

    const translationFilePromises = translationFilePaths.map(
      (translationFilePath) => import(translationFilePath),
    );

    const translationFiles = await Promise.all(translationFilePromises);
    const translationKeys = translationFiles.map((translationFile) =>
      Object.keys(treeToFlatMap(translationFile.default)),
    );

    const [firstKeys, ...restKeys] = translationKeys;

    for (let i = 0; i < restKeys.length; i++) {
      // Run _difference in both directions as an omission in the first array will not flag as a difference.
      const diff = [
        ..._difference(restKeys[i], firstKeys),
        ..._difference(firstKeys, restKeys[i]),
      ];

      if (diff.length !== 0) {
        let diffMessage = "";
        diff.forEach((key) => {
          diffMessage = `${diffMessage}
            "${key}"`;
        });
        throw new Error(`
          ${translationFilePaths[0]}
          AND 
          ${translationFilePaths[i + 1]}
          differ in the following keys:
          ${diffMessage}
          `);
      }
    }
  });
});
