'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating note content based on a user request using AI.
 *
 * - generateNoteWithAI - A function that takes a user request and returns generated content.
 * - GenerateNoteWithAIInput - The input type for the generateNoteWithAI function.
 * - GenerateNoteWithAIOutput - The return type for the generateNoteWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNoteWithAIInputSchema = z.object({
  request: z.string().describe('The user request to generate a note from.'),
});
export type GenerateNoteWithAIInput = z.infer<typeof GenerateNoteWithAIInputSchema>;

const GenerateNoteWithAIOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated content of the note.'),
});
export type GenerateNoteWithAIOutput = z.infer<typeof GenerateNoteWithAIOutputSchema>;

export async function generateNoteWithAI(input: GenerateNoteWithAIInput): Promise<GenerateNoteWithAIOutput> {
  return generateNoteWithAIFlow(input);
}

const generateNoteWithAIPrompt = ai.definePrompt({
  name: 'generateNoteWithAIPrompt',
  input: {schema: GenerateNoteWithAIInputSchema},
  output: {schema: GenerateNoteWithAIOutputSchema},
  prompt: `Sei un assistente AI. Il tuo compito è scrivere una nota basata sulla richiesta dell'utente. La nota deve essere ben strutturata, scritta in italiano e facile da leggere.

Richiesta dell'utente: {{{request}}}`,
});

const generateNoteWithAIFlow = ai.defineFlow(
  {
    name: 'generateNoteWithAIFlow',
    inputSchema: GenerateNoteWithAIInputSchema,
    outputSchema: GenerateNoteWithAIOutputSchema,
  },
  async input => {
    const {output} = await generateNoteWithAIPrompt(input);
    return { generatedContent: output!.generatedContent };
  }
);
