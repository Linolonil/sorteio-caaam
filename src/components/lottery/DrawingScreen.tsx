// components/lottery/DrawingScreen.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Ticket, RotateCcw, Trophy } from "lucide-react"
import { UseLotteryReturn } from "@/hooks/useLottery"

// Sub-componente para a lista de números sorteados
function DrawnNumbersList({ drawnNumbers, redrawingIndex, onRedraw, isDrawing }: { drawnNumbers: number[], redrawingIndex: number | null, onRedraw: (index: number) => void, isDrawing: boolean }) {
  return (
    <div className="space-y-3">
      {drawnNumbers.map((number, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="flex items-center justify-between gap-3 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2A6F97] flex items-center justify-center font-bold text-white text-lg">{index + 1}</div>
            <div className="text-2xl font-semibold text-[#014F86] dark:text-blue-200">
              {redrawingIndex === index ? "..." : number}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onRedraw(index)} disabled={isDrawing || redrawingIndex === index} className="h-8 px-3">
            {redrawingIndex === index ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2A6F97]" /> : <RotateCcw className="h-4 w-4" />}
          </Button>
        </motion.div>
      ))}
      {drawnNumbers.length === 0 && <div className="text-center py-8 text-gray-500 italic">Os números sorteados aparecerão aqui</div>}
    </div>
  )
}

export function DrawingScreen({ lottery }: { lottery: UseLotteryReturn }) {
  const { config, drawnNumbers, isDrawing, currentPrize, redrawingIndex, drawNextNumber, resetDraw, redrawNumber, addMorePrizes } = lottery
  const [showAddPrizeInput, setShowAddPrizeInput] = useState<boolean>(false)
  const [additionalPrizes, setAdditionalPrizes] = useState<number>(0)

  const handleAddPrizes = () => {
    if (addMorePrizes(additionalPrizes)) {
      setAdditionalPrizes(0)
      setShowAddPrizeInput(false)
    }
  }

  const isFinished = currentPrize > config.numberOfPrizes

  return (
    <motion.div
      key="drawing"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl px-4 flex flex-col md:flex-row gap-6"
    >
      {/* Main drawing area */}
      <div className="flex-1 order-2 md:order-1">
        <Card className="backdrop-blur-sm shadow-xl overflow-hidden border-0 p-0">
          <CardHeader className="bg-gradient-to-r from-[#E63946] to-[#D62828] text-white p-6">
            <CardTitle className="text-2xl text-center">Sorteio em Andamento</CardTitle>
            <CardDescription className="text-center text-white/90 text-lg">
              Prêmio <span className="font-bold">{Math.min(currentPrize, config.numberOfPrizes)}</span> de <span className="font-bold">{config.numberOfPrizes}</span>
            </CardDescription>
            {!showAddPrizeInput ? (
              <Button variant="outline" size="sm" onClick={() => setShowAddPrizeInput(true)} className="mt-2 mx-auto bg-white/10 hover:bg-white/20 text-white border-white/20">
                Adicionar Mais Prêmios
              </Button>
            ) : (
              <div className="flex items-center gap-2 mt-2 justify-center">
                <Input type="number" min="1" value={additionalPrizes || ""} onChange={(e) => setAdditionalPrizes(parseInt(e.target.value))} className="w-24 h-8 text-black" placeholder="Qtd." />
                <Button variant="outline" size="sm" onClick={handleAddPrizes} className="bg-white/10 hover:bg-white/20 text-white border-white/20">Confirmar</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddPrizeInput(false)} className="hover:bg-white/20 text-white">Cancelar</Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-8">
            <div className="flex justify-center my-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : "initial"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`w-48 h-48 rounded-full flex items-center justify-center font-bold text-6xl shadow-xl ${isDrawing ? "bg-gray-100 text-gray-400" : "bg-gradient-to-br from-[#E63946] to-[#D62828] text-white"}`}
                >
                  {isDrawing ? "?" : (drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : "?")}
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center p-6">
            <Button className="px-8 h-14 text-lg" onClick={drawNextNumber} disabled={isDrawing || isFinished} size="lg" style={{ background: "linear-gradient(to right, #E63946, #D62828)", color: "white" }}>
              <Ticket className="mr-2 h-5 w-5" />
              {isFinished ? "Sorteio Finalizado" : "Sortear Próximo"}
            </Button>
            <Button variant="outline" onClick={resetDraw} size="lg" className="h-14">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reiniciar
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Previous numbers sidebar */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="md:w-80 order-1 md:order-2">
        <Card className="backdrop-blur-sm shadow-xl border-0 h-full p-0">
          <CardHeader className="bg-gradient-to-r from-[#2A6F97] to-[#014F86] text-white p-6">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Trophy className="h-5 w-5" />
              Números Sorteados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-[500px] overflow-auto">
            <DrawnNumbersList drawnNumbers={drawnNumbers} redrawingIndex={redrawingIndex} onRedraw={redrawNumber} isDrawing={isDrawing} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
