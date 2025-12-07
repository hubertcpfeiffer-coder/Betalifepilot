export interface TourStep {
  id: string;
  title: string;
  description: string;
  speechText: string;
  highlight?: string;
  action?: 'openKnowledge' | 'openContacts' | 'openSettings' | 'openAI' | 'scrollToArchitecture' | 'scrollToCoaches';
  pointDirection?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  avatarPosition: { x: number; y: number };
  modulePosition?: 'left' | 'right' | 'center';
}

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Willkommen bei Mio!',
    description: 'Ich bin deine persönliche KI-Assistentin.',
    speechText: 'Hallo und herzlich willkommen! Ich bin Mio, deine persönliche KI-Assistentin. Ich freue mich, dich kennenzulernen! Komm, ich zeige dir, was ich alles für dich tun kann.',
    duration: 6000,
    avatarPosition: { x: 50, y: 45 },
    modulePosition: 'center',
  },
  {
    id: 'round-table',
    title: 'Der Runde Tisch',
    description: '5 KI-Experten beraten gemeinsam.',
    speechText: 'Schau mal hier! Das ist unser Runder Tisch. Bei wichtigen Entscheidungen arbeiten fünf KI-Experten zusammen: Karriere, Gesundheit, Finanzen, Beziehungen und Kreativität. Gemeinsam finden wir die beste Lösung für dich!',
    action: 'scrollToArchitecture',
    duration: 9000,
    avatarPosition: { x: 75, y: 40 },
    modulePosition: 'left',
  },
  {
    id: 'knowledge',
    title: 'Mios Wissen über dich',
    description: 'Dein persönliches Profil mit IQ-Tests.',
    speechText: 'Hier speichere ich alles über dich. Deine Ziele, Interessen, und auch IQ-Tests zur Begabungsanalyse. Je mehr ich über dich weiß, desto besser kann ich dir helfen. Alles bleibt natürlich streng vertraulich!',
    action: 'openKnowledge',
    duration: 8000,
    avatarPosition: { x: 25, y: 35 },
    modulePosition: 'right',
  },
  {
    id: 'contacts',
    title: 'Deine Kontakte',
    description: 'Beziehungen pflegen leicht gemacht.',
    speechText: 'Deine Beziehungen sind mir wichtig! Ich erinnere dich an Geburtstage, schlage vor, wann du dich wieder melden solltest, und halte alle wichtigen Informationen zu deinen Kontakten bereit.',
    action: 'openContacts',
    duration: 7000,
    avatarPosition: { x: 75, y: 55 },
    modulePosition: 'left',
  },
  {
    id: 'coaches',
    title: 'Deine Life Coaches',
    description: 'Spezialisierte KI-Coaches für dich.',
    speechText: 'Und hier sind deine persönlichen Life Coaches! Du hast Zugang zu spezialisierten KI-Coaches für Karriere, Gesundheit, Finanzen und persönliche Entwicklung. Sie unterstützen dich mit maßgeschneiderten Ratschlägen.',
    action: 'scrollToCoaches',
    duration: 8000,
    avatarPosition: { x: 25, y: 60 },
    modulePosition: 'right',
  },
  {
    id: 'ready',
    title: 'Bereit loszulegen!',
    description: 'Ich bin rund um die Uhr für dich da.',
    speechText: 'Super! Jetzt kennst du alle wichtigen Funktionen. Ich bin rund um die Uhr für dich da. Stell mir einfach eine Frage oder sag mir, wobei ich dir helfen soll. Lass uns gemeinsam dein Leben optimieren!',
    action: 'openAI',
    duration: 7000,
    avatarPosition: { x: 50, y: 45 },
    modulePosition: 'center',
  },
];
