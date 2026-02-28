"use client";

import { useTaskStore } from "@/store/use-task-store";
import { PatientRow } from "@/components/taskboard/patient-row";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Role, TimeFilter } from "@/types";
import { 
  Wifi, 
  WifiOff, 
  Filter, 
  RefreshCw,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Home() {
  const { 
    patients, 
    filters, 
    setFilters, 
    networkSimulatedSuccess, 
    toggleNetworkStability 
  } = useTaskStore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <LayoutGrid className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary leading-none">RenalCare</h1>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Taskboard</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center space-x-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
              <Label htmlFor="network-mode" className="text-xs font-medium flex items-center gap-2 cursor-pointer">
                {networkSimulatedSuccess ? (
                  <><Wifi className="h-3 w-3 text-green-500" /> Server Connected</>
                ) : (
                  <><WifiOff className="h-3 w-3 text-destructive" /> Server Offline</>
                )}
              </Label>
              <Switch 
                id="network-mode" 
                checked={networkSimulatedSuccess} 
                onCheckedChange={toggleNetworkStability}
                className="scale-75"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Select 
                value={filters.role} 
                onValueChange={(v: Role | 'all') => setFilters({ role: v })}
              >
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="dietician">Dietician</SelectItem>
                  <SelectItem value="social_worker">Social Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select 
                value={filters.time} 
                onValueChange={(v: TimeFilter) => setFilters({ time: v })}
              >
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="due_today">Due Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Displaying tasks for <strong>{patients.length}</strong> patients
          </div>
        </div>

        {/* Patient Taskboard Grid */}
        <div className="space-y-4">
          {patients.map(patient => (
            <PatientRow key={patient.id} patient={patient} />
          ))}
        </div>
      </main>

      {/* Footer / Failure Mode Info */}
      <footer className="bg-slate-900 text-slate-300 py-6 mt-12 border-t border-slate-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-sm font-bold text-white mb-3">RenalCare Taskboard</h4>
            <p className="text-xs leading-relaxed opacity-70">
              System health: <span className="text-green-400">Stable</span>. 
              Built for dialysis center efficiency and robustness under imperfect network conditions.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Integration & Failure Modes</h4>
            <p className="text-[10px] leading-relaxed opacity-70">
              This app uses <strong>Optimistic UI</strong>. If the "Server Mode" switch in the header is toggled off, 
              updates will fail and roll back automatically with user feedback.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Adaptability Strategy</h4>
            <p className="text-[10px] leading-relaxed opacity-70">
              New roles or task types can be added via the <code>Role</code> type in <code>types/index.ts</code> 
              and configuring the <code>ROLE_CONFIG</code> in the Badge component.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}