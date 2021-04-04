import React, { FC, useEffect, useState } from "react";
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
 */
export const withClients = (WrappedComponent: FC): FC => () => {
  const [, setAreClientsInstantiated] = useState<boolean>(false);

  useEffect(() => {
    if (!clients && activePivotServerUrl && contentServerUrl) {
      const contentClient = createContentClient({
        url: contentServerUrl,
        version: versions.apis.content.versions[0],
      });
      const activePivotClient = createActivePivotClient({
        url: activePivotServerUrl,
        version: versions.apis.pivot.versions[0],
      });
      clients = {
        activePivot: { [serverKey]: activePivotClient },
        content: contentClient,
      };
      setAreClientsInstantiated(true);
    }
  }, []);

  if (!clients) {
    return <LoadingBackground />;
  }

  return (
    <ClientsProvider value={clients}>
      <WrappedComponent />
    </ClientsProvider>
  );
};
