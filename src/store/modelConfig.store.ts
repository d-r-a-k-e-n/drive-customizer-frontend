import { create } from "zustand";
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

export const useModelConfigStore = create<IModelConfigStore>()((set, get) => ({
  ...initialState,
  setModelStore: (data) => set((state) => ({ ...state, ...data })),
  resetModelStore: () => set(initialState),
  getModelStore: () => get().config,
}));
