"use client";

import { useState } from "react";
import { useModelConfigStore } from "@/store/modelConfig.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ISaveConfigModalProps {
  isOpen: boolean;
  isSaving: boolean;
  error?: string | null;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export default function SaveConfigModal({
  isOpen,
  isSaving,
  error,
  onSave,
  onCancel,
}: ISaveConfigModalProps) {
  const [name, setName] = useState("");
  const { resetModelStore } = useModelConfigStore((state) => state);

  if (!isOpen) return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || isSaving) return;
    onSave(trimmedName);
    resetModelStore();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-900 p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-white">
          Save configuration
        </h2>
        <p className="mb-4 text-sm text-zinc-400">
          Enter a name for your configuration
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Configuration name"
            autoFocus
            disabled={isSaving}
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
          />

          {error && (
            <p className="mb-4 text-xs uppercase tracking-wide text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving || !name.trim()}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
