'use server';
/**
 * @fileOverview An AI assistant that generates comprehensive task descriptions for dialysis center staff.
 *
 * - generateTaskDescription - A function that generates a task description.
 * - GenerateTaskDescriptionInput - The input type for the generateTaskDescription function.
 * - GenerateTaskDescriptionOutput - The return type for the generateTaskDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTaskDescriptionInputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('A list of keywords or phrases related to the task.'),
  patientContext: z
    .string()
    .optional()
    .describe('Additional context about the patient relevant to the task.'),
});
export type GenerateTaskDescriptionInput = z.infer<
  typeof GenerateTaskDescriptionInputSchema
>;

const GenerateTaskDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated comprehensive task description.'),
});
export type GenerateTaskDescriptionOutput = z.infer<
  typeof GenerateTaskDescriptionOutputSchema
>;

export async function generateTaskDescription(
  input: GenerateTaskDescriptionInput
): Promise<GenerateTaskDescriptionOutput> {
  return aiTaskDescriptionAssistantFlow(input);
}

const aiTaskDescriptionPrompt = ai.definePrompt({
  name: 'aiTaskDescriptionPrompt',
  input: {schema: GenerateTaskDescriptionInputSchema},
  output: {schema: GenerateTaskDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to help dialysis center staff create clear and comprehensive task descriptions.

Based on the following keywords and patient context, generate a detailed and actionable task description.

Keywords: {{#each keywords}}- {{{this}}}\n{{/each}}

{{#if patientContext}}
Patient Context: {{{patientContext}}}
{{/if}}

Generate the description, focusing on clarity, completeness, and ensuring it's easy for staff to understand and act upon.
`,
});

const aiTaskDescriptionAssistantFlow = ai.defineFlow(
  {
    name: 'aiTaskDescriptionAssistantFlow',
    inputSchema: GenerateTaskDescriptionInputSchema,
    outputSchema: GenerateTaskDescriptionOutputSchema,
  },
  async input => {
    const {output} = await aiTaskDescriptionPrompt(input);
    return output!;
  }
);
