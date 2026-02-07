'use client';

import * as React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Note } from '@/app/types';
import { formatNoteWithAI } from '@/ai/flows/format-note-with-ai';
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Editor</h1>
        <Button onClick={handleFormatWithAI} disabled={isFormatting || !content}>
          {isFormatting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles className="text-accent-foreground" />
          )}
          <span>Format with AI</span>
        </Button>
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
