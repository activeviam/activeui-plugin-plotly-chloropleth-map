import { createStore } from "redux";

import { reducer, State } from "../state/store";

const initialState: Partial<State> = {
  credentials: {
    username: "username",
    token:
      "abc123.eyJzdWIiOiJhZG1pbiIsIm5iZiI6MTYxMDExNTMyMiwiaXNzIjoiYWN0aXZldmlhbSIsImV4cCI6MTYxMDE1ODUyMiwiaWF0IjoxNjEwMTE1MzIyLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiLCJST0xFX0NTX1JPT1QiLCJST0xFX0tQSSIsIlJPTEVfQURNSU4iXSwianRpIjoiMmYzYzVlYzgtNjRiNy00ZWEwLWIzNDYtNWJmNDMzOWI3MWMyIn0.A1qI3e_YDYjXA20A-6WEZRuyrjWGpC4kboib57knkSecGCFfPQ2bWjfo7XPVz2qJVNPgqJMd6f4sxkNyVykoTPSE2f_t9MhyYfpQU5ceT0l2lLmLFRw37V1Gt-zfPp_GJvE2u9xi-84R_ex4mBtc1shHmiffSP_dQVdJSnhhFGxQ5Hu5XsqY8BejmkxkOBwoTLftjdz3IGd72Nn48wWR4GJZ_wtT5OJg34QWuyV8ASCazyElJGJygQvHVL-2vR387twO2O8dFmRI567IL3Vj3o7RKUuZlxMAPy48JDi7BPfcnXfOYRYFAW1gFq3qFRnEtwAZES2PL-Nbiusi83q8Og",
  },
};

export default createStore(reducer, initialState, undefined);
