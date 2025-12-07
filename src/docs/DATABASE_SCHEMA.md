# Mio Lifepilot - Datenbank Schema

## Übersicht
Die Mio-Datenbank verwendet Supabase (PostgreSQL) mit Row Level Security (RLS).

## Tabellen mit RLS

### Core Tables
| Tabelle | RLS | Beschreibung |
|---------|-----|--------------|
| `users` | ✅ | Benutzerprofile (erweitert auth.users) |
| `user_settings` | ✅ | Benutzereinstellungen |
| `mio_profiles` | ✅ | Mio AI-Einstellungen |
| `user_devices` | ✅ | Geräte-Tracking |
| `device_login_notifications` | ✅ | Neue Geräte-Benachrichtigungen |

### Tasks & Knowledge
| Tabelle | RLS | Beschreibung |
|---------|-----|--------------|
| `tasks` | ✅ | Aufgaben mit Priorität, Kategorie |
| `user_knowledge_profiles` | ✅ | Wissensprofil des Benutzers |
| `reminders` | ✅ | Geplante Erinnerungen |
| `user_goals` | ✅ | Benutzerziele |
| `user_routines` | ✅ | Tägliche Routinen |

### Contacts & Social
| Tabelle | RLS | Beschreibung |
|---------|-----|--------------|
| `contacts` | ✅ | Kontakte |
| `social_profiles` | ✅ | Social Media Profile |
| `social_activities` | ✅ | Social Media Aktivitäten |

### Notifications
| Tabelle | RLS | Beschreibung |
|---------|-----|--------------|
| `notifications` | ✅ | Benachrichtigungen |
| `notification_settings` | ✅ | Benachrichtigungseinstellungen |

### IQ & Analytics
| Tabelle | RLS | Beschreibung |
|---------|-----|--------------|
| `iq_profiles` | ✅ | IQ-Profile |
| `iq_test_results` | ✅ | IQ-Test Ergebnisse |

### Shopping & Price Alerts
| Tabelle | RLS | Beschreibung |
|---------|-----|--------------|
| `price_alerts` | ✅ | Preisalarme |
| `price_alert_notifications` | ✅ | Preisalarm-Benachrichtigungen |

### AI & Voice
| Tabelle | RLS | Beschreibung |
|---------|-----|--------------|
| `ai_conversations` | ✅ | AI Gesprächsverlauf |
| `voice_settings` | ✅ | Spracheinstellungen |
| `face_recognition_data` | ✅ | Gesichtserkennung |

### Security & System
| Tabelle | RLS | Beschreibung |
|---------|-----|--------------|
| `audit_log` | ✅ | Sicherheitsprotokoll |
| `email_verification_tokens` | ✅ | E-Mail-Verifizierung |
| `rate_limits` | ✅ | API Rate Limiting |
| `user_connections` | ✅ | Third-party Integrationen |
| `health_data` | ✅ | Gesundheitsdaten |
| `file_uploads` | ✅ | Datei-Uploads |

## RLS Policies
Alle Tabellen haben strikte user_id-basierte Policies:
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

## Indizes
Optimierte Indizes für:
- user_id Lookups (alle Tabellen)
- Zeitstempel-basierte Sortierung
- Status-Filterung
- Zusammengesetzte Abfragen

## Trigger
- `update_updated_at_column()` - Automatische Timestamp-Aktualisierung

## GDPR Compliance
- `delete_user_data(user_id)` - Vollständige Datenlöschung
- Audit-Logging für alle Löschungen
