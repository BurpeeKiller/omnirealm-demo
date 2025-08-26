"use client";

import React from "react";
import { WorkoutView } from "@/components/Workout/WorkoutView";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default function WorkoutPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <WorkoutView onBack={handleBack} />
    </motion.main>
  );
}
