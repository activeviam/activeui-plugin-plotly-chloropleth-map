import { AWidgetState, MdxSelect, Query } from "@activeviam/activeui-sdk";

export type ChloroplethMapState = AWidgetState & {
  query: Query<MdxSelect>;
};
