import { createStore } from "redux";

import { reducer, State } from "../state/store";

const initialState: Partial<State> = {};

export default createStore(reducer, initialState, undefined);
