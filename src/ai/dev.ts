import { config } from 'dotenv';
config();

import '@/ai/flows/format-note-with-ai.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/generate-note-with-ai.ts';
import '@/ai/flows/summarize-note-with-ai.ts';
