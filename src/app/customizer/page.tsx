"use client";

import Link from "next/link";
import Image from "next/image";

export default function CustomizerPage() {
  return (
    <div className="flex flex-1 font-sans items-center justify-center">
      <main className="flex w-full max-w-3xl flex-col items-center">
        <h1 className="mb-10 uppercase font-bold text-6xl">
          Select your model
        </h1>

        <div className="flex w-full items-center justify-center gap-4">
          <Link href={"/customizer/bus"}>
            <Image
              className="rounded"
              src={"/bus.png"}
              alt="Bus image"
              width={200}
              height={100}
            />
          </Link>

          <Link href={"/customizer/lotus"}>
            <Image
              className="rounded"
              src={"/lotus.png"}
              alt="Lotus image"
              width={200}
              height={100}
            />
          </Link>
        </div>
      </main>
    </div>
  );
}
