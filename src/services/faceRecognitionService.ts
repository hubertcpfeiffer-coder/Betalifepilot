// R-15: Gesichtserkennung ist in der Beta deaktiviert.
// Die frühere Implementierung war ein Demo-Stub OHNE echten Gesichtsabgleich
// (compareFaceImages() lieferte immer true) und schrieb/las nicht existierende
// Spalten (`users.face_data` / `face_registered_at`) → 400-Fehler gegen das
// gehärtete Schema. Echte Biometrie ist ein separates, compliance-geprüftes
// Projekt (EU AI Act / DSGVO Art. 9, besondere Kategorien personenbezogener Daten).
//
// Bis dahin: sichere No-Op-Stubs ohne DB-Zugriff, mit klarer Nutzer-Meldung.

const DISABLED_MSG = 'Gesichtserkennung ist in der Beta noch nicht verfügbar.';

// Gesicht registrieren – deaktiviert (kein DB-Zugriff)
export async function registerFace(
  _userId: string,
  _faceData: string
): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: DISABLED_MSG };
}

// Gesicht verifizieren – deaktiviert (kein DB-Zugriff)
export async function verifyFace(
  _email: string,
  _faceData: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  return { success: false, error: DISABLED_MSG };
}

// Ist ein Gesicht registriert? – in der Beta immer false
export async function hasFaceRegistered(_userId: string): Promise<boolean> {
  return false;
}
