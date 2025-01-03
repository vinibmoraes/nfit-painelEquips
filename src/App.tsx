import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/indexRoutes";
import { AppThemeProvider } from "./shared/contexts/ThemeContext";

export const App = () => {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppThemeProvider>
  );
};

export default App;
