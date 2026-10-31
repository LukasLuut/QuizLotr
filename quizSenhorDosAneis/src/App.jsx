import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { AudioProvider } from "./context/AudioContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import SoundToggle from "./components/SoundToggle";
import Start from "./pages/Start";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Perfil e jogo carregam sob demanda: Leaflet e os vídeos não entram no carregamento inicial
const Profile = lazy(() => import("./pages/Profile"));
const PlayQuiz = lazy(() => import("./pages/PlayQuiz"));

function App() {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/playquiz"
                  element={
                    <ProtectedRoute>
                      <PlayQuiz />
                    </ProtectedRoute>
                  }
                />
                {/* rotas antigas com maiúscula */}
                <Route path="/Profile" element={<Navigate to="/profile" replace />} />
                <Route path="/Login" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
          <SoundToggle />
        </AuthProvider>
      </AudioProvider>
    </ErrorBoundary>
  );
}

export default App;
