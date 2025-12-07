export type VoiceCommandAction = 
  | 'openContacts'
  | 'openKnowledge'
  | 'openSettings'
  | 'openAIAgent'
  | 'openIQTest'
  | 'openTasks'
  | 'startTour'
  | 'closeAll'
  | 'showHelp'
  | 'scrollUp'
  | 'scrollDown'
  | 'goHome'
  | 'openRoundTable'
  | 'openNotifications'
  | 'login'
  | 'unknown';


export interface VoiceCommand {
  patterns: string[];
  action: VoiceCommandAction;
  description: string;
  feedback: string;
}

export interface VoiceCommandResult {
  action: VoiceCommandAction;
  command: VoiceCommand | null;
  confidence: number;
  transcript: string;
}

export const VOICE_COMMANDS: VoiceCommand[] = [
  { patterns: ['öffne kontakte', 'kontakte öffnen', 'zeige kontakte', 'kontakte zeigen', 'meine kontakte'], action: 'openContacts', description: 'Kontakte öffnen', feedback: 'Öffne Kontakte...' },
  { patterns: ['zeige mein profil', 'mein profil', 'profil öffnen', 'öffne profil', 'mein wissen', 'wissen öffnen', 'öffne wissen'], action: 'openKnowledge', description: 'Mein Profil/Wissen anzeigen', feedback: 'Öffne dein Profil...' },
  { patterns: ['einstellungen', 'gehe zu einstellungen', 'einstellungen öffnen', 'öffne einstellungen', 'settings'], action: 'openSettings', description: 'Einstellungen öffnen', feedback: 'Öffne Einstellungen...' },
  { patterns: ['öffne mio', 'mio starten', 'starte mio', 'hey mio', 'hallo mio', 'mio öffnen', 'ki assistent'], action: 'openAIAgent', description: 'Mio KI-Assistent öffnen', feedback: 'Starte Mio...' },
  { patterns: ['starte iq test', 'iq test', 'begabungstest', 'intelligenztest', 'test starten', 'iq prüfung'], action: 'openIQTest', description: 'IQ-Test starten', feedback: 'Starte IQ-Test...' },
  { patterns: ['aufgaben', 'tasks', 'öffne aufgaben', 'meine aufgaben', 'todo', 'to do', 'aufgabenliste', 'zeige aufgaben'], action: 'openTasks', description: 'Aufgaben öffnen', feedback: 'Öffne Aufgaben...' },
  { patterns: ['tour starten', 'starte tour', 'führung starten', 'zeig mir alles', 'rundgang'], action: 'startTour', description: 'Geführte Tour starten', feedback: 'Starte die Tour...' },
  { patterns: ['schließen', 'zurück', 'beenden', 'abbrechen', 'close', 'exit'], action: 'closeAll', description: 'Aktuelles Panel schließen', feedback: 'Schließe...' },
  { patterns: ['hilfe', 'was kann ich sagen', 'befehle', 'kommandos', 'help'], action: 'showHelp', description: 'Verfügbare Befehle anzeigen', feedback: 'Zeige Hilfe...' },
  { patterns: ['nach oben', 'hoch scrollen', 'scroll up'], action: 'scrollUp', description: 'Nach oben scrollen', feedback: 'Scrolle nach oben...' },
  { patterns: ['nach unten', 'runter scrollen', 'scroll down'], action: 'scrollDown', description: 'Nach unten scrollen', feedback: 'Scrolle nach unten...' },
  { patterns: ['startseite', 'home', 'nach hause', 'hauptseite'], action: 'goHome', description: 'Zur Startseite', feedback: 'Gehe zur Startseite...' },
  { patterns: ['runder tisch', 'round table', 'berater', 'lebensberater'], action: 'openRoundTable', description: 'Runden Tisch öffnen', feedback: 'Öffne den Runden Tisch...' },
  { patterns: ['benachrichtigungen', 'notifications', 'zeige benachrichtigungen', 'öffne benachrichtigungen'], action: 'openNotifications', description: 'Benachrichtigungen öffnen', feedback: 'Öffne Benachrichtigungen...' },
  { patterns: ['anmelden', 'login', 'einloggen', 'registrieren', 'konto erstellen'], action: 'login', description: 'Anmelden/Registrieren', feedback: 'Öffne Anmeldung...' }
];

