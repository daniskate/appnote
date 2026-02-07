'use server';
/**
 * @fileOverview This file defines a Genkit flow for automatically formatting note content using AI to improve readability and structure.
 *
 * - formatNoteWithAI - A function that takes a note's content and returns a formatted version.
 * - FormatNoteWithAIInput - The input type for the formatNoteWithAI function.
 * - FormatNoteWithAIOutput - The return type for the formatNoteWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatNoteWithAIInputSchema = z.object({
  content: z.string().describe('The content of the note to format.'),
});
export type FormatNoteWithAIInput = z.infer<typeof FormatNoteWithAIInputSchema>;

const FormatNoteWithAIOutputSchema = z.object({
  formattedContent: z.string().describe('The AI-formatted content of the note.'),
});
export type FormatNoteWithAIOutput = z.infer<typeof FormatNoteWithAIOutputSchema>;

export async function formatNoteWithAI(input: FormatNoteWithAIInput): Promise<FormatNoteWithAIOutput> {
  return formatNoteWithAIFlow(input);
}

const formatNoteWithAIPrompt = ai.definePrompt({
  name: 'formatNoteWithAIPrompt',
  input: {schema: FormatNoteWithAIInputSchema},
  output: {schema: FormatNoteWithAIOutputSchema},
  prompt: `You are an AI assistant designed to format note content to improve its readability and structure.  Incorporate markdown formatting such as headers, lists, bold, and italics where appropriate to enhance the organization and clarity of the note.  The decision to use markdown should be based on your expert reasoning of the note's content.

Note Content: {{{content}}}`,
});

const formatNoteWithAIFlow = ai.defineFlow(
  {
    name: 'formatNoteWithAIFlow',
    inputSchema: FormatNoteWithAIInputSchema,
    outputSchema: FormatNoteWithAIOutputSchema,
  },
  async input => {
    const {output} = await formatNoteWithAIPrompt(input);
    return output!;
  }
);
