"use client";

import { useEffect, useState } from "react";
import { catalogService } from "@/services/catalog.service";
import { modelConfigService } from "@/services/modelConfigs.services";
import { type ICatalog } from "@/types/catalog.types";
import { type IModelConfig } from "@/types/modelConfig.types";
import { ROUTS } from "@/consts/routs.const";
import ModelCard from "@/components/modelCard";

export default function ViewerPage() {
  const [customizedModels, setCustomizedModels] = useState<
    (IModelConfig & { previewUrl?: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomizedModels(): Promise<void> {
      try {
        const [configs, catalogItems] = await Promise.all([
          modelConfigService.getAll(),
          catalogService.getAll(),
        ]);

        const catalogById = new Map<string, ICatalog>(
          catalogItems.map((item) => [item._id, item]),
        );

        const modelsWithPreview = configs.map((config) => ({
          ...config,
          previewUrl: catalogById.get(config.modelId)?.previewUrl,
        }));

        setCustomizedModels(modelsWithPreview);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomizedModels();
  }, []);

  return (
    <div className="flex flex-1 font-sans justify-center">
      <main className="flex mt-6 mb-32 w-full max-w-5xl flex-col items-center">
        <h1 className="mb-12 uppercase font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-center">
          <span className="text-blue-600">Customized</span> models
        </h1>

        {isLoading && (
          <p className="text-sm uppercase tracking-wide text-zinc-400">
            Loading...
          </p>
        )}

        {!isLoading && customizedModels.length === 0 && (
          <p className="text-sm uppercase tracking-wide text-zinc-400">
            No customized models yet
          </p>
        )}

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {customizedModels.map(({ _id, name, previewUrl }) => (
            <ModelCard
              key={_id}
              name={name}
              img={previewUrl}
              link={`${ROUTS.VIEWER_ROUTE}/${_id}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
