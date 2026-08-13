import React, { useEffect, useState } from "react";
import "./UserDashboard.css";

function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    useEffect(() => {
        fetchStores();
    }, []);

    // GET STORES
    const fetchStores = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/stores",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load stores"
                );
            }

            setStores(data);
            setFilteredStores(data);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching stores:", error);
            setLoading(false);
        }
    };

    // SEARCH STORE
    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        const searchValue = value.toLowerCase();

        const filtered = stores.filter(
            (store) =>
                store.name
                    .toLowerCase()
                    .includes(searchValue) ||
                store.address
                    .toLowerCase()
                    .includes(searchValue)
        );

        setFilteredStores(filtered);
    };

    // ADD / UPDATE RATING
    const handleRating = async (storeId, rating) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/ratings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        store_id: storeId,
                        rating: rating
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(
                    data.message ||
                    "Rating updated successfully"
                );

                fetchStores();
            } else {
                alert(
                    data.message ||
                    "Failed to update rating"
                );
            }

        } catch (error) {
            console.error("Rating error:", error);
            alert("Server error");
        }
    };

    // CHANGE PASSWORD
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        setPasswordMessage("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/users/password",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPasswordMessage(
                    data.message ||
                    "Password updated successfully!"
                );

                setCurrentPassword("");
                setNewPassword("");

            } else {
                setPasswordMessage(
                    data.message ||
                    "Password update failed"
                );
            }

        } catch (error) {
            console.error(error);

            setPasswordMessage(
                "Server error. Please try again."
            );
        }
    };

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    // LOADING
    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <h2>Loading Dashboard...</h2>
                <p>Please wait while we load the stores.</p>
            </div>
        );
    }

    // DASHBOARD
    return (
        <div className="user-dashboard">

            {/* ================= HEADER ================= */}

            <header className="dashboard-header">

                <div className="brand-section">
                    <div className="brand-icon">
                        ★
                    </div>

                    <div>
                        <h1>Store Rating System</h1>
                        <p>User Dashboard</p>
                    </div>
                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            {/* ================= WELCOME ================= */}

            <section className="welcome-section">

                <div>
                    <h2>Welcome Back! 👋</h2>

                    <p>
                        Discover stores, check ratings,
                        and share your experience.
                    </p>
                </div>

            </section>


            {/* ================= STATS ================= */}

            <section className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon">
                        🏪
                    </div>

                    <div>
                        <h3>{stores.length}</h3>
                        <p>Total Stores</p>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        ⭐
                    </div>

                    <div>
                        <h3>
                            {stores.filter(
                                store => store.user_rating
                            ).length}
                        </h3>

                        <p>Stores Rated</p>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        🔍
                    </div>

                    <div>
                        <h3>
                            {filteredStores.length}
                        </h3>

                        <p>Search Results</p>
                    </div>

                </div>

            </section>


            {/* ================= STORES ================= */}

            <section className="stores-section">

                <div className="section-heading">

                    <div>
                        <h2>Available Stores</h2>

                        <p>
                            Search and rate your favorite stores
                        </p>
                    </div>

                    <div className="search-box">

                        <span>🔍</span>

                        <input
                            type="text"
                            placeholder="Search stores..."
                            value={search}
                            onChange={handleSearch}
                        />

                    </div>

                </div>


                {/* STORE CARDS */}

                <div className="store-grid">

                    {filteredStores.length > 0 ? (

                        filteredStores.map((store) => (

                            <div
                                className="store-card"
                                key={store.id}
                            >

                                <div className="store-card-header">

                                    <div className="store-icon">
                                        🏪
                                    </div>

                                    <div>
                                        <h3>
                                            {store.name}
                                        </h3>

                                        <p>
                                            {store.email}
                                        </p>
                                    </div>

                                </div>


                                <div className="store-address">

                                    <span>📍</span>

                                    <p>
                                        {store.address}
                                    </p>

                                </div>


                                <div className="rating-info">

                                    <div className="rating-box">

                                        <span>
                                            ⭐ Average Rating
                                        </span>

                                        <strong>
                                            {store.average_rating
                                                ? Number(
                                                    store.average_rating
                                                ).toFixed(1)
                                                : "0.0"}
                                            <small>/5</small>
                                        </strong>

                                    </div>


                                    <div className="rating-box">

                                        <span>
                                            👥 Ratings
                                        </span>

                                        <strong>
                                            {store.total_ratings || 0}
                                        </strong>

                                    </div>

                                </div>


                                <div className="your-rating">

                                    <span>
                                        Your Rating:
                                    </span>

                                    <strong>
                                        {store.user_rating
                                            ? `⭐ ${store.user_rating}/5`
                                            : "Not Rated"}
                                    </strong>

                                </div>


                                <div className="rate-section">

                                    <label>
                                        Rate this store
                                    </label>

                                    <select
                                        defaultValue=""
                                        onChange={(e) =>
                                            handleRating(
                                                store.id,
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    >

                                        <option
                                            value=""
                                            disabled
                                        >
                                            Select Rating
                                        </option>

                                        <option value="1">
                                            ⭐ 1 / 5
                                        </option>

                                        <option value="2">
                                            ⭐⭐ 2 / 5
                                        </option>

                                        <option value="3">
                                            ⭐⭐⭐ 3 / 5
                                        </option>

                                        <option value="4">
                                            ⭐⭐⭐⭐ 4 / 5
                                        </option>

                                        <option value="5">
                                            ⭐⭐⭐⭐⭐ 5 / 5
                                        </option>

                                    </select>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="no-stores">

                            <div>
                                🔍
                            </div>

                            <h3>
                                No Stores Found
                            </h3>

                            <p>
                                Try searching with a different
                                store name or address.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* ================= PASSWORD ================= */}

            <section className="password-section">

                <div className="password-header">

                    <div className="password-icon">
                        🔐
                    </div>

                    <div>
                        <h2>Change Password</h2>

                        <p>
                            Keep your account secure by
                            updating your password.
                        </p>
                    </div>

                </div>


                <form
                    className="password-form"
                    onSubmit={handlePasswordUpdate}
                >

                    <div className="password-field">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="password-field">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="password-btn"
                    >
                        Update Password
                    </button>

                </form>


                <p className="password-hint">
                    Password must be 8-16 characters and
                    contain at least one uppercase letter
                    and one special character.
                </p>


                {passwordMessage && (
                    <div className="password-message">
                        {passwordMessage}
                    </div>
                )}

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="dashboard-footer">

                <p>
                    © 2026 Store Rating System
                </p>

                <p>
                    Rate • Discover • Share
                </p>

            </footer>

        </div>
    );
}

export default UserDashboard;