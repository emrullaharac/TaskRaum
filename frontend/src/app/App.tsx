import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { RouterProvider } from "./providers/RouterProvider.tsx";

function App() {

  return (
      <ThemeProvider>
          <RouterProvider />
      </ThemeProvider>
  );
}

export default App
