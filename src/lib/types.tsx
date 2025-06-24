export interface Task {
  id: string
  name: string
  duration: number // en minutos
  dueDate: Date
  priority: string // "alta", "media", "baja"
  actualGrade: number // calificación actual del 1 al 7
  createdAt: Date
}

export interface Availability {
  id: string
  day: string // "lunes", "martes", etc.
  startTime: string // formato "HH:MM"
  endTime: string // formato "HH:MM"
}

export interface ScheduleBlock {
  day: string // "lunes", "martes", etc.
  startTime: string // formato "HH:MM"
  endTime: string // formato "HH:MM"
  taskName: string
  taskId: string
  priority: string
}
