import axios from "axios";
import { ICreateModelConfig } from "@/types/modelConfig.types";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/model-configs`;

export const modelConfigService = {
  create: async (data: ICreateModelConfig) => {
    try {
      const response = await axios.post(`${BASE_URL}/creates`, data);
      return response.data;
    } catch (error) {
      console.error("Unexpected Error:", error);
      throw new Error("Error");
    }
  },
};
