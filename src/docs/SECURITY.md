# Mio Lifepilot - Sicherheitsdokumentation

## Row Level Security (RLS)

### Aktivierte Tabellen
Alle Tabellen haben RLS aktiviert mit user_id-basierten Policies:

```sql
-- Standard Policy Pattern
CREATE POLICY "Users can view own data" ON table_name
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON table_name
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON table_name
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON table_name
    FOR DELETE USING (auth.uid() = user_id);
```

## API Rate Limiting

### Edge Functions
Alle Edge Functions implementieren In-Memory Rate Limiting:
- **Limit**: 15-20 Requests pro Minute
- **Window**: 60 Sekunden
- **Response**: HTTP 429 bei Überschreitung

```typescript
const RATE_LIMIT = 20;
const RATE_WINDOW = 60000; // 1 minute
```

## CORS Konfiguration

Alle Edge Functions verwenden standardisierte CORS Headers:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
```

## Passwort-Sicherheit

- Bcrypt Hashing mit Salt
- Minimum 8 Zeichen
- Client-seitige Validierung
- Sichere Session Tokens

## GDPR Compliance

### Datenexport
- Vollständiger JSON-Export aller Benutzerdaten
- Strukturiertes Format mit Metadaten

### Datenlöschung
- Kaskadierte Löschung aller Benutzerdaten
- Audit-Logging für Compliance
- Reihenfolge respektiert Foreign Keys

## Error Tracking

### Sentry Integration (Production)
- Automatische Error-Erfassung
- Stack Traces
- User Context
- Performance Monitoring

## Audit Logging

Alle sicherheitsrelevanten Aktionen werden protokolliert:
- Login/Logout
- Passwortänderungen
- Kontolöschungen
- Datenexporte
- Neue Geräte-Logins
