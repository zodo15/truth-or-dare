import { useState, useCallback } from 'react';
import { gameContent } from '../data/gameContent';
import { Question, QuestionType, QuestionCategory } from '../types/game';

export function useGameQuestions() {
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  const addCustomQuestion = useCallback((question: Question) => {
    setCustomQuestions(prev => [...prev, question]);
  }, []);

  const getRandomQuestion = useCallback((type: QuestionType, category: QuestionCategory, currentPlayer: string): Question => {
    const defaultQuestions = gameContent[type][category].map(content => ({
      content,
      type,
      category,
      isCustom: false
    }));
    
    const categoryQuestions = [
      ...defaultQuestions,
      ...customQuestions.filter(q => 
        q.type === type && 
        q.category === category && 
        (!q.targetPlayer || q.targetPlayer === currentPlayer)
      )
    ];
    
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    return categoryQuestions[randomIndex];
  }, [customQuestions]);

  return {
    customQuestions,
    addCustomQuestion,
    getRandomQuestion
  };
}