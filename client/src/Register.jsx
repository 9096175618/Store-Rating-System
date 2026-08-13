import { useState } from "react";
import axios from "axios";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name: name,
                    email: email,
                    address: address,
                    password: password
                }
            );

            setMessage(response.data.message);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );

        }
    };


    return (

        <div style={{ padding: "30px" }}>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                {/* NAME */}

                <div>

                    <label>Name</label>

                    <br />

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter your full name"
                        required
                    />

                    <p>
                        Name must be 20-60 characters.
                    </p>

                </div>


                {/* EMAIL */}

                <div>

                    <label>Email</label>

                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter email"
                        required
                    />

                </div>


                <br />


                {/* ADDRESS */}

                <div>

                    <label>Address</label>

                    <br />

                    <textarea
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                        placeholder="Enter address"
                        maxLength="400"
                        required
                    />

                    <p>
                        Maximum 400 characters.
                    </p>

                </div>


                {/* PASSWORD */}

                <div>

                    <label>Password</label>

                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                        required
                    />

                    <p>
                        Password must be 8-16 characters,
                        contain at least one uppercase
                        letter and one special character.
                    </p>

                </div>


                <br />


                <button type="submit">
                    Register
                </button>

            </form>


            <br />


            <button
                type="button"
                onClick={() =>
                    window.location.href = "/login"
                }
            >
                Back to Login
            </button>


            <br />
            <br />


            {message && (
                <p>
                    {message}
                </p>
            )}

        </div>

    );
}

export default Register;