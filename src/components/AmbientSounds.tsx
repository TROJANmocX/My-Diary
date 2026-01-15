import { Music, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AmbientSoundsProps {
  soundType: string;
  enabled: boolean;
}

export function AmbientSounds({ soundType, enabled }: AmbientSoundsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(enabled);

  const soundUrls: Record<string, string> = {
    typewriter: 'https://assets.codepen.io/3685267/typewriter-sound-2.wav',
    rain: 'https://assets.codepen.io/1481527/nature-rain-01.wav',
    fireplace: 'https://assets.codepen.io/3685267/fireplace-ambience.wav',
  };

  useEffect(() => {
    if (audioRef.current) {
      if (enabled && isPlaying) {
        audioRef.current.play().catch(() => {
          console.log('Audio autoplay prevented by browser');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [enabled, isPlaying]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 vintage-entry p-4 rounded-lg shadow-lg flex items-center gap-3">
      <Music size={20} className="text-amber-700" />
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="text-amber-700 hover:text-amber-900 transition-colors"
        aria-label={isPlaying ? 'Pause ambient sound' : 'Play ambient sound'}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      <audio
        ref={audioRef}
        src={soundUrls[soundType] || soundUrls.typewriter}
        loop
        crossOrigin="anonymous"
      />
    </div>
  );
}
