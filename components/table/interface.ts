import { type TableColumnProps } from "@nextui-org/table";
import React from "react";

// export interface columnsType<T = any> {}

export interface DataTableColumnProps<T = any>
  extends Partial<TableColumnProps<T>> {
  uid: string;
  name: string;
  sortable?: boolean;
  valueType?: "input" | "select";
  valueEnum?: Map<string, any>;
  renderCell?: (
    item: T,
    columnKey: keyof T
  ) => string | number | React.JSX.Element;
}
