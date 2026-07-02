import { useState, useEffect } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";

interface IModelConfig {
  id: number;
  color: string;
}

export default function CarModel({
  modelUrl,
  paintColor,
}: {
  modelUrl: string;
  paintColor: string;
}) {
  const MODEL_CONFIG_KEY = "model-config";

  const [modelConfig, setModelConfig] = useState<IModelConfig[]>(() => {
    const saved = localStorage.getItem(MODEL_CONFIG_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const { scene } = useGLTF(modelUrl);

  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (modelConfig.length > 0) {
      localStorage.setItem(MODEL_CONFIG_KEY, JSON.stringify(modelConfig));
    }
  }, [modelConfig]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const diffX = Math.abs(e.clientX - startPos.x);
    const diffY = Math.abs(e.clientY - startPos.y);

    if (diffX > 5 || diffY > 5) {
      return;
    }

    if (e.object instanceof Mesh) {
      const material = e.object.material;

      if (material instanceof MeshStandardMaterial) {
        material.color.set(paintColor);
      }

      setModelConfig((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === material.id);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            color: material.color.getHexString(),
          };
          return updated;
        }

        return [
          ...prev,
          {
            id: material.id,
            color: material.color.getHexString(),
          },
        ];
      });
    }
  };

  return (
    <Center top>
      <primitive
        object={scene}
        scale={1.5}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />
    </Center>
  );
}
