// components/LoadingScreen.tsx
import { motion, AnimatePresence } from "framer-motion";
import LogoLoader from "./LogoLoader";

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
  variant?: "fade" | "breathe" | "elegant" | "shimmer" | "reveal";
  background?: "dark" | "light" | "gradient";
}

const LoadingScreen = ({
  isLoading,
  message = "Please wait",
  variant = "elegant",
  background = "dark",
}: LoadingScreenProps) => {
  const backgroundStyles = {
    dark: "bg-black",
    light: "bg-white",
    gradient: "bg-gradient-to-br from-black via-gray-900 to-black",
  };

  const textColor = background === "light" ? "text-black" : "text-white";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center ${backgroundStyles[background]}`}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${background === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <LogoLoader
              variant={variant}
              size="lg"
              showText={true}
              loadingText={message}
            />
          </div>

          {/* Bottom progress bar (optional) */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className={`h-full ${background === "light" ? "bg-black/20" : "bg-white/20"}`}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
