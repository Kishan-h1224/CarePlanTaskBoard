"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { RoleBadge } from "./role-badge";
import { useTaskStore } from "@/store/use-task-store";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Loader2
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTaskStatus } = useTaskStore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    
    setIsUpdating(true);
    try {
      await updateTaskStatus(task.id, newStatus);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "The task update could not be saved to the server. Changes rolled back.",
        variant: "destructive",
        action: (
          <ToastAction altText="Retry" onClick={() => handleStatusChange(newStatus)}>
            Retry
          </ToastAction>
        ),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isOverdue = task.status !== 'completed' && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = isToday(new Date(task.dueDate));

  return (
    <Card className={`group relative mb-3 border-l-4 transition-all hover:shadow-md ${
      task.status === 'completed' ? 'border-l-green-500 opacity-75' : 
      isOverdue ? 'border-l-destructive' : 
      isDueToday ? 'border-l-primary' : 'border-l-muted'
    }`}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h4 className={`text-sm font-semibold leading-tight ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange('pending')}>Set as To Do</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>Set as In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('completed')}>Set as Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <RoleBadge role={task.role} />
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 text-[10px] font-medium ${
              isOverdue ? 'text-destructive' : 
              isDueToday ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <Clock className="h-3 w-3" />
              {isDueToday ? 'Today' : format(new Date(task.dueDate), 'MMM d')}
            </div>

            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : task.status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : isOverdue ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
