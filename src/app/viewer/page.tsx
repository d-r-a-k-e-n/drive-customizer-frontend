"use client";

import { useEffect, useState } from "react";
import { modelConfigService } from "@/services/modelConfigs.services";
import { type IModelConfig } from "@/types/modelConfig.types";
import { ROUTS } from "@/consts/routs.const";
import ModelCard from "@/components/modelCard";
import Pagination from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/consts/pageSize";

export default function ViewerPage() {
  const [customizedModels, setCustomizedModels] = useState<IModelConfig[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomizedModels(): Promise<void> {
      setIsLoading(true);

      try {
        const { data, meta } = await modelConfigService.getAll(page, PAGE_SIZE);
        setCustomizedModels(data);
        setTotalPages(meta.totalPages);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomizedModels();
  }, [page]);

  return (
    <div className="flex flex-1 font-sans justify-center">
      <main className="flex mt-6 mb-32 w-full max-w-5xl flex-col items-center mx-6">
        <h1 className="mb-12 uppercase font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-center">
          <span className="text-blue-600">Customized</span> models
        </h1>

        {isLoading && (
          <p className="mb-8 text-sm uppercase tracking-wide text-zinc-400">
            Loading...
          </p>
        )}

        {!isLoading && customizedModels.length === 0 && (
          <p className="mb-8 text-sm uppercase tracking-wide text-zinc-400">
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

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-12"
        />
      </main>
    </div>
  );
}
