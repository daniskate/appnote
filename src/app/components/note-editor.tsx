'use client';

import * as React from 'react';
import { Loader2, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Note } from '@/app/types';
import { formatNoteWithAI } from '@/ai/flows/format-note-with-ai';
import { generateNoteWithAI } from '@/ai/flows/generate-note-with-ai';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GeminiIcon } from '@/app/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = React.useState(note.title);
  const [content, setContent] = React.useState(note.content);
  const [isFormatting, setIsFormatting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        onUpdate({ ...note, title, content });
      }
    }, 500); // Debounce time for auto-save

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, note, onUpdate]);

  const handleFormatWithAI = async () => {
    setIsFormatting(true);
    try {
      const result = await formatNoteWithAI({ content });
      if (result.formattedContent) {
        setContent(result.formattedContent);
      }
    } catch (error) {
      console.error('Failed to format note with AI:', error);
      toast({
        variant: 'destructive',
        title: 'Formattazione Fallita',
        description: 'Impossibile formattare il contenuto della nota. Riprova.',
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const handleGenerateNoteWithAI = async () => {
    setIsGenerating(true);
    try {
      const result = await generateNoteWithAI({ request: content });
      if (result.title) {
        setTitle(result.title);
      }
      if (result.generatedContent) {
        setContent(result.generatedContent);
      }
    } catch (error) {
      console.error('Failed to generate note with AI:', error);
      toast({
        variant: 'destructive',
        title: 'Generazione Fallita',
        description: 'Impossibile generare il contenuto della nota. Riprova.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            if (!base64Audio) {
              toast({
                variant: 'destructive',
                title: 'Trascrizione Fallita',
                description: 'Impossibile leggere i dati audio.',
              });
              return;
            }

            setIsTranscribing(true);
            try {
              const result = await transcribeAudio({ audioDataUri: base64Audio });
              if (result.transcription) {
                setContent((prevContent) =>
                  prevContent ? `${prevContent}\n\n${result.transcription}` : result.transcription
                );
              } else {
                toast({
                  variant: 'default',
                  title: 'Trascrizione Completata',
                  description: 'L\'audio è stato trascritto, ma il risultato era vuoto.',
                });
              }
            } catch (error) {
              console.error('Failed to transcribe audio:', error);
              toast({
                variant: 'destructive',
                title: 'Trascrizione Fallita',
                description: 'Impossibile trascrivere l\'audio. Riprova.',
              });
            } finally {
              setIsTranscribing(false);
            }
          };
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start recording:', err);
        toast({
          variant: 'destructive',
          title: 'Registrazione Fallita',
          description: 'Impossibile accedere al microfono. Controlla le autorizzazioni.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Browser non supportato',
        description: 'Il tuo browser non supporta la registrazione audio.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const isAiBusy = isFormatting || isGenerating;
  const isBusy = isAiBusy || isTranscribing;

  return (
    <TooltipProvider>
      <div className="relative flex h-full flex-col">
        <div className="flex flex-1 flex-col gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo della nota"
            className="border-none bg-transparent text-3xl font-bold h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 tracking-tight"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Inizia a scrivere la tua nota qui..."
            className="h-full flex-1 resize-none border-none bg-transparent p-0 leading-7 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>
        <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-3">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={isBusy || !content}
                    size="icon"
                    className="rounded-full h-12 w-12 shadow-lg"
                  >
                    {isAiBusy ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <GeminiIcon className="h-5 w-5" />
                    )}
                    <span className="sr-only">Azioni AI</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Azioni AI</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleFormatWithAI}>
                Formatta nota
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGenerateNoteWithAI}>
                Genera nota da richiesta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleToggleRecording}
                disabled={isAiBusy}
                variant={isRecording ? 'destructive' : 'default'}
                size="icon"
                className="rounded-full h-12 w-12 shadow-lg"
              >
                {isTranscribing ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : isRecording ? (
                  <Square className="fill-current h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isTranscribing
                    ? 'Trascrizione in corso...'
                    : isRecording
                    ? 'Ferma registrazione'
                    : 'Avvia registrazione'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRecording ? 'Ferma registrazione' : 'Registra Audio'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
