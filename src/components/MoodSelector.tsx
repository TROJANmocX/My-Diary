import { Sparkles } from 'lucide-react';

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood?: string;
}

const MOODS = [
  { id: 'melancholy', label: 'Melancholy', emoji: '🖤' },
  { id: 'hopeful', label: 'Hopeful', emoji: '✨' },
  { id: 'unhinged', label: 'Unhinged', emoji: '⚡' },
  { id: 'romantic', label: 'Romantic but Tired', emoji: '🌙' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🕊️' },
  { id: 'nostalgic', label: 'Nostalgic', emoji: '🍂' },
];

export function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-amber-900 font-serif text-lg mb-3">
        <Sparkles size={20} className="inline mr-2" />
        How are you feeling today?
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            className={`p-3 rounded-lg transition-all text-center transform hover:scale-110 ${
              selectedMood === mood.id
                ? 'vintage-entry ring-2 ring-amber-700 shadow-lg'
                : 'vintage-entry hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <div className="text-xs font-serif text-amber-900">{mood.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
