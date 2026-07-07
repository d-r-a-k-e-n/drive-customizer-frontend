"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogService } from "@/services/catalog.service";
import { modelConfigService } from "@/services/modelConfigs.services";
import { type ICatalog } from "@/types/catalog.types";
import { type IModelConfig } from "@/types/modelConfig.types";

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
    <div className="flex flex-1 font-sans items-center justify-center py-10">
      <main className="flex w-full max-w-5xl flex-col items-center px-4">
        <h1 className="mb-10 uppercase font-bold text-6xl">
          Customized models
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
            <Link key={_id} href={`/viewer/${_id}`}>
              <article className="overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10">
                {previewUrl ? (
                  <Image
                    className="h-48 w-full object-cover"
                    src={previewUrl}
                    alt={name}
                    width={400}
                    height={200}
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center text-xs uppercase tracking-wide text-zinc-400">
                    No preview
                  </div>
                )}
                <h2 className="p-4 text-lg font-semibold uppercase">{name}</h2>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
