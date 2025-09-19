import { useCallback } from 'react';

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const getAudioContext = (() => {
  let ctx: AudioContext | null = null;
  return () => {
    if (ctx) {
      return ctx;
    }
    const audioWindow = window as AudioWindow;
    const AudioContextConstructor = window.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioContextConstructor) {
      return null;
    }
    ctx = new AudioContextConstructor();
    return ctx;
  };
})();

const playTone = (frequency: number, duration = 0.25) => {
  const audioCtx = getAudioContext();
  if (!audioCtx) {
    return;
  }
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const useFeedbackSounds = () => {
  const playSuccess = useCallback(() => {
    playTone(660, 0.2);
    setTimeout(() => playTone(880, 0.2), 120);
  }, []);

  const playError = useCallback(() => {
    playTone(220, 0.3);
    setTimeout(() => playTone(196, 0.3), 150);
  }, []);

  return { playSuccess, playError };
};
