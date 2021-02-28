import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import testStore from "../__test_resources__/testStore";
import { render, RenderOptions } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { IntlProvider } from "react-intl";
import { pluginRegistry } from "../pluginRegistry";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { serverKey } from "../serverUrls";
import AntdConfigProvider from "antd/lib/config-provider";

const locale = "en-US";

export async function getRenderWithMocks() {
  const mockedFetchDataModel = jest.fn(() => Promise.resolve({}));

  // This must be called before loading modules importing `@activeviam/activeui-sdk`.
  // Otherwise these modules will import the real SDK functions instead of the mocks.
  jest.mock("@activeviam/activeui-sdk", () => {
    const activeUISdk = jest.requireActual("@activeviam/activeui-sdk");

    return {
      ...activeUISdk,
      authenticate: jest.fn(() => Promise.resolve("token")),
    };
  });

  const mockActivePivotClient = { fetchDataModel: mockedFetchDataModel };
  const mockContentClient = {
    fetchTree: () => Promise.resolve({}),
    fetchAccessLogs: () => Promise.resolve([]),
    loadSettings: () => Promise.resolve(),
  };
  const mockClients: any = {
    activePivot: { [serverKey]: mockActivePivotClient },
    content: mockContentClient,
  };

  const sdk = await import("@activeviam/activeui-sdk");

  const [sdkTranslations, { default: appTranslations }] = await Promise.all([
    sdk.fetchTranslations(pluginRegistry, locale),
    import(`../translations/${locale}.ts`),
  ]);

  const translations = {
    ...sdkTranslations,
    ...appTranslations,
  };

  // This function depends on the mocked sdk, it has to be declared after
  // the sdk has been mocked.
  const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, "queries">,
  ) => {
    return render(ui, {
      wrapper: (props: PropsWithChildren<any>) => {
        return (
          <AntdConfigProvider getPopupContainer={() => document.body}>
            <ReduxProvider store={testStore}>
              <DndProvider backend={HTML5Backend}>
                <sdk.ClientsProvider value={mockClients}>
                  <IntlProvider locale={locale} messages={translations}>
                    {props.children}
                  </IntlProvider>
                </sdk.ClientsProvider>
              </DndProvider>
            </ReduxProvider>
          </AntdConfigProvider>
        );
      },
      ...options,
    });
  };

  return {
    mockedAuthenticate: sdk.authenticate as jest.Mock,
    mockedFetchDataModel,
    render: customRender,
  };
}
