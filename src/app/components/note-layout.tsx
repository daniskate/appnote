'use client';

import * as React from 'react';
import {
  FileText,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';
import { NoteEditor } from './note-editor';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
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
import { Logo } from '@/app/components/icons';
import type { Note } from '@/app/types';

interface NoteLayoutProps {
  initialNotes: Note[];
}

export function NoteLayout({ initialNotes }: NoteLayoutProps) {
  const [notes, setNotes] = React.useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = React.useState<string | null>(null);

  const sortedNotes = React.useMemo(() => {
    return [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notes]);
  
  const selectedNote = React.useMemo(() => {
    return notes.find((note) => note.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  };

  const openDeleteDialog = (noteId: string) => {
    setNoteToDeleteId(noteId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo className="size-7 text-sidebar-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              SmartNotes
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleCreateNote}
                className="font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Plus />
                <span>New Note</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {sortedNotes.map((note) => (
              <SidebarMenuItem key={note.id}>
                <SidebarMenuButton
                  isActive={note.id === selectedNoteId}
                  onClick={() => setSelectedNoteId(note.id)}
                  tooltip={note.title}
                >
                  <FileText />
                  <span>{note.title}</span>
                </SidebarMenuButton>
                <SidebarMenuAction
                  showOnHover
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(note.id);
                  }}
                  aria-label="Delete note"
                >
                  <Trash2 />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-0">
        <div className="flex h-full flex-col">
          <header className="flex h-12 items-center border-b px-4">
             <SidebarTrigger className="md:hidden" />
          </header>
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {selectedNote ? (
              <NoteEditor key={selectedNote.id} note={selectedNote} onUpdate={handleUpdateNote} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card">
                <FileText size={48} className="text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold">Select a note</h2>
                <p className="mt-2 text-center text-muted-foreground">
                  Choose a note from the list to view or edit,
                  <br />
                  or create a new one to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
    </SidebarProvider>
  );
}
