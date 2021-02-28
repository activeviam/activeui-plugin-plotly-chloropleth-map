import fs from "fs-extra";

/**
 * Copies the CSS files that need to be served along with the app, from the SDK to /public.
 */
const copyCSSFiles = () => fs.copy("../sdk/dist/style", "./public/style");

copyCSSFiles();
