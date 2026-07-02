import axios from "axios";
import { type ICatalog, type ICatalogResponse } from "@/types/catalog.types";
const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalogs`;

export const catalogService = {
  getAll: async (): Promise<ICatalog[]> => {
    try {
      const response = await axios.get<ICatalogResponse>(BASE_URL);
      return response.data.data;
    } catch (error) {
      console.error("Axios Error:", error);
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<ICatalog> => {
    try {
      const response = await axios.get<ICatalog>(`${BASE_URL}/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Axios Error:", error);
      throw error;
    }
  },
};
