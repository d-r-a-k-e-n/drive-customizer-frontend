import { AnimatePresence, motion } from "framer-motion";

interface IModelLoaderProps {
  showScene: boolean;
  progress: number;
}

export default function ModelLoader({
  showScene,
  progress,
}: IModelLoaderProps) {
  return (
    <AnimatePresence>
      {!showScene && (
        <motion.div
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-1 w-48 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
              Loading {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
