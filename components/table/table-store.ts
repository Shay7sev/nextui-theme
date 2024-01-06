import { create } from "zustand";
import { TableState } from "./interface";
// import { persist } from "zustand/middleware";

export const searchParamsStore = create<TableState>((set) => ({
  searchParams: {},
  setSearchParams: (newSearchParams) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...newSearchParams },
    })),
  page: 1,
  setPage: (newPage) => set({ page: newPage }),
  rowsPerPage: 5,
  setRowsPerPage: (newRowsPerPage) => set({ rowsPerPage: newRowsPerPage }),
  visibleColumns: "all",
  setVisibleColumns: (newVisibleColumns) =>
    set({ visibleColumns: newVisibleColumns }),
}));

// export const searchParamsPersistStore = create(
//   persist<TableState>(
//     (set) => ({
//       searchParams: {},
//       setSearchParams: (newSearchParams) =>
//         set((state) => ({
//           searchParams: { ...state.searchParams, ...newSearchParams },
//         })),
//       page: 1,
//       setPage: (newPage) => set({ page: newPage }),
//       rowsPerPage: 5,
//       setRowsPerPage: (newRowsPerPage) => set({ rowsPerPage: newRowsPerPage }),
//       visibleColumns: "all",
//       setVisibleColumns: (newVisibleColumns) =>
//         set({ visibleColumns: newVisibleColumns }),
//     }),
//     {
//       name: "zustand-table",
//     }
//   )
// );
