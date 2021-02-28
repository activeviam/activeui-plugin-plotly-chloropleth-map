import { getPrefixedLocalStorageKey } from "../getPrefixedLocalStorageKey";
import { Action } from "./actions";
import { State } from "./store";

export type CredentialsState = {
  username: string | null;
  token: string | null;
};

export interface LoggedInAction {
  type: "loggedIn";
  payload: CredentialsState;
}

export interface LoggedOutAction {
  type: "loggedOut";
}

const locallySavedUserName = window.localStorage.getItem(
  getPrefixedLocalStorageKey("username"),
);

export const credentialsReducer = (
  state: CredentialsState = { username: locallySavedUserName, token: null },
  action: Action,
) => {
  if (action.type === "loggedIn") {
    return action.payload;
  }
  if (action.type === "loggedOut") {
    return {
      username: state.username,
      token: null,
    };
  }
  return state;
};

export const getUsername = (state: State) => state.credentials.username;
export const getToken = (state: State) => state.credentials.token;

export const onLoggedIn = (credentials: CredentialsState) => ({
  type: "loggedIn",
  payload: credentials,
});

export const onLoggedOut = () => ({
  type: "loggedOut",
});
