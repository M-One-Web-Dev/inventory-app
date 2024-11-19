import { create } from "zustand";

export const sidebarGlobalState = create((set) => ({
    iconMode: false,
    setIconMode: (value) => set({ iconMode: value }),
}));
