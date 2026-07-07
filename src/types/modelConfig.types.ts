export interface IModelConfigItem {
  meshId: string;
  color: string;
}

export interface ICreateModelConfig {
  modelId: string;
  name: string;
  thumbnailUrl?: string;
  backgroundColor: string;
  config: IModelConfigItem[];
}

export interface IModelConfig extends ICreateModelConfig {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IModelConfigResponse {
  data: IModelConfig[];
}

export interface IModelConfigSingleResponse {
  data: IModelConfig | null;
}
