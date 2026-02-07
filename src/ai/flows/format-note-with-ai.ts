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
  prompt: `Sei un assistente AI. Il tuo compito è riformattare il contenuto della nota fornito. Devi riordinare la nota, correggere gli errori di ortografia in italiano e identificare strutture come elenchi per formattarle correttamente usando il Markdown. L'output finale deve essere ben strutturato e di facile lettura.

Contenuto della nota: {{{content}}}`,
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
