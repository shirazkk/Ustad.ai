import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Works reasonably well for Roman Urdu

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    try {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error('Failed to start listening:', e);
    }
  }, [supported]);

  const stopListening = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Failed to stop listening:', e);
    }
  }, [supported]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    supported
  };
}
