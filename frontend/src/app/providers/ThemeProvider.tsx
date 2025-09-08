import type {ReactNode} from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#4f46e5" },
        background: { default: "#ffffff", paper: "#ffffff" },
        text: { primary: "#213547", secondary: "#4b5563" },
    },
    typography: {
        fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#ffffff",
                },
            },
        },
    },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}