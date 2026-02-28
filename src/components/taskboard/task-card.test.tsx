import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from './task-card';
import { useTaskStore } from '@/store/use-task-store';

// Mock the store
vi.mock('@/store/use-task-store', () => ({
  useTaskStore: vi.fn(),
}));

const mockTask = {
  id: 't1',
  patientId: 'p1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending' as const,
  role: 'nurse' as const,
  dueDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskCard Component', () => {
  it('renders task details correctly', () => {
    (useTaskStore as any).mockReturnValue({
      updateTaskStatus: vi.fn(),
    });

    render(<TaskCard task={mockTask} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls updateTaskStatus when a dropdown menu item is clicked', async () => {
    const updateTaskStatusSpy = vi.fn().mockResolvedValue(undefined);
    (useTaskStore as any).mockReturnValue({
      updateTaskStatus: updateTaskStatusSpy,
    });

    render(<TaskCard task={mockTask} />);
    
    // Open dropdown
    const trigger = screen.getByRole('button', { name: '' }); // MoreVertical has no label by default in the code, but we can target the button
    fireEvent.click(trigger);

    // Click "Set as Completed"
    const completedOption = await screen.findByText('Set as Completed');
    fireEvent.click(completedOption);

    expect(updateTaskStatusSpy).toHaveBeenCalledWith('t1', 'completed');
  });
});