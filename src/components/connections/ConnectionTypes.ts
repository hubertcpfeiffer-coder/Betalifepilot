export interface ConnectionService {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  connected?: boolean;
}

export interface ConnectionCategory {
  id: string;
  title: string;
  services: ConnectionService[];
}

export const emailServices: ConnectionService[] = [
  { id: 'gmail', name: 'Gmail', icon: 'gmail', color: '#EA4335', description: 'Google Mail verbinden' },
  { id: 'outlook', name: 'Outlook', icon: 'outlook', color: '#0078D4', description: 'Microsoft Outlook' },
  { id: 'yahoo', name: 'Yahoo Mail', icon: 'yahoo', color: '#6001D2', description: 'Yahoo Mail verbinden' },
  { id: 'gmx', name: 'GMX', icon: 'gmx', color: '#1C449B', description: 'GMX Mail verbinden' },
  { id: 'webde', name: 'Web.de', icon: 'webde', color: '#FFD800', description: 'Web.de Mail verbinden' },
  { id: 'proton', name: 'ProtonMail', icon: 'proton', color: '#6D4AFF', description: 'Sichere E-Mail' },
  { id: 'icloud', name: 'iCloud Mail', icon: 'icloud', color: '#3693F3', description: 'Apple iCloud Mail' },
];

export const calendarServices: ConnectionService[] = [
  { id: 'gcal', name: 'Google Calendar', icon: 'gcal', color: '#4285F4', description: 'Google Kalender' },
  { id: 'outlook-cal', name: 'Outlook Kalender', icon: 'outlook', color: '#0078D4', description: 'Microsoft Kalender' },
  { id: 'apple-cal', name: 'Apple Kalender', icon: 'apple', color: '#555555', description: 'iCal verbinden' },
  { id: 'caldav', name: 'CalDAV', icon: 'caldav', color: '#FF6B35', description: 'Beliebiger CalDAV Server' },
];

export const socialServices: ConnectionService[] = [
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E4405F', description: 'Fotos & Stories' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#1877F2', description: 'Social Network' },
  { id: 'twitter', name: 'X (Twitter)', icon: 'twitter', color: '#000000', description: 'Kurznachrichten' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2', description: 'Business Netzwerk' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok', color: '#000000', description: 'Video Plattform' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#FF0000', description: 'Video Kanal' },
  { id: 'pinterest', name: 'Pinterest', icon: 'pinterest', color: '#BD081C', description: 'Inspiration & Ideen' },
  { id: 'threads', name: 'Threads', icon: 'threads', color: '#000000', description: 'Meta Threads' },
];

export const contactServices: ConnectionService[] = [
  { id: 'google-contacts', name: 'Google Kontakte', icon: 'google-contacts', color: '#4285F4', description: 'Google Kontakte synchronisieren' },
  { id: 'icloud-contacts', name: 'iCloud Kontakte', icon: 'icloud-contacts', color: '#3693F3', description: 'Apple iCloud Kontakte' },
  { id: 'outlook-contacts', name: 'Outlook Kontakte', icon: 'outlook-contacts', color: '#0078D4', description: 'Microsoft Kontakte' },
  { id: 'carddav', name: 'CardDAV', icon: 'carddav', color: '#FF6B35', description: 'Beliebiger CardDAV Server' },
];

export const shoppingServices: ConnectionService[] = [
  { id: 'rewe', name: 'REWE', icon: 'rewe', color: '#CC071E', description: 'REWE App & Payback verbinden' },
  { id: 'kaufland', name: 'Kaufland', icon: 'kaufland', color: '#E10915', description: 'Kaufland App & K-Card' },
  { id: 'lidl', name: 'Lidl Plus', icon: 'lidl', color: '#0050AA', description: 'Lidl Plus Kundenkarte' },
  { id: 'edeka', name: 'EDEKA', icon: 'edeka', color: '#FFE500', description: 'EDEKA App & Genuss+' },
  { id: 'aldi-sued', name: 'ALDI SÜD', icon: 'aldi', color: '#00005F', description: 'ALDI SÜD App' },
  { id: 'aldi-nord', name: 'ALDI Nord', icon: 'aldi-nord', color: '#1C3F94', description: 'ALDI Nord App' },
  { id: 'penny', name: 'Penny', icon: 'penny', color: '#CD1719', description: 'Penny App & Coupons' },
  { id: 'netto', name: 'Netto', icon: 'netto', color: '#FFE500', description: 'Netto App & Deutschlandcard' },
  { id: 'dm', name: 'dm', icon: 'dm', color: '#008A52', description: 'dm App & Payback' },
  { id: 'rossmann', name: 'Rossmann', icon: 'rossmann', color: '#C8102E', description: 'Rossmann App & Coupons' },
  { id: 'mueller', name: 'Müller', icon: 'mueller', color: '#E30613', description: 'Müller App & Bluecode' },
  { id: 'amazon', name: 'Amazon', icon: 'amazon', color: '#FF9900', description: 'Amazon Shopping' },
  { id: 'ebay', name: 'eBay', icon: 'ebay', color: '#E53238', description: 'eBay Kleinanzeigen & Shop' },
  { id: 'payback', name: 'Payback', icon: 'payback', color: '#0046AA', description: 'Payback Punkte sammeln' },
  { id: 'deutschlandcard', name: 'DeutschlandCard', icon: 'deutschlandcard', color: '#E30613', description: 'DeutschlandCard Punkte' },
];
