'use client';

import * as React from 'react';
import { ArrowLeft, FileText, Plus, Trash2 } from 'lucide-react';
import { NoteEditor } from '@/app/components/note-editor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Note } from '@/app/types';
import { initialNotes } from '@/app/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';

export default function Home() {
  const [notes, setNotes] = React.useState<Note[]>(initialNotes);
  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = React.useState<string | null>(
    null
  );

  const sortedNotes = React.useMemo(() => {
    return [...notes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notes]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    if (selectedNote?.id === updatedNote.id) {
      setSelectedNote(updatedNote);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
    setNoteToDeleteId(null);
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (noteId: string) => {
    setNoteToDeleteId(noteId);
    setIsDeleteDialogOpen(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  if (selectedNote) {
    return (
      <main className="flex h-svh flex-col">
        <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedNote(null)}
            className="h-8 w-8"
          >
            <ArrowLeft />
            <span className="sr-only">Back to notes</span>
          </Button>
          <h1 className="truncate text-xl font-semibold">
            {selectedNote.title}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <NoteEditor
            key={selectedNote.id}
            note={selectedNote}
            onUpdate={handleUpdateNote}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">SmartNotes</h1>
        <Button onClick={handleCreateNote}>
          <Plus className="mr-2" />
          <span>New Note</span>
        </Button>
      </div>

      {sortedNotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedNotes.map((note) => (
            <Card
              key={note.id}
              className="flex cursor-pointer flex-col transition-shadow hover:shadow-lg"
              onClick={() => handleSelectNote(note)}
            >
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2">
                  <span className="truncate">{note.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mr-2 -mt-2 h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(note.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete note</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  {format(new Date(note.createdAt), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-4 text-sm text-muted-foreground">
                  {note.content || 'No content...'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card">
          <FileText size={48} className="text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">No notes yet</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Create a new note to get started.
          </p>
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNoteToDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (noteToDeleteId) {
                  handleDeleteNote(noteToDeleteId);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
