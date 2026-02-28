"use client";

import { Patient, Task, TaskStatus, Role } from "@/types";
import { useTaskStore } from "@/store/use-task-store";
import { TaskCard } from "./task-card";
import { CreateTaskDialog } from "./create-task-dialog";
import { Badge } from "@/components/ui/badge";
import { User, Activity } from "lucide-react";
import { isPast, isToday } from "date-fns";

interface PatientRowProps {
  patient: Patient;
}

export function PatientRow({ patient }: PatientRowProps) {
  const { tasks, filters } = useTaskStore();

  const filteredTasks = tasks.filter(task => {
    if (task.patientId !== patient.id) return false;
    
    // Role filter
    if (filters.role !== 'all' && task.role !== filters.role) return false;
    
    // Time filter
    const taskDate = new Date(task.dueDate);
    if (filters.time === 'overdue') {
      return task.status !== 'completed' && isPast(taskDate) && !isToday(taskDate);
    }
    if (filters.time === 'due_today') {
      return isToday(taskDate);
    }
    if (filters.time === 'upcoming') {
      return !isPast(taskDate) && !isToday(taskDate);
    }
    
    return true;
  });

  const getStatusTasks = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);

  const statusColors = {
    stable: 'bg-green-100 text-green-700',
    monitoring: 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 border-b pb-6 mb-6 last:border-0 last:mb-0">
      {/* Patient Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">{patient.name}</h3>
              <p className="text-xs text-muted-foreground">{patient.medicalRecordNumber}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={`${statusColors[patient.status]} border-none capitalize`}>
              {patient.status}
            </Badge>
            <Badge variant="outline" className="bg-white">Bed {patient.bedNumber}</Badge>
          </div>
          
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Last Dialysis: {new Date(patient.lastDialysis).toLocaleDateString()}
          </div>

          <div className="pt-2">
            <CreateTaskDialog patient={patient} />
          </div>
        </div>
      </div>

      {/* Task Columns */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column: To Do */}
        <div className="bg-slate-50/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To Do</span>
            <Badge variant="outline" className="bg-white">{getStatusTasks('pending').length}</Badge>
          </div>
          {getStatusTasks('pending').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          {getStatusTasks('pending').length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed rounded-lg">
              No tasks pending
            </div>
          )}
        </div>

        {/* Column: In Progress */}
        <div className="bg-slate-50/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">In Progress</span>
            <Badge variant="outline" className="bg-white">{getStatusTasks('in_progress').length}</Badge>
          </div>
          {getStatusTasks('in_progress').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          {getStatusTasks('in_progress').length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed rounded-lg">
              No tasks in progress
            </div>
          )}
        </div>

        {/* Column: Completed */}
        <div className="bg-slate-50/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Completed</span>
            <Badge variant="outline" className="bg-white">{getStatusTasks('completed').length}</Badge>
          </div>
          {getStatusTasks('completed').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          {getStatusTasks('completed').length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed rounded-lg">
              No completed tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
}