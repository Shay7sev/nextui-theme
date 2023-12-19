import { ChipProps } from "@nextui-org/chip";

export const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};
