// components/lottery/ConfigurationScreen.tsx
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import { LotteryConfig } from "@/hooks/useLottery"

interface ConfigurationScreenProps {
  config: LotteryConfig
  setConfig: (config: LotteryConfig) => void
  onStart: () => void
}

export function ConfigurationScreen({ config, setConfig, onStart }: ConfigurationScreenProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setConfig({
      ...config,
      [id]: id === "excludedNumbersRaw" ? value : parseInt(value, 10) || 1,
    })
  }

  return (
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
            <Label htmlFor="numberOfPrizes" className="text-base">Quantos prêmios serão sorteados?</Label>
            <Input id="numberOfPrizes" type="number" min="1" value={config.numberOfPrizes} onChange={handleChange} className="text-lg h-12" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfParticipants" className="text-base">Quantas pessoas vão participar?</Label>
            <Input id="numberOfParticipants" type="number" min="1" value={config.numberOfParticipants} onChange={handleChange} className="text-lg h-12" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excludedNumbersRaw" className="text-base">Números que não devem ser sorteados (separados por vírgula)</Label>
            <Input id="excludedNumbersRaw" type="text" placeholder="Ex: 5, 10, 15" value={config.excludedNumbersRaw} onChange={handleChange} className="text-lg h-12" />
            <p className="text-sm text-gray-500">Digite os números separados por vírgula.</p>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button className="w-full h-12 text-lg" onClick={onStart} style={{ background: "linear-gradient(to right, #E63946, #D62828)", color: "white" }}>
            Iniciar Sorteio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
