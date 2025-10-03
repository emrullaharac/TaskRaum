import { createContext } from "react";

export type Mode = "light" | "dark";

export const ColorModeContext = createContext<{
  mode: Mode;
  toggleColorMode: () => void;
}>({
  mode: "light",
  toggleColorMode: () => {
  },
});
