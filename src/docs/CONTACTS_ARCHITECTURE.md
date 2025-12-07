# Kontakte-Kartei mit Social Media Aktivitätenübersicht

## Programmstruktur Übersicht

```
src/
├── components/
│   ├── contacts/
│   │   ├── ContactsPanel.tsx         # Hauptpanel mit Kontaktliste
│   │   ├── ContactCard.tsx           # Einzelne Kontaktkarte
│   │   ├── ContactDetail.tsx         # Detailansicht mit Benachrichtigungen
│   │   ├── ActivityItem.tsx          # Einzelne Aktivität
│   │   └── PlatformIcon.tsx          # Plattform-Icons
│   │
│   └── notifications/
│       ├── NotificationPanel.tsx     # Benachrichtigungs-Dropdown
│       ├── NotificationItem.tsx      # Einzelne Benachrichtigung
│       ├── NotificationFilters.tsx   # Filter für Plattformen/Typen
│       └── NotificationSettings.tsx  # Einstellungen pro Kontakt
│
├── types/
│   ├── contacts.ts                   # Kontakt-Interfaces
│   └── notifications.ts              # Benachrichtigungs-Interfaces
│
└── data/
    ├── mockContacts.ts               # Beispiel-Kontakte
    ├── mockActivities.ts             # Beispiel-Aktivitäten
    └── mockNotifications.ts          # Beispiel-Benachrichtigungen
```

## Benachrichtigungssystem

### Funktionen
- Benachrichtigungen für favorisierte Kontakte aktivieren
- Filter nach Plattformen (WhatsApp, Facebook, Instagram, etc.)
- Filter nach Aktivitätstypen (Posts, Stories, Status, etc.)
- Ungelesene Benachrichtigungen markieren
- Alle als gelesen markieren

### NotificationSettings Interface
```typescript
interface NotificationSettings {
  contactId: string;
  enabled: boolean;
  platforms: SocialPlatform[];
  activityTypes: ActivityType[];
  createdAt: Date;
}
```

### Notification Interface
```typescript
interface Notification {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  platform: SocialPlatform;
  activityType: ActivityType;
  content: string;
  timestamp: Date;
  isRead: boolean;
}
```

## Komponenten-Hierarchie

```
Header
└── NotificationPanel (Bell-Icon)
    ├── NotificationFilters
    └── NotificationItem (multiple)

ContactsPanel
├── ContactCard (multiple)
│   └── Bell-Icon (wenn Benachrichtigungen aktiv)
└── ContactDetail
    └── NotificationSettings (ausklappbar)
```

## Benötigte API-Tokens

| Plattform | Token | Zweck |
|-----------|-------|-------|
| META_ACCESS_TOKEN | Facebook & Instagram Graph API | Posts, Stories |
| WHATSAPP_API_TOKEN | WhatsApp Business API | Status-Updates |
| LINKEDIN_ACCESS_TOKEN | LinkedIn API | Posts, Artikel |
