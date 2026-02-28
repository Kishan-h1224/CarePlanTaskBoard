"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, Patient } from "@/types";
import { useTaskStore } from "@/store/use-task-store";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { generateTaskDescription } from "@/ai/flows/ai-task-description-assistant-flow";

interface CreateTaskDialogProps {
  patient: Patient;
}

export function CreateTaskDialog({ patient }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { createTask } = useTaskStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: 'nurse' as Role,
    dueDate: new Date().toISOString().split('T')[0],
  });

  const handleAiRefine = async () => {
    if (!formData.title) {
      toast({
        title: "Missing Keywords",
        description: "Please enter a task title to use as keywords for AI generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateTaskDescription({
        keywords: [formData.title],
        patientContext: `Patient ${patient.name} (${patient.medicalRecordNumber}), Status: ${patient.status}`,
      });
      setFormData(prev => ({ ...prev, description: result.description }));
      toast({
        title: "AI Description Generated",
        description: "A comprehensive description has been added based on the context.",
      });
    } catch (error) {
      toast({
        title: "AI Failed",
        description: "Could not generate AI description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const performCreation = async (data: typeof formData) => {
    setIsSubmitting(true);
    try {
      await createTask({
        patientId: patient.id,
        title: data.title,
        description: data.description,
        role: data.role,
        dueDate: new Date(data.dueDate).toISOString(),
        status: 'pending',
      });
      toast({
        title: "Task Created",
        description: `Successfully added "${data.title}" for ${patient.name}.`,
      });
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        role: 'nurse',
        dueDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "The task could not be saved to the server. Optimistic update rolled back.",
        variant: "destructive",
        action: (
          <ToastAction altText="Retry" onClick={() => performCreation(data)}>
            Retry
          </ToastAction>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performCreation(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1.5 border-dashed">
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Task for {patient.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Monthly Labs, Access Assessment" 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs gap-1 text-primary"
                  onClick={handleAiRefine}
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  Generate with AI
                </Button>
              </div>
              <Textarea 
                id="description" 
                placeholder="Detailed instructions for the staff member..."
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Assign to Role</Label>
                <Select value={formData.role} onValueChange={(v: Role) => setFormData(prev => ({ ...prev, role: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="dietician">Dietician</SelectItem>
                    <SelectItem value="social_worker">Social Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
