import { create } from "zustand";

type ProductStore = {
  selectedProductId?: string;
  setSelectedProductId: (id?: string) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  selectedProductId: undefined,
  setSelectedProductId: (id) => set({ selectedProductId: id })
}));