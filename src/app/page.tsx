"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import CarModel from "@/app/customizer/[model]/CarModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTS } from "@/consts/routs.const";
import { catalogService } from "@/services/catalog.service";
import type { ICatalog } from "@/types/catalog.types";
import ModelCard from "@/components/modelCard";
import { FEATURES } from "@/consts/features.const";
import type { IModelConfig } from "@/types/modelConfig.types";
import { modelConfigService } from "@/services/modelConfigs.services";
import { PAGE_SIZE } from "@/consts/pageSize";

useGLTF.preload("/models/lotus.glb");

export default function HomePage() {
  const [catalogItems, setCatalogItems] = useState<ICatalog[]>([]);
  useEffect(() => {
    async function fetchData(): Promise<void> {
      const { data: catalogList } = await catalogService.getAll(1, PAGE_SIZE);
      setCatalogItems(catalogList);
    }

    fetchData();
  }, []);

  const [customizedModels, setCustomizedModels] = useState<IModelConfig[]>([]);

  useEffect(() => {
    async function fetchCustomizedModels(): Promise<void> {
      const { data: configs } = await modelConfigService.getAll(1, PAGE_SIZE);
      setCustomizedModels(configs);
    }

    fetchCustomizedModels();
  }, []);

  return (
    <main className="bg-[#050505] text-white selection:bg-blue-600/30 font-sans">
      <section className="relative flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4 mt-20">
          <p className="text-blue-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">
            Engineered for perfection
          </p>
          <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] mb-8 italic uppercase">
            Drive <br /> <span className="text-blue-600">customizer.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            Experience a whole new level of customization. Photorealistic
            graphics, thousands of details, and instant results.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href={ROUTS.CUSTOMIZER_ROUTE}>
              <Button variant="primary">Start customizing</Button>
            </Link>
            <Link href={ROUTS.VIEWER_ROUTE}>
              <Button variant="secondary">Gallery of Collections</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">
              Our model line
            </h2>
            <p className="text-zinc-500 font-medium">
              Each model is a blank canvas for your imagination
            </p>
          </div>
          <Link href={ROUTS.CUSTOMIZER_ROUTE}>
            <Button variant="link">View all</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {catalogItems.map(({ _id, name, previewUrl, slug }) => (
            <ModelCard
              key={_id}
              name={name}
              img={previewUrl}
              link={`${ROUTS.CUSTOMIZER_ROUTE}/${slug}`}
            />
          ))}
        </div>
      </section>

      <section className="py-32 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-5xl font-black mb-10 leading-none tracking-tighter uppercase italic">
              Technologies of
              <br /> <span className="text-blue-600">the Future</span>
            </h2>
            <div className="space-y-10">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 tracking-tight">
                      {title}
                    </h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2 relative aspect-square rounded-[40px] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-transparent to-transparent z-10"></div>
            <Canvas shadows camera={{ position: [100, 100, 100], fov: 35 }}>
              <Suspense fallback={null}>
                <Stage intensity={0.6}>
                  <CarModel modelUrl={"/models/lotus.glb"} />
                </Stage>
              </Suspense>
              <OrbitControls
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2.5}
              />
            </Canvas>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-black mb-6 uppercase italic tracking-tighter">
          Created by the community
        </h2>
        <p className="text-zinc-500 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
          Designers are already creating their own unique designs. Get inspired
          by the best work.
        </p>

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
      </section>
    </main>
  );
}
