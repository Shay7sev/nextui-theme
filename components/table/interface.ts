import { type TableColumnProps } from "@nextui-org/table";
import React from "react";

// export interface columnsType<T = any> {}

export interface DataTableColumnProps<T = any>
  extends Partial<TableColumnProps<T>> {
  uid: string;
  name: string;
  sortable?: boolean;
  renderCell?: (
    item: T,
    columnKey: keyof T
  ) => string | number | React.JSX.Element;
}
