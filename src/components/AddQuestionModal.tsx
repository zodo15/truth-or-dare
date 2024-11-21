import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Question, QuestionType, QuestionCategory } from '../types/game';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (question: Question) => void;
}

export default function AddQuestionModal({ isOpen, onClose, onAdd }: AddQuestionModalProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<QuestionType>('truth');
  const [category, setCategory] = useState<QuestionCategory>('funny');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd({
        content: content.trim(),
        type,
        category,
        isCustom: true
      });
      setContent('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Add Custom Question</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as QuestionType)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="truth">Truth</option>
              <option value="dare">Dare</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as QuestionCategory)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              {type === 'truth' ? (
                <>
                  <option value="spicy">Spicy</option>
                  <option value="funny">Funny</option>
                  <option value="deep">Deep</option>
                </>
              ) : (
                <>
                  <option value="social">Social</option>
                  <option value="action">Action</option>
                  <option value="creative">Creative</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Question
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-24 resize-none"
              placeholder="Enter your question..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all"
          >
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
}