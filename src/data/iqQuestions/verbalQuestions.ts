import { IQQuestion } from '@/types/iqTests';

export const verbalQuestions: IQQuestion[] = [
  {
    id: 'verb1',
    question: 'Welches Wort passt nicht: Apfel, Birne, Karotte, Traube?',
    options: ['Apfel', 'Birne', 'Karotte', 'Traube'],
    correctAnswer: 2,
    explanation: 'Karotte ist ein Gemüse, die anderen sind Früchte',
    difficulty: 'easy'
  },
  {
    id: 'verb2',
    question: 'Buch verhält sich zu Lesen wie Gabel zu...',
    options: ['Küche', 'Essen', 'Metall', 'Tisch'],
    correctAnswer: 1,
    explanation: 'Ein Buch wird zum Lesen benutzt, eine Gabel zum Essen',
    difficulty: 'easy'
  },
  {
    id: 'verb3',
    question: 'Was ist das Gegenteil von "ephemer"?',
    options: ['Flüchtig', 'Dauerhaft', 'Schnell', 'Unsichtbar'],
    correctAnswer: 1,
    explanation: 'Ephemer bedeutet kurzlebig, das Gegenteil ist dauerhaft',
    difficulty: 'hard'
  },
  {
    id: 'verb4',
    question: 'Welches Wort bedeutet "Zustimmung"?',
    options: ['Dissens', 'Konsens', 'Nonsens', 'Absenz'],
    correctAnswer: 1,
    explanation: 'Konsens bedeutet Übereinstimmung/Zustimmung',
    difficulty: 'medium'
  },
  {
    id: 'verb5',
    question: 'Arzt : Patient :: Lehrer : ?',
    options: ['Schule', 'Buch', 'Schüler', 'Wissen'],
    correctAnswer: 2,
    explanation: 'Ein Arzt behandelt Patienten, ein Lehrer unterrichtet Schüler',
    difficulty: 'easy'
  }
];
