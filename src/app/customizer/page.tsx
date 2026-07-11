"use client";

import { catalogService } from "@/services/catalog.service";
import { useEffect, useState } from "react";
import { type ICatalog } from "@/types/catalog.types";
import { ROUTS } from "@/consts/routs.const";
import ModelCard from "@/components/modelCard";

export default function CustomizerPage() {
  const [catalogItems, setCatalogItems] = useState<ICatalog[]>([]);
  useEffect(() => {
    async function fetchData(): Promise<void> {
      const catalogList: ICatalog[] = await catalogService.getAll();
      setCatalogItems(catalogList);
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 font-sans justify-center">
      <main className="flex mt-6 mb-32 w-full max-w-5xl flex-col items-center mx-6">
        <h1 className="mb-12 uppercase font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-center">
          Select your <span className="text-blue-600">model</span>
        </h1>

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
      </main>
    </div>
  );
}
