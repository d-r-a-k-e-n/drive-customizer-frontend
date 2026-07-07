"use client";

import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import CarModel from "@/app/customizer/[model]/CarModel";
import { catalogService } from "@/services/catalog.service";
import { modelConfigService } from "@/services/modelConfigs.services";
import { type IModelConfig } from "@/types/modelConfig.types";

const LIGHT_INTENSITY = 0.5;
const ENV_INTENSITY = 0.5;

export default function ViewerModelPage() {
  const params = useParams();
  const configId = params.id as string;

  const [modelConfig, setModelConfig] = useState<IModelConfig | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadViewerModel(): Promise<void> {
      try {
        const savedConfig = await modelConfigService.getById(configId);

        if (!savedConfig) {
          setError("Configuration not found");
          return;
        }

        setModelConfig(savedConfig);

        const catalogItems = await catalogService.getAll();
        const catalogItem = catalogItems.find(
          (item) => item._id === String(savedConfig.modelId),
        );

        if (!catalogItem) {
          setError("Model not found");
          return;
        }

        setModelUrl(catalogItem.modelUrl);
      } catch {
        setError("Failed to load configuration");
      } finally {
        setIsLoading(false);
      }
    }

    loadViewerModel();
  }, [configId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center font-sans">
        <p className="text-sm uppercase tracking-wide text-zinc-400">
          Loading...
        </p>
      </div>
    );
  }

  if (error || !modelConfig || !modelUrl) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 font-sans">
        <p className="text-sm uppercase tracking-wide text-zinc-400">
          {error ?? "Configuration not found"}
        </p>
        <Link
          href="/viewer"
          className="text-xs uppercase tracking-wide text-zinc-300 underline"
        >
          Back to viewer
        </Link>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 h-full w-full">
      <Canvas shadows="percentage">
        <color attach="background" args={[modelConfig.backgroundColor]} />
        <PerspectiveCamera makeDefault position={[5, 3, 8]} fov={40} />

        <ambientLight intensity={LIGHT_INTENSITY / 2} />
        <directionalLight
          position={[0, 5, 5]}
          intensity={LIGHT_INTENSITY}
          castShadow
        />
        <directionalLight
          position={[3, 5, -5]}
          color="red"
          intensity={LIGHT_INTENSITY}
        />

        <Suspense fallback={null}>
          <CarModel modelUrl={modelUrl} config={modelConfig.config} readOnly />

          <Environment preset="city" environmentIntensity={ENV_INTENSITY} />

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>

      <div className="absolute top-4 left-8 flex flex-col gap-2">
        <Link
          href="/viewer"
          className="cursor-pointer rounded-md border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-300 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
        >
          back
        </Link>
        <span className="text-xs uppercase tracking-wide text-zinc-400">
          {modelConfig.name} — view only
        </span>
      </div>
    </main>
  );
}
