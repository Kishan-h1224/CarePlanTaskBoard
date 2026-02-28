"use client";

import { create } from 'zustand';
import { Patient, Task, TaskStatus, TaskboardFilters } from '@/types';
import { MOCK_PATIENTS, MOCK_TASKS } from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';

interface TaskState {
  patients: Patient[];
  tasks: Task[];
  filters: TaskboardFilters;
  isLoading: boolean;
  networkSimulatedSuccess: boolean;
  
  setFilters: (filters: Partial<TaskboardFilters>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  toggleNetworkStability: () => void;
  resetToMocks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  patients: MOCK_PATIENTS,
  tasks: MOCK_TASKS,
  filters: {
    role: 'all',
    time: 'all',
  },
  isLoading: false,
  networkSimulatedSuccess: true,

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  toggleNetworkStability: () => set((state) => ({
    networkSimulatedSuccess: !state.networkSimulatedSuccess
  })),

  resetToMocks: () => set({ patients: MOCK_PATIENTS, tasks: MOCK_TASKS }),

  updateTaskStatus: async (taskId, newStatus) => {
    const previousTasks = [...get().tasks];
    
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t)
    }));

    try {
      await apiClient.updateTaskStatus(taskId, newStatus, get().networkSimulatedSuccess);
    } catch (error) {
      set({ tasks: previousTasks });
      throw error;
    }
  },

  createTask: async (newTaskData) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newTask: Task = {
      ...newTaskData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const previousTasks = [...get().tasks];
    
    set((state) => ({
      tasks: [...state.tasks, newTask]
    }));

    try {
      await apiClient.createTask(newTask, get().networkSimulatedSuccess);
    } catch (error) {
      set({ tasks: previousTasks });
      throw error;
    }
  },
}));