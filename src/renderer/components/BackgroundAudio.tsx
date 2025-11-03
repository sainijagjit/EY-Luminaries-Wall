import { useEffect, useRef } from 'react';

type BackgroundAudioProps = {
  src: string;
  volume?: number; // 0.0 - 1.0
};

export default function BackgroundAudio({
  src,
  volume = 0.1,
}: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = Math.min(1, Math.max(0, volume));
    const play = () => {
      // Attempt play; ignore errors (autoplay policy is already relaxed in main)
      el.play().catch(() => undefined);
    };
    play();
  }, [volume]);

  return <audio ref={audioRef} src={src} autoPlay loop />;
}
