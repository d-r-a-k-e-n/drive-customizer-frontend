import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BACKGROUND_COLOR } from "@/consts/backgroundColor.const";
import { type IModelConfigItem } from "@/types/modelConfig.types";

interface IModelConfigInitialStore {
  modelId: string;
  name: string;
  thumbnailUrl?: string;
  backgroundColor: string;
  config: IModelConfigItem[];
}

interface IModelConfigStore extends IModelConfigInitialStore {
  setModelStore: (data: Partial<IModelConfigInitialStore>) => void;
  resetModelStore: () => void;
  getModelStore: () => IModelConfigItem[];
}

const initialState: IModelConfigInitialStore = {
  modelId: "",
  name: "",
  thumbnailUrl: "",
  backgroundColor: BACKGROUND_COLOR,
  config: [],
};

export const useModelConfigStore = create<IModelConfigStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setModelStore: (data) => set((state) => ({ ...state, ...data })),
      resetModelStore: () =>
        set((state) => ({
          ...state,
          backgroundColor: BACKGROUND_COLOR,
          config: [],
        })),
      getModelStore: () => get().config,
    }),
    {
      name: "model-config",
    },
  ),
);
