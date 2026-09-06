import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CaptureScreen } from "@/components/CaptureScreen"
import { ReportsScreen } from "@/components/ReportsScreen"

type View = "capture" | "reports"

function App() {
  const [view, setView] = useState<View>("capture")

  return (
    <div className="min-h-screen">
      <nav className="flex gap-2 border-b p-4">
        <Button
          type="button"
          variant={view === "capture" ? "default" : "outline"}
          aria-pressed={view === "capture"}
          onClick={() => setView("capture")}
        >
          Captura
        </Button>
        <Button
          type="button"
          variant={view === "reports" ? "default" : "outline"}
          aria-pressed={view === "reports"}
          onClick={() => setView("reports")}
        >
          Reportes
        </Button>
      </nav>

      {view === "capture" ? <CaptureScreen /> : <ReportsScreen />}
    </div>
  )
}

export default App
