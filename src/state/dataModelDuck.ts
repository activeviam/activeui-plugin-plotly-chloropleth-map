import { DataModel } from "@activeviam/activeui-sdk";

import { Action } from "./actions";
import { State } from "./store";

export type DataModelState = DataModel | null;

export interface DataModelLoadedAction {
  type: "dataModelLoaded";
  payload: DataModelState;
}

export const dataModelReducer = (
  state: DataModelState = null,
  action: Action,
) => {
  if (action.type === "dataModelLoaded") {
    return action.payload;
  }
  return state;
};

export const getDataModel = (state: State) => state.dataModel;

export const onDataModelLoaded = (dataModel: DataModelState) => ({
  type: "dataModelLoaded",
  payload: dataModel,
});
