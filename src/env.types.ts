declare global {
  interface Window {
    env: Env;
  }
}

// By exporting this type we allow the global declaration to be in the scope of whoever imports it (app, tests, etc.)
export interface Env {
  activePivotServerUrl: string;
  contentServerUrl: string;
}
