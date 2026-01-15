import { Trash2, Edit3, Pin, PinOff } from 'lucide-react';
import { DiaryEntry as DiaryEntryType } from '../lib/supabase';

interface DiaryEntryProps {
  entry: DiaryEntryType;
  onDelete: (id: string) => void;
  onEdit: (entry: DiaryEntryType) => void;
  onPin?: (id: string, isPinned: boolean) => void;
}

const MOOD_EMOJI: Record<string, string> = {
  melancholy: '🖤',
  hopeful: '✨',
  unhinged: '⚡',
  romantic: '🌙',
  peaceful: '🕊️',
  nostalgic: '🍂',
};

export function DiaryEntry({ entry, onDelete, onEdit, onPin }: DiaryEntryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="vintage-entry mb-8 p-6 rounded-lg transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <time className="text-amber-700 font-serif italic text-sm">
            {formatDate(entry.created_at)}
          </time>
          {entry.mood && (
            <span className="text-2xl" title={entry.mood}>
              {MOOD_EMOJI[entry.mood] || '◆'}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {onPin && (
            <button
              onClick={() => onPin(entry.id, !entry.is_pinned)}
              className="text-amber-600 hover:text-amber-800 transition-colors p-1"
              aria-label={entry.is_pinned ? 'Unpin entry' : 'Pin entry'}
            >
              {entry.is_pinned ? <Pin size={18} /> : <PinOff size={18} />}
            </button>
          )}
          <button
            onClick={() => onEdit(entry)}
            className="text-amber-600 hover:text-amber-800 transition-colors p-1"
            aria-label="Edit entry"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-amber-600 hover:text-red-700 transition-colors p-1"
            aria-label="Delete entry"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="typewriter-text whitespace-pre-wrap leading-relaxed mb-4">
        {entry.content}
      </div>
      {entry.signature && (
        <div className="text-right italic text-amber-700 text-sm font-serif mt-4 pt-4 border-t border-amber-200">
          {entry.signature}
        </div>
      )}
    </div>
  );
}
