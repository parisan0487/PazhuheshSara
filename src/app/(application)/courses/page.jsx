"use client";

import { motion } from "framer-motion";

export default function Courses() {
  return (
    <div className="flex items-center justify-center h-80">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
          className="text-3xl md:text-4xl font-extrabold text-[#00e0ca] mb-2"
        >
           دوره‌ای موجود نیست
        </motion.h2>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          className="text-gray-400 text-lg"
        >
          به زودی دوره‌های جدید اضافه خواهند شد ✨
        </motion.p>
      </motion.div>
    </div>
  );
}
