import type { Note } from './types';

export const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Project Phoenix - Kick-off',
    content: `Project Phoenix - Meeting Notes

Date: Today

Attendees:
- Alex
- Brenda
- Charles

Agenda:
1. Project Goals & Objectives
2. Timelines and Milestones
3. Team Roles and Responsibilities

Discussion Summary:
- Goal: Relaunch the company website by Q3.
- Key features: New design, improved performance, and a blog section.
- Brenda will lead the design, Charles is in charge of backend, Alex will handle frontend.

Action Items:
- Brenda: Finalize wireframes by next week.
- Charles: Set up the staging environment.
- Alex: Choose a frontend framework.`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '2',
    title: 'Grocery List',
    content: `Things to buy:
- Milk
- Bread
- Eggs
- Cheese
- Apples
- Bananas
- Chicken breasts
- Spinach`,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    title: 'Ideas for new blog post',
    content: `Brainstorming topics for the tech blog.

- "5 Common Mistakes in React and How to Avoid Them"
- A deep dive into server components in Next.js.
- "CSS Grid vs. Flexbox: A Practical Guide"
- The future of web development: What's next after JavaScript frameworks?
- A tutorial on building a simple API with Node.js and Express.`,
    createdAt: new Date().toISOString(),
  },
];
