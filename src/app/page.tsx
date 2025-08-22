// app/page.tsx (ou onde seu componente principal está)
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ThemeToggle } from "@/components/themeToggle" // Ajuste o caminho se necessário
import { useLottery } from "@/hooks/useLottery"
import { ConfigurationScreen } from "@/components/lottery/ConfigurationScreen"
import { DrawingScreen } from "@/components/lottery/DrawingScreen"
import { Confetti } from "./confetti"

export default function HomePage() {
  const lottery = useLottery({
    numberOfPrizes: 10,
    numberOfParticipants: 100,
    excludedNumbersRaw: "",
  })

  return (
    <div className="lottery-container min-h-screen flex flex-col items-center relative overflow-hidden p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {lottery.showConfetti && <Confetti />}

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-8 mb-6 md:mb-10 w-full max-w-md"
      >
        <div className="p-4 rounded-xl shadow-lg flex justify-center bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <Image
            src="/logo.png"
            alt="OAB CAAAM Amazonas"
            width={300}
            height={100}
            className="h-auto w-full max-w-[300px] object-contain"
            priority
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!lottery.isConfigured ? (
          <ConfigurationScreen
            key="config"
            config={lottery.config}
            setConfig={(newConfig) => lottery.setConfig(newConfig)}
            onStart={lottery.startDraw}
          />
        ) : (
          <DrawingScreen key="drawing" lottery={lottery} />
        )}
      </AnimatePresence>
    </div>
  )
}
