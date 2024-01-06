"use client";

// import { title } from "@/components/primitives";

import { ResUser } from "@/api/about/typing";
import { Logo } from "@/components/icons";
import { NextTable } from "@/components/table";
import { DataTableColumnProps } from "@/components/table/interface";
import { Chip } from "@nextui-org/chip";
import { User } from "@nextui-org/user";
import { statusColorMap } from "../about/util";
import { getDocsList } from "@/api/about";

export default function DocsPage() {
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
    { name: "AGE", uid: "age", sortable: true },
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
  ];

  return (
    <div className="w-full h-auto">
      {/* <h1 className={title()}>Docs</h1> */}
      <NextTable<ResUser> key="1211" columns={columns} api={getDocsList} />
    </div>
  );
}
