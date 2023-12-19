"use client";

import { Logo, VerticalDotsIcon } from "@/components/icons";
// import { title } from "@/components/primitives";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnProps } from "@/components/table/interface";
import { Chip } from "@nextui-org/chip";
import { User } from "@nextui-org/user";
import { useAsyncList } from "@react-stately/data";
import { statusColorMap } from "./util";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

export default function AboutPage() {
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
  ];

  type IUser = (typeof users)[0];

  const columns: DataTableColumnProps<IUser>[] = [
    { name: "ID", uid: "id", sortable: true },
    {
      name: "NAME",
      uid: "name",
      sortable: true,
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

  let list = useAsyncList<IUser>({
    async load({ signal }: { signal: AbortSignal }) {
      let res = await fetch(
        "http://192.168.31.208:7300/mock/657d65df94d82b0021391abd/example/mock",
        {
          signal,
        }
      );
      let json = await res.json();
      const data = json.data;

      return {
        items: data.results,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof IUser];
          let second = b[sortDescriptor.column as keyof IUser];
          let cmp =
            (parseInt(first.toString()) || first) <
            (parseInt(second.toString()) || second)
              ? -1
              : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });
  return (
    <div className="w-full h-auto">
      {/* <h1 className={title({ color: "violet" })}>About</h1> */}
      <DataTable<IUser> data={list.items} list={list} columns={columns} />
    </div>
  );
}
