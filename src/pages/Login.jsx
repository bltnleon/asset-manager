import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUsers, toSessionUser } from "../auth";
import PasswordInput from "../components/PasswordInput";

const inputStyle =
  "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const users = getUsers();

    if (users.length === 0) {
      setError("No account found. Please sign up first.");
      return;
    }

    const matchedUser = users.find(
      (user) => user.email === email && user.password === formData.password,
    );

    if (!matchedUser) {
      setError("Incorrect email or password");
      return;
    }

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(toSessionUser(matchedUser)),
    );
    navigate(
      matchedUser.role === "admin" ? "/dashboard" : "/dashboard/inventory",
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-gray-600">Log in to manage your assets.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </label>

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
