"use client";

import Link from "next/link";
import Image from "next/image";
import { catalogService } from "@/services/catalog.service";
import { useEffect, useState } from "react";
import { type ICatalog } from "@/types/catalog.types";
import { ROUTS } from "@/consts/routs.const";

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
      <main className="flex w-full max-w-5xl flex-col items-center mx-6">
        <h1 className="mb-6 uppercase font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center md:text-left">
          Select your model
        </h1>

        <div className="flex w-full gap-4 justify-center m-10 flex-wrap">
          {catalogItems.map(({ _id, name, slug, previewUrl }) => (
            <Link key={_id} href={`${ROUTS.CUSTOMIZER_ROUTE}/${slug}`}>
              <Image
                className="rounded"
                src={`${previewUrl}`}
                alt={name}
                width={300}
                height={100}
              />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
