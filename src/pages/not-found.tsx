import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Large 404 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <span className="text-[#EBE9E4] text-8xl sm:text-9xl font-light tracking-wider">
            404
          </span>
        </motion.div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-light tracking-wide text-[#1C1C1A] mb-4"
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#6B6B64] text-base font-light leading-relaxed max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "60px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-px bg-[#D4D1CA] mx-auto my-8"
        />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-[#1C1C1A] text-sm font-medium tracking-wide text-[#1C1C1A] bg-transparent hover:bg-[#1C1C1A] hover:text-white transition-all duration-300"
          >
            Continue To Dashboard
          </Link>
        </motion.div>

        {/* Subtle footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-xs text-[#8C8C86] tracking-wide"
        >
          <p>Error 404 — Page not found</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
