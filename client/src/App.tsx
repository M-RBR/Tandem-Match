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
    return <div>Loading...</div>; // Perhaps change later to a loading spinner
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
            {/* other routes... */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

/*

import { useEffect, useState } from "react";
import "./App.css";
import { baseURL } from "./utils/baseURL";

function App() {
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: "",
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const body = JSON.stringify(formValues);
      const requestOptions = {
        method: "POST",
        headers,
        body,
      };
      const response = await fetch(baseURL + "/users/register", requestOptions);
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(baseURL + "/users");
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <>
      <h1>Hello</h1>
      <form onSubmit={submitHandler}>
        <h2>Register</h2>
        <input
          name="email"
          type="email"
          placeholder="add your email "
          value={formValues.email}
          onChange={changeHandler}
        />
        <input
          name="password"
          type="password"
          placeholder="add your password"
          value={formValues.password}
          onChange={changeHandler}
        />
        <input
          name="username"
          type="text"
          placeholder="add a username if you want"
          value={formValues.username}
          onChange={changeHandler}
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default App;

*/
