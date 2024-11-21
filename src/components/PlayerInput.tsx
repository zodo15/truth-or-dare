import React, { useState, useCallback } from 'react';
import { PlusCircle, X } from 'lucide-react';

interface PlayerInputProps {
  players: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function PlayerInput({ players, setPlayers }: PlayerInputProps) {
  const [newPlayer, setNewPlayer] = useState('');

  const addPlayer = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.trim() && players.length < 10) {
      setPlayers(prev => [...prev, newPlayer.trim()]);
      setNewPlayer('');
    }
  }, [newPlayer, players.length, setPlayers]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  }, []);

  const removePlayer = useCallback((index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  }, [players, setPlayers]);

  return (
    <div className="w-full max-w-md">
      <form onSubmit={addPlayer} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter player name"
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          maxLength={20}
        />
        <button
          type="submit"
          disabled={players.length >= 10}
          className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </form>

      <div className="space-y-2">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 group"
          >
            <span className="text-white">{player}</span>
            <button
              onClick={() => removePlayer(index)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}