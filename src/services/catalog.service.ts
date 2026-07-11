import axios from "axios";
import {
  type ICatalog,
  type ICatalogResponse,
  type ICatalogSingleResponse,
} from "@/types/catalog.types";
import { type IPaginatedResponse } from "@/types/pagination.types";
import { PAGE_SIZE } from "@/consts/pageSize";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalogs`;

export const catalogService = {
  getAll: async (
    page = 1,
    limit = PAGE_SIZE,
  ): Promise<IPaginatedResponse<ICatalog>> => {
    try {
      const response = await axios.get<ICatalogResponse>(BASE_URL, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Axios Error:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<ICatalog> => {
    try {
      const response = await axios.get<ICatalogSingleResponse>(
        `${BASE_URL}/${id}`,
      );
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
