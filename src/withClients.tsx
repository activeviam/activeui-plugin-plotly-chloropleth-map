import React, { FC, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ContentClient,
  ClientsProvider,
  ActivePivotClient,
  createContentClient,
  createActivePivotClient,
} from "@activeviam/activeui-sdk";
import {
  activePivotServerUrl,
  contentServerUrl,
  serverKey,
} from "./serverUrls";
import { getToken } from "./state/credentialsDuck";
import LoadingBackground from "./components/LoadingBackground";
import { versions } from "./versions";

//
// Defining 'withClients' allows to maintain the client instance alive across hot module reloads.
// It prevents queries from being killed and restarted when you save a file in your IDE.
//

let clients: {
  content?: ContentClient;
  activePivot: {
    [serverKey: string]: ActivePivotClient;
  };
} | null = null;

/**
 * Provides a client.
 * Requires a valid token.
 */
export const withClients = (WrappedComponent: FC): FC => () => {
  const token = useSelector(getToken);
  const [, setAreClientsInstantiated] = useState<boolean>(false);

  const requestInit = useMemo(() => {
    if (!token) {
      return undefined;
    }
    return { headers: { authorization: `Jwt ${token}` } };
  }, [token]);

  useEffect(() => {
    if (!clients && requestInit && activePivotServerUrl && contentServerUrl) {
      const contentClient = createContentClient({
        url: contentServerUrl,
        version: versions.apis.content.versions[0],
        requestInit,
      });
      const activePivotClient = createActivePivotClient({
        url: activePivotServerUrl,
        version: versions.apis.pivot.versions[0],
        requestInit,
      });
      clients = {
        activePivot: { [serverKey]: activePivotClient },
        content: contentClient,
      };
      setAreClientsInstantiated(true);
    }
  }, [requestInit]);

  if (!clients || !requestInit) {
    return <LoadingBackground />;
  }

  return (
    <ClientsProvider value={clients}>
      <WrappedComponent />
    </ClientsProvider>
  );
};
