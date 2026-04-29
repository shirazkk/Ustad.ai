import { useState, useCallback, useEffect } from 'react';

export function useSpeechOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      requestAnimationFrame(() => setSupported(false));
      return;
    }

    // Pre-load voices for browsers that load them async
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, gender: 'male' | 'female' = 'female') => {
    if (!supported || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*#_`~\[\]()]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();
    
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    
    // Prioritize Urdu, Hindi, or Indian English with matching gender
    const preferredVoice = voices.find(v => {
      const isCorrectLang = v.lang.startsWith('ur') || v.lang.startsWith('hi') || v.lang.startsWith('en-IN');
      const nameMatch = v.name.toLowerCase().includes(gender);
      return isCorrectLang && nameMatch;
    }) || voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('hi') || v.lang.startsWith('en-IN'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e.error); // Log the specific error string
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
