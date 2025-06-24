"use client"

import React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TaskInput from "@/components/task-input"
import AvailabilityScheduler from "@/components/availability-scheduler"
import ScheduleGenerator from "@/components/schedule-generator"
import ScheduleViewer from "@/components/schedule-viewer"
import type { Task, Availability, ScheduleBlock } from "@/lib/types"
import api from "@/lib/api"

export default function OrganizAI() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])
  const [strategy, setStrategy] = useState<string>("pomodoro")
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")

  const addTask = (task: Task) => setTasks([...tasks, task])
  const removeTask = (id: string) => setTasks(tasks.filter((task) => task.id !== id))
  const updateAvailability = (newAvailability: Availability[]) => setAvailability(newAvailability)

  const handleGenerateSchedule = async () => {
    setIsGenerating(true)
    try {
      console.log("Generando cronograma con:", { tasks, availability, strategy })
      const response = await api.post("/generate-schedule", {
        tasks,
        availability,
        strategy,
      })

      const data = response.data
      console.log("Cronograma generado:", data.schedule)
      setSchedule(data.schedule)
      setActiveTab("schedule")
    } catch (error) {
      console.error("Error al generar el cronograma:", error)
    } finally {
      setIsGenerating(false)
    }
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">OrganizAI</h1>
        <p className="text-lg text-gray-600">Organiza tu tiempo académico de manera inteligente</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white rounded-md shadow-sm border">
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
          <TabsTrigger value="strategy">Estrategia</TabsTrigger>
          <TabsTrigger value="schedule">Cronograma</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Tareas</CardTitle>
              <CardDescription>Ingresa las tareas académicas que necesitas organizar</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskInput onAddTask={addTask} onRemoveTask={removeTask} tasks={tasks} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidad Horaria</CardTitle>
              <CardDescription>Define tus horarios disponibles para estudiar</CardDescription>
            </CardHeader>
            <CardContent>
              <AvailabilityScheduler availability={availability} onUpdateAvailability={updateAvailability} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estrategia de Estudio</CardTitle>
              <CardDescription>Selecciona una estrategia para organizar tu estudio</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Estructura simple", value: "Estructura simple" },
                    { label: "Técnica Pomodoro", value: "pomodoro" },
                    { label: "Técnica Feynman", value: "feynman" },
                    { label: "Mapas mentales", value: "mapas" },
                  ].map(({ label, value }) => (
                    <label
                      key={value}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-colors
                        ${strategy === value ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}
                      `}
                    >
                      <input
                        type="radio"
                        name="estrategia"
                        value={value}
                        checked={strategy === value}
                        onChange={(e) => setStrategy(e.target.value)}
                        className="sr-only"
                      />
                      <span className="font-medium text-gray-800">{label}</span>
                    </label>
                  ))}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tu Cronograma</CardTitle>
              <CardDescription>Visualiza tu plan de estudio personalizado</CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleGenerator
                tasks={tasks}
                availability={availability}
                strategy={strategy}
                onGenerate={handleGenerateSchedule}
                isGenerating={isGenerating}
              />
              {schedule.length > 0 && <ScheduleViewer schedule={schedule} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}
