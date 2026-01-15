import { X, BookMarked } from 'lucide-react';
import { DiaryEntry as DiaryEntryType } from '../lib/db';
import { DiaryEntry } from './DiaryEntry';

interface MemoryDrawerProps {
  pinnedEntries: DiaryEntryType[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (entry: DiaryEntryType) => void;
  onPin: (id: string, isPinned: boolean) => void;
}

export function MemoryDrawer({
  pinnedEntries,
  onClose,
  onDelete,
  onEdit,
  onPin,
}: MemoryDrawerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
      <div className="fixed right-0 top-0 h-full w-full max-w-md vintage-bg shadow-2xl overflow-y-auto">
        <div className="sticky top-0 vintage-bg border-b border-amber-200 p-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-amber-900 flex items-center gap-2">
            <BookMarked size={24} />
            Pinned Memories
          </h2>
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {pinnedEntries.length === 0 ? (
            <div className="text-center text-amber-700 py-12">
              <BookMarked size={48} className="text-amber-400 mx-auto mb-3 opacity-50" />
              <p className="font-serif italic">No pinned memories yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pinnedEntries.map((entry) => (
                <DiaryEntry
                  key={entry.id}
                  entry={entry}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onPin={onPin}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
