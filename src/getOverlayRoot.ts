import { activeUIOverlayRootId } from "@activeviam/activeui-sdk";

// TODO update doc link to the corresponding section in the ActiveUI 5 documentation when available.

/**
 * Returns the DOM node used as the container for all overlays.
 * This element should have the ".ant-root" className, or have a parent with it.
 * The application must provide this element as part of its DOM.
 * For more information, see https://activeviam.com/activeui/documentation/4.3.15/dev/guides/custom-components.html#inheriting-ant-design-style.
 */
export function getOverlayRoot() {
  const element = document.getElementById(activeUIOverlayRootId);
  if (!element) {
    throw new Error(
      `Missing overlay root DOM node in page. Did you forget to add "<div id='${activeUIOverlayRootId}'></div>" to your page?`,
    );
  }
  return element;
}
