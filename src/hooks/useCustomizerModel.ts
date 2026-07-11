"use client";

import { useProgress } from "@react-three/drei";
import { useControls } from "leva";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type WebGLRenderer } from "three";
import { catalogService } from "@/services/catalog.service";
import { modelConfigService } from "@/services/modelConfigs.services";
import { useModelConfigStore } from "@/store/modelConfig.store";
import { BACKGROUND_COLOR } from "@/consts/backgroundColor.const";

export function useCustomizerModel() {
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
  const { progress, active } = useProgress();
  const [showScene, setShowScene] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active && modelUrl) {
      const timer = setTimeout(() => setShowScene(true), 200);
      return () => clearTimeout(timer);
    }
  }, [active, modelUrl]);

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

  return {
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
  };
}
