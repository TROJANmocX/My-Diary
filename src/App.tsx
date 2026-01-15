import { useEffect, useState } from 'react';
import { BookOpen, PenLine, Settings as SettingsIcon, BookMarked } from 'lucide-react';
import { supabase, DiaryEntry as DiaryEntryType, UserSettings } from './lib/supabase';
import { DiaryEntry } from './components/DiaryEntry';
import { EntryForm } from './components/EntryForm';
import { Settings } from './components/Settings';
import { SearchBar } from './components/SearchBar';
import { MemoryDrawer } from './components/MemoryDrawer';
import { AmbientSounds } from './components/AmbientSounds';

function App() {
  const [entries, setEntries] = useState<DiaryEntryType[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntryType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showMemoryDrawer, setShowMemoryDrawer] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [theme, setTheme] = useState('vintage');

  useEffect(() => {
    loadEntries();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .maybeSingle();

      if (data) {
        setUserSettings(data);
        setTheme(data.theme);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string, moodFilter: string, dateFilter: string) => {
    let results = entries;

    if (query) {
      results = results.filter((entry) =>
        entry.content.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (moodFilter) {
      results = results.filter((entry) => entry.mood === moodFilter);
    }

    if (dateFilter) {
      results = results.filter((entry) => {
        const entryDate = new Date(entry.created_at).toISOString().slice(0, 7);
        return entryDate === dateFilter;
      });
    }

    setFilteredEntries(results);
  };

  const handleClearSearch = () => {
    setFilteredEntries(entries);
  };

  const handleSaveNew = async (content: string, mood?: string, signature?: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .insert([{ content, mood, signature, is_pinned: false }]);

      if (error) throw error;
      await loadEntries();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleUpdate = async (content: string, mood?: string, signature?: string) => {
    if (!editingEntry) return;

    try {
      const { error } = await supabase
        .from('diary_entries')
        .update({ content, mood, signature, updated_at: new Date().toISOString() })
        .eq('id', editingEntry.id);

      if (error) throw error;
      await loadEntries();
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handlePin = async (id: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .update({ is_pinned: isPinned })
        .eq('id', id);

      if (error) throw error;
      await loadEntries();
    } catch (error) {
      console.error('Error pinning entry:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const pinnedEntries = entries.filter((entry) => entry.is_pinned);

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'candle' ? 'candle-bg' : 'vintage-bg'}`}>
      <div className="book-spine" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen size={48} className="text-amber-800" />
          </div>
          <h1 className="font-serif text-5xl text-amber-900 mb-2">My Diary</h1>
          <p className="text-amber-700 italic">A place for your thoughts and memories</p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setShowMemoryDrawer(!showMemoryDrawer)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors font-serif font-semibold"
              title={`${pinnedEntries.length} pinned memories`}
            >
              <BookMarked size={20} />
              {pinnedEntries.length}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </header>

        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

        {!showForm && !editingEntry && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full vintage-entry p-6 mb-8 rounded-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all group"
          >
            <PenLine size={24} className="text-amber-700 group-hover:text-amber-900 transition-colors" />
            <span className="font-serif text-xl text-amber-800 group-hover:text-amber-900 transition-colors">
              Write a new entry
            </span>
          </button>
        )}

        {showForm && (
          <EntryForm
            onSave={handleSaveNew}
            onCancel={() => setShowForm(false)}
            userName={userSettings?.user_name || 'Diarist'}
          />
        )}

        {editingEntry && (
          <EntryForm
            onSave={handleUpdate}
            onCancel={() => setEditingEntry(null)}
            initialContent={editingEntry.content}
            initialMood={editingEntry.mood}
            initialSignature={editingEntry.signature}
            isEditing
            userName={userSettings?.user_name || 'Diarist'}
          />
        )}

        {loading ? (
          <div className="text-center text-amber-700 py-12">
            <p className="font-serif text-xl">Loading your memories...</p>
          </div>
        ) : filteredEntries.length === 0 && entries.length === 0 ? (
          <div className="vintage-entry p-12 rounded-lg text-center">
            <BookOpen size={64} className="text-amber-400 mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-amber-900 mb-2">
              Your diary is empty
            </h2>
            <p className="text-amber-700 italic">
              Start writing your first entry to capture your thoughts and memories
            </p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="vintage-entry p-12 rounded-lg text-center">
            <p className="text-amber-700 italic font-serif">No entries match your search</p>
          </div>
        ) : (
          <div className="entries-list">
            {filteredEntries.map((entry) => (
              <DiaryEntry
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
                onEdit={setEditingEntry}
                onPin={handlePin}
              />
            ))}
          </div>
        )}
      </div>

      {showSettings && <Settings onClose={() => { setShowSettings(false); loadSettings(); }} />}
      {showMemoryDrawer && (
        <MemoryDrawer
          pinnedEntries={pinnedEntries}
          onClose={() => setShowMemoryDrawer(false)}
          onDelete={handleDelete}
          onEdit={setEditingEntry}
          onPin={handlePin}
        />
      )}

      <AmbientSounds
        soundType={userSettings?.sound_type || 'typewriter'}
        enabled={userSettings?.sounds_enabled || false}
      />
    </div>
  );
}

export default App;
