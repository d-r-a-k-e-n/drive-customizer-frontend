import axios from "axios";
import {
  type ICreateModelConfig,
  type IModelConfig,
  type IModelConfigResponse,
  type IModelConfigSingleResponse,
} from "@/types/modelConfig.types";
import { type IPaginatedResponse } from "@/types/pagination.types";
import { PAGE_SIZE } from "@/consts/pageSize";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/model-configs`;

export const modelConfigService = {
  getAll: async (
    page = 1,
    limit = PAGE_SIZE,
  ): Promise<IPaginatedResponse<IModelConfig>> => {
    try {
      const response = await axios.get<IModelConfigResponse>(BASE_URL, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Unexpected Error:", error);
      throw new Error("Error");
    }
  },

  getById: async (id: string): Promise<IModelConfig | null> => {
    try {
      const response = await axios.get<IModelConfigSingleResponse>(
        `${BASE_URL}/${id}`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Unexpected Error:", error);
      throw new Error("Error");
    }
  },

  create: async (data: ICreateModelConfig): Promise<IModelConfig> => {
    try {
      const response = await axios.post<IModelConfigSingleResponse>(
        `${BASE_URL}/creates`,
        data,
      );
      return response.data.data as IModelConfig;
    } catch (error) {
      console.error("Unexpected Error:", error);
      throw new Error("Error");
    }
  },
};
