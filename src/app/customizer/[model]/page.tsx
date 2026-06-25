"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useControls } from "leva";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CatalogService } from "@/app/customizer/catalog.service";
import CarModel from "@/app/customizer/[model]/CarModel";

export default function CustomizerModelPage() {
  const params = useParams();
  const modelSlug = params.model as string;
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  const { backgroundColor, paintColor, intensity, envIntensity } = useControls({
    backgroundColor: "#4b5563",
    paintColor: "#b7b7b7",
    intensity: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    envIntensity: { value: 0.5, min: 0, max: 1, step: 0.1 },
  });

  useEffect(() => {
    async function fetchModel(): Promise<void> {
      const catalogItem = await CatalogService.getBySlug(modelSlug);
      setModelUrl(catalogItem.modelUrl);
    }

    fetchModel();
  }, [modelSlug]);

  return (
    <main className="fixed inset-0 w-full h-full">
      <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={[backgroundColor]} />
        <PerspectiveCamera makeDefault position={[5, 3, 8]} fov={40} />

        <ambientLight intensity={intensity / 2} />
        <directionalLight
          position={[0, 5, 5]}
          intensity={intensity}
          castShadow
        />
        <directionalLight
          position={[3, 5, -5]}
          color="red"
          intensity={intensity}
        />

        {modelUrl && (
          <Suspense fallback={null}>
            <CarModel modelUrl={modelUrl} paintColor={paintColor} />

            <Environment preset="city" environmentIntensity={envIntensity} />

            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
            />
          </Suspense>
        )}

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
    </main>
  );
}
