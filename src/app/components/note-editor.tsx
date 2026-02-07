'use client';

import * as React from 'react';
import { Loader2, Mic, Sparkles, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Note } from '@/app/types';
import { formatNoteWithAI } from '@/ai/flows/format-note-with-ai';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = React.useState(note.title);
  const [content, setContent] = React.useState(note.content);
  const [isFormatting, setIsFormatting] = React.useState(false);
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
        title: 'Formatting Failed',
        description: 'Could not format the note content. Please try again.',
      });
    } finally {
      setIsFormatting(false);
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
                title: 'Transcription Failed',
                description: 'Could not read audio data.',
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
                  title: 'Transcription Complete',
                  description: 'The audio was transcribed, but the result was empty.',
                });
              }
            } catch (error) {
              console.error('Failed to transcribe audio:', error);
              toast({
                variant: 'destructive',
                title: 'Transcription Failed',
                description: 'Could not transcribe the audio. Please try again.',
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
          title: 'Recording Failed',
          description: 'Could not access the microphone. Please check your permissions.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Your browser does not support audio recording.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const isBusy = isFormatting || isRecording || isTranscribing;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Editor</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleToggleRecording}
            disabled={isFormatting || isTranscribing}
            variant={isRecording ? 'destructive' : 'outline'}
          >
            {isTranscribing ? (
              <Loader2 className="animate-spin" />
            ) : isRecording ? (
              <Square className="fill-current" />
            ) : (
              <Mic />
            )}
            <span>
              {isTranscribing
                ? 'Transcribing...'
                : isRecording
                ? 'Stop'
                : 'Record'}
            </span>
          </Button>
          <Button onClick={handleFormatWithAI} disabled={isBusy || !content}>
            {isFormatting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles className="text-accent-foreground" />
            )}
            <span>Format with AI</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="bg-card text-2xl font-bold h-auto p-2"
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note here..."
          className="h-full flex-1 resize-none bg-card leading-7"
        />
      </div>
    </div>
  );
}
