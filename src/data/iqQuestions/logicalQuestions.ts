import { IQQuestion } from '@/types/iqTests';

export const logicalQuestions: IQQuestion[] = [
  {
    id: 'log1',
    question: 'Welche Zahl folgt: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '36'],
    correctAnswer: 1,
    explanation: 'Die Differenzen sind 4, 6, 8, 10, 12. Also 30 + 12 = 42',
    difficulty: 'medium'
  },
  {
    id: 'log2',
    question: 'Wenn alle Blumen Pflanzen sind und einige Pflanzen Bäume sind, dann...',
    options: ['Alle Blumen sind Bäume', 'Einige Blumen könnten Bäume sein', 'Keine Blume ist ein Baum', 'Alle Bäume sind Blumen'],
    correctAnswer: 2,
    explanation: 'Blumen und Bäume sind verschiedene Kategorien von Pflanzen',
    difficulty: 'medium'
  },
  {
    id: 'log3',
    question: 'A ist größer als B, B ist größer als C. Welche Aussage ist wahr?',
    options: ['C ist größer als A', 'A ist größer als C', 'B ist am größten', 'C ist am größten'],
    correctAnswer: 1,
    explanation: 'Wenn A > B und B > C, dann ist A > C',
    difficulty: 'easy'
  },
  {
    id: 'log4',
    question: 'Welches Muster fehlt: ○●○○ | ●○●● | ○●○○ | ?',
    options: ['○●○●', '●○●●', '●●○○', '○○●●'],
    correctAnswer: 1,
    explanation: 'Das Muster wiederholt sich alle 2 Zeilen',
    difficulty: 'hard'
  },
  {
    id: 'log5',
    question: 'Ein Zug fährt um 8:00 ab und kommt um 11:30 an. Wie lange dauert die Fahrt?',
    options: ['2,5 Stunden', '3 Stunden', '3,5 Stunden', '4 Stunden'],
    correctAnswer: 2,
    explanation: '11:30 - 8:00 = 3 Stunden 30 Minuten = 3,5 Stunden',
    difficulty: 'easy'
  }
];
