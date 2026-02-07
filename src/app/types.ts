export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // Use ISO string for serialization
};
