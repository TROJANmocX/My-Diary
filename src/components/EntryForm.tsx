import { useState, useRef, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { MoodSelector } from './MoodSelector';

interface EntryFormProps {
  onSave: (content: string, mood?: string, signature?: string) => void;
  onCancel: () => void;
  initialContent?: string;
  initialMood?: string;
  initialSignature?: string;
  isEditing?: boolean;
  userName?: string;
}

export function EntryForm({ onSave, onCancel, initialContent = '', initialMood = '', initialSignature = '', isEditing = false, userName = 'Diarist' }: EntryFormProps) {
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState(initialMood);
  const [signature, setSignature] = useState(initialSignature);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const finalSignature = signature || `— Yours, ${userName}`;
      onSave(content, mood, finalSignature);
      setContent('');
      setMood('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vintage-entry p-6 mb-8 rounded-lg">
      <h3 className="font-serif text-2xl text-amber-900 mb-4">
        {isEditing ? 'Edit Your Entry' : 'New Entry'}
      </h3>

      <MoodSelector onMoodSelect={setMood} selectedMood={mood} />

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Dear diary..."
        className="typewriter-text w-full bg-transparent border-none outline-none resize-none min-h-[200px] leading-loose"
        style={{ overflow: 'hidden' }}
      />

      <div className="mt-4 pt-4 border-t border-amber-200">
        <input
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder={`— Yours, ${userName}`}
          className="w-full text-right italic text-amber-800 bg-transparent border-none outline-none font-serif text-sm placeholder:text-amber-600"
        />
      </div>

      <div className="flex gap-3 mt-6 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors"
        >
          <X size={18} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={!content.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 text-amber-50 hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isEditing ? 'Update' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
}
