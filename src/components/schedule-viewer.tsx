"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ScheduleBlock } from "@/lib/types"
import { Download, Calendar } from "lucide-react"
import { jsPDF } from "jspdf"
import { format, addDays, startOfWeek } from "date-fns"
import { es } from "date-fns/locale"

interface ScheduleViewerProps {
  schedule: ScheduleBlock[]
}

export default function ScheduleViewer({ schedule }: ScheduleViewerProps) {
  const [viewType, setViewType] = useState("week")

  const today = new Date()
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 })

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startOfCurrentWeek, i)
    return {
      date,
      dayName: format(date, "EEEE", { locale: es }),
      dayNumber: format(date, "d", { locale: es }),
      month: format(date, "MMMM", { locale: es }),
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200"
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "baja":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text("OrganizAI - Tu Cronograma", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.text(`Generado el ${format(new Date(), "PPP", { locale: es })}`, 105, 30, { align: "center" })

    doc.setFontSize(12)
    let y = 40

    schedule.forEach((block, index) => {
      const day = daysOfWeek.find((d) => d.dayName.toLowerCase() === block.day.toLowerCase())
      const dayText = day ? `${day.dayName} ${day.dayNumber} de ${day.month}` : block.day

      doc.text(`${dayText} - ${block.startTime} a ${block.endTime}`, 20, y)
      doc.text(`Tarea: ${block.taskName}`, 20, y + 7)
      doc.text(`Prioridad: ${block.priority}`, 20, y + 14)

      y += 25

      if (y > 270 && index < schedule.length - 1) {
        doc.addPage()
        y = 20
      }
    })

    doc.save("organizai-cronograma.pdf")
  }

  const scheduleByDay = daysOfWeek.map((day) => {
    const dayBlocks = schedule.filter((block) => block.day.toLowerCase() === day.dayName.toLowerCase())
    return {
      ...day,
      blocks: dayBlocks.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }
  })

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tu Cronograma</h3>
        <Button onClick={exportToPDF} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <Tabs value={viewType} onValueChange={setViewType} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">Vista Semanal</TabsTrigger>
          <TabsTrigger value="list">Vista Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {scheduleByDay.map((day) => (
              <Card key={day.dayName} className={day.blocks.length === 0 ? "opacity-50" : ""}>
                <CardContent className="p-3">
                  <div className="text-center mb-2 pb-2 border-b">
                    <div className="font-medium">{day.dayName}</div>
                    <div className="text-sm text-muted-foreground">
                      {day.dayNumber} {day.month}
                    </div>
                  </div>

                  {day.blocks.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      <Calendar className="h-5 w-5 mx-auto mb-1 opacity-50" />
                      Sin actividades
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {day.blocks.map((block) => (
                        <div
                          key={`${block.day}-${block.startTime}`}
                          className={`p-2 rounded-md border text-sm ${getPriorityColor(block.priority)}`}
                        >
                          <div className="font-medium">{block.taskName}</div>
                          <div className="text-xs mt-1">
                            {block.startTime} - {block.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="space-y-3">
            {scheduleByDay.map(
              (day) =>
                day.blocks.length > 0 && (
                  <div key={day.dayName} className="space-y-2">
                    <h4 className="font-medium">
                      {day.dayName} {day.dayNumber} {day.month}
                    </h4>

                    {day.blocks.map((block) => (
                      <Card key={`${block.day}-${block.startTime}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{block.taskName}</div>
                              <div className="text-sm text-muted-foreground">
                                {block.startTime} - {block.endTime}
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-md text-xs ${getPriorityColor(block.priority)}`}>
                              {block.priority.charAt(0).toUpperCase() + block.priority.slice(1)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ),
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
