"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
  SortDescriptor,
} from "@nextui-org/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { ChevronDownIcon, SearchIcon } from "../icons";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { DataTableProps } from "./interface";
import { getSvgSize } from "@/utils";
import useSWRMutation from "swr/mutation";
import { searchParamsStore } from "./table-store";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ZustandTable<TData>({
  size = "sm",
  selectionBehavior = "toggle",
  selectionMode = "none",
  setColumns = true,
  columns,
  api,
  uniqueKey = "id",
  operationContent,
}: DataTableProps<TData>) {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([""])
  );
  const [total, setTotal] = React.useState(1);
  const [data, setData] = React.useState([]);

  const {
    searchParams,
    setSearchParams,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    visibleColumns,
    setVisibleColumns,
  } = searchParamsStore();

  const pages = React.useMemo(() => {
    return Math.ceil(total / rowsPerPage);
  }, [total, rowsPerPage]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [columns, visibleColumns]);

  const renderCell = React.useCallback(
    (item: TData, columnKey: keyof TData) => {
      const cellValue = item[columnKey as keyof TData];
      let obj = columns?.find((m) => m.uid === columnKey);
      if (obj) {
        if (obj?.renderCell) {
          return obj.renderCell(item, columnKey);
        } else {
          return <>{cellValue || ""}</>;
        }
      } else {
        return <></>;
      }
    },
    [columns]
  );

  const { trigger, isMutating } = useSWRMutation("/", api /* options */);

  const asyncTrigger = React.useCallback(async () => {
    // 过滤 searchParams
    const filteredSearchParams = columns
      .filter((m) => m.valueType)
      .reduce(
        (
          acc: {
            [key: string]: any;
          },
          curr
        ) => {
          const { uid } = curr;
          if (searchParams.hasOwnProperty(uid)) {
            acc[uid] = searchParams[uid];
          }
          return acc;
        },
        {}
      );
    let params: {
      [key: string]: any;
    } = {
      currentPage: page,
      pageSize: rowsPerPage,
      ...filteredSearchParams,
    };
    const response = await trigger(
      Object.fromEntries(
        Object.entries(params)
          .filter(([_k, v]) => v != null)
          .map(([key, value]) => [
            key,
            value instanceof Set ? Array.from(value) : value,
          ])
      )
    );
    const data = response.data;
    setTotal(data.total);
    setData(data.list);
    // 设置 currentPage
    if (page > Math.ceil(data.total / rowsPerPage)) setPage(1);
  }, [columns, page, rowsPerPage, searchParams, setPage, trigger]);

  React.useEffect(() => {
    asyncTrigger();
  }, [asyncTrigger, page, rowsPerPage, searchParams]);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>();

  const sortedItems = React.useMemo(() => {
    return [...data].sort((a: TData, b: TData) => {
      const first = a[sortDescriptor?.column as keyof TData] as number;
      const second = b[sortDescriptor?.column as keyof TData] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor?.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage, setRowsPerPage]
  );

  const onInputChange = React.useCallback(
    (value?: string, uid?: string) => {
      if (value && uid) {
        setSearchParams({
          [uid]: value,
        });
      }
    },
    [setSearchParams]
  );

  const onSelectChange = React.useCallback(
    (value?: Selection, uid?: string) => {
      if (value && uid) {
        setSearchParams({
          [uid]: value,
        });
      }
    },
    [setSearchParams]
  );

  const onClear = React.useCallback(() => {
    setPage(1);
  }, [setPage]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            {columns.map((column) => {
              if (column.valueType === "input") {
                return (
                  <Input
                    key={column.uid}
                    isClearable
                    size={size}
                    className="w-full sm:max-w-[44%] h-auto"
                    placeholder={`搜索${column.name}`}
                    startContent={<SearchIcon size={getSvgSize(size)} />}
                    labelPlacement={"outside"}
                    value={searchParams[column.uid]}
                    onClear={() => onClear()}
                    onValueChange={(val) => onInputChange(val, column.uid)}
                  />
                );
              } else if (column.valueType === "select" && column.valueEnum) {
                return (
                  <Dropdown key={column.uid}>
                    <DropdownTrigger className="hidden sm:flex">
                      <Button
                        variant="flat"
                        className="w-full sm:max-w-[15%] h-auto"
                        size={size}
                        endContent={<ChevronDownIcon className="text-small" />}>
                        {column.name}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection={false}
                      aria-label="Table Columns"
                      closeOnSelect={false}
                      selectedKeys={searchParams[column.uid]}
                      selectionMode="multiple"
                      onSelectionChange={(val) => {
                        onSelectChange(val, column.uid);
                      }}>
                      {Array.from(column.valueEnum).map((item) => (
                        <DropdownItem key={item[1]} className="capitalize">
                          {capitalize(item[0])}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                );
              }
            })}

            {operationContent}
          </div>
          {setColumns ? (
            <Dropdown>
              <DropdownTrigger>
                <Button size={size} variant="flat" isIconOnly>
                  <MixerHorizontalIcon className="text-small" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(val) => setVisibleColumns(val)}>
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className={clsx(`text-default-400 text-${size}`)}>
            共 {total} 条
          </span>
          <label
            className={clsx(`flex items-center text-default-400 text-${size}`)}>
            条/页:
            <select
              className={clsx(
                `bg-transparent outline-none text-default-400 text-${size}`
              )}
              value={rowsPerPage}
              onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    columns,
    operationContent,
    setColumns,
    size,
    visibleColumns,
    total,
    rowsPerPage,
    onRowsPerPageChange,
    searchParams,
    onClear,
    onInputChange,
    onSelectChange,
    setVisibleColumns,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {selectionBehavior === "toggle" ? (
          <span className={clsx(`text-default-400 text-${size}`)}>
            {selectedKeys === "all"
              ? "已全选"
              : `${selectedKeys.size} of ${total} 已选`}
          </span>
        ) : (
          <span></span>
        )}
        <Pagination
          isCompact
          showControls
          size={size}
          showShadow
          color="primary"
          page={page}
          total={pages}
          variant="light"
          disableCursorAnimation
          disableAnimation
          classNames={{
            item: "!rounded-xl",
          }}
          radius="full"
          onChange={setPage}
        />
      </div>
    );
  }, [selectionBehavior, size, selectedKeys, total, page, pages, setPage]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode={selectionMode}
      selectionBehavior={selectionBehavior}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}>
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.align ? column.align : "start"}
            allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={sortedItems}
        loadingContent={<Spinner />}
        loadingState={
          isMutating || sortedItems.length === 0 ? "loading" : "idle"
        }>
        {(item: any) => (
          <TableRow key={item[uniqueKey]}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof TData)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
