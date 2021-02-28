import { getPathOfIds } from "./getPathOfIds";

describe("getPathOfIds", () => {
  it("returns the path of ids corresponding to `pathOfIndices` in `dashboardFolders`", () => {
    expect(
      getPathOfIds(
        [
          {
            caption: "root",
            metaData: {},
            id: "1",
            type: "folder",
            children: [
              {
                caption: "parent",
                metaData: {},
                id: "a",
                type: "folder",
                children: [
                  {
                    caption: "sibling",
                    metaData: {},
                    id: "x",
                    type: "file",
                  },
                  {
                    caption: "me",
                    metaData: {},
                    id: "y",
                    type: "file",
                  },
                ],
              },
              {
                caption: "uncle",
                metaData: {},
                id: "b",
                type: "folder",
                children: [
                  {
                    caption: "cousin",
                    metaData: {},
                    id: "z",
                    type: "file",
                  },
                ],
              },
            ],
          },
        ],
        [0, 1, 0],
      ),
    ).toMatchInlineSnapshot(`
      Array [
        "1",
        "b",
        "z",
      ]
    `);
  });
});
