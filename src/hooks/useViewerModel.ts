"use client";

import { useProgress } from "@react-three/drei";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { catalogService } from "@/services/catalog.service";
import { modelConfigService } from "@/services/modelConfigs.services";
import { type IModelConfig } from "@/types/modelConfig.types";

export function useViewerModel() {
  const params = useParams();
  const configId = params.id as string;

  const [modelConfig, setModelConfig] = useState<IModelConfig | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { progress, active } = useProgress();
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    if (!active && modelUrl) {
      const timer = setTimeout(() => setShowScene(true), 200);
      return () => clearTimeout(timer);
    }
  }, [active, modelUrl]);

  useEffect(() => {
    async function loadViewerModel(): Promise<void> {
      try {
        const savedConfig = await modelConfigService.getById(configId);

        if (!savedConfig) {
          setError("Configuration not found");
          return;
        }

        setModelConfig(savedConfig);

        const catalogItem = await catalogService.getById(
          String(savedConfig.modelId),
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

  return {
    configId,
    modelConfig,
    modelUrl,
    isLoading,
    error,
    progress,
    showScene,
  };
}
