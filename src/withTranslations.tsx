import React, { FC, useEffect, useState } from "react";
import { fetchTranslations } from "@activeviam/activeui-sdk";

import { treeToFlatMap } from "tree-to-flat-map";
import { pluginRegistry } from "./pluginRegistry";
import { IntlConfig, IntlProvider } from "react-intl";
import LoadingBackground from "./components/LoadingBackground";

const locale = "en-US";

/**
 * Provides the translations from the SDK and the application to the WrappedComponent.
 */
export const withTranslations = (WrappedComponent: FC): FC => () => {
  const [translations, setTranslations] = useState<
    IntlConfig["messages"] | undefined
  >(undefined);

  useEffect(() => {
    const initTranslations = async (locale: string) => {
      const [
        sdkTranslations,
        { default: appTranslations },
      ] = await Promise.all([
        fetchTranslations(pluginRegistry, locale),
        import(`./translations/${locale}.ts`),
      ]);

      const flatAppTranslations = treeToFlatMap(appTranslations);
      setTranslations({
        ...sdkTranslations,
        ...flatAppTranslations,
      });
    };
    initTranslations(locale);
  }, []);

  if (!translations) {
    return <LoadingBackground />;
  }

  return (
    <IntlProvider locale={locale} messages={translations}>
      <WrappedComponent />
    </IntlProvider>
  );
};
