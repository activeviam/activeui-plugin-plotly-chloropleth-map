import "./env.types";

const params = new URLSearchParams(window.location.search);

export const activePivotServerUrl: string =
  params.get("url") || window.env.activePivotServerUrl;
export const contentServerUrl: string =
  params.get("url") || window.env.contentServerUrl;

export const serverKey = "my-server";
