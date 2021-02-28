/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC, ChangeEvent, useMemo } from "react";
import { useIntl } from "react-intl";
import Input from "antd/lib/input";
import { ContentRecord, FormRow } from "@activeviam/activeui-sdk";
import Select from "antd/lib/select";
export interface SaveAsPopupState {
  name?: string;
  pathToFolder: string[];
}

interface SaveAsPopupProps {
  contentTree: ContentRecord | null;
  value: SaveAsPopupState;
  onChange: (state: SaveAsPopupState) => void;
}

export const SaveAsPopup: FC<SaveAsPopupProps> = ({
  contentTree,
  value,
  onChange,
}) => {
  const { formatMessage } = useIntl();

  const pathToFolders: { caption: string; path: string[] }[] = useMemo(() => {
    const _pathToFolders: { caption: string; path: string[] }[] = [];
    if (contentTree) {
      const accumulate = (
        node: ContentRecord,
        path: string[] = [],
        caption: string = "",
      ) => {
        _pathToFolders.push({
          caption,
          path,
        });
        Object.entries(node.children || {}).forEach(([id, child]) => {
          const metaData = child.children?.[`${id}_metadata`].entry.content;
          if (metaData && metaData.isFolder) {
            accumulate(child, [...path, id], `${caption}/${metaData.name}`);
          }
        });
      };
      accumulate(contentTree);
    }
    return _pathToFolders;
  }, [contentTree]);

  const handleNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      name: event.target.value,
    });
  };

  const handleFolderChanged = (pathToFolder: string) => {
    onChange({
      ...value,
      pathToFolder: pathToFolder.split("/"),
    });
  };

  return (
    <div>
      <FormRow>
        {formatMessage({ id: "name" })}
        <Input autoFocus value={value.name} onChange={handleNameChanged} />
      </FormRow>
      <FormRow>
        {formatMessage({ id: "folder" })}
        <Select style={{ width: "100%" }} onChange={handleFolderChanged}>
          {pathToFolders.map(({ caption, path }, i) => (
            <Select.Option key={i} value={path.join("/")}>
              {caption}
            </Select.Option>
          ))}
        </Select>
      </FormRow>
    </div>
  );
};
