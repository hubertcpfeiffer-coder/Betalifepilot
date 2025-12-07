import { IQQuestion } from '@/types/iqTests';

export const emotionalQuestions: IQQuestion[] = [
  {
    id: 'emo1',
    question: 'Dein Kollege wirkt gestresst. Was ist die beste Reaktion?',
    options: ['Ignorieren', 'Fragen ob alles okay ist', 'Ihm sagen er soll sich zusammenreißen', 'Über ihn lästern'],
    correctAnswer: 1,
    explanation: 'Empathie zeigen und nachfragen zeigt emotionale Intelligenz',
    difficulty: 'easy'
  },
  {
    id: 'emo2',
    question: 'Jemand kritisiert deine Arbeit unfair. Wie reagierst du am besten?',
    options: ['Sofort zurückschlagen', 'Ruhig nachfragen was genau gemeint ist', 'Weinen', 'Den Raum verlassen'],
    correctAnswer: 1,
    explanation: 'Sachlich bleiben und nachfragen hilft die Situation zu klären',
    difficulty: 'medium'
  },
  {
    id: 'emo3',
    question: 'Ein Freund hat einen Fehler gemacht und schämt sich. Was sagst du?',
    options: ['Das war wirklich dumm', 'Fehler passieren jedem', 'Ich hätte das besser gemacht', 'Erzähl niemandem davon'],
    correctAnswer: 1,
    explanation: 'Verständnis zeigen und normalisieren hilft dem Freund',
    difficulty: 'easy'
  },
  {
    id: 'emo4',
    question: 'Du merkst, dass du wütend wirst. Was ist der beste erste Schritt?',
    options: ['Schreien', 'Tief durchatmen', 'Jemanden beschuldigen', 'Weggehen ohne Erklärung'],
    correctAnswer: 1,
    explanation: 'Tief durchatmen hilft, die Emotionen zu regulieren',
    difficulty: 'easy'
  },
  {
    id: 'emo5',
    question: 'Dein Team hat ein Projekt erfolgreich abgeschlossen. Wie feierst du?',
    options: ['Nur meinen Anteil hervorheben', 'Das ganze Team loben', 'Nichts sagen', 'Sofort zum nächsten Projekt'],
    correctAnswer: 1,
    explanation: 'Teamleistung anzuerkennen stärkt die Zusammenarbeit',
    difficulty: 'easy'
  }
];
