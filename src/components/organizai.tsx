"use client"

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
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")

  const addTask = (task: Task) => setTasks([...tasks, task])
  const removeTask = (id: string) => setTasks(tasks.filter((task) => task.id !== id))
  const updateAvailability = (newAvailability: Availability[]) => setAvailability(newAvailability)

  const handleGenerateSchedule = async () => {
    setIsGenerating(true)
    try {
      console.log("Generando cronograma con:", { tasks, availability })
      const response = await api.post("/generate-schedule", {
        tasks,
        availability,
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
          <TabsTrigger value="schedule">Cronograma</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
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

        <TabsContent value="availability">
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

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Tu Cronograma</CardTitle>
              <CardDescription>Visualiza tu plan de estudio personalizado</CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleGenerator
                tasks={tasks}
                availability={availability}
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
