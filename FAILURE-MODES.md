# Integration & Failure Modes: RenalCare Taskboard

## Backend Assumptions (Mock Layer)
The application uses a dedicated mock layer (`src/lib/api-client.ts`) to simulate a backend server. This allows for testing edge cases without a live database.
- **Latency**: API calls are delayed by 500ms–1200ms to simulate real network conditions.
- **Flaky Connectivity**: A "Server Connected/Offline" switch in the UI header controls the `networkSimulatedSuccess` flag, forcing API rejections to test rollback behavior.
- **Contract Enforcement**: All mock data is passed through `Zod` schemas before being returned to the application, simulating a "Schema-First" backend approach.

## Behavior Under Partial Failures
The application implements an **Optimistic UI pattern** with automated rollback:
1. **Network Disconnection / Server Error**:
    * **Action**: User updates a task status or creates a new task.
    * **Behavior**: The UI updates immediately (e.g., the card moves to the "Completed" column).
    * **Failure Handling**: If the server request fails, the application identifies the error, displays a "destructive" toast notification with a **Retry** action, and **rolls back** the local state to the last known good state.
2. **AI Service Failure**:
    * **Behavior**: If the Genkit flow for task description generation fails, a specific error toast is shown. The user retains their manual input and can proceed without AI assistance.

## Adaptation Strategy (UI Evolution)
The system is designed for **intentional ambiguity**, allowing the backend to evolve:
- **Adding New Roles**: Update the `Role` union type in `src/types/index.ts` and add configuration to the `ROLE_CONFIG` object in `src/components/taskboard/role-badge.tsx`.
- **New Task Categories**: The `TaskSchema` includes a `metadata` field and defaults for `description`. New properties can be passed in `metadata` without breaking the `Task` DTO.

## Persistence & Validation Policy
The application uses **Zod schemas** in the `apiClient` to validate data contracts. If the backend returns unexpected shapes or missing optional fields, the schemas provide safe defaults (e.g., "No description provided"), preventing runtime crashes.