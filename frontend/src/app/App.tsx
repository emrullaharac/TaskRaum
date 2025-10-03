import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { ThemeProvider } from "./providers/ThemeProvider";
import { RouterProvider } from "./providers/RouterProvider";
import "./calendarTheme.css";

function App() {
    const fetchUser = useAuthStore((s) => s.fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

  return (
      <ThemeProvider>
          <RouterProvider />
      </ThemeProvider>
  );
}

export default App
