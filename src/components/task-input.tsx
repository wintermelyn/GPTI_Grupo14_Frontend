"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/lib/types"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TaskInputProps {
  onAddTask: (task: Task) => void
  onRemoveTask: (id: string) => void
  tasks: Task[]
}

export default function TaskInput({ onAddTask, onRemoveTask, tasks }: TaskInputProps) {
  const [name, setName] = useState("")
  const [duration, setDuration] = useState(60)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState("media")
  const [actualGrade, setActualGrade] = useState(4)
  const [error, setError] = useState("")

  const handleAddTask = () => {
    if (!name) {
      setError("El nombre de la tarea es obligatorio")
      return
    }
    if (!dueDate) {
      setError("La fecha límite es obligatoria")
      return
    }
    if (duration <= 0) {
      setError("La duración debe ser mayor a 0 minutos")
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name,
      duration,
      dueDate,
      priority,
      actualGrade,
      createdAt: new Date(),
    }

    onAddTask(newTask)
    setName("")
    setDuration(60)
    setDueDate(undefined)
    setPriority("media")
    setActualGrade(4)
    setError("")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="task-name">Nombre de la tarea</Label>
          <Input
            id="task-name"
            placeholder="Ej: Ensayo de Historia"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="task-duration">Duración (minutos)</Label>
            <div className="flex items-center">
              <Input
                id="task-duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(Number.parseInt(e.target.value))}
              />
              <Clock className="ml-2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Fecha límite</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomCalendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-priority">Prioridad</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="task-priority">
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-actual-grade">Promedio actual del curso (1.0-7.0)</Label>
            <div className="flex items-center">
              <Input
                id="task-actual-grade"
                type="number"
                min="1"
                max="7"
                step="0.1"
                value={actualGrade}
                onChange={(e) => setActualGrade(Number.parseFloat(e.target.value))}
              />
            </div>
          </div>

        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleAddTask} className="w-full">
          Agregar Tarea
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tareas Ingresadas ({tasks.length})</h3>

        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No hay tareas ingresadas. Agrega una tarea para comenzar.
          </p>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> {task.duration} min
                        </span>
                        <span>•</span>
                        <span>Vence: {format(task.dueDate, "d MMM", { locale: es })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => onRemoveTask(task.id)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar tarea</span>
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
