import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 font-sans items-center justify-center">
      <main className="flex w-full max-w-3xl flex-col items-center">
        <h1 className="mb-10 uppercase font-bold text-6xl">
          driven customizer
        </h1>

        <div className="flex w-full items-center justify-center gap-4">
          <Link href={"/viewer"}>Viewer</Link>
          <Link href={"/customizer"}>Customizer</Link>
        </div>
      </main>
    </div>
  );
}
