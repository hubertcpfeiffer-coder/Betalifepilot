import { logicalQuestions } from './logicalQuestions';
import { verbalQuestions } from './verbalQuestions';
import { mathQuestions } from './mathQuestions';
import { spatialQuestions } from './spatialQuestions';
import { emotionalQuestions } from './emotionalQuestions';
import { IQQuestion } from '@/types/iqTests';

export const allQuestions: Record<string, IQQuestion[]> = {
  logical: logicalQuestions,
  verbal: verbalQuestions,
  math: mathQuestions,
  spatial: spatialQuestions,
  emotional: emotionalQuestions,
  creativity: [
    { id: 'cre1', question: 'Wie viele Verwendungen fallen dir für eine Büroklammer ein?', options: ['1-3', '4-6', '7-10', '10+'], correctAnswer: 3, difficulty: 'medium', explanation: 'Kreative Menschen finden viele ungewöhnliche Verwendungen' },
    { id: 'cre2', question: 'Was verbindet Wolke, Schaf und Watte?', options: ['Farbe Weiß', 'Weichheit', 'Flauschigkeit', 'Alle genannten'], correctAnswer: 3, difficulty: 'easy', explanation: 'Alle drei sind weiß, weich und flauschig' },
    { id: 'cre3', question: 'Welches Wort passt: Sonne, Mond, Stern, Lampe?', options: ['Dunkelheit', 'Licht', 'Himmel', 'Nacht'], correctAnswer: 1, difficulty: 'easy', explanation: 'Alle geben Licht' },
    { id: 'cre4', question: 'Ein leeres Blatt Papier ist...', options: ['Nutzlos', 'Voller Möglichkeiten', 'Langweilig', 'Nur zum Schreiben'], correctAnswer: 1, difficulty: 'easy', explanation: 'Kreatives Denken sieht Potenzial' },
    { id: 'cre5', question: 'Was würdest du mit einem unsichtbaren Stuhl machen?', options: ['Wegwerfen', 'Als Kunstwerk ausstellen', 'Ignorieren', 'Verkaufen'], correctAnswer: 1, difficulty: 'medium', explanation: 'Kreative Lösungen finden ungewöhnliche Werte' }
  ],
  memory: [
    { id: 'mem1', question: 'Merke dir: 7, 3, 9, 1, 5. Was war die dritte Zahl?', options: ['7', '3', '9', '1'], correctAnswer: 2, difficulty: 'easy', explanation: 'Die Reihenfolge war 7, 3, 9, 1, 5' },
    { id: 'mem2', question: 'Welcher Wochentag war vor 3 Tagen, wenn heute Freitag ist?', options: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag'], correctAnswer: 1, difficulty: 'easy', explanation: 'Freitag - 3 = Dienstag' },
    { id: 'mem3', question: 'BLAU, ROT, GRÜN, GELB - welche Farbe kam zuerst?', options: ['ROT', 'BLAU', 'GRÜN', 'GELB'], correctAnswer: 1, difficulty: 'easy', explanation: 'BLAU war die erste Farbe' },
    { id: 'mem4', question: 'Wie viele Monate haben 28 Tage?', options: ['1', '6', '12', 'Alle'], correctAnswer: 3, difficulty: 'medium', explanation: 'Alle Monate haben mindestens 28 Tage' },
    { id: 'mem5', question: 'Merke: Apfel, Tisch, Hund, Buch, Sonne. Was kam nach Tisch?', options: ['Apfel', 'Hund', 'Buch', 'Sonne'], correctAnswer: 1, difficulty: 'easy', explanation: 'Die Reihenfolge war Apfel, Tisch, Hund, Buch, Sonne' }
  ],
  knowledge: [
    { id: 'know1', question: 'Welches ist das größte Organ des menschlichen Körpers?', options: ['Herz', 'Leber', 'Haut', 'Gehirn'], correctAnswer: 2, difficulty: 'easy', explanation: 'Die Haut ist das größte Organ' },
    { id: 'know2', question: 'In welchem Jahr fiel die Berliner Mauer?', options: ['1987', '1989', '1991', '1993'], correctAnswer: 1, difficulty: 'easy', explanation: 'Die Mauer fiel am 9. November 1989' },
    { id: 'know3', question: 'Was ist die Hauptstadt von Australien?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correctAnswer: 2, difficulty: 'medium', explanation: 'Canberra ist die Hauptstadt Australiens' },
    { id: 'know4', question: 'Wer malte die Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correctAnswer: 1, difficulty: 'easy', explanation: 'Leonardo da Vinci malte die Mona Lisa' },
    { id: 'know5', question: 'Welches Element hat das chemische Symbol "Au"?', options: ['Silber', 'Kupfer', 'Gold', 'Aluminium'], correctAnswer: 2, difficulty: 'medium', explanation: 'Au steht für Gold (Aurum)' }
  ]
};

export const getRandomQuestions = (category: string, count: number = 5): IQQuestion[] => {
  const questions = allQuestions[category] || [];
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
