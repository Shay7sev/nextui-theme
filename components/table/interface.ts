import { type TableColumnProps, type Selection } from "@nextui-org/table";
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

export interface DataTableProps<TData> {
  size?: "sm" | "md" | "lg";
  selectionBehavior?: "toggle" | "replace" | undefined;
  selectionMode?: "single" | "multiple" | "none";
  setColumns?: boolean;
  columns: DataTableColumnProps<TData>[];
  operationContent?: React.JSX.Element;
  url?: string;
  api: (
    url: string,
    {
      arg,
    }: {
      arg: any;
    }
  ) => Promise<any>;
  uniqueKey?: string;
  useZustand?: boolean;
}

export interface TableState {
  searchParams: {
    [key: string]: any;
  };
  setSearchParams: (newSearchParams: { [key: string]: any }) => void;
  page: number;
  setPage: (newPage: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (newRowsPerPage: number) => void;
  visibleColumns: Selection;
  setVisibleColumns: (newVisibleColumns: Selection) => void;
}
