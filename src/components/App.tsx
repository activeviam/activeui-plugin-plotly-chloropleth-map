/** @jsx jsx */
import { FC, useEffect } from "react";
import { jsx } from "@emotion/core";
import { useSelector, useDispatch } from "react-redux";
import {
  DataModelsProvider,
  PluginsProvider,
  ThemeProvider,
  lightActiveViamTheme,
  IsPresentingProvider,
  useActivePivotClient,
  useContentClient,
  UserProvider,
} from "@activeviam/activeui-sdk";

import { onDataModelLoaded, getDataModel } from "../state/dataModelDuck";
import { serverKey } from "../serverUrls";
import { EditableDashboard } from "./EditableDashboard";
import { getIsPresenting } from "../state/isPresentingDuck";
import LoadingBackground from "./LoadingBackground";
import { HeaderLeftBarAndChild } from "./HeaderLeftBarAndChild";
import { pluginRegistry } from "../pluginRegistry";
import { useErrorHandler } from "react-error-boundary";

const App: FC = () => {
  const dispatch = useDispatch();
  const dataModel = useSelector(getDataModel);
  const activePivotClient = useActivePivotClient(serverKey);
  const contentClient = useContentClient();
  const handleError = useErrorHandler();

  // As soon as the authentication token is set, fetch the data model and the saved dashboards and widgets.
  useEffect(() => {
    const initDataModel = async () => {
      const fetchedDataModel = await activePivotClient.fetchDataModel();
      dispatch(onDataModelLoaded(fetchedDataModel));
    };

    initDataModel();
  }, [dispatch, activePivotClient, contentClient, handleError]);

  const isPresenting = useSelector(getIsPresenting);

  if (dataModel === null) {
    return <LoadingBackground />;
  }

  return (
    <UserProvider value={{ username: "", userRoles: [] }}>
      <PluginsProvider value={pluginRegistry}>
        <DataModelsProvider value={{ [serverKey]: dataModel }}>
          <ThemeProvider value={lightActiveViamTheme}>
            <IsPresentingProvider value={isPresenting}>
              <HeaderLeftBarAndChild>
                <EditableDashboard />
              </HeaderLeftBarAndChild>
            </IsPresentingProvider>
          </ThemeProvider>
        </DataModelsProvider>
      </PluginsProvider>
    </UserProvider>
  );
};

export default App;
