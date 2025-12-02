import { createContext, useContext } from "react";
import type { ThemeContextValue } from "./themeTypes";

// Only export the hook and context (no other types)
const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;