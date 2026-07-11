"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { Suspense } from "react";
import CarModel from "@/app/customizer/[model]/CarModel";
import ConfirmModal from "@/components/modals/confirmModal";
import SaveConfigModal from "@/components/modals/saveConfigModal";
import SaveSuccessModal from "@/components/modals/saveSuccessModal";
import { Button } from "@/components/ui/button";
import { ROUTS } from "@/consts/routs.const";
import Link from "next/link";
import { useCustomizerModel } from "@/hooks/useCustomizerModel";
import ModelLoader from "@/components/modelLoader";
import { ArrowLeft } from "lucide-react";
import { Leva } from "leva";

export default function CustomizerModelPage() {
  const {
    modelSlug,
    modelUrl,
    glRef,
    progress,
    showScene,
    mounted,
    backgroundColor,
    paintColor,
    intensity,
    envIntensity,
    modelId,
    isResetModalOpen,
    setIsResetModalOpen,
    isSaveModalOpen,
    isSuccessModalOpen,
    isSaving,
    saveError,
    savedConfigId,
    savedConfigName,
    handleResetConfirm,
    handleSaveClick,
    handleSaveConfirm,
    handleSaveCancel,
    handleSuccessClose,
  } = useCustomizerModel();

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <p className="text-zinc-500 uppercase tracking-widest text-[10px]">
          Initializing...
        </p>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 w-full h-full">
      <ModelLoader showScene={showScene} progress={progress} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScene ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="w-full h-full"
      >
        <div className="absolute z-10 pointer-events-auto bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[320px] px-4 lg:top-8 lg:right-8 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:w-80 lg:px-0">
          <Leva
            fill
            theme={{
              colors: {
                accent1: "#2563eb",
                elevation1: "#18181b",
                elevation2: "#09090b",
              },
            }}
          />
        </div>
        <Canvas
          shadows="percentage"
          gl={{ preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            glRef.current = gl;
          }}
        >
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
        <div className="absolute top-4 left-8 flex items-center gap-2">
          <Link href={ROUTS.CUSTOMIZER_ROUTE}>
            <Button variant="default">
              <ArrowLeft size={24} />
            </Button>
          </Link>
          <Button
            variant="default"
            onClick={handleSaveClick}
            disabled={isSaving || !modelId}
          >
            save
          </Button>

          <Button variant="default" onClick={() => setIsResetModalOpen(true)}>
            reset
          </Button>
        </div>
        <ConfirmModal
          isOpen={isResetModalOpen}
          title="Reset configuration"
          message="Are you sure you want to reset all customizations? This action cannot be undone."
          confirmLabel="Reset"
          cancelLabel="Cancel"
          onConfirm={handleResetConfirm}
          onCancel={() => setIsResetModalOpen(false)}
        />
        <SaveConfigModal
          isOpen={isSaveModalOpen}
          isSaving={isSaving}
          error={saveError}
          onSave={handleSaveConfirm}
          onCancel={handleSaveCancel}
        />
        {savedConfigId && (
          <SaveSuccessModal
            isOpen={isSuccessModalOpen}
            configId={savedConfigId}
            configName={savedConfigName}
            modelSlug={modelSlug}
            onClose={handleSuccessClose}
          />
        )}
      </motion.div>
    </main>
  );
}
