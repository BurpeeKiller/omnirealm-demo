"use client";

import { LandingPage } from "@/components/Landing/LandingPage";

export const dynamic = "force-dynamic";

export default function Home() {
  const handleStartFree = () => {
    console.log("Start free trial");
    // TODO: Implement free trial logic
  };

  return <LandingPage onStartFree={handleStartFree} />;
}
