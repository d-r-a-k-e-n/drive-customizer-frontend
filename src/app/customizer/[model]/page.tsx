"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useParams } from "next/navigation";

const MODELS_MAP: Record<string, string> = {
  lotus: "lotus.glb",
  bus: "bus.glb",
};

function CarModel({ modelId }: { modelId: string }) {
  const fileName = MODELS_MAP[modelId] || MODELS_MAP["lotus"];

  const { scene } = useGLTF(`/models/${fileName}`);

  return <primitive object={scene} scale={1.5} />;
}

export default function CustomizerModelPage() {
  const params = useParams();
  const modelName = params.model;

  return (
    <main className="fixed inset-0 w-full h-full bg-gray-600">
      <Canvas>
        <PerspectiveCamera makeDefault position={[3, 3, 6]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 0, 5]} color="whte" />
        <directionalLight position={[3, 5, -5]} color="red" />

        <CarModel modelId={modelName as string} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </main>
  );
}
