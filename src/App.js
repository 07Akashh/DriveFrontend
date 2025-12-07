import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import QueryProvider from "./TanstackQuery/QueryProvider";
import ThemeRoutes from "./routes";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <Router>
            <Suspense
              fallback={
                <div className="loader">
                  <div className="spinner w-8 h-8" />
                </div>
              }
            >
              <ThemeRoutes />
            </Suspense>
            <Toaster position="top-right" richColors />
          </Router>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
