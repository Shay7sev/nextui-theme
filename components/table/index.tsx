"use client";

import { DataTable } from "./data-table";
import { DataTableProps } from "./interface";
import { ZustandTable } from "./zustand-table";

export function NextTable<TData>({
  size = "sm",
  selectionBehavior = "toggle",
  selectionMode = "none",
  columns,
  api,
  uniqueKey = "id",
  operationContent,
  useZustand = false,
}: DataTableProps<TData>) {
  return !useZustand ? (
    <DataTable<TData>
      size={size}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
      columns={columns}
      uniqueKey={uniqueKey}
      api={api}
      operationContent={operationContent}
    />
  ) : (
    <ZustandTable<TData>
      size={size}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
      columns={columns}
      uniqueKey={uniqueKey}
      api={api}
      operationContent={operationContent}
    />
  );
}
