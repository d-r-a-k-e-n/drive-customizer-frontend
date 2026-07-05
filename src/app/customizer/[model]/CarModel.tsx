import { useState, useEffect, useMemo } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import { useModelConfigStore } from "@/store/modelConfig.store";

interface ICarModelProps {
  modelUrl: string;
  paintColor: string;
}

export default function CarModel({ modelUrl, paintColor }: ICarModelProps) {
  const { scene } = useGLTF(modelUrl);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const { config, setModelStore } = useModelConfigStore((state) => state);

  const originalColors = useMemo(() => {
    const colorsMap = new Map();
    scene.traverse((object) => {
      if (
        object instanceof Mesh &&
        object.material instanceof MeshStandardMaterial
      ) {
        colorsMap.set(object.uuid, object.material.color.clone());
      }
    });
    return colorsMap;
  }, [scene]);

  useEffect(() => {
    if (config.length === 0) {
      scene.traverse((object) => {
        if (
          object instanceof Mesh &&
          object.material instanceof MeshStandardMaterial
        ) {
          const initialColor = originalColors.get(object.uuid);
          if (initialColor) {
            object.material.color.copy(initialColor);
          }
        }
      });
    }
  }, [config, scene, originalColors]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const diffX = Math.abs(e.clientX - startPos.x);
    const diffY = Math.abs(e.clientY - startPos.y);

    if (diffX > 5 || diffY > 5) return;

    if (e.object instanceof Mesh) {
      const material = e.object.material;

      if (material instanceof MeshStandardMaterial) {
        const newColorHex = paintColor;
        material.color.set(newColorHex);

        const meshId = e.object.uuid;

        const existingIndex = config.findIndex(
          (item) => item.meshId === meshId,
        );
        let updatedConfig;

        if (existingIndex !== -1) {
          updatedConfig = config.map((item, index) =>
            index === existingIndex ? { ...item, color: newColorHex } : item,
          );
        } else {
          updatedConfig = [...config, { meshId: meshId, color: newColorHex }];
        }

        setModelStore({ config: updatedConfig });
      }
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
