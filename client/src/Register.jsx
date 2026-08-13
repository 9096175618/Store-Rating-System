import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Temporary registration logic
    console.log("Registration Data:", {
      name,
      email,
      password,
      role,
    });

    alert("Registration successful!");

    // Go to Login page
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Heading */}
        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Register for Store Rating System
        </p>

        {/* Registration Form */}
        <form onSubmit={handleRegister}>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="auth-button"
          >
            Register
          </button>

        </form>

        {/* Login Link */}
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;