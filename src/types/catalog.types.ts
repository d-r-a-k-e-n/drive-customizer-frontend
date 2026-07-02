export interface ICatalog {
  _id: string;
  name: string;
  slug: string;
  modelUrl: string;
  previewUrl: string;
}

export interface ICatalogResponse {
  data: ICatalog[];
}
