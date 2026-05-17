// components/LogoLoader.tsx
import { motion, type Variants } from "framer-motion";

interface LogoLoaderProps {
  variant?: "fade" | "breathe" | "elegant" | "shimmer" | "reveal";
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  loadingText?: string;
}

const LogoLoader = ({
  variant = "elegant",
  size = "md",
  showText = true,
  loadingText = "Loading...",
}: LogoLoaderProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  // Fade variant - Simple elegant fade
  const fadeVariant: Variants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Breathe variant - Gentle scale pulsing
  const breatheVariant: Variants = {
    initial: { opacity: 1, scale: 1 },
    animate: {
      opacity: [1, 0.7, 1],
      scale: [1, 0.95, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Elegant variant - Sophisticated multi-stage animation
  const elegantVariant: Variants = {
    initial: { opacity: 0, scale: 0.8, rotate: -5 },
    animate: {
      opacity: [0, 1, 1, 1, 0],
      scale: [0.8, 1, 1, 1, 0.8],
      rotate: [-5, 0, 0, 0, 5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: [0.16, 1, 0.3, 1], // Custom bezier for luxury feel
        times: [0, 0.2, 0.5, 0.8, 1],
      },
    },
  };

  // Shimmer variant - Luxury shimmer effect
  const shimmerVariant: Variants = {
    initial: { opacity: 1, filter: "brightness(1) contrast(1)" },
    animate: {
      opacity: [1, 0.4, 1],
      filter: [
        "brightness(1) contrast(1)",
        "brightness(1.2) contrast(1.1)",
        "brightness(1) contrast(1)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Reveal variant - Gradual reveal from bottom
  const revealVariant: Variants = {
    initial: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
    animate: {
      clipPath: [
        "inset(100% 0% 0% 0%)",
        "inset(0% 0% 0% 0%)",
        "inset(0% 0% 0% 0%)",
        "inset(0% 0% 100% 0%)",
      ],
      opacity: [0, 1, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.3, 0.7, 1],
      },
    },
  };

  const variants = {
    fade: fadeVariant,
    breathe: breatheVariant,
    elegant: elegantVariant,
    shimmer: shimmerVariant,
    reveal: revealVariant,
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated Logo */}
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        variants={variants[variant]}
        initial="initial"
        animate="animate"
      >
        <img
          src="/images/logo_light.png"
          alt="SaVy"
          className="w-full h-full object-contain"
        />

        {/* Optional glow effect for shimmer variant */}
        {variant === "shimmer" && (
          <motion.div
            className="absolute inset-0 blur-xl opacity-30"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/images/logo_light.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Loading Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-white/70 font-light tracking-[0.3em] uppercase">
            {loadingText}
          </p>

          {/* Animated dots */}
          <motion.div className="flex justify-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-white/50"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LogoLoader;
