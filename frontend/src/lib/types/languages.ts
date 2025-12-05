export type SupportedLanguage = "en-US" | "id-ID" | "auto";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "auto", label: "Auto Detect", flag: "🌐" },
  { code: "en-US", label: "English", flag: "🇺🇸" },
  { code: "id-ID", label: "Indonesian", flag: "🇮🇩" },
];