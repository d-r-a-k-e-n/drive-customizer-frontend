interface IConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: IConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-900 p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-white">
          {title}
        </h2>
        <p className="mb-6 text-sm text-zinc-400">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="cursor-pointer rounded-md border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="cursor-pointer rounded-md border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-red-300 transition-all hover:bg-red-500/20 hover:text-red-200"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
