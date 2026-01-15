import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, moodFilter: string, dateFilter: string) => void;
  onClear: () => void;
}

const MOODS = ['melancholy', 'hopeful', 'unhinged', 'romantic', 'peaceful', 'nostalgic'];

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    onSearch(query, moodFilter, dateFilter);
  };

  const handleClear = () => {
    setQuery('');
    setMoodFilter('');
    setDateFilter('');
    onClear();
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full vintage-entry p-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all group"
      >
        <span className="font-serif text-amber-800 group-hover:text-amber-900 transition-colors">
          <Search size={20} className="inline mr-2" />
          Search your memories...
        </span>
        <Search size={20} className="text-amber-700" />
      </button>

      {isOpen && (
        <div className="vintage-entry p-6 rounded-lg mt-2">
          <div className="space-y-4">
            <div>
              <label className="block text-amber-900 font-serif text-sm mb-2">Keywords</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keyword..."
                className="w-full p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-serif placeholder:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-amber-900 font-serif text-sm mb-2">Mood</label>
              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="w-full p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-700"
              >
                <option value="">Any mood</option>
                {MOODS.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-amber-900 font-serif text-sm mb-2">Date Range</label>
              <input
                type="month"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2 rounded-lg bg-amber-700 text-amber-50 hover:bg-amber-800 transition-colors font-serif font-semibold"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 rounded-lg bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors font-serif font-semibold flex items-center justify-center gap-2"
              >
                <X size={18} />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
