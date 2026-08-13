import { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            // Save token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage("Login successful");

            console.log(
                "Logged in user:",
                response.data.user
            );

            // Redirect according to role
            const role = response.data.user.role;

            if (role === "admin") {

                window.location.href = "/admin";

            } else if (role === "owner") {

                window.location.href = "/owner";

            } else {

                window.location.href = "/user";

            }

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    };


    const goToRegister = () => {

        window.location.href = "/register";

    };


    return (

        <div className="auth-page">

            <div className="login-card">

                {/* Logo / Title */}

                <div className="auth-header">

                    <div className="auth-logo">
                        ★
                    </div>

                    <h1>Store Rating System</h1>

                    <p>
                        Welcome back! Please login to continue.
                    </p>

                </div>


                {/* Login Form */}

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    {/* Email */}

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    {/* Password */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    {/* Login Button */}

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Login
                    </button>

                </form>


                {/* Register */}

                <div className="auth-register">

                    <p>
                        Don't have an account?
                    </p>

                    <button
                        type="button"
                        onClick={goToRegister}
                        className="register-button"
                    >
                        Create Account
                    </button>

                </div>


                {/* Message */}

                {message && (

                    <div
                        className={
                            message === "Login successful"
                                ? "success-message"
                                : "error-message"
                        }
                    >
                        {message}
                    </div>

                )}

            </div>

        </div>

    );
}

export default Login;