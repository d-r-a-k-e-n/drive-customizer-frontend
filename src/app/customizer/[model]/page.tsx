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
import { Suspense, useEffect, useRef, useState } from "react";
import { type WebGLRenderer } from "three";
import { catalogService } from "@/services/catalog.service";
import { modelConfigService } from "@/services/modelConfigs.services";
import CarModel from "@/app/customizer/[model]/CarModel";
import ConfirmModal from "@/components/modals/ConfirmModal";
import SaveConfigModal from "@/components/modals/SaveConfigModal";
import SaveSuccessModal from "@/components/modals/SaveSuccessModal";
import { useModelConfigStore } from "@/store/modelConfig.store";
import { BACKGROUND_COLOR } from "@/consts/backgroundColor.const";

export default function CustomizerModelPage() {
  const params = useParams();
  const modelSlug = params.model as string;
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedConfigId, setSavedConfigId] = useState<string | null>(null);
  const [savedConfigName, setSavedConfigName] = useState("");
  const glRef = useRef<WebGLRenderer | null>(null);

  const {
    modelId,
    thumbnailUrl,
    backgroundColor: storedBackgroundColor,
    setModelStore,
    resetModelStore,
  } = useModelConfigStore((store) => store);

  const [
    { backgroundColor, paintColor, intensity, envIntensity },
    setControls,
  ] = useControls(() => ({
    backgroundColor: storedBackgroundColor || BACKGROUND_COLOR,
    paintColor: "#b7b7b7",
    intensity: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    envIntensity: { value: 0.5, min: 0, max: 1, step: 0.1 },
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setModelStore({ backgroundColor });
    }, 500);
    return () => clearTimeout(timer);
  }, [backgroundColor, setModelStore]);

  useEffect(() => {
    async function loadModel(): Promise<void> {
      const catalogItem = await catalogService.getBySlug(modelSlug);
      setModelUrl(catalogItem.modelUrl);

      setModelStore({
        modelId: catalogItem._id,
        name: catalogItem.name,
        thumbnailUrl: catalogItem.previewUrl,
        backgroundColor: BACKGROUND_COLOR,
        config: [],
      });
      setControls({ backgroundColor: BACKGROUND_COLOR });
    }

    loadModel();
  }, [modelSlug, setModelStore, setControls]);

  function handleResetConfirm() {
    resetModelStore();
    setControls({ backgroundColor: BACKGROUND_COLOR });
    setIsResetModalOpen(false);
  }

  function handleSaveClick() {
    setSaveError(null);
    setIsSaveModalOpen(true);
  }

  async function handleSaveConfirm(configName: string) {
    if (!modelId) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const { config, backgroundColor } = useModelConfigStore.getState();

      const savedConfig = await modelConfigService.create({
        modelId,
        name: configName,
        thumbnailUrl,
        backgroundColor,
        config,
      });

      setSavedConfigId(savedConfig._id);
      setSavedConfigName(configName);
      setIsSaveModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch {
      setSaveError("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  }

  function handleSaveCancel() {
    if (isSaving) return;
    setIsSaveModalOpen(false);
    setSaveError(null);
  }

  function handleSuccessClose() {
    setIsSuccessModalOpen(false);
    setSavedConfigId(null);
    setSavedConfigName("");
  }

  return (
    <main className="fixed inset-0 w-full h-full">
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

      <div className="absolute top-4 left-8 flex items-center gap-4">
        <button
          className="cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white px-4 py-1.5 rounded-md text-xs font-medium transition-all tracking-wide uppercase disabled:opacity-50"
          onClick={handleSaveClick}
          disabled={isSaving || !modelId}
        >
          save
        </button>
        <button
          className="cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white px-4 py-1.5 rounded-md text-xs font-medium transition-all tracking-wide uppercase"
          onClick={() => setIsResetModalOpen(true)}
        >
          reset
        </button>
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
    </main>
  );
}
