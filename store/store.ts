import { create } from "zustand";
import { AuthSlice, createAuthSlice } from "./slices";

type StoreState = AuthSlice;

export const useAppStore = create<StoreState>()((...state) => ({
    ...createAuthSlice(...state),
}));
