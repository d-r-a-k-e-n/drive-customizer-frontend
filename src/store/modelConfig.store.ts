import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IModelConfigInitialStore {
  modelId: string;
  name: string;
  thumbnailUrl?: string;
  config: {
    meshId: string;
    color: string;
  }[];
}

interface IModelConfigStore extends IModelConfigInitialStore {
  setModelStore: (data: Partial<IModelConfigInitialStore>) => void;
  resetModelStore: () => void;
  getModelStore: () => void;
}

const initialState: IModelConfigInitialStore = {
  modelId: "",
  name: "",
  thumbnailUrl: "",
  config: [],
};

export const useModelConfigStore = create<IModelConfigStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setModelStore: (data) => set((state) => ({ ...state, ...data })),
      resetModelStore: () => set(() => initialState),
      getModelStore: () => get().config,
    }),
    {
      name: "model-config",
    },
  ),
);
