import { create } from "zustand";

type ProductStore = {
  productIds: string[];
  addProductId: (id: string) => void;
  removeProductId: (id: string) => void;
  clearProductIds: () => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  productIds: [],
  addProductId: (id) =>
    set((state) => {
      if (state.productIds.includes(id)) {
        return state;
      }

      return { productIds: [...state.productIds, id] };
    }),
  removeProductId: (id) =>
    set((state) => ({
      productIds: state.productIds.filter((productId) => productId !== id)
    })),
  clearProductIds: () => set({ productIds: [] })
}));
