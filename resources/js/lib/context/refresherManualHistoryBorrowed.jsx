import { create } from "zustand";

export const manualHistoryBorrowedStore = create((set) => ({
    search: "",
    handleSearchValue: (value) => set({ search: value }),
}));
