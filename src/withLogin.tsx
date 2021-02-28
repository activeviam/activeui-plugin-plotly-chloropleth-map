import React, { FC } from "react";
import { LoginProvider } from "./components/LoginProvider";

/**
 * Provides the token and the username to the WrappedComponent.
 */
export const withLogin = (WrappedComponent: FC): FC => () => (
  <LoginProvider>
    <WrappedComponent />
  </LoginProvider>
);
