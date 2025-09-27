import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CreateProfile from "./pages/CreateProfile";
import Dashboard from "./pages/Dashboard";
import { useUser } from "./contexts/useUser";
import { isProfileComplete } from "./utils/profileUtils";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const profileComplete = isProfileComplete(user);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  profileComplete ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/createprofile" />
                  )
                ) : (
                  <Home />
                )
              }
            />
            <Route
              path="/createprofile"
              element={user ? <CreateProfile /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard"
              element={
                user && profileComplete ? (
                  <Dashboard />
                ) : (
                  <Navigate to={user ? "/createprofile" : "/"} />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
