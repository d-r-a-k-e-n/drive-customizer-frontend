"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Center,
} from "@react-three/drei";
import { useControls } from "leva";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const MODELS_MAP: Record<string, string> = {
  lotus: "lotus.glb",
  bus: "bus.glb",
};

function CarModel({
  modelId,
  paintColor,
}: {
  modelId: string;
  paintColor: string;
}) {
  const fileName = MODELS_MAP[modelId] || MODELS_MAP["lotus"];
  const { scene } = useGLTF(`/models/${fileName}`);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

    if (e.object.isMesh) {
      e.object.material.color.set(paintColor);
    }
  };

  return (
    <Center top>
      <primitive
        object={scene}
        scale={1.5}
        onClick={handlePointerDown}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      />
    </Center>
  );
}

export default function CustomizerModelPage() {
  const params = useParams();
  const modelName = params.model as string;

  const { backgroundColor, paintColor, intensity, envIntensity } = useControls({
    backgroundColor: "#4b5563",
    paintColor: "#b7b7b7",
    intensity: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    envIntensity: { value: 0.5, min: 0, max: 1, step: 0.1 },
  });

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

        <Suspense fallback={null}>
          <CarModel modelId={modelName} paintColor={paintColor} />

          <Environment preset="city" environmentIntensity={envIntensity} />

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
    </main>
  );
}
