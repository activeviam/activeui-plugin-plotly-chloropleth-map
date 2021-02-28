/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC, Fragment, ReactElement, useEffect, useState } from "react";
import {
  UnauthorizedError,
  ForbiddenError,
  ping,
} from "@activeviam/activeui-sdk";
import { useSelector, useDispatch } from "react-redux";

import {
  getUsername,
  getToken,
  onLoggedIn,
  onLoggedOut,
} from "../state/credentialsDuck";
import LoadingBackground from "./LoadingBackground";
import LoginPopup from "./LoginPopup";
import { contentServerUrl } from "../serverUrls";
import { getPrefixedLocalStorageKey } from "../getPrefixedLocalStorageKey";
import { versions } from "../versions";

const locallySavedToken = window.localStorage.getItem(
  getPrefixedLocalStorageKey("token"),
);

/**
 * Displays a login popup if the user is not logged in
 * Dispatches `username` and `token` to the Redux store otherwise.
 */
export const LoginProvider: FC<{}> = (props) => {
  const username = useSelector(getUsername);
  const token = useSelector(getToken);
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initToken = async () => {
      if (username && locallySavedToken && !token) {
        setIsCheckingToken(true);
        try {
          const contentServerVersion = versions.apis.content.versions[0];
          // Make sure that the locally saved token is still valid by using it to perform an authenticated ping.
          // If it isn't, this call will throw.
          await ping(contentServerUrl, contentServerVersion, {
            headers: { authorization: `Jwt ${locallySavedToken}` },
          });
          dispatch(onLoggedIn({ token: locallySavedToken, username }));
        } catch (error) {
          if (
            error instanceof UnauthorizedError ||
            error instanceof ForbiddenError
          ) {
            dispatch(onLoggedOut());
            window.localStorage.removeItem(getPrefixedLocalStorageKey("token"));
          } else {
            throw error;
          }
        } finally {
          setIsCheckingToken(false);
        }
      }
    };
    initToken();
  }, [username, token, dispatch]);

  const handleLogin = (username: string, token: string) => {
    dispatch(onLoggedIn({ username, token }));
    window.localStorage.setItem(getPrefixedLocalStorageKey("token"), token);
    window.localStorage.setItem(
      getPrefixedLocalStorageKey("username"),
      username,
    );
    setIsCheckingToken(false);
  };

  if (isCheckingToken) {
    // We are in the process of checking the validity of the locally saved token, while the app loads.
    return <LoadingBackground />;
  }

  if (!token || !username) {
    return (
      <Fragment>
        <LoadingBackground />
        <LoginPopup username={username} onLogin={handleLogin} />
      </Fragment>
    );
  }

  return props.children as ReactElement;
};
