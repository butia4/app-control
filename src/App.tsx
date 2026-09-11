import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { CaptureScreen } from "@/components/CaptureScreen"
import { ReportsScreen } from "@/components/ReportsScreen"
import { ConfigScreen } from "@/components/ConfigScreen"

type View = "capture" | "reports" | "config"

function App() {
  const [view, setView] = useState<View>("capture")

  return (
    <div className="min-h-screen">
      <nav className="flex gap-2 border-b bg-card p-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <Button
          type="button"
          variant={view === "capture" ? "default" : "outline"}
          aria-pressed={view === "capture"}
          className={
            view === "capture" ? "ring-2 ring-ring/50" : undefined
          }
          onClick={() => setView("capture")}
        >
          Captura
        </Button>
        <Button
          type="button"
          variant={view === "reports" ? "default" : "outline"}
          aria-pressed={view === "reports"}
          className={
            view === "reports" ? "ring-2 ring-ring/50" : undefined
          }
          onClick={() => setView("reports")}
        >
          Reportes
        </Button>
        <Button
          type="button"
          variant={view === "config" ? "default" : "outline"}
          aria-pressed={view === "config"}
          className={
            view === "config" ? "ring-2 ring-ring/50" : undefined
          }
          onClick={() => setView("config")}
        >
          Config
        </Button>
      </nav>

      {view === "capture" && <CaptureScreen />}
      {view === "reports" && <ReportsScreen />}
      {view === "config" && <ConfigScreen />}
      <Toaster />
    </div>
  )
}

export default App
