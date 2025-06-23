"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Availability } from "@/lib/types"
import { Clock, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvailabilitySchedulerProps {
  availability: Availability[]
  onUpdateAvailability: (availability: Availability[]) => void
}

const daysOfWeek = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
]

const hoursOfDay = Array.from({ length: 24 * 2 }).map((_, i) => {
  const hour = Math.floor(i / 2)
  const minute = (i % 2) * 30
  return {
    value: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    label: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    hour,
    minute,
  }
})

export default function AvailabilityScheduler({ availability, onUpdateAvailability }: AvailabilitySchedulerProps) {
  const [day, setDay] = useState("lunes")
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("10:00")
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"form" | "grid">("grid")
  const [gridSelection, setGridSelection] = useState<Record<string, Record<string, boolean>>>({})

  // Improved drag selection state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ day: string; time: string } | null>(null)
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select")
  // Remover estas líneas del estado:
  // const [draggedCells, setDraggedCells] = useState<Set<string>>(new Set())

  useEffect(() => {
    const newGridSelection: Record<string, Record<string, boolean>> = {}

    daysOfWeek.forEach((day) => {
      newGridSelection[day.value] = {}
      hoursOfDay.forEach((hour) => {
        newGridSelection[day.value][hour.value] = false
      })
    })

    availability.forEach((block) => {
      const startIndex = hoursOfDay.findIndex((h) => h.value === block.startTime)
      const endIndex = hoursOfDay.findIndex((h) => h.value === block.endTime)

      if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i < endIndex; i++) {
          if (newGridSelection[block.day] && hoursOfDay[i]) {
            newGridSelection[block.day][hoursOfDay[i].value] = true
          }
        }
      }
    })

    setGridSelection(newGridSelection)
  }, [availability])

  // Improved mouse event handlers
  const handleMouseDown = useCallback(
    (day: string, time: string, event: React.MouseEvent) => {
      event.preventDefault()
      setIsDragging(true)
      setDragStart({ day, time })

      const currentState = gridSelection[day]?.[time] || false
      setDragMode(currentState ? "deselect" : "select")

      const newGridSelection = { ...gridSelection }
      newGridSelection[day][time] = !currentState
      setGridSelection(newGridSelection)
    },
    [gridSelection],
  )

  const handleMouseEnter = useCallback(
    (day: string, time: string) => {
      if (!isDragging || !dragStart) return

      const newGridSelection = { ...gridSelection }

      // Si estamos arrastrando en el mismo día, seleccionar rango
      if (day === dragStart.day) {
        const startIndex = hoursOfDay.findIndex((h) => h.value === dragStart.time)
        const currentIndex = hoursOfDay.findIndex((h) => h.value === time)

        if (startIndex !== -1 && currentIndex !== -1) {
          const minIndex = Math.min(startIndex, currentIndex)
          const maxIndex = Math.max(startIndex, currentIndex)

          // Primero restaurar el estado original para este día
          hoursOfDay.forEach((hour, index) => {
            const originalState = availability.some(
              (block) =>
                block.day === day &&
                hoursOfDay.findIndex((h) => h.value === block.startTime) <= index &&
                hoursOfDay.findIndex((h) => h.value === block.endTime) > index,
            )
            newGridSelection[day][hour.value] = originalState
          })

          // Luego aplicar la selección del rango
          for (let i = minIndex; i <= maxIndex; i++) {
            if (hoursOfDay[i]) {
              newGridSelection[day][hoursOfDay[i].value] = dragMode === "select"
            }
          }
        }
      }

      setGridSelection(newGridSelection)
    },
    [isDragging, dragStart, gridSelection, dragMode, availability],
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setDragStart(null)
      // setDraggedCells(new Set())

      // Convert grid selection to availability blocks
      const newAvailability = convertGridToAvailability()
      onUpdateAvailability(newAvailability)
    }
  }, [isDragging])

  // Add global mouse up listener to handle cases where mouse is released outside the grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp()
      }
    }

    document.addEventListener("mouseup", handleGlobalMouseUp)
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [isDragging, handleMouseUp])

  const convertGridToAvailability = () => {
    const newAvailability: Availability[] = []

    Object.entries(gridSelection).forEach(([day, hours]) => {
      let inBlock = false
      let blockStart = ""

      for (let i = 0; i < hoursOfDay.length; i++) {
        const time = hoursOfDay[i].value
        const isSelected = hours[time]
        const nextTime = i < hoursOfDay.length - 1 ? hoursOfDay[i + 1].value : null

        if (isSelected && !inBlock) {
          inBlock = true
          blockStart = time
        }

        if (inBlock && (!isSelected || !nextTime || !hours[nextTime])) {
          inBlock = false
          const blockEnd = isSelected && nextTime ? nextTime : time

          newAvailability.push({
            id: `${day}-${blockStart}-${blockEnd}-${Date.now()}`,
            day,
            startTime: blockStart,
            endTime: blockEnd,
          })
        }
      }
    })

    return newAvailability
  }

  const handleAddAvailability = () => {
    if (startTime >= endTime) {
      setError("La hora de inicio debe ser anterior a la hora de fin")
      return
    }

    const overlapping = availability.some(
      (block) =>
        block.day === day &&
        ((startTime >= block.startTime && startTime < block.endTime) ||
          (endTime > block.startTime && endTime <= block.endTime) ||
          (startTime <= block.startTime && endTime >= block.endTime)),
    )

    if (overlapping) {
      setError("Este horario se solapa con otro bloque de disponibilidad")
      return
    }

    const newAvailability: Availability = {
      id: Date.now().toString(),
      day,
      startTime,
      endTime,
    }

    onUpdateAvailability([...availability, newAvailability])
    setError("")
  }

  const handleRemoveAvailability = (id: string) => {
    const updatedAvailability = availability.filter((block) => block.id !== id)
    onUpdateAvailability(updatedAvailability)
  }

  const getDayLabel = (dayValue: string) => {
    return daysOfWeek.find((d) => d.value === dayValue)?.label || dayValue
  }

  return (
    <div className="space-y-6">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "form" | "grid")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Cuadrícula Visual</TabsTrigger>
          <TabsTrigger value="form">Formulario</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          <div className="border rounded-lg overflow-auto select-none">
            <div className="grid grid-cols-[auto_1fr] min-w-[800px]">
              <div className="sticky left-0 z-10 bg-background border-b border-r w-24"></div>
              <div className="grid grid-cols-48 border-b">
                {hoursOfDay.map((hour) => (
                  <div
                    key={hour.value}
                    className={cn(
                      "text-xs text-center py-1 border-r",
                      hour.minute === 0 ? "font-medium" : "text-muted-foreground",
                    )}
                  >
                    {hour.minute === 0 ? `${hour.hour}h` : ""}
                  </div>
                ))}
              </div>

              {daysOfWeek.map((day) => (
                <React.Fragment key={day.value}>
                  <div className="sticky left-0 z-10 bg-background border-b border-r w-24 py-2 px-3 font-medium">
                    {day.label}
                  </div>
                  <div className="grid grid-cols-48 border-b">
                    {hoursOfDay.map((hour) => (
                      <div
                        key={`${day.value}-${hour.value}`}
                        className={cn(
                          "border-r h-8 cursor-pointer transition-colors",
                          gridSelection[day.value]?.[hour.value]
                            ? "bg-primary/80 hover:bg-primary/70"
                            : "bg-background hover:bg-muted",
                          // Remover esta línea: isDragging && "pointer-events-none",
                        )}
                        onMouseDown={(e) => handleMouseDown(day.value, hour.value, e)}
                        onMouseEnter={() => handleMouseEnter(day.value, hour.value)}
                        style={{ userSelect: "none" }}
                      />
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            Haz clic y arrastra para seleccionar tus horarios disponibles.
            {isDragging && (
              <span className="text-primary font-medium">
                {dragMode === "select" ? " Seleccionando..." : " Deseleccionando..."}
              </span>
            )}
          </div>
        </TabsContent>

        <TabsContent value="form" className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {hoursOfDay.map((time) => (
                    <option key={`start-${time.value}`} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {hoursOfDay.map((time) => (
                    <option key={`end-${time.value}`} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button onClick={handleAddAvailability} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Agregar Disponibilidad
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Horarios Disponibles ({availability.length})</h3>

        {availability.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No hay horarios disponibles. Agrega tu disponibilidad para comenzar.
          </p>
        ) : (
          <div className="grid gap-3">
            {availability
              .sort((a, b) => {
                const dayOrder =
                  daysOfWeek.findIndex((d) => d.value === a.day) - daysOfWeek.findIndex((d) => d.value === b.day)
                if (dayOrder !== 0) return dayOrder
                return a.startTime.localeCompare(b.startTime)
              })
              .map((block) => (
                <Card key={block.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{getDayLabel(block.day)}</div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>
                            {block.startTime} - {block.endTime}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAvailability(block.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar disponibilidad</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
