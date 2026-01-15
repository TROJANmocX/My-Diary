export interface DiaryEntry {
    id: string;
    content: string;
    mood?: string;
    is_pinned: boolean;
    signature?: string;
    created_at: string;
    updated_at: string;
}

export interface UserSettings {
    id: string;
    user_name: string;
    theme: string;
    sounds_enabled: boolean;
    sound_type: string;
    created_at: string;
    updated_at: string;
}

const ENTRIES_KEY = 'my_diary_entries';
const SETTINGS_KEY = 'my_diary_settings';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const db = {
    getEntries: (): DiaryEntry[] => {
        try {
            const stored = localStorage.getItem(ENTRIES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading entries:', error);
            return [];
        }
    },

    saveEntry: (content: string, mood?: string, signature?: string): DiaryEntry => {
        const entries = db.getEntries();
        const newEntry: DiaryEntry = {
            id: generateId(),
            content,
            mood,
            signature,
            is_pinned: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Add to beginning of array
        const updatedEntries = [newEntry, ...entries];
        localStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
        return newEntry;
    },

    updateEntry: (id: string, updates: Partial<DiaryEntry>): DiaryEntry | null => {
        const entries = db.getEntries();
        const index = entries.findIndex(e => e.id === id);

        if (index === -1) return null;

        const updatedEntry = {
            ...entries[index],
            ...updates,
            updated_at: new Date().toISOString()
        };

        entries[index] = updatedEntry;
        localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
        return updatedEntry;
    },

    deleteEntry: (id: string): void => {
        const entries = db.getEntries();
        const filtered = entries.filter(e => e.id !== id);
        localStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
    },

    getSettings: (): UserSettings | null => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading settings:', error);
            return null;
        }
    },

    saveSettings: (settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>): UserSettings => {
        const current = db.getSettings();
        const now = new Date().toISOString();

        const newSettings: UserSettings = {
            id: current?.id || generateId(),
            created_at: current?.created_at || now,
            updated_at: now,
            ...settings
        };

        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        return newSettings;
    }
};
