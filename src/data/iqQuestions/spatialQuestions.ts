import { IQQuestion } from '@/types/iqTests';

export const spatialQuestions: IQQuestion[] = [
  {
    id: 'spat1',
    question: 'Wie viele Flächen hat ein Würfel?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    explanation: 'Ein Würfel hat 6 quadratische Flächen',
    difficulty: 'easy'
  },
  {
    id: 'spat2',
    question: 'Wenn man einen Würfel auffaltet, wie viele Quadrate sieht man?',
    options: ['4', '5', '6', '8'],
    correctAnswer: 2,
    explanation: 'Ein aufgefalteter Würfel zeigt alle 6 Flächen',
    difficulty: 'easy'
  },
  {
    id: 'spat3',
    question: 'Wie viele Ecken hat eine Pyramide mit quadratischer Grundfläche?',
    options: ['4', '5', '6', '8'],
    correctAnswer: 1,
    explanation: '4 Ecken an der Basis + 1 Spitze = 5 Ecken',
    difficulty: 'medium'
  },
  {
    id: 'spat4',
    question: 'Ein Spiegel zeigt ein "b". Was ist der Originalbuchstabe?',
    options: ['b', 'd', 'p', 'q'],
    correctAnswer: 1,
    explanation: 'Im Spiegel wird links zu rechts, also wird "d" zu "b"',
    difficulty: 'medium'
  },
  {
    id: 'spat5',
    question: 'Wie viele kleine Würfel braucht man für einen 3×3×3 Würfel?',
    options: ['9', '18', '27', '36'],
    correctAnswer: 2,
    explanation: '3 × 3 × 3 = 27 kleine Würfel',
    difficulty: 'easy'
  }
];
