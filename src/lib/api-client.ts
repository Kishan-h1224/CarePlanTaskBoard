/**
 * @fileOverview API Client for managing patient and task data with Zod validation.
 * Acts as the mock layer simulating latency and network instability.
 */

import { Task, Patient, TaskStatus, TaskSchema, PatientSchema } from '@/types';
import { MOCK_PATIENTS, MOCK_TASKS } from '@/lib/mock-data';
import { z } from 'zod';

export const apiClient = {
  getPatients: async (): Promise<Patient[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return z.array(PatientSchema).parse(MOCK_PATIENTS);
  },

  getTasks: async (): Promise<Task[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return z.array(TaskSchema).parse(MOCK_TASKS);
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus, shouldSucceed: boolean = true): Promise<void> => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldSucceed) {
          resolve(true);
        } else {
          reject(new Error("Network failure: Could not update task status."));
        }
      }, 800);
    });
  },

  createTask: async (task: Task, shouldSucceed: boolean = true): Promise<Task> => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldSucceed) {
          resolve(task);
        } else {
          reject(new Error("Network failure: Could not create task."));
        }
      }, 1200);
    });
    return TaskSchema.parse(task);
  }
};