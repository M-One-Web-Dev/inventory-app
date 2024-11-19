import { create } from "zustand";

export const manualHistoryBorrowedStore = create((set) => ({
    search: "",
    status: "",
    handleSearchValue: (value) => set({ search: value }),
    handleStatusValue: (value) => set({ status: value }),
    reset: () => set({ search: "", status: "" }),
}));
