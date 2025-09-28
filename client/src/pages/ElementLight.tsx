import React from "react";
import { motion } from "framer-motion";
import { PlayerDetailsSection } from "./sections/PlayerDetailsSection";

export const ElementLight = (): JSX.Element => {
  return (
    <motion.div 
      className="bg-[#18184a] w-full min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <PlayerDetailsSection />
    </motion.div>
  );
};
