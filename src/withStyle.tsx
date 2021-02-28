import React, { FC, useEffect } from "react";

/**
 * A HOC fetching the CSS file corresponding to `themeKey`.
 * Loads its content in the style tag with the id "ant-style".
 * The injected CSS will only match elements under a parent with "ant-root" className.
 */
export const withStyle = (themeKey: string): ((WrappedComponent: FC) => FC) => (
  WrappedComponent: FC,
): FC => (props) => {
  useEffect(() => {
    // Get target style element in DOM
    const styleElement = document.getElementById("ant-style");
    if (!styleElement || styleElement.tagName !== "LINK") {
      throw new Error(
        "Could not find a style element with the id “ant-style”. Such a style element should be in the DOM for ActiveUI to work.",
      );
    }

    // `styleElement` is expected to exist in the DOM and to be an HTMLLinkElement.
    // eslint-disable-next-line
    if (
      !(styleElement as HTMLLinkElement).href.endsWith(
        `/style/${themeKey}.antd.css`,
      )
    ) {
      // eslint-disable-next-line
      (styleElement as HTMLLinkElement).href = `/style/${themeKey}.antd.css`;
    }
  });
  return <WrappedComponent {...props} />;
};
