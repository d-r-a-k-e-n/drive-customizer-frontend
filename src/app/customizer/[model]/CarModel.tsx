import { useState } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";

export default function CarModel({
  modelUrl,
  paintColor,
}: {
  modelUrl: string;
  paintColor: string;
}) {
  const { scene } = useGLTF(modelUrl);

  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

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
