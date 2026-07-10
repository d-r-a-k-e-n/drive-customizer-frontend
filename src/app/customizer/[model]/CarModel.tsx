import { useState, useEffect, useMemo } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import { useModelConfigStore } from "@/store/modelConfig.store";
import { type IModelConfigItem } from "@/types/modelConfig.types";
import { BACKGROUND_COLOR } from "@/consts/backgroundColor.const";

interface ICarModelProps {
  modelUrl: string;
  paintColor?: string;
  config?: IModelConfigItem[];
  readOnly?: boolean;
}

export default function CarModel({
  modelUrl,
  paintColor = BACKGROUND_COLOR,
  config: configProp,
  readOnly = false,
}: ICarModelProps) {
  const { scene } = useGLTF(modelUrl);

  const { setModelStore, config: storeConfig } = useModelConfigStore(
    (state) => state,
  );
  const config = configProp ?? storeConfig;
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const originalColors = useMemo(() => {
    const colorsMap = new Map<string, MeshStandardMaterial["color"]>();
    scene.traverse((object) => {
      if (
        object instanceof Mesh &&
        object.material instanceof MeshStandardMaterial
      ) {
        colorsMap.set(object.name, object.material.color.clone());
      }
    });
    return colorsMap;
  }, [scene]);

  useEffect(() => {
    scene.traverse((object) => {
      if (
        object instanceof Mesh &&
        object.material instanceof MeshStandardMaterial
      ) {
        const configItem = config.find((item) => item.meshId === object.name);

        if (configItem) {
          object.material.color.set(configItem.color);
          return;
        }

        const initialColor = originalColors.get(object.name);
        if (initialColor) {
          object.material.color.copy(initialColor);
        }
      }
    });
  }, [config, scene, originalColors]);
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (readOnly) return;

    e.stopPropagation();

    const diffX = Math.abs(e.clientX - startPos.x);
    const diffY = Math.abs(e.clientY - startPos.y);

    if (diffX > 5 || diffY > 5) return;

    if (e.object instanceof Mesh) {
      const material = e.object.material;

      if (material instanceof MeshStandardMaterial) {
        const newColorHex = paintColor;
        material.color.set(newColorHex);

        const meshId = e.object.name;

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
        onPointerUp={readOnly ? undefined : handlePointerUp}
      />
    </Center>
  );
}
