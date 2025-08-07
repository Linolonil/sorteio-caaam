"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Confetti } from "./confetti"
import { Ticket, RotateCcw, ArrowRight, Trophy } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from './../components/themeToggle';

export default function LotterySystem() {
  // Configuration state
  const [numberOfPrizes, setNumberOfPrizes] = useState<number>(10)
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>(100)
  const [isConfigured, setIsConfigured] = useState<boolean>(false)
  const [showAddPrizeInput, setShowAddPrizeInput] = useState<boolean>(false)
  const [additionalPrizes, setAdditionalPrizes] = useState<number>(0)
  const [excludedNumbers, setExcludedNumbers] = useState<string>("")

  // Drawing state
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [currentPrize, setCurrentPrize] = useState<number>(1)
  const [redrawingIndex, setRedrawingIndex] = useState<number | null>(null)

  const parseExcludedNumbers = (): number[] => {
    if (!excludedNumbers.trim()) return []
    return excludedNumbers
      .split(",")
      .map(n => n.trim())
      .filter(n => n !== "")
      .map(n => parseInt(n))
      .filter(n => !isNaN(n) && n > 0 && n <= numberOfParticipants)
  }

  const startDraw = () => {
    if (numberOfPrizes <= 0 || numberOfParticipants <= 0) {
      alert("Por favor, insira valores válidos para os prêmios e participantes.")
      return
    }

    if (numberOfPrizes > numberOfParticipants) {
      alert("O número de prêmios não pode ser maior que o número de participantes.")
      return
    }

    setIsConfigured(true)
  }

  const drawNextNumber = () => {
    if (currentPrize > numberOfPrizes) return

    setIsDrawing(true)

    // Generate a unique random number that hasn't been drawn yet
    let randomNumber: number
    const excluded = parseExcludedNumbers()
    do {
      randomNumber = Math.floor(Math.random() * numberOfParticipants) + 1
    } while (drawnNumbers.includes(randomNumber) || excluded.includes(randomNumber))

    // Simulate drawing suspense with a timeout
    setTimeout(() => {
      setDrawnNumbers((prev) => [...prev, randomNumber])
      setIsDrawing(false)

      // If this was the last prize, show confetti
      if (currentPrize === numberOfPrizes) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }

      setCurrentPrize((prev) => prev + 1)
    }, 500)
  }

  const redrawNumber = (index: number) => {
    if (isDrawing) return
    
    setRedrawingIndex(index)

    // Generate a unique random number that hasn't been drawn yet
    let randomNumber: number
    const excluded = parseExcludedNumbers()
    do {
      randomNumber = Math.floor(Math.random() * numberOfParticipants) + 1
    } while (drawnNumbers.includes(randomNumber) || excluded.includes(randomNumber))

    // Simulate drawing suspense with a timeout
    setTimeout(() => {
      setDrawnNumbers((prev) => {
        const newNumbers = [...prev]
        newNumbers[index] = randomNumber
        return newNumbers
      })
      setRedrawingIndex(null)
    }, 500)
  }

  const resetDraw = () => {
    setDrawnNumbers([])
    setCurrentPrize(1)
    setShowConfetti(false)
    setIsConfigured(false)
  }

  const addMorePrizes = () => {
    if (additionalPrizes <= 0) {
      alert("Por favor, insira um número válido de prêmios adicionais.")
      return
    }

    if (numberOfPrizes + additionalPrizes > numberOfParticipants) {
      alert("O número total de prêmios não pode ser maior que o número de participantes.")
      return
    }

    setNumberOfPrizes(prev => prev + additionalPrizes)
    setAdditionalPrizes(0)
    setShowAddPrizeInput(false)
  }

  return (
    <div
      className="lottery-container min-h-screen flex flex-col items-center relative overflow-hidden "
    >
      <ThemeToggle/>
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-8 mb-6 md:mb-10 w-full max-w-md px-4"
      >
      <div className={`
        p-4 rounded-xl shadow-lg flex justify-center
        bg-white/90 dark:bg-black/90 
        border border-gray-200 dark:border-gray-700  
        backdrop-blur-sm
      `}>          
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
        {!isConfigured ? (
          // Configuration Form
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md px-4 text-black"
          >
            <Card className="p-6 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center">Sistema de Sorteio</CardTitle>
                <CardDescription className="text-center">Configure os parâmetros do sorteio</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="numberOfPrizes" className="text-base">
                    Quantos prêmios serão sorteados?
                  </Label>
                  <Input
                    id="numberOfPrizes"
                    type="number"
                    min="1"
                    value={numberOfPrizes}
                    onChange={(e) => setNumberOfPrizes(Number.parseInt(e.target.value) || 1)}
                    className="text-lg h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfParticipants" className="text-base">
                    Quantas pessoas vão participar?
                  </Label>
                  <Input
                    id="numberOfParticipants"
                    type="number"
                    min="1"
                    value={numberOfParticipants}
                    onChange={(e) => setNumberOfParticipants(Number.parseInt(e.target.value) || 1)}
                    className="text-lg h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excludedNumbers" className="text-base">
                    Números que não devem ser sorteados (separados por vírgula)
                  </Label>
                  <Input
                    id="excludedNumbers"
                    type="text"
                    placeholder="Ex: 5, 10, 15"
                    value={excludedNumbers}
                    onChange={(e) => setExcludedNumbers(e.target.value)}
                    className="text-lg h-12"
                  />
                  <p className="text-sm text-gray-500">
                    Digite os números separados por vírgula. Exemplo: 5, 10, 15
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  className="w-full h-12 text-lg"
                  onClick={startDraw}
                  style={{
                    background: "linear-gradient(to right, #E63946, #D62828)",
                    color: "white",
                  }}
                >
                  Iniciar Sorteio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          // Drawing Interface
          <motion.div
            key="drawing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl px-4 flex flex-col md:flex-row gap-6"
          >
            {/* Main drawing area */}
            <div className="flex-1 order-2 md:order-1 ">
              <Card className="backdrop-blur-sm shadow-xl overflow-hidden border-0 p-0"> 
                <CardHeader className="bg-gradient-to-r from-[#E63946] to-[#D62828] text-white p-6">
                  <CardTitle className="text-2xl text-center">Sorteio em Andamento</CardTitle>
                  <CardDescription className="text-center text-white/90 text-lg">
                    Prêmio <span className="font-bold">{Math.min(currentPrize, numberOfPrizes)}</span> de{" "}
                    <span className="font-bold">{numberOfPrizes}</span>
                  </CardDescription>
                  {!showAddPrizeInput ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddPrizeInput(true)}
                      className="mt-2 mx-auto bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      Adicionar Mais Prêmios
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 mt-2 justify-center">
                      <Input
                        type="number"
                        min="1"
                        value={additionalPrizes}
                        onChange={(e) => setAdditionalPrizes(Number.parseInt(e.target.value) || 0)}
                        className="w-24 h-8 text-black"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addMorePrizes}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddPrizeInput(false)
                          setAdditionalPrizes(0)
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-8">
                  {/* Current number display */}
                  <div className="flex justify-center my-8">
                    <AnimatePresence mode="wait">
                      {isDrawing && redrawingIndex === null ? (
                        <motion.div
                          key="drawing"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{
                            scale: [0.8, 1.1, 1],
                            opacity: 1,
                            rotate: [0, 5, -5, 5, -5, 0],
                          }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            repeatType: "reverse",
                          }}
                          className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-6xl shadow-lg"
                        >
                          ?
                        </motion.div>
                      ) : drawnNumbers.length > 0 ? (
                        <motion.div
                          key="result"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="w-48 h-48 rounded-full bg-gradient-to-br from-[#E63946] to-[#D62828] flex items-center justify-center text-white font-bold text-6xl shadow-xl"
                        >
                          {drawnNumbers[drawnNumbers.length - 1]}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-6xl shadow-lg"
                        >
                          ?
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile view for previous numbers */}
                  <div className="md:hidden mb-6">
                    <h3 className="text-lg font-bold text-center mb-4">Números Sorteados</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {drawnNumbers.slice(0, -1).map((number, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-red-100 border border-red-300 flex items-center justify-center font-bold text-red-800">
                            {number}
                          </div>
                          <div className="text-xs mt-1 font-medium">#{index + 1}</div>
                        </div>
                      ))}
                      {drawnNumbers.length <= 1 && (
                        <p className="text-center text-gray-500 italic">Nenhum número sorteado ainda</p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-4 justify-center p-6 ">
                  <Button
                    className="px-8 h-14 text-lg"
                    onClick={drawNextNumber}
                    disabled={isDrawing || currentPrize > numberOfPrizes}
                    size="lg"
                    style={{
                      background: "linear-gradient(to right, #E63946, #D62828)",
                      color: "white",
                    }}
                  >
                    <Ticket className="mr-2 h-5 w-5" />
                    {currentPrize > numberOfPrizes ? "Sorteio Finalizado" : "Sortear Próximo Número"}
                  </Button>

                  <Button variant="outline" onClick={resetDraw} size="lg" className="h-14">
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reiniciar
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Previous numbers sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-80 order-1 md:order-2"
            >
              <Card className="backdrop-blur-sm shadow-xl border-0 h-full p-0">
                <CardHeader className="bg-gradient-to-r from-[#2A6F97] to-[#014F86] text-white p-[43.5px]">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Números Sorteados
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 max-h-[500px] overflow-auto">
                  <div className="space-y-3">
                    {drawnNumbers.map((number, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#2A6F97] flex items-center justify-center font-bold text-white text-lg">
                            {index + 1}
                          </div>
                          <div className="text-2xl font-semibold text-[#014F86]">
                            {redrawingIndex === index ? (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                  scale: [0.8, 1.1, 1],
                                  opacity: 1,
                                  rotate: [0, 5, -5, 5, -5, 0],
                                }}
                                transition={{
                                  duration: 0.5,
                                  repeat: 3,
                                  repeatType: "reverse",
                                }}
                                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-2xl"
                              >
                                ?
                              </motion.div>
                            ) : (
                              number
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => redrawNumber(index)}
                          disabled={isDrawing}
                          className="h-8 px-3"
                        >
                          {redrawingIndex === index ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2A6F97]" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                        </Button>
                      </motion.div>
                    ))}

                    {drawnNumbers.length === 0 && (
                      <div className="text-center py-8 text-gray-500 italic">Os números sorteados aparecerão aqui</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

