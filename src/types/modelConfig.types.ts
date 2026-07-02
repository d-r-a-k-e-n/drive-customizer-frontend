export interface ICreateModelConfig {
  modelId: string;
  name: string;
  thumbnailUrl?: string;
  config: {
    meshId: string;
    color: string;
  }[];
}
