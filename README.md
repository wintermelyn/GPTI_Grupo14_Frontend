# OrganizAI - Frontend

OrganizAI es una aplicación web para la gestión inteligente de tareas y horarios académicos. Permite a estudiantes organizar sus tareas, definir su disponibilidad horaria y generar un cronograma personalizado de estudio, integrándose con un backend que realiza la planificación automática.

---

## 🚀 Tecnologías principales
- **Next.js** (App Router)
- **React**
- **TypeScript**
- **TailwindCSS**
- **Axios** (para requests HTTP)

---

## 📁 Estructura del proyecto

```
organizai/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout global
│   │   └── page.tsx           # Página principal
│   ├── components/
│   │   ├── organizai.tsx      # Componente principal
│   │   ├── task-input.tsx     # Formulario de tareas
│   │   ├── availability-scheduler.tsx # Disponibilidad horaria
│   │   ├── schedule-generator.tsx     # Botón y lógica de generación
│   │   └── schedule-viewer.tsx       # Visualización del cronograma
│   └── lib/
│       ├── api.ts             # Configuración de Axios
│       ├── types.tsx          # Tipos TypeScript
│       └── utils.ts           # Utilidades
├── public/                    # Recursos estáticos
└── README.md                  # Este archivo
```

---

## ⚙️ Instalación y ejecución

1. **Instala dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

2. **Configura el backend:**
   - El frontend espera un backend corriendo en `http://localhost:8000/api`.
   - Puedes modificar la URL base en `src/lib/api.ts` si tu backend está en otra dirección.

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abre la app:**
   - Ve a [http://localhost:3000](http://localhost:3000)

---

## 🧩 ¿Cómo funciona?

1. **Gestión de tareas:**
   - Agrega tareas con nombre, duración (minutos), fecha límite y prioridad.
2. **Disponibilidad horaria:**
   - Define tus bloques de tiempo disponibles por día.
3. **Generación de cronograma:**
   - Haz clic en "Generar Cronograma". El frontend envía tus tareas y disponibilidad al backend.
   - El backend responde con un cronograma óptimo, que se muestra en la interfaz.
4. **Visualización:**
   - Puedes ver el cronograma en formato semanal o de lista, y exportarlo a PDF.

---

## 🔗 Integración con Backend

- El frontend utiliza Axios (`src/lib/api.ts`) para comunicarse con el backend.
- El endpoint esperado para generar el cronograma es:
  - `POST http://localhost:8000/api/generate-schedule`
- El formato de request y response debe ser compatible con el backend que implementes.
- Si tienes problemas de CORS, asegúrate de configurar correctamente tu backend para aceptar peticiones desde `http://localhost:3000`.

---

## 📝 Personalización

- **Cambiar la URL del backend:**
  - Edita `src/lib/api.ts` y modifica el valor de `baseURL`.
- **Modificar tipos de datos:**
  - Edita `src/lib/types.tsx` para ajustar los tipos de tareas, disponibilidad, etc.
- **Estilos:**
  - Usa TailwindCSS para personalizar la apariencia.

---

## 🛠️ Scripts útiles

- `npm run dev` — Inicia el servidor de desarrollo
- `npm run build` — Compila la app para producción
- `npm run start` — Sirve la app compilada

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o un pull request si quieres mejorar OrganizAI.

---

## 📄 Licencia

MIT
