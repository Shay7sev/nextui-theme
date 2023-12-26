export const getSvgSize = (size?: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return 14;
    case "md":
      return 24;
    case "lg":
      return 36;
    default:
      return 14;
  }
};
