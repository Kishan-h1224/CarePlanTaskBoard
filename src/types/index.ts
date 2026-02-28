import { z } from "zod";

/**
 * @fileOverview Data contracts and TypeScript definitions for the RenalCare Taskboard.
 * These schemas handle "intentional ambiguity" by providing defaults and optional fields.
 */

export const RoleSchema = z.enum(['nurse', 'dietician', 'social_worker']);
export type Role = z.infer<typeof RoleSchema>;

export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'completed']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TimeFilterSchema = z.enum(['all', 'overdue', 'due_today', 'upcoming']);
export type TimeFilter = z.infer<typeof TimeFilterSchema>;

export const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  medicalRecordNumber: z.string(),
  lastDialysis: z.string(),
  status: z.enum(['stable', 'monitoring', 'critical']),
  bedNumber: z.string(),
  insuranceProvider: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});
export type Patient = z.infer<typeof PatientSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  title: z.string(),
  description: z.string().default("No description provided"), 
  status: TaskStatusSchema,
  role: RoleSchema,
  dueDate: z.string(),
  assignedTo: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  metadata: z.record(z.any()).optional(),
});
export type Task = z.infer<typeof TaskSchema>;

export interface TaskboardFilters {
  role: Role | 'all';
  time: TimeFilter;
}