import { ContentNode, TreeObject, AMetaData } from "@activeviam/activeui-sdk";

// A path can be defined by:
//   - indices (the child index of each node amongst its siblings). Useful for selection, because more performant.
//   - ids (each segment is the id of the corresponding node). Necessary to get or update files on the content server.

/**
 * Returns the path of ids corresponding to `pathOfIndices` in `dashboardFolders`.
 */
export const getPathOfIds = (
  trees: TreeObject<ContentNode<AMetaData>>[],
  pathOfIndices: number[],
): string[] => {
  const pathOfIds: string[] = [];
  let node: TreeObject<ContentNode<AMetaData>> = {
    caption: "root",
    id: "",
    type: "folder",
    children: trees,
    metaData: {},
  };
  pathOfIndices.forEach((index) => {
    const child = node.children?.[index]!;
    pathOfIds.push(child.id);
    node = child;
  });
  return pathOfIds;
};
