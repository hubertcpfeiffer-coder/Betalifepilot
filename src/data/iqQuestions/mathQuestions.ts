import { IQQuestion } from '@/types/iqTests';

export const mathQuestions: IQQuestion[] = [
  {
    id: 'math1',
    question: 'Was ist 15% von 80?',
    options: ['10', '12', '14', '16'],
    correctAnswer: 1,
    explanation: '15% × 80 = 0.15 × 80 = 12',
    difficulty: 'easy'
  },
  {
    id: 'math2',
    question: 'Wenn x + 5 = 12, was ist x²?',
    options: ['25', '36', '49', '64'],
    correctAnswer: 2,
    explanation: 'x = 7, also x² = 49',
    difficulty: 'easy'
  },
  {
    id: 'math3',
    question: 'Ein Produkt kostet nach 20% Rabatt 64€. Was war der Originalpreis?',
    options: ['76€', '80€', '84€', '88€'],
    correctAnswer: 1,
    explanation: '64€ = 80% des Originals, also Original = 64 ÷ 0.8 = 80€',
    difficulty: 'medium'
  },
  {
    id: 'math4',
    question: 'Was ist √144 + √81?',
    options: ['21', '23', '25', '27'],
    correctAnswer: 0,
    explanation: '√144 = 12, √81 = 9, also 12 + 9 = 21',
    difficulty: 'medium'
  },
  {
    id: 'math5',
    question: 'Wie viele Primzahlen gibt es zwischen 10 und 20?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 2,
    explanation: 'Die Primzahlen sind: 11, 13, 17, 19 = 4 Stück',
    difficulty: 'medium'
  }
];
