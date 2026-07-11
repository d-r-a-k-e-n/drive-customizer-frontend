"use client";

import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";
import CarModel from "@/app/customizer/[model]/CarModel";
import { ROUTS } from "@/consts/routs.const";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ModelLoader from "@/components/modelLoader";
import { useViewerModel } from "@/hooks/useViewerModel";
import { ArrowLeft } from "lucide-react";

const LIGHT_INTENSITY = 0.5;
const ENV_INTENSITY = 0.5;

export default function ViewerModelPage() {
  const { modelConfig, modelUrl, isLoading, error, progress, showScene } =
    useViewerModel();

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
          href={ROUTS.VIEWER_ROUTE}
          className="text-xs uppercase tracking-wide text-zinc-300 underline"
        >
          Back to viewer
        </Link>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 h-full w-full">
      <ModelLoader showScene={showScene} progress={progress} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScene ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="w-full h-full"
      >
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
            <CarModel
              modelUrl={modelUrl}
              config={modelConfig.config}
              readOnly
            />

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
      </motion.div>

      <div className="absolute top-4 left-8 flex flex-col gap-2">
        <Link href={ROUTS.VIEWER_ROUTE}>
          <Button variant="default">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <span className="text-xs uppercase tracking-wide text-zinc-400">
          {modelConfig.name} - view only
        </span>
      </div>
    </main>
  );
}
