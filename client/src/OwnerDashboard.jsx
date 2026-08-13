import { useEffect, useState } from "react";
import axios from "axios";
import "./OwnerDashboard.css";

function OwnerDashboard() {
    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [message, setMessage] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    useEffect(() => {
        getMyStores();
        getMyRatings();
    }, []);

    // ==========================================
    // GET OWNER'S STORES
    // ==========================================
    const getMyStores = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/stores/owner/my-stores",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStores(response.data);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to load stores"
            );
        }
    };

    // ==========================================
    // GET OWNER'S RATINGS
    // ==========================================
    const getMyRatings = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/ratings/owner",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRatings(response.data);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to load ratings"
            );
        }
    };

    // ==========================================
    // CALCULATE AVERAGE RATING
    // ==========================================
    const averageRating =
        ratings.length > 0
            ? (
                  ratings.reduce(
                      (total, item) =>
                          total + Number(item.rating),
                      0
                  ) / ratings.length
              ).toFixed(1)
            : "0.0";

    // ==========================================
    // RATING COUNTS
    // ==========================================
    const fiveStar = ratings.filter(
        (item) => Number(item.rating) === 5
    ).length;

    const fourStar = ratings.filter(
        (item) => Number(item.rating) === 4
    ).length;

    const threeStar = ratings.filter(
        (item) => Number(item.rating) === 3
    ).length;

    // ==========================================
    // UPDATE PASSWORD
    // ==========================================
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        setPasswordMessage("");

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                "http://localhost:5000/api/users/password",
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPasswordMessage(
                response.data.message
            );

            setCurrentPassword("");
            setNewPassword("");

        } catch (error) {
            setPasswordMessage(
                error.response?.data?.message ||
                "Password update failed"
            );
        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    return (
        <div className="owner-dashboard">

            {/* ==================================
                HEADER
            ================================== */}

            <header className="owner-header">

                <div className="owner-brand">

                    <div className="owner-logo">
                        ★
                    </div>

                    <div>
                        <h1>Store Rating System</h1>
                        <p>Store Owner Dashboard</p>
                    </div>

                </div>

                <button
                    className="owner-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            {/* ==================================
                WELCOME
            ================================== */}

            <section className="owner-welcome">

                <div>

                    <h2>
                        Welcome, Store Owner! 👋
                    </h2>

                    <p>
                        Monitor your stores, view customer
                        ratings, and manage your account.
                    </p>

                </div>

            </section>


            {/* ==================================
                STATISTICS
            ================================== */}

            <section className="owner-stats">

                <div className="owner-stat-card">

                    <div className="owner-stat-icon">
                        🏪
                    </div>

                    <div>
                        <h3>
                            {stores.length}
                        </h3>

                        <p>
                            My Stores
                        </p>
                    </div>

                </div>


                <div className="owner-stat-card">

                    <div className="owner-stat-icon">
                        ⭐
                    </div>

                    <div>
                        <h3>
                            {averageRating}
                        </h3>

                        <p>
                            Average Rating
                        </p>
                    </div>

                </div>


                <div className="owner-stat-card">

                    <div className="owner-stat-icon">
                        👥
                    </div>

                    <div>
                        <h3>
                            {ratings.length}
                        </h3>

                        <p>
                            Total Ratings
                        </p>
                    </div>

                </div>


                <div className="owner-stat-card">

                    <div className="owner-stat-icon">
                        🏆
                    </div>

                    <div>
                        <h3>
                            {fiveStar}
                        </h3>

                        <p>
                            5-Star Ratings
                        </p>
                    </div>

                </div>

            </section>


            {/* ==================================
                MY STORES
            ================================== */}

            <section className="owner-section">

                <div className="owner-section-header">

                    <div>

                        <h2>
                            My Stores
                        </h2>

                        <p>
                            Stores assigned to your account
                        </p>

                    </div>

                </div>


                {stores.length > 0 ? (

                    <div className="owner-store-grid">

                        {stores.map((store) => (

                            <div
                                className="owner-store-card"
                                key={store.id}
                            >

                                <div className="owner-store-top">

                                    <div className="owner-store-icon">
                                        🏪
                                    </div>

                                    <div>

                                        <h3>
                                            {store.name}
                                        </h3>

                                        <span>
                                            Store ID: {store.id}
                                        </span>

                                    </div>

                                </div>


                                <div className="owner-store-info">

                                    <div>
                                        <span>📧</span>
                                        <p>
                                            {store.email}
                                        </p>
                                    </div>

                                    <div>
                                        <span>📍</span>
                                        <p>
                                            {store.address}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="empty-state">

                        <div>
                            🏪
                        </div>

                        <h3>
                            No Stores Assigned
                        </h3>

                        <p>
                            There are currently no stores
                            assigned to your account.
                        </p>

                    </div>

                )}

            </section>


            {/* ==================================
                RATING OVERVIEW
            ================================== */}

            <section className="rating-overview">

                <div className="rating-overview-header">

                    <div className="rating-big-icon">
                        ⭐
                    </div>

                    <div>

                        <h2>
                            Rating Overview
                        </h2>

                        <p>
                            See how customers rate your stores
                        </p>

                    </div>

                </div>


                <div className="rating-summary">

                    <div className="average-rating">

                        <span>
                            Average Rating
                        </span>

                        <strong>
                            ⭐ {averageRating}
                        </strong>

                        <small>
                            out of 5
                        </small>

                    </div>


                    <div className="rating-bars">

                        <div className="rating-bar-row">

                            <span>
                                5 ⭐
                            </span>

                            <div className="rating-bar">
                                <div
                                    className="rating-fill"
                                    style={{
                                        width:
                                            ratings.length
                                                ? `${(fiveStar / ratings.length) * 100}%`
                                                : "0%"
                                    }}
                                ></div>
                            </div>

                            <strong>
                                {fiveStar}
                            </strong>

                        </div>


                        <div className="rating-bar-row">

                            <span>
                                4 ⭐
                            </span>

                            <div className="rating-bar">
                                <div
                                    className="rating-fill"
                                    style={{
                                        width:
                                            ratings.length
                                                ? `${(fourStar / ratings.length) * 100}%`
                                                : "0%"
                                    }}
                                ></div>
                            </div>

                            <strong>
                                {fourStar}
                            </strong>

                        </div>


                        <div className="rating-bar-row">

                            <span>
                                3 ⭐
                            </span>

                            <div className="rating-bar">
                                <div
                                    className="rating-fill"
                                    style={{
                                        width:
                                            ratings.length
                                                ? `${(threeStar / ratings.length) * 100}%`
                                                : "0%"
                                    }}
                                ></div>
                            </div>

                            <strong>
                                {threeStar}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================
                CUSTOMER RATINGS
            ================================== */}

            <section className="owner-section">

                <div className="owner-section-header">

                    <div>

                        <h2>
                            Customer Ratings
                        </h2>

                        <p>
                            Users who rated your stores
                        </p>

                    </div>

                    <div className="rating-count-badge">
                        {ratings.length} Ratings
                    </div>

                </div>


                {ratings.length > 0 ? (

                    <div className="ratings-table-wrapper">

                        <table className="ratings-table">

                            <thead>

                                <tr>
                                    <th>Store</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Rating</th>
                                    <th>Date</th>
                                </tr>

                            </thead>

                            <tbody>

                                {ratings.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item.rating_id ||
                                                index
                                            }
                                        >

                                            <td>
                                                <strong>
                                                    {item.store_name}
                                                </strong>
                                            </td>

                                            <td>
                                                {item.user_name}
                                            </td>

                                            <td>
                                                {item.user_email}
                                            </td>

                                            <td>

                                                <span className="rating-pill">
                                                    ⭐ {item.rating} / 5
                                                </span>

                                            </td>

                                            <td>
                                                {item.created_at
                                                    ? new Date(
                                                        item.created_at
                                                    ).toLocaleString()
                                                    : "-"}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="empty-state">

                        <div>
                            ⭐
                        </div>

                        <h3>
                            No Ratings Yet
                        </h3>

                        <p>
                            Your customers have not rated
                            your stores yet.
                        </p>

                    </div>

                )}

            </section>


            {/* ==================================
                CHANGE PASSWORD
            ================================== */}

            <section className="owner-password">

                <div className="password-title">

                    <div className="password-icon">
                        🔐
                    </div>

                    <div>

                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Update your password to keep
                            your account secure.
                        </p>

                    </div>

                </div>


                <form
                    className="owner-password-form"
                    onSubmit={handlePasswordUpdate}
                >

                    <div>

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


                    <div>

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
                        className="update-password-btn"
                    >
                        Update Password
                    </button>

                </form>


                <p className="password-note">
                    Password must be 8-16 characters,
                    contain at least one uppercase letter
                    and one special character.
                </p>


                {passwordMessage && (

                    <div className="password-message">
                        {passwordMessage}
                    </div>

                )}

            </section>


            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {message && (

                <div className="owner-error">
                    ⚠️ {message}
                </div>

            )}


            {/* ==================================
                FOOTER
            ================================== */}

            <footer className="owner-footer">

                <span>
                    © 2026 Store Rating System
                </span>

                <span>
                    Manage • Monitor • Improve
                </span>

            </footer>

        </div>
    );
}

export default OwnerDashboard;