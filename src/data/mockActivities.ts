import { SocialActivity } from '@/types/contacts';

export const mockActivities: SocialActivity[] = [
  {
    id: 'a1', contactId: '1', platform: 'linkedin', type: 'post',
    content: 'Freue mich, unser neues Produkt vorzustellen! Nach Monaten harter Arbeit ist es endlich soweit. #Innovation #TechStart',
    timestamp: new Date('2024-12-05T10:30:00'),
    engagement: { likes: 234, comments: 45, shares: 23 },
  },
  {
    id: 'a2', contactId: '1', platform: 'instagram', type: 'story',
    content: 'Behind the scenes vom Fotoshooting',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943768011_c2184163.jpg',
    timestamp: new Date('2024-12-05T09:00:00'),
    engagement: { likes: 156, comments: 0, shares: 0 },
  },
  {
    id: 'a3', contactId: '2', platform: 'linkedin', type: 'article',
    content: 'Die Zukunft der KI im Business: 5 Trends, die Sie kennen sollten',
    timestamp: new Date('2024-12-05T09:15:00'),
    engagement: { likes: 567, comments: 89, shares: 134 },
  },
  {
    id: 'a4', contactId: '2', platform: 'twitter', type: 'post',
    content: 'Gerade auf der Tech Conference in Berlin. Spannende Einblicke in die Zukunft der Digitalisierung! 🚀',
    timestamp: new Date('2024-12-05T08:45:00'),
    engagement: { likes: 89, comments: 12, shares: 8 },
  },
  {
    id: 'a5', contactId: '3', platform: 'instagram', type: 'post',
    content: 'Neues Branding-Projekt abgeschlossen! So stolz auf das Ergebnis.',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943764656_ad2a24de.jpg',
    timestamp: new Date('2024-12-04T18:45:00'),
    engagement: { likes: 423, comments: 67, shares: 34 },
  },
  {
    id: 'a6', contactId: '3', platform: 'tiktok', type: 'post',
    content: 'Design-Tipps für Anfänger - Teil 3',
    timestamp: new Date('2024-12-04T16:00:00'),
    engagement: { likes: 1234, comments: 89, shares: 156 },
  },
  {
    id: 'a7', contactId: '4', platform: 'linkedin', type: 'post',
    content: 'Q4 Ergebnisse übertreffen alle Erwartungen. Danke an das gesamte Team!',
    timestamp: new Date('2024-12-05T08:00:00'),
    engagement: { likes: 345, comments: 56, shares: 23 },
  },
  {
    id: 'a8', contactId: '4', platform: 'whatsapp', type: 'status',
    content: 'Im Meeting - später erreichbar',
    timestamp: new Date('2024-12-05T07:30:00'),
    engagement: { likes: 0, comments: 0, shares: 0 },
  },
  {
    id: 'a9', contactId: '5', platform: 'instagram', type: 'story',
    content: 'Kaffeepause im Büro ☕',
    timestamp: new Date('2024-12-05T11:20:00'),
    engagement: { likes: 89, comments: 0, shares: 0 },
  },
  {
    id: 'a10', contactId: '5', platform: 'facebook', type: 'post',
    content: 'Wir suchen Content Creator! Bewirb dich jetzt bei Media House.',
    timestamp: new Date('2024-12-05T10:00:00'),
    engagement: { likes: 234, comments: 45, shares: 67 },
  },
];

export default mockActivities;
