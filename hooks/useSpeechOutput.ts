import { useState, useCallback, useEffect } from 'react';

export function useSpeechOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported || typeof window === 'undefined') return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Strip markdown for clean reading
    const cleanText = text.replace(/[*#_`~\[\]()]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US'; // Works reasonably well for Roman Urdu
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    
    utterance.onend = () => setIsSpeaking(false);
    
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);

  return { speak, stop, isSpeaking, supported };
}
