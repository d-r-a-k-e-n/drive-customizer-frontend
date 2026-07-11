import Link from "next/link";
import { ROUTS } from "@/consts/routs.const";

export default function SiteNav() {
  return (
    <nav className="w-full flex justify-between items-center px-6 md:px-12 py-4">
      <Link
        href={ROUTS.MAIN_ROUTE}
        className="text-2xl font-black tracking-tighter italic uppercase"
      >
        Drive<span className="text-blue-600">.</span>
      </Link>
      <div className="flex gap-4 md:gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
        <Link
          href={ROUTS.MAIN_ROUTE}
          className="hover:text-white transition-colors"
        >
          Main
        </Link>
        <Link
          href={ROUTS.CUSTOMIZER_ROUTE}
          className="hover:text-white transition-colors"
        >
          Models
        </Link>
        <Link
          href={ROUTS.VIEWER_ROUTE}
          className="hover:text-white transition-colors"
        >
          Viewer
        </Link>
      </div>
    </nav>
  );
}
