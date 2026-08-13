import { useState } from "react";
import axios from "axios";

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


    // ==========================================
    // GO TO REGISTER PAGE
    // ==========================================

    const goToRegister = () => {

        window.location.href = "/register";

    };


    return (

        <div style={{ padding: "30px" }}>

            <h1>Login</h1>


            <form onSubmit={handleSubmit}>

                {/* EMAIL */}

                <div>

                    <label>
                        Email
                    </label>

                    <br />

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


                <br />


                {/* PASSWORD */}

                <div>

                    <label>
                        Password
                    </label>

                    <br />

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


                <br />


                {/* LOGIN */}

                <button type="submit">
                    Login
                </button>

            </form>


            <br />


            {/* REGISTER */}

            <p>
                Don't have an account?
            </p>

            <button
                type="button"
                onClick={goToRegister}
            >
                Register
            </button>


            <br />
            <br />


            {/* MESSAGE */}

            {message && (
                <p>
                    {message}
                </p>
            )}

        </div>

    );
}

export default Login;