"use client"

import { Button } from "@/components/ui/button"
import type { Task, Availability } from "@/lib/types"
import { AlertCircle, Calendar, Loader2 } from "lucide-react"

interface ScheduleGeneratorProps {
  tasks: Task[]
  availability: Availability[]
  strategy: string
  onGenerate: () => void
  isGenerating: boolean
}

export default function ScheduleGenerator({ tasks, availability, strategy, onGenerate, isGenerating }: ScheduleGeneratorProps) {
  const canGenerate = tasks.length > 0 && availability.length > 0

  return (
    <div className="space-y-6">
      {!canGenerate && (
        <div className="flex items-start space-x-2 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-destructive">No se puede generar el cronograma</h4>
            <p className="text-sm text-destructive/80">
              {tasks.length === 0 && availability.length === 0
                ? "Debes agregar al menos una tarea y un bloque de disponibilidad."
                : tasks.length === 0
                  ? "Debes agregar al menos una tarea."
                  : "Debes agregar al menos un bloque de disponibilidad."}
            </p>
          </div>
        </div>
      )}

      <Button onClick={onGenerate} disabled={!canGenerate || isGenerating} className="w-full" size="lg">
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando cronograma...
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-4 w-4" />
            Generar Cronograma
          </>
        )}
      </Button>

      {canGenerate && (
        <div className="text-sm text-muted-foreground">
          <p>
            Se generará un cronograma basado en {tasks.length} tarea(s) y {availability.length} bloque(s) de
            disponibilidad, utilizando la estrategia {strategy}.
          </p>
        </div>
      )}
    </div>
  )
}
