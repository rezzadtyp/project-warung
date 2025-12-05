import { useEffect, useState } from "react";
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

  const startListening = async (lang?: SupportedLanguage) => {
    try {
      const languageToUse = lang || currentLanguage;

      // Auto detect: try both English and Indonesian
      if (languageToUse === "auto") {
        // Start with English, then switch to Indonesian if needed
        // Note: True auto-detect requires testing both, but we'll default to English
        await SpeechRecognition.startListening({
          continuous,
          language: "en-US", // Default to English for auto
        });
      } else {
        await SpeechRecognition.startListening({
          continuous,
          language: languageToUse,
        });
      }

      if (lang) {
        setCurrentLanguage(lang);
      }
    } catch (error) {
      console.error("Failed to start listening:", error);
    }
  };

  const stopListening = async () => {
    try {
      await SpeechRecognition.stopListening();
    } catch (error) {
      console.error("Failed to stop listening:", error);
    }
  };

  const abortListening = async () => {
    try {
      await SpeechRecognition.abortListening();
    } catch (error) {
      console.error("Failed to abort listening:", error);
    }
  };

  const toggleListening = async (lang?: SupportedLanguage) => {
    if (listening) {
      await stopListening();
    } else {
      await startListening(lang);
    }
  };

  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
  };

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
