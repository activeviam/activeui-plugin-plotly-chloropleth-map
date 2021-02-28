import { ComponentType } from "react";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { EditorProps } from "@activeviam/activeui-sdk";

import WidgetsDrawer, { WidgetsDrawerIcon } from "./WidgetsDrawer";
import ContentEditorDrawer, {
  ContentEditorDrawerIcon,
} from "./ContentEditorDrawer";
import FiltersDrawer, { FiltersDrawerIcon } from "./FiltersDrawer";
import StyleEditorDrawer, { StyleEditorDrawerIcon } from "./StyleEditorDrawer";
import QueryEditorDrawer, { QueryEditorDrawerIcon } from "./QueryEditorDrawer";

export type DrawerKey =
  | "filters"
  | "widgets"
  | "contentEditor"
  | "styleEditor"
  | "queryEditor";

interface Drawer {
  type: "double" | "single";
  component: ComponentType<EditorProps>;
  icon: ComponentType<AntdIconProps>;
}

const drawers: { [key in DrawerKey]: Drawer } = {
  contentEditor: {
    type: "double",
    component: ContentEditorDrawer,
    icon: ContentEditorDrawerIcon,
  },
  filters: {
    type: "double",
    component: FiltersDrawer,
    icon: FiltersDrawerIcon,
  },
  widgets: {
    type: "single",
    component: WidgetsDrawer,
    icon: WidgetsDrawerIcon,
  },
  styleEditor: {
    type: "single",
    component: StyleEditorDrawer,
    icon: StyleEditorDrawerIcon,
  },
  queryEditor: {
    type: "single",
    component: QueryEditorDrawer,
    icon: QueryEditorDrawerIcon,
  },
};

export default drawers;
