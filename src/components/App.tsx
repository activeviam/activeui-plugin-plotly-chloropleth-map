/** @jsx jsx */
import { FC, useEffect, useMemo } from "react";
import { jsx } from "@emotion/core";
import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Switch, Route } from "react-router-dom";
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
import { getToken, getUsername, onLoggedOut } from "../state/credentialsDuck";
import { onDashboardsTreeLoaded } from "../state/dashboardsTreeDuck";
import { onWidgetsTreeLoaded } from "../state/widgetsTreeDuck";
import { EditableDashboard } from "./EditableDashboard";
import { PageNotFound } from "./PageNotFound";
import { Home } from "./home/Home";
import { onAccessLogsLoaded, AccessLogsState } from "../state/accessLogsDuck";
import { getIsPresenting } from "../state/isPresentingDuck";
import LoadingBackground from "./LoadingBackground";
import { HeaderLeftBarAndChild } from "./HeaderLeftBarAndChild";
import { pluginRegistry } from "../pluginRegistry";
import { useErrorHandler } from "react-error-boundary";
import { getUserRoles } from "./getUserRoles";

const App: FC = () => {
  const username = useSelector(getUsername);
  const token = useSelector(getToken);
  const userRoles = useMemo(() => getUserRoles(token), [token]);
  const dispatch = useDispatch();
  const dataModel = useSelector(getDataModel);
  const activePivotClient = useActivePivotClient(serverKey);
  const contentClient = useContentClient();
  const handleError = useErrorHandler();

  // As soon as the authentication token is set, fetch the data model and the saved dashboards and widgets.
  useEffect(() => {
    if (username) {
      const initDashboardsTree = async () => {
        const dashboardsTree = await contentClient.fetchTree("dashboard");
        dispatch(onDashboardsTreeLoaded(dashboardsTree));
      };
      const initWidgetsTree = async () => {
        const widgetsTree = await contentClient.fetchTree("widget");
        dispatch(onWidgetsTreeLoaded(widgetsTree));
      };
      const initDataModel = async () => {
        const fetchedDataModel = await activePivotClient.fetchDataModel();
        dispatch(onDataModelLoaded(fetchedDataModel));
      };

      const initSettings = async () => {
        await contentClient.loadSettings(username);
      };

      const initAccessLogs = async () => {
        const accessLogs: AccessLogsState = await contentClient.fetchAccessLogs(
          username,
          "dashboard",
        );
        dispatch(onAccessLogsLoaded(accessLogs));
      };

      const init = async () => {
        try {
          await Promise.all([
            initDashboardsTree(),
            initWidgetsTree(),
            initDataModel(),
            initAccessLogs(),
            initSettings(),
          ]);
        } catch (e) {
          if (e.name === "UnauthorizedError") {
            dispatch(onLoggedOut());
          } else {
            handleError(e);
          }
        }
      };
      init();
    }
  }, [username, dispatch, activePivotClient, contentClient, handleError]);

  const isPresenting = useSelector(getIsPresenting);

  if (dataModel === null || username === null || userRoles === null) {
    return <LoadingBackground />;
  }

  return (
    <UserProvider value={{ username: username, userRoles }}>
      <HashRouter>
        <PluginsProvider value={pluginRegistry}>
          <DataModelsProvider value={{ [serverKey]: dataModel }}>
            <ThemeProvider value={lightActiveViamTheme}>
              <IsPresentingProvider value={isPresenting}>
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <Route path="/">
                    <HeaderLeftBarAndChild>
                      <Switch>
                        <Route path="/dashboard/:id">
                          <EditableDashboard />
                        </Route>
                        <Route path="/">
                          <PageNotFound />
                        </Route>
                      </Switch>
                    </HeaderLeftBarAndChild>
                  </Route>
                </Switch>
              </IsPresentingProvider>
            </ThemeProvider>
          </DataModelsProvider>
        </PluginsProvider>
      </HashRouter>
    </UserProvider>
  );
};

export default App;
