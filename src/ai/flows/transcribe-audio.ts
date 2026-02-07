'use server';
/**
 * @fileOverview This file defines a Genkit flow for transcribing audio content.
 *
 * - transcribeAudio - A function that takes audio data and returns the transcribed text.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcribeAudioPrompt = `Trascrivi l'audio fornito. Se l'audio non è in italiano, trascrivilo comunque nella lingua originale.`;

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async ({ audioDataUri }) => {
    const model = ai.getModel('googleai/gemini-2.5-flash');

    const result = await ai.generate({
      model: model,
      prompt: [
        { media: { url: audioDataUri } },
        { text: transcribeAudioPrompt },
      ],
    });

    return { transcription: result.text };
  }
);
