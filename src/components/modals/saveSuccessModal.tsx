"use client";

import Link from "next/link";
import { useState } from "react";
import { ROUTS } from "@/consts/routs.const";

interface ISaveSuccessModalProps {
  isOpen: boolean;
  configId: string;
  configName: string;
  modelSlug: string;
  onClose: () => void;
}

export default function SaveSuccessModal({
  isOpen,
  configId,
  configName,
  modelSlug,
  onClose,
}: ISaveSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const viewerUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/viewer/${configId}`
      : `/viewer/${configId}`;

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(viewerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-900 p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-white">
          Configuration saved
        </h2>
        <p className="mb-6 text-sm text-zinc-400">
          &ldquo;{configName}&rdquo; has been saved successfully
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-md border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white transition-all hover:bg-white/20"
            onClick={handleShare}
          >
            {copied ? "Link copied!" : "Share"}
          </button>

          <Link
            href={ROUTS.MAIN_ROUTE}
            className="text-center cursor-pointer rounded-md border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            Home
          </Link>

          <Link
            href={`${ROUTS.VIEWER_ROUTE}/${configId}`}
            className="text-center cursor-pointer rounded-md border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            View
          </Link>

          <Link
            href={`${ROUTS.CUSTOMIZER_ROUTE}/${modelSlug}`}
            className="text-center cursor-pointer rounded-md border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            Configuration
          </Link>
        </div>
      </div>
    </div>
  );
}
