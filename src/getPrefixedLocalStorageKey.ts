/**
 * Returns `key`, prefixed with the application's name, in order to avoid conflicts on the domain where it is deployed.
 */
export const getPrefixedLocalStorageKey = (key: string): string =>
  `activeui-${key}`;
