import { NoteLayout } from '@/app/components/note-layout';
import { initialNotes } from '@/app/data';

export default function Home() {
  return (
    <main>
      <NoteLayout initialNotes={initialNotes} />
    </main>
  );
}
