import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerProfile } from '../types/game';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: PlayerProfile) => void;
  player: string;
}

interface ProfileField {
  key: keyof PlayerProfile;
  label: string;
  placeholder: string;
  prompts: string[];
  icon: JSX.Element;
  gradient: string;
}

const PROFILE_FIELDS: ProfileField[] = [
  {
    key: 'secrets',
    label: 'Secrets',
    placeholder: 'Share a secret...',
    prompts: [
      "What's something you've never told anyone?",
      "What's your guilty pleasure?",
      "What's the most mischievous thing you've done?"
    ],
    icon: <span className="text-xl">🤫</span>,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    key: 'fears',
    label: 'Fears',
    placeholder: 'Share a fear...',
    prompts: [
      "What's your biggest irrational fear?",
      "What situation makes you most uncomfortable?",
      "What's something you avoid at all costs?"
    ],
    icon: <span className="text-xl">😱</span>,
    gradient: 'from-red-500 to-orange-500'
  },
  {
    key: 'funnyStories',
    label: 'Funny Stories',
    placeholder: 'Share a funny story...',
    prompts: [
      "What's your most embarrassing moment?",
      "What's the funniest thing that happened to you?",
      "What's your best 'fail' story?"
    ],
    icon: <span className="text-xl">😂</span>,
    gradient: 'from-yellow-500 to-green-500'
  },
  {
    key: 'crushes',
    label: 'Crushes',
    placeholder: 'Share a crush...',
    prompts: [
      "Who was your first crush?",
      "Who's your celebrity crush?",
      "Who's someone you secretly admire?"
    ],
    icon: <span className="text-xl">😍</span>,
    gradient: 'from-pink-500 to-red-500'
  },
  {
    key: 'dreams',
    label: 'Dreams & Aspirations',
    placeholder: 'Share a dream...',
    prompts: [
      "What's your biggest life goal?",
      "What's your dream job?",
      "Where do you see yourself in 10 years?"
    ],
    icon: <span className="text-xl">✨</span>,
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    key: 'randomFacts',
    label: 'Random Facts',
    placeholder: 'Share a random fact...',
    prompts: [
      "What's something unique about you?",
      "What's a hidden talent you have?",
      "What's the most interesting thing about you?"
    ],
    icon: <span className="text-xl">🎲</span>,
    gradient: 'from-green-500 to-teal-500'
  },
  {
    key: 'interests',
    label: 'Interests & Hobbies',
    placeholder: 'Share an interest...',
    prompts: [
      "What's your favorite hobby?",
      "What activity makes you lose track of time?",
      "What's something you're passionate about?"
    ],
    icon: <span className="text-xl">🎯</span>,
    gradient: 'from-blue-500 to-green-500'
  },
  {
    key: 'achievements',
    label: 'Achievements',
    placeholder: 'Share an achievement...',
    prompts: [
      "What's your proudest accomplishment?",
      "What's a personal milestone you've reached?",
      "What's something you worked hard to achieve?"
    ],
    icon: <span className="text-xl">🏆</span>,
    gradient: 'from-yellow-500 to-orange-500'
  }
];

export default function PlayerProfileModal({ isOpen, onClose, onSave, player }: PlayerProfileModalProps) {
  const [profile, setProfile] = useState<PlayerProfile>({ name: player });
  const [activeField, setActiveField] = useState<keyof PlayerProfile | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [showPrompts, setShowPrompts] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleAddItem = (field: keyof PlayerProfile) => {
    if (inputValues[field]?.trim()) {
      setProfile(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), inputValues[field].trim()]
      }));
      setInputValues(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: keyof PlayerProfile) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem(field);
    }
  };

  const handleRemoveItem = (field: keyof PlayerProfile, index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    Object.entries(inputValues).forEach(([field, value]) => {
      if (value.trim()) {
        setProfile(prev => ({
          ...prev,
          [field]: [...(prev[field] || []), value.trim()]
        }));
      }
    });
    onSave(profile);
    onClose();
  };

  const togglePrompts = (field: keyof PlayerProfile) => {
    setShowPrompts(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl relative my-8 shadow-xl border border-gray-800"
      >
        <motion.button
          whileHover={{ rotate: 90 }}
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>
        
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {player}'s Profile
            </h2>
            <p className="text-white/60">Share some fun facts to generate personalized questions!</p>
          </div>
        </div>
        
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
          {PROFILE_FIELDS.map(field => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {field.icon}
                  <h3 className="text-lg font-semibold text-white">{field.label}</h3>
                </div>
                <button
                  onClick={() => togglePrompts(field.key)}
                  className={`text-sm bg-gradient-to-r ${field.gradient} px-3 py-1 rounded-full text-white hover:opacity-90 transition-opacity`}
                >
                  {showPrompts[field.key] ? 'Hide prompts' : 'Show prompts'}
                </button>
              </div>

              <AnimatePresence>
                {showPrompts[field.key] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {field.prompts.map((prompt, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`text-sm text-white/70 bg-gradient-to-r ${field.gradient} bg-opacity-10 p-2 rounded`}
                        >
                          {prompt}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={inputValues[field.key] || ''}
                  onChange={(e) => setInputValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, field.key)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddItem(field.key)}
                  className={`p-2 rounded-lg bg-gradient-to-r ${field.gradient} text-white`}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>

              <AnimatePresence>
                <div className="space-y-2">
                  {profile[field.key]?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex items-center justify-between p-2 rounded-lg bg-gradient-to-r ${field.gradient} bg-opacity-10 border border-gray-800`}
                    >
                      <span className="text-white">{item}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveItem(field.key, index)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-white/70" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all shadow-lg"
          >
            Save Profile
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}