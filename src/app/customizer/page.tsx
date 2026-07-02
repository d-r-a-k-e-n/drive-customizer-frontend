"use client";

import Link from "next/link";
import Image from "next/image";
import { catalogService } from "@/services/catalog.service";
import { useEffect, useState } from "react";
import { type ICatalog } from "@/types/catalog.types";

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
    <div className="flex flex-1 font-sans items-center justify-center">
      <main className="flex w-full max-w-3xl flex-col items-center">
        <h1 className="mb-10 uppercase font-bold text-6xl">
          Select your model
        </h1>

        <div className="flex w-full items-center justify-center gap-4">
          {catalogItems.map(({ _id, name, slug, previewUrl }) => (
            <Link key={_id} href={`/customizer/${slug}`}>
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
