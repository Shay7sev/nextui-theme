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
import { DataTableColumnProps } from "./interface";
import { getSvgSize } from "@/utils";
import useSWRMutation from "swr/mutation";

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
];

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

type DataTableProps<TData> = {
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
};

export function DataTable<TData>({
  size = "sm",
  selectionBehavior = "toggle",
  selectionMode = "none",
  setColumns = true,
  columns,
  api,
  uniqueKey = "id",
  operationContent,
}: DataTableProps<TData>) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([""])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(1);
  const [data, setData] = React.useState([]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // const filteredItems = React.useMemo(() => {
  //   let filteredUsers = [...users];

  //   if (hasSearchFilter) {
  //     filteredUsers = filteredUsers.filter((user) =>
  //       user.name.toLowerCase().includes(filterValue.toLowerCase())
  //     );
  //   }
  //   if (
  //     statusFilter !== "all" &&
  //     Array.from(statusFilter).length !== statusOptions.length
  //   ) {
  //     filteredUsers = filteredUsers.filter((user) =>
  //       Array.from(statusFilter).includes(user.status)
  //     );
  //   }

  //   return filteredUsers;
  // }, [users, filterValue, statusFilter]);
  // const items = React.useMemo(() => {
  //   const start = (page - 1) * rowsPerPage;
  //   const end = start + rowsPerPage;

  //   return filteredItems.slice(start, end);
  // }, [page, filteredItems, rowsPerPage]);

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
    []
  );

  const { trigger, isMutating } = useSWRMutation("/", api /* options */);

  const asyncTrigger = React.useCallback(async () => {
    let params = {
      currentPage: page,
      pageSize: rowsPerPage,
    };
    const response = await trigger(params);
    const data = response.data;
    setTotal(data.total);
    setData(data.list);
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    asyncTrigger();
  }, [page, rowsPerPage]);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>();

  const sortedItems = React.useMemo(() => {
    return [...data].sort((a: TData, b: TData) => {
      const first = a[sortDescriptor?.column as keyof TData] as number;
      const second = b[sortDescriptor?.column as keyof TData] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor?.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);

  const pages = React.useMemo(() => {
    return Math.ceil(total / rowsPerPage);
  }, [total, rowsPerPage]);

  // const onNextPage = React.useCallback(() => {
  //   if (page < pages) {
  //     setPage(page + 1);
  //   }
  // }, [page, pages]);

  // const onPreviousPage = React.useCallback(() => {
  //   if (page > 1) {
  //     setPage(page - 1);
  //   }
  // }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onPageChange = React.useCallback((val: number) => {
    setPage(val);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Input
              isClearable
              size={size}
              className="w-full sm:max-w-[44%] h-auto"
              placeholder="Search by name..."
              startContent={<SearchIcon size={getSvgSize(size)} />}
              labelPlacement={"outside"}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  variant="flat"
                  size={size}
                  endContent={<ChevronDownIcon className="text-small" />}>
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}>
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
                onSelectionChange={setVisibleColumns}>
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
            共 {users.length} 条
          </span>
          <label
            className={clsx(`flex items-center text-default-400 text-${size}`)}>
            条/页:
            <select
              className={clsx(
                `bg-transparent outline-none text-default-400 text-${size}`
              )}
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
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
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
          isDisabled={isMutating}
          page={page}
          total={pages}
          variant="light"
          onChange={onPageChange}
        />
      </div>
    );
  }, [selectedKeys, total, page, pages, hasSearchFilter]);

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
        // emptyContent={"No users found"}
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
