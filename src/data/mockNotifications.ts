import { Notification, NotificationSettings, PriceAlertNotification } from '@/types/notifications';

export const mockNotifications: Notification[] = [
  {
    id: 'n1', contactId: '1', contactName: 'Anna Schmidt',
    contactAvatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943774848_58721210.png',
    platform: 'linkedin', activityType: 'post', activityId: 'a1',
    content: 'Freue mich, unser neues Produkt vorzustellen! Nach Monaten harter Arbeit...',
    timestamp: new Date('2024-12-05T10:30:00'), isRead: false,
  },
  {
    id: 'n2', contactId: '1', contactName: 'Anna Schmidt',
    contactAvatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943774848_58721210.png',
    platform: 'instagram', activityType: 'story', activityId: 'a2',
    content: 'Behind the scenes vom Fotoshooting',
    timestamp: new Date('2024-12-05T09:00:00'), isRead: false,
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943768011_c2184163.jpg',
  },
  {
    id: 'n3', contactId: '2', contactName: 'Max Müller',
    contactAvatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943794255_a215bcd8.jpg',
    platform: 'linkedin', activityType: 'article', activityId: 'a3',
    content: 'Die Zukunft der KI im Business: 5 Trends, die Sie kennen sollten',
    timestamp: new Date('2024-12-05T09:15:00'), isRead: true,
  },
  {
    id: 'n4', contactId: '5', contactName: 'Sarah Klein',
    contactAvatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943767957_d8d5c560.png',
    platform: 'instagram', activityType: 'story', activityId: 'a9',
    content: 'Kaffeepause im Büro',
    timestamp: new Date('2024-12-05T11:20:00'), isRead: false,
  },
  {
    id: 'n5', contactId: '5', contactName: 'Sarah Klein',
    contactAvatar: 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764943767957_d8d5c560.png',
    platform: 'facebook', activityType: 'post', activityId: 'a10',
    content: 'Wir suchen Content Creator! Bewirb dich jetzt bei Media House.',
    timestamp: new Date('2024-12-05T10:00:00'), isRead: false,
  },
];

export const mockPriceAlertNotifications: PriceAlertNotification[] = [
  {
    id: 'pa1', type: 'price_alert', productName: 'Nutella 450g',
    shopId: 'kaufland', shopName: 'Kaufland',
    currentPrice: 2.99, originalPrice: 3.99, savedAmount: 1.00,
    isOnSale: true, timestamp: new Date('2024-12-05T08:00:00'), isRead: false,
  },
  {
    id: 'pa2', type: 'price_alert', productName: 'Coca-Cola 1.5L',
    shopId: 'lidl', shopName: 'Lidl',
    currentPrice: 0.99, originalPrice: 1.49, savedAmount: 0.50,
    isOnSale: true, timestamp: new Date('2024-12-05T07:30:00'), isRead: false,
  },
  {
    id: 'pa3', type: 'price_alert', productName: 'Barilla Spaghetti 500g',
    shopId: 'rewe', shopName: 'REWE',
    currentPrice: 1.29, originalPrice: 1.79, savedAmount: 0.50,
    isOnSale: true, timestamp: new Date('2024-12-04T18:00:00'), isRead: true,
  },
];

export const mockNotificationSettings: NotificationSettings[] = [
  {
    contactId: '1', enabled: true,
    platforms: ['linkedin', 'instagram', 'facebook'],
    activityTypes: ['post', 'story', 'article'],
    createdAt: new Date('2024-11-01'),
  },
  {
    contactId: '2', enabled: true,
    platforms: ['linkedin', 'twitter'],
    activityTypes: ['post', 'article'],
    createdAt: new Date('2024-11-15'),
  },
  {
    contactId: '5', enabled: true,
    platforms: ['instagram', 'facebook', 'linkedin'],
    activityTypes: ['post', 'story'],
    createdAt: new Date('2024-11-20'),
  },
];
