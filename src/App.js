import "./App.css";
import BlogPage from "./BlogPage";
import Register from "./auth/Register";
import Login from "./auth/Login";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

function RequireAuth({ children }) {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  let parsedToken = JSON.parse(token);
  let location = useLocation();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/v1/user/me`, {
        headers: { Authorization: `Bearer ${parsedToken}` },
      })
      .then(() => setLoading(false))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });
  }, []);

  if (loading) {
    return <div>Loading....</div>;
  }

  if (!parsedToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/blogs"
          element={
            <RequireAuth>
              <BlogPage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
