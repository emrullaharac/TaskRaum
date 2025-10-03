import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ColorModeContext, type Mode } from "./ColorModeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<Mode>(() => (localStorage.getItem("taskraum-mode") as Mode) || "light");
    const toggleColorMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

    useEffect(() => {
        localStorage.setItem("taskraum-mode", mode);
        document.body.classList.toggle("taskraum-dark", mode === "dark");
    }, [mode]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: { main: "#4f46e5" },
                    background: {
                        default: mode === "light" ? "#ffffff" : "#0b1020",
                        paper: mode === "light" ? "#ffffff" : "#0f1426",
                    },
                    text: {
                        primary: mode === "light" ? "#111827" : "#e5e7eb",
                        secondary: mode === "light" ? "#6b7280" : "#a8b3cf",
                    },
                    divider: mode === "light" ? "rgba(17,24,39,0.12)" : "rgba(148,163,184,0.16)",
                },
                typography: {
                    fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
                },
                components: {
                    MuiAppBar: {
                        styleOverrides: {
                            root: { backgroundImage: "none" },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: { backgroundImage: "none" },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: { backgroundColor: mode === "light" ? "#ffffff" : "#121a2f" },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ColorModeContext.Provider>
    );
}