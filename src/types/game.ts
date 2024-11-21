export type QuestionType = 'truth' | 'dare';
export type QuestionCategory = 'spicy' | 'funny' | 'deep' | 'social' | 'action' | 'creative';

export interface Question {
  content: string;
  type: QuestionType;
  category: QuestionCategory;
  isCustom?: boolean;
  targetPlayer?: string;
}