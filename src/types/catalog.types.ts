export interface ICatalog {
  _id: string;
  name: string;
  slug: string;
  modelUrl: string;
  previewUrl: string;
}

export interface ICatalogResponse {
  data: ICatalog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ICatalogSingleResponse {
  data: ICatalog;
}
