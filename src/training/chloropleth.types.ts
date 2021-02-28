import { AWidgetState, MdxString, Query } from "@activeviam/activeui-sdk";

export type ChloroplethMapState = AWidgetState & {
  query: Query<MdxString>;
};
