"use client";

import { catalogService } from "@/services/catalog.service";
import { useEffect, useState } from "react";
import { type ICatalog } from "@/types/catalog.types";
import { ROUTS } from "@/consts/routs.const";
import ModelCard from "@/components/modelCard";
import Pagination from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/consts/pageSize";
import { useModelConfigStore } from "@/store/modelConfig.store";

export default function CustomizerPage() {
  const [catalogItems, setCatalogItems] = useState<ICatalog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const resetModelStore = useModelConfigStore((state) => state.resetModelStore);

  useEffect(() => {
    resetModelStore();
    localStorage.removeItem("model-config");
  }, [resetModelStore]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true);

      try {
        const { data, meta } = await catalogService.getAll(page, PAGE_SIZE);
        setCatalogItems(data);
        setTotalPages(meta.totalPages);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [page]);

  return (
    <div className="flex flex-1 font-sans justify-center">
      <main className="flex mt-6 mb-32 w-full max-w-5xl flex-col items-center mx-6">
        <h1 className="mb-12 uppercase font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-center">
          Select your <span className="text-blue-600">model</span>
        </h1>

        {isLoading && (
          <p className="mb-8 text-sm uppercase tracking-wide text-zinc-400">
            Loading...
          </p>
        )}

        {!isLoading && catalogItems.length === 0 && (
          <p className="mb-8 text-sm uppercase tracking-wide text-zinc-400">
            No models available
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {catalogItems.map(({ _id, name, slug, previewUrl }) => (
            <ModelCard
              key={_id}
              name={name}
              img={previewUrl}
              link={`${ROUTS.CUSTOMIZER_ROUTE}/${slug}`}
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
