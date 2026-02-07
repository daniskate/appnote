'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing note content using AI.
 *
 * - summarizeNoteWithAI - A function that takes a note's content and returns a summarized version.
 * - SummarizeNoteWithAIInput - The input type for the summarizeNoteWithAI function.
 * - SummarizeNoteWithAIOutput - The return type for the summarizeNoteWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNoteWithAIInputSchema = z.object({
  content: z.string().describe('The content of the note to summarize.'),
});
export type SummarizeNoteWithAIInput = z.infer<typeof SummarizeNoteWithAIInputSchema>;

const SummarizeNoteWithAIOutputSchema = z.object({
  summarizedContent: z.string().describe('The AI-summarized content of the note.'),
});
export type SummarizeNoteWithAIOutput = z.infer<typeof SummarizeNoteWithAIOutputSchema>;

export async function summarizeNoteWithAI(input: SummarizeNoteWithAIInput): Promise<SummarizeNoteWithAIOutput> {
  return summarizeNoteWithAIFlow(input);
}

const summarizeNoteWithAIPrompt = ai.definePrompt({
  name: 'summarizeNoteWithAIPrompt',
  input: {schema: SummarizeNoteWithAIInputSchema},
  output: {schema: SummarizeNoteWithAIOutputSchema},
  prompt: `Sei un assistente AI. Il tuo compito è riassumere il contenuto della nota fornito. Il riassunto deve essere ben strutturato, utilizzando il Markdown per la formattazione. Usa grassetto per i titoli e includi emoji pertinenti per migliorare la leggibilità e l'impatto visivo.

Contenuto della nota: {{{content}}}`,
});

const summarizeNoteWithAIFlow = ai.defineFlow(
  {
    name: 'summarizeNoteWithAIFlow',
    inputSchema: SummarizeNoteWithAIInputSchema,
    outputSchema: SummarizeNoteWithAIOutputSchema,
  },
  async input => {
    const {output} = await summarizeNoteWithAIPrompt(input);
    return output!;
  }
);
