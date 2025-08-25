// hooks/useLottery.ts
"use client"

import { useState, useMemo, useCallback } from "react"

// Interface para a configuração inicial, facilitando a tipagem.
export interface LotteryConfig {
  numberOfPrizes: number
  numberOfParticipants: number
  
  excludedNumbersRaw: string
}

// O tipo de retorno do hook, para ser usado como prop nos componentes filhos.
export type UseLotteryReturn = ReturnType<typeof useLottery>

export function useLottery(initialConfig: LotteryConfig) {
  const [config, setConfig] = useState<LotteryConfig>(initialConfig)
  const [isConfigured, setIsConfigured] = useState<boolean>(false)
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [currentPrize, setCurrentPrize] = useState<number>(1)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [redrawingIndex, setRedrawingIndex] = useState<number | null>(null)

  // useMemo otimiza o parsing dos números excluídos, recalculando apenas quando a string muda.
  const excludedNumbers = useMemo((): Set<number> => {
    if (!config.excludedNumbersRaw.trim()) return new Set()
    const numbers = config.excludedNumbersRaw
      .split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= config.numberOfParticipants)
    return new Set(numbers)
  }, [config.excludedNumbersRaw, config.numberOfParticipants])

  const availableNumbersCount = config.numberOfParticipants - excludedNumbers.size

  // useCallback garante que as funções não sejam recriadas a cada render, otimizando performance.
  const validateConfiguration = useCallback(() => {
    if (config.numberOfPrizes <= 0 || config.numberOfParticipants <= 0) {
      alert("Por favor, insira valores válidos para os prêmios e participantes.")
      return false
    }
    if (config.numberOfPrizes > availableNumbersCount) {
      alert("O número de prêmios não pode ser maior que o número de participantes válidos.")
      return false
    }
    return true
  }, [config, availableNumbersCount])

  const startDraw = useCallback(() => {
    if (validateConfiguration()) {
      setIsConfigured(true)
    }
  }, [validateConfiguration])

  const generateUniqueRandomNumber = useCallback(() => {
    if (drawnNumbers.length >= availableNumbersCount) {
      // Não há mais números para sortear
      return null
    }
    let randomNumber: number
    do {
      randomNumber = Math.floor(Math.random() * config.numberOfParticipants) + 1
    } while (drawnNumbers.includes(randomNumber) || excludedNumbers.has(randomNumber))
    return randomNumber
  }, [config.numberOfParticipants, drawnNumbers, excludedNumbers, availableNumbersCount])

  const drawNextNumber = useCallback(() => {
    if (currentPrize > config.numberOfPrizes || isDrawing) return

    setIsDrawing(true)
    const newNumber = generateUniqueRandomNumber()

    setTimeout(() => {
      if (newNumber !== null) {
        setDrawnNumbers(prev => [...prev, newNumber])
        if (currentPrize === config.numberOfPrizes) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 5000)
        }
        setCurrentPrize(prev => prev + 1)
      }
      setIsDrawing(false)
    }, 500)
  }, [currentPrize, config.numberOfPrizes, isDrawing, generateUniqueRandomNumber])

  const redrawNumber = useCallback((index: number) => {
    if (isDrawing) return
    
    setRedrawingIndex(index)
    const newNumber = generateUniqueRandomNumber()

    setTimeout(() => {
      if (newNumber !== null) {
        setDrawnNumbers(prev => {
          const newNumbers = [...prev]
          newNumbers[index] = newNumber
          return newNumbers
        })
      }
      setRedrawingIndex(null)
    }, 500)
  }, [isDrawing, generateUniqueRandomNumber])

  const resetDraw = useCallback(() => {
    setDrawnNumbers([])
    setCurrentPrize(1)
    setShowConfetti(false)
    setIsConfigured(false)
    // Opcional: resetar a configuração para o estado inicial
    // setConfig(initialConfig);
  }, [])

  const addMorePrizes = useCallback((additionalPrizes: number) => {
      if (additionalPrizes <= 0) {
          alert("Por favor, insira um número válido de prêmios adicionais.")
          return false
      }
      const newTotalPrizes = config.numberOfPrizes + additionalPrizes
      if (newTotalPrizes > availableNumbersCount - drawnNumbers.length) {
          alert("O número total de prêmios não pode exceder os participantes restantes.")
          return false
      }
      setConfig(prev => ({ ...prev, numberOfPrizes: newTotalPrizes }))
      return true
  }, [config.numberOfPrizes, availableNumbersCount, drawnNumbers.length])

  return {
    config,
    isConfigured,
    drawnNumbers,
    isDrawing,
    currentPrize,
    showConfetti,
    redrawingIndex,
    setConfig,
    startDraw,
    drawNextNumber,
    redrawNumber,
    resetDraw,
    addMorePrizes,
  }
}
