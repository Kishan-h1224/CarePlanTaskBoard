import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from './use-task-store';

describe('useTaskStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { resetToMocks, setFilters } = useTaskStore.getState();
    resetToMocks();
    setFilters({ role: 'all', time: 'all' });
  });

  it('should optimistically update task status and rollback on failure', async () => {
    const store = useTaskStore.getState();
    const taskId = store.tasks[0].id;
    const initialStatus = store.tasks[0].status;
    const newStatus = 'completed';

    // Disable network success simulation
    useTaskStore.setState({ networkSimulatedSuccess: false });

    try {
      await useTaskStore.getState().updateTaskStatus(taskId, newStatus);
    } catch (e) {
      // Expected failure
    }

    // Verify rollback
    const updatedStore = useTaskStore.getState();
    const task = updatedStore.tasks.find(t => t.id === taskId);
    expect(task?.status).toBe(initialStatus);
  });

  it('should successfully update task status when network is stable', async () => {
    const store = useTaskStore.getState();
    const taskId = store.tasks[0].id;
    const newStatus = 'completed';

    // Enable network success simulation
    useTaskStore.setState({ networkSimulatedSuccess: true });

    await useTaskStore.getState().updateTaskStatus(taskId, newStatus);

    // Verify success
    const updatedStore = useTaskStore.getState();
    const task = updatedStore.tasks.find(t => t.id === taskId);
    expect(task?.status).toBe(newStatus);
  });

  it('should filter tasks by role correctly', () => {
    const { setFilters } = useTaskStore.getState();
    
    setFilters({ role: 'nurse' });
    
    const state = useTaskStore.getState();
    expect(state.filters.role).toBe('nurse');
  });
});