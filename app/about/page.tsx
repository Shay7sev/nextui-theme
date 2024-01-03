"use client";

import { Logo, PlusIcon, VerticalDotsIcon } from "@/components/icons";
// import { title } from "@/components/primitives";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnProps } from "@/components/table/interface";
import { Chip } from "@nextui-org/chip";
import { User } from "@nextui-org/user";
import { statusColorMap } from "./util";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { getAboutList } from "@/api/about";
import { ResUser } from "@/api/about/typing";
import { useMemo } from "react";
import { getSvgSize } from "@/utils";

export default function AboutPage() {
  const columns: DataTableColumnProps<ResUser>[] = [
    { name: "ID", uid: "id", sortable: true },
    {
      name: "NAME",
      uid: "name",
      sortable: true,
      valueType: "input",
      renderCell: (item, columnKey) => {
        return (
          <User
            avatarProps={{
              radius: "lg",
              // util html-to-image img cors bug
              // src: user.avatar,
              fallback: <Logo />,
            }}
            description={item.email}
            name={item[columnKey]}>
            {item.email}
          </User>
        );
      },
    },
    { name: "AGE", uid: "age", sortable: true, valueType: "input" },
    {
      name: "ROLE",
      uid: "role",
      sortable: true,
      renderCell: (item, columnKey) => {
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{item[columnKey]}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {item.team}
            </p>
          </div>
        );
      },
    },
    { name: "TEAM", uid: "team" },
    { name: "EMAIL", uid: "email" },
    {
      name: "STATUS",
      uid: "status",
      sortable: true,
      valueType: "select",
      valueEnum: new Map([
        ["active", "Active"],
        ["paused", "Paused"],
      ]),
      renderCell: (item, columnKey) => {
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[item.status]}
            size="sm"
            variant="flat">
            {item[columnKey]}
          </Chip>
        );
      },
    },
    {
      name: "ACTIONS",
      uid: "actions",
      renderCell: (_item, _columnKey) => {
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      },
    },
  ];
  const operationContent = useMemo(() => {
    return (
      <Button
        color="primary"
        className="hidden sm:flex w-full sm:max-w-[15%] h-auto"
        endContent={<PlusIcon size={getSvgSize()} />}
        size={"sm"}>
        Add New
      </Button>
    );
  }, []);
  return (
    <div className="w-full h-auto">
      {/* <h1 className={title({ color: "violet" })}>About</h1> */}
      <DataTable<ResUser>
        columns={columns}
        api={getAboutList}
        operationContent={operationContent}
      />
    </div>
  );
}
