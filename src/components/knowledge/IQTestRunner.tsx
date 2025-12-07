import React, { useState, useEffect } from 'react';
import { X, ChevronRight, CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react';
import { IQQuestion, IQ_CATEGORIES } from '@/types/iqTests';
import { getRandomQuestions } from '@/data/iqQuestions';

interface Props {
  categoryId: string;
  onComplete: (score: number, total: number, correct: number) => void;
  onClose: () => void;
}

const IQTestRunner: React.FC<Props> = ({ categoryId, onComplete, onClose }) => {
  const [questions, setQuestions] = useState<IQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);

  const category = IQ_CATEGORIES.find(c => c.id === categoryId);

  useEffect(() => {
    const qs = getRandomQuestions(categoryId, 5);
    setQuestions(qs);
  }, [categoryId]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === currentQuestion.correctAnswer) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
      const finalCorrect = selectedAnswer === currentQuestion.correctAnswer ? correctCount : correctCount;
      onComplete(Math.round((correctCount / questions.length) * 100), questions.length, correctCount);
    }
  };

  if (!currentQuestion) return null;

  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br ${category?.color}`}>
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mt-4">Test abgeschlossen!</h2>
          <p className="text-gray-600 mt-2">{category?.name}</p>
          <div className="text-5xl font-bold mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            {percentage}%
          </div>
          <p className="text-gray-500 mt-2">{correctCount} von {questions.length} richtig</p>
          <button onClick={onClose} className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700">
            Fertig
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className={`p-4 bg-gradient-to-r ${category?.color} text-white flex items-center justify-between`}>
          <div>
            <h3 className="font-bold">{category?.name}</h3>
            <p className="text-sm text-white/80">Frage {currentIndex + 1} von {questions.length}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="h-1 bg-gray-200"><div className="h-full bg-cyan-500 transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div>
        <div className="p-6">
          <h4 className="text-xl font-semibold mb-6">{currentQuestion.question}</h4>
          <div className="space-y-3">
            {currentQuestion.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(i)} disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                  showResult ? i === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : i === selectedAnswer ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  : selectedAnswer === i ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-cyan-300'
                }`}>
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {showResult && i === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {showResult && i === selectedAnswer && i !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            ))}
          </div>
          {showResult && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-blue-700 text-sm">{currentQuestion.explanation}</div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
          <button onClick={handleNext} disabled={!showResult}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2">
            {currentIndex < questions.length - 1 ? 'Weiter' : 'Ergebnis'}<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IQTestRunner;
