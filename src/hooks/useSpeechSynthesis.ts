import { useCallback } from 'react';

interface SpeakOptions {
  text: string;
  locale: string;
  rate?: number;
}

export const useSpeechSynthesis = () => {
  const speak = useCallback(({ text, locale, rate = 0.9 }: SpeakOptions) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((voice) => voice.lang.startsWith(locale));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
};
