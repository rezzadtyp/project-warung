import { useEffect, useState, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition as useReactSpeechRecognition,
} from "react-speech-recognition";
import type { SupportedLanguage } from "@/lib/types/languages";

interface UseSpeechRecognitionOptions {
  onTranscriptChange?: (transcript: string) => void;
  continuous?: boolean;
  language?: SupportedLanguage;
}

export const useSpeechRecognition = ({
  onTranscriptChange,
  continuous = false,
  language = "auto",
}: UseSpeechRecognitionOptions = {}) => {
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>(language);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useReactSpeechRecognition();

  useEffect(() => {
    if (transcript && onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const startListening = useCallback(
    (lang?: SupportedLanguage) => {
      const languageToUse = lang || currentLanguage;

      // Auto detect: try both English and Indonesian
      if (languageToUse === "auto") {
        // Start with English, then switch to Indonesian if needed
        // Note: True auto-detect requires testing both, but we'll default to English
        SpeechRecognition.startListening({
          continuous,
          language: "en-US", // Default to English for auto
        });
      } else {
        SpeechRecognition.startListening({
          continuous,
          language: languageToUse,
        });
      }

      if (lang) {
        setCurrentLanguage(lang);
      }
    },
    [continuous, currentLanguage]
  );

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  const abortListening = useCallback(() => {
    SpeechRecognition.abortListening();
  }, []);

  const toggleListening = useCallback(
    (lang?: SupportedLanguage) => {
      if (listening) {
        SpeechRecognition.stopListening();
      } else {
        const languageToUse = lang || currentLanguage;

        if (languageToUse === "auto") {
          SpeechRecognition.startListening({
            continuous,
            language: "en-US",
          });
        } else {
          SpeechRecognition.startListening({
            continuous,
            language: languageToUse,
          });
        }

        if (lang) {
          setCurrentLanguage(lang);
        }
      }
    },
    [listening, continuous, currentLanguage]
  );

  const changeLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
  }, []);

  return {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    currentLanguage,
    startListening,
    stopListening,
    abortListening,
    toggleListening,
    changeLanguage,
    resetTranscript,
  };
};
