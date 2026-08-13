import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import UserDashboard from "./UserDashboard";
import OwnerDashboard from "./OwnerDashboard";
import AdminDashboard from "./AdminDashboard";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Dashboards */}
                <Route
                    path="/user"
                    element={<UserDashboard />}
                />

                <Route
                    path="/owner"
                    element={<OwnerDashboard />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;