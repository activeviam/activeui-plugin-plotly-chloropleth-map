import { Versions } from "@activeviam/activeui-sdk";

/**
 * The result of calling the `versions` endpoint on a 5.9.x server.
 *
 * @see {@link https://artifacts.activeviam.com/documentation/rest/5.9.4/}
 */
export const versions: Versions = {
  version: 1,
  serverVersion: "5.9.4",
  apis: {
    sentinel: {
      versions: [
        { id: "6", restPath: "/sentinel/rest/v6", wsPath: "/sentinel/ws/v6" },
      ],
    },
    jwt: { versions: [{ id: "1", restPath: "/jwt/rest/v1" }] },
    pivot: {
      versions: [
        { id: "5", restPath: "/pivot/rest/v5", wsPath: "/pivot/ws/v5" },
      ],
    },
    repository: {
      versions: [
        {
          id: "4",
          restPath: "/repository/rest/v4",
          wsPath: "/repository/ws/v4",
        },
      ],
    },
    content: {
      versions: [
        { id: "5", restPath: "/content/rest/v5", wsPath: "/content/ws/v5" },
      ],
    },
    reporting: { versions: [{ id: "1", restPath: "/reporting/rest/v1" }] },
  },
};
