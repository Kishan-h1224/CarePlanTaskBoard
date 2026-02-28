# **App Name**: RenalCare Taskboard

## Core Features:

- Patient & Task Display: Visualize patient care plans and their associated tasks in a configurable taskboard layout, showing key details like status, due date, and assignee.
- Dynamic Filtering: Filter tasks across all patients by professional role (e.g., nurse, dietician) and temporal criteria (e.g., overdue, due today, upcoming tasks).
- Task Creation & Assignment: Provide an interface for creating new tasks for a specific patient, allowing assignment to different roles and setting due dates.
- Optimistic Task Updates: Allow real-time updating of task status, assignee, or due date with immediate UI feedback, pending server confirmation or rollback on error.
- AI Task Description Assistant: A generative AI tool that suggests and refines task descriptions based on context, common care procedures, or keywords, streamlining task creation.
- Robust Error & Network Handling: Implement strategies for graceful handling of network failures, including retry mechanisms, user feedback, and rolling back optimistic UI updates.
- TypeScript Data Contracts: Define explicit TypeScript interfaces for patient, task, and other relevant data, ensuring type safety and clarity with backend API interactions.

## Style Guidelines:

- Primary color: Professional blue (#2692DE), evoking trust and clarity, suitable for headings, interactive elements, and key information.
- Background color: A subtle and light variant of the primary hue (#ECF3F6), promoting a clean and focused user experience.
- Accent color: A deep indigo-purple (#2E55B3), providing strong contrast for call-to-action buttons, notifications, and emphasizing important actions.
- Body and headline font: 'Inter' (sans-serif) for its modern, legible, and objective aesthetic, suitable for clear display of medical data and tasks.
- Use a set of simple, clean line icons that convey actions and information clearly, without cluttering the taskboard interface.
- Implement a flexible taskboard layout with distinct areas for patient listings, task details, and filtering options, ensuring responsiveness for various screen sizes.
- Incorporate subtle animations for state changes, task updates (including optimistic UI feedback and rollbacks), and navigation, to provide a smooth and intuitive user experience.