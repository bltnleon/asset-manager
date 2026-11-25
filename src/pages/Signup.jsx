import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getUsers,
  saveUsers,
  getRoleFromEmail,
  MAX_ADMINS,
  MAX_VIEWERS,
} from "../auth";
import PasswordInput from "../components/PasswordInput";

const inputStyle =
  "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const role = getRoleFromEmail(email);

    if (!role) {
      setError(
        "Please use your company email: name@company.co.ke or name@companyadmin.co.ke",
      );
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const users = getUsers();

    if (users.some((user) => user.email === email)) {
      setError("An account with this email already exists.");
      return;
    }

    const sameRoleCount = users.filter((user) => user.role === role).length;

    if (role === "admin" && sameRoleCount >= MAX_ADMINS) {
      setError(`The maximum of ${MAX_ADMINS} admin accounts has been reached.`);
      return;
    }
    if (role === "viewer" && sameRoleCount >= MAX_VIEWERS) {
      setError(
        `The maximum of ${MAX_VIEWERS} view-only accounts has been reached.`,
      );
      return;
    }

    saveUsers([
      ...users,
      {
        id: Date.now(),
        name: formData.name.trim(),
        email,
        password: formData.password,
        role,
      },
    ]);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mt-1 text-gray-600">Sign up with your company email.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Full name
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="johndoe@company.co.ke"
              className={inputStyle}
            />
            <span className="block mt-1 text-xs font-normal text-gray-500">
              Use name@company.co.ke for view-only access or
              name@companyadmin.co.ke for admin access.
            </span>
          </label>

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
