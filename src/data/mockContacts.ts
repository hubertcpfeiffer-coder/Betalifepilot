import { Contact, SocialActivity } from '@/types/contacts';

export const mockContacts: Contact[] = [
  {
    id: '1', name: 'Anna Schmidt', email: 'anna@example.com', phone: '+49 170 1234567',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943774848_58721210.png',
    company: 'TechStart GmbH', position: 'Marketing Director', isFavorite: true, tags: ['Arbeit', 'Wichtig'],
    socialProfiles: [
      { platform: 'linkedin', username: 'annaschmidt', connected: true },
      { platform: 'instagram', username: 'anna.schmidt', connected: true },
      { platform: 'facebook', username: 'anna.schmidt.official', connected: true },
    ],
    activities: [], lastActivity: new Date('2024-12-05T10:30:00'),
  },
  {
    id: '2', name: 'Max Müller', email: 'max@example.com', phone: '+49 171 2345678',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943794255_a215bcd8.jpg',
    company: 'Digital Solutions AG', position: 'CEO', isFavorite: true, tags: ['Business', 'Partner'],
    socialProfiles: [
      { platform: 'linkedin', username: 'maxmueller', connected: true },
      { platform: 'twitter', username: 'max_mueller', connected: true },
    ],
    activities: [], lastActivity: new Date('2024-12-05T09:15:00'),
  },
  {
    id: '3', name: 'Lisa Weber', email: 'lisa@example.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943765882_72e716ae.png',
    company: 'Creative Agency', position: 'Designer', tags: ['Kreativ', 'Freelancer'],
    socialProfiles: [
      { platform: 'instagram', username: 'lisa.creates', connected: true },
      { platform: 'tiktok', username: 'lisacreates', connected: true },
    ],
    activities: [], lastActivity: new Date('2024-12-04T18:45:00'),
  },
  {
    id: '4', name: 'Thomas Bauer', email: 'thomas@example.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943808046_60051f87.png',
    company: 'Finance Plus', position: 'CFO', tags: ['Finanzen'],
    socialProfiles: [
      { platform: 'linkedin', username: 'thomasbauer', connected: true },
      { platform: 'whatsapp', username: '+49172345678', connected: true },
    ],
    activities: [], lastActivity: new Date('2024-12-05T08:00:00'),
  },
  {
    id: '5', name: 'Sarah Klein', email: 'sarah@example.com',
    avatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943767957_d8d5c560.png',
    company: 'Media House', position: 'Content Manager', isFavorite: true, tags: ['Medien'],
    socialProfiles: [
      { platform: 'instagram', username: 'sarah.klein', connected: true },
      { platform: 'facebook', username: 'sarahklein', connected: true },
      { platform: 'linkedin', username: 'sarahklein', connected: true },
    ],
    activities: [], lastActivity: new Date('2024-12-05T11:20:00'),
  },
];

export default mockContacts;
