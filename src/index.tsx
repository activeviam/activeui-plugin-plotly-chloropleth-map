import React from "react";
import ReactDOM from "react-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider as ReduxProvider } from "react-redux";

import "./index.css";
import store from "./state/store";
import App from "./components/App";

import { withLogin } from "./withLogin";
import { withClients } from "./withClients";
import { withTranslations } from "./withTranslations";
import { withErrorBoundary } from "./withErrorBoundary";
import { withStyle } from "./withStyle";
import AntdConfigProvider from "antd/lib/config-provider";
import { getOverlayRoot } from "./getOverlayRoot";

const render = () => {
  const WiredApp = withTranslations(
    withErrorBoundary(
      withLogin(withClients(withStyle("light-activeviam")(App))),
    ),
  );

  ReactDOM.render(
    <AntdConfigProvider getPopupContainer={getOverlayRoot}>
      <ReduxProvider store={store}>
        <DndProvider backend={HTML5Backend}>
          <WiredApp />
        </DndProvider>
      </ReduxProvider>
    </AntdConfigProvider>,
    document.getElementById("root"),
  );
};

render();

if (module.hot) {
  module.hot.accept("./components/App", render);
}
