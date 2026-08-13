import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            address,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setMessage(data.message);

      // Clear form
      setName("");
      setEmail("");
      setAddress("");
      setPassword("");

      // Go to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Register for Store Rating System
        </p>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength="20"
              maxLength="60"
              required
            />

            <small>
              Name must be between 20 and 60 characters.
            </small>
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

          {/* Address */}
          <div className="form-group">
            <label>Address</label>

            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength="400"
              rows="4"
              required
            />

            <small>
              Maximum 400 characters.
            </small>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8"
              maxLength="16"
              required
            />

            <small>
              8-16 characters, at least one uppercase letter
              and one special character.
            </small>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="auth-button"
          >
            Register
          </button>

        </form>

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