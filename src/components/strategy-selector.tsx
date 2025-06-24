"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Brain, Network } from "lucide-react"

interface StrategySelectorProps {
  strategy: string
  onStrategyChange: (strategy: string) => void
}

export default function StrategySelector({ strategy, onStrategyChange }: StrategySelectorProps) {
  const techniques = [
    {
      name: "Estructura simple",
      value: "Estructura simple",
      description: "Un enfoque directo y organizado para el estudio",
      icon: BookOpen,
      benefits: [
        "Fácil de implementar y seguir",
        "Ideal para principiantes en organización",
        "Permite flexibilidad en los horarios",
        "Reduce la complejidad de planificación",
      ],
      howItWorks:
        "Organiza tus tareas por prioridad y disponibilidad, creando bloques de estudio simples y directos sin técnicas específicas complejas.",
    },
    {
      name: "Técnica Pomodoro",
      value: "pomodoro",
      description: "Método de gestión del tiempo que utiliza intervalos de trabajo y descanso",
      icon: Clock,
      benefits: [
        "Mejora la concentración y enfoque",
        "Reduce la fatiga mental",
        "Aumenta la productividad",
        "Facilita el seguimiento del progreso",
      ],
      howItWorks:
        "Trabaja en intervalos de 25 minutos seguidos de descansos de 5 minutos. Después de 4 pomodoros, toma un descanso más largo de 15-30 minutos.",
    },
    {
      name: "Técnica Feynman",
      value: "feynman",
      description: "Método de aprendizaje basado en explicar conceptos con palabras simples",
      icon: Brain,
      benefits: [
        "Identifica lagunas en el conocimiento",
        "Mejora la comprensión profunda",
        "Facilita la retención a largo plazo",
        "Desarrolla habilidades de comunicación",
      ],
      howItWorks:
        "1) Elige un concepto, 2) Explícalo como si fueras un profesor, 3) Identifica áreas confusas, 4) Revisa y simplifica hasta dominarlo completamente.",
    },
    {
      name: "Mapas mentales",
      value: "mapas",
      description: "Representación visual de información usando diagramas y conexiones",
      icon: Network,
      benefits: [
        "Estimula la creatividad y memoria visual",
        "Facilita la conexión de ideas",
        "Mejora la organización de información",
        "Útil para repaso y síntesis",
      ],
      howItWorks:
        "Crea diagramas con un tema central, ramificándose en subtemas conectados con palabras clave, colores e imágenes para facilitar la memorización.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Selecciona tu Técnica de Estudio</h3>
        <p className="text-gray-600">Haz click en la técnica que prefieras para seleccionarla</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techniques.map((technique, index) => {
          const IconComponent = technique.icon
          const isSelected = strategy === technique.value
          return (
            <Card
              key={index}
              onClick={() => onStrategyChange(technique.value)}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? "bg-white border-gray-800 shadow-md ring-2 ring-gray-300"
                  : "bg-gray-50 border-gray-200 opacity-75 hover:opacity-90 hover:bg-gray-100"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-5 w-5 ${isSelected ? "text-gray-900" : "text-gray-500"}`} />
                  <CardTitle className={`text-lg ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                    {technique.name}
                  </CardTitle>
                  {isSelected && (
                    <div className="ml-auto">
                      <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                    </div>
                  )}
                </div>
                <CardDescription className={`text-sm ${isSelected ? "text-gray-700" : "text-gray-500"}`}>
                  {technique.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                    ¿Cómo funciona?
                  </h4>
                  <p className={`text-xs leading-relaxed ${isSelected ? "text-gray-700" : "text-gray-500"}`}>
                    {technique.howItWorks}
                  </p>
                </div>

                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                    Beneficios:
                  </h4>
                  <ul className="space-y-1">
                    {technique.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-xs">
                        <span className={`mr-2 mt-0.5 font-bold ${isSelected ? "text-gray-800" : "text-gray-400"}`}>
                          ✓
                        </span>
                        <span className={isSelected ? "text-gray-700" : "text-gray-500"}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Consejo
        </h3>
        <p className="text-xs text-gray-700">
          No existe una técnica perfecta para todos. Te recomendamos experimentar con diferentes estrategias para
          encontrar la que mejor se adapte a tu estilo de aprendizaje y tipo de material de estudio.
        </p>
      </div>
    </div>
  )
}
