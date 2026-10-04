export interface ArchiveMemory {
  id: string;
  className: string;
  anchor?: string | null;
  image: string;
  alt: string;
}

export interface ContactPerson {
  role: string;
  email: string;
  label: string;
}

export const archiveMemories: readonly ArchiveMemory[] = [
  {
    id: 'team',
    className: 'story-card story-card--team',
    anchor: 'team',
    image: '/assets/memory-02.webp',
    alt: 'Students presenting their work in a computer lab',
  },
  {
    id: 'story-card--events',
    className: 'story-card story-card--events',
    anchor: null,
    image: '/assets/memory-03.webp',
    alt: 'Participants and organisers at a data science event',
  },
  {
    id: 'story-card--archive',
    className: 'story-card story-card--archive',
    anchor: null,
    image: '/assets/memory-04.webp',
    alt: 'A participant playing in a neon-lit activity arena',
  },
];

export const contacts: readonly ContactPerson[] = [
  {
    role: 'Chairperson -',
    email: 'shaikhaayan4721@gmail.com',
    label: 'SHAIKHAAYAN4721@GMAIL.COM',
  },
  {
    role: 'Vice Chairperson -',
    email: 'shradhasingh257@gmail.com',
    label: 'SHRADHASINGH257@GMAIL.COM',
  },
];
