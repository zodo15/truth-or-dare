import React, { useState } from 'react';
import { Sparkles, Zap, Brain, Users, Dumbbell, Palette, RefreshCw, Plus } from 'lucide-react';
import { gameContent } from '../data/gameContent';
import { useGameQuestions } from '../hooks/useGameQuestions';
import AddQuestionModal from './AddQuestionModal';
import { Question, QuestionType, QuestionCategory } from '../types/game';

interface GameBoardProps {
  players: string[];
  onReset: () => void;
}

export default function GameBoard({ players, onReset }: GameBoardProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [showCustomQuestions, setShowCustomQuestions] = useState(false);
  const { getRandomQuestion, addCustomQuestion, customQuestions } = useGameQuestions();

  const currentPlayer = players[currentPlayerIndex];
  const playerCustomQuestions = customQuestions.filter(q => q.targetPlayer === currentPlayer);

  const selectType = (type: QuestionType) => {
    setSelectedType(type);
    setSelectedCategory(null);
    setCurrentQuestion(null);
    setShowCustomQuestions(false);
  };

  const selectCategory = (category: QuestionCategory) => {
    setSelectedCategory(category);
    const question = getRandomQuestion(selectedType!, category, currentPlayer);
    setCurrentQuestion(question);
  };

  const refreshQuestion = () => {
    if (selectedType && selectedCategory) {
      const newQuestion = getRandomQuestion(selectedType, selectedCategory, currentPlayer);
      setCurrentQuestion(newQuestion);
    }
  };

  const nextTurn = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    setSelectedType(null);
    setSelectedCategory(null);
    setCurrentQuestion(null);
    setShowCustomQuestions(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spicy': return <Zap className="w-6 h-6" />;
      case 'funny': return <Sparkles className="w-6 h-6" />;
      case 'deep': return <Brain className="w-6 h-6" />;
      case 'social': return <Users className="w-6 h-6" />;
      case 'action': return <Dumbbell className="w-6 h-6" />;
      case 'creative': return <Palette className="w-6 h-6" />;
      default: return null;
    }
  };

  const getQuestionWithContext = (question: Question) => {
    if (question.context) {
      return (
        <div className="space-y-2">
          <p className="text-xl text-white">{question.content}</p>
          <span className="text-sm text-white/60">
            Based on your {question.context}
          </span>
        </div>
      );
    }
    return <p className="text-xl text-white">{question.content}</p>;
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsQuestionModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 text-white"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
          {playerCustomQuestions.length > 0 && (
            <button
              onClick={() => setShowCustomQuestions(!showCustomQuestions)}
              className="px-4 py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/40 transition-colors text-white"
            >
              {showCustomQuestions ? 'Hide' : 'Show'} Custom Questions
            </button>
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">
          {currentPlayer}'s Turn
        </h2>
        <div className="text-white/60">
          Player {currentPlayerIndex + 1} of {players.length}
        </div>
      </div>

      {showCustomQuestions && playerCustomQuestions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Custom Questions</h3>
          <div className="grid gap-4">
            {playerCustomQuestions.map((q, i) => (
              <div key={i} className="p-4 rounded-lg bg-white/10 text-white text-left">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(q.category)}
                  <span className="capitalize text-sm text-white/70">{q.category}</span>
                </div>
                <p>{q.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedType && !showCustomQuestions && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => selectType('truth')}
            className="p-6 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Truth</h3>
            <p className="text-white/70">Answer honestly...</p>
          </button>
          <button
            onClick={() => selectType('dare')}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Dare</h3>
            <p className="text-white/70">Accept the challenge!</p>
          </button>
        </div>
      )}

      {selectedType && !selectedCategory && !showCustomQuestions && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {Object.keys(gameContent[selectedType]).map((category) => (
            <button
              key={category}
              onClick={() => selectCategory(category as QuestionCategory)}
              className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-center mb-2 text-white">
                {getCategoryIcon(category)}
              </div>
              <h3 className="text-lg font-semibold text-white capitalize">
                {category}
              </h3>
            </button>
          ))}
        </div>
      )}

      {currentQuestion && !showCustomQuestions && (
        <div className="mb-8">
          <div className="p-6 rounded-xl bg-white/10 mb-4 relative group">
            <button
              onClick={refreshQuestion}
              className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Get another question"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
            {getQuestionWithContext(currentQuestion)}
            {currentQuestion.isCustom && (
              <span className="absolute left-4 top-4 text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                Custom
              </span>
            )}
          </div>
          <button
            onClick={nextTurn}
            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
          >
            Next Turn
          </button>
        </div>
      )}

      <button
        onClick={onReset}
        className="px-4 py-2 text-white/60 hover:text-white transition-colors"
      >
        End Game
      </button>

      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onAdd={addCustomQuestion}
      />
    </div>
  );
}