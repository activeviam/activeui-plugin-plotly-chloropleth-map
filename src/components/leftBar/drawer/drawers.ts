import { ComponentType } from "react";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { EditorProps } from "@activeviam/activeui-sdk";

import ContentEditorDrawer, {
  ContentEditorDrawerIcon,
} from "./ContentEditorDrawer";
import FiltersDrawer, { FiltersDrawerIcon } from "./FiltersDrawer";

export type DrawerKey = "filters" | "contentEditor";

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
};

export default drawers;
