import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CreateProfile from "./pages/CreateProfile";
import { useUser } from "./contexts/UserContext";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/createprofile"
              element={user ? <CreateProfile /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
