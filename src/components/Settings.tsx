import { Settings as SettingsIcon, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../lib/db';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [userName, setUserName] = useState('Diarist');
  const [theme, setTheme] = useState('vintage');
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [soundType, setSoundType] = useState('typewriter');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const data = db.getSettings();

      if (data) {
        setUserName(data.user_name);
        setTheme(data.theme);
        setSoundsEnabled(data.sounds_enabled);
        setSoundType(data.sound_type);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = () => {
    try {
      db.saveSettings({
        user_name: userName,
        theme,
        sounds_enabled: soundsEnabled,
        sound_type: soundType,
      });

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="vintage-entry p-8 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-amber-900 flex items-center gap-2">
            <SettingsIcon size={24} />
            Settings
          </h2>
          <button onClick={onClose} className="text-amber-700 hover:text-amber-900">
            <X size={24} />
          </button>
        </div>

        {!loading && (
          <div className="space-y-6">
            <div>
              <label className="block text-amber-900 font-serif mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-amber-900 font-serif mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-700"
              >
                <option value="vintage">Vintage</option>
                <option value="candle">Candle Mode</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundsEnabled}
                  onChange={(e) => setSoundsEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-amber-900 font-serif">Ambient Sounds</span>
              </label>

              {soundsEnabled && (
                <select
                  value={soundType}
                  onChange={(e) => setSoundType(e.target.value)}
                  className="w-full p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-700"
                >
                  <option value="typewriter">Typewriter</option>
                  <option value="rain">Rain</option>
                  <option value="fireplace">Fireplace</option>
                </select>
              )}
            </div>

            <button
              onClick={saveSettings}
              className="w-full mt-6 px-4 py-2 rounded-lg bg-amber-700 text-amber-50 hover:bg-amber-800 transition-colors font-serif font-semibold"
            >
              Save Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


