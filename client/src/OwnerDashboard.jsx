import { useEffect, useState } from "react";
import axios from "axios";

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

        window.location.href = "/login";
    };


    return (
        <div style={{ padding: "30px" }}>

            {/* ==================================
                HEADER
            ================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <h1>Owner Dashboard</h1>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>


            {/* ==================================
                MY STORES
            ================================== */}

            <h2>My Stores</h2>

            {stores.length > 0 ? (

                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        borderCollapse: "collapse",
                        width: "100%"
                    }}
                >

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Store Name</th>
                            <th>Email</th>
                            <th>Address</th>
                        </tr>

                    </thead>

                    <tbody>

                        {stores.map((store) => (

                            <tr key={store.id}>

                                <td>{store.id}</td>

                                <td>
                                    {store.name}
                                </td>

                                <td>
                                    {store.email}
                                </td>

                                <td>
                                    {store.address}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            ) : (

                <p>No stores assigned to you.</p>

            )}


            {/* ==================================
                RATING SUMMARY
            ================================== */}

            <div
                style={{
                    display: "flex",
                    gap: "30px",
                    marginTop: "30px",
                    marginBottom: "30px"
                }}
            >

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "200px"
                    }}
                >

                    <h3>Average Rating</h3>

                    <h2>
                        ⭐ {averageRating} / 5
                    </h2>

                </div>


                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "200px"
                    }}
                >

                    <h3>Total Ratings</h3>

                    <h2>
                        {ratings.length}
                    </h2>

                </div>

            </div>


            {/* ==================================
                CUSTOMER RATINGS
            ================================== */}

            <h2>Users Who Rated Your Store</h2>

            {ratings.length > 0 ? (

                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        borderCollapse: "collapse",
                        width: "100%"
                    }}
                >

                    <thead>

                        <tr>
                            <th>Store</th>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Rating</th>
                            <th>Date</th>
                        </tr>

                    </thead>

                    <tbody>

                        {ratings.map((item, index) => (

                            <tr
                                key={
                                    item.rating_id ||
                                    index
                                }
                            >

                                <td>
                                    {item.store_name}
                                </td>

                                <td>
                                    {item.user_name}
                                </td>

                                <td>
                                    {item.user_email}
                                </td>

                                <td>
                                    ⭐ {item.rating} / 5
                                </td>

                                <td>
                                    {item.created_at
                                        ? new Date(
                                              item.created_at
                                          ).toLocaleString()
                                        : "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            ) : (

                <p>
                    No ratings received yet.
                </p>

            )}


            {/* ==================================
                CHANGE PASSWORD
            ================================== */}

            <h2 style={{ marginTop: "40px" }}>
                Change Password
            </h2>

            <form
                onSubmit={handlePasswordUpdate}
                style={{
                    width: "400px",
                    border: "1px solid #ccc",
                    padding: "20px"
                }}
            >

                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(
                            e.target.value
                        )
                    }
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <p>
                    Password must be 8-16 characters,
                    contain at least one uppercase
                    letter and one special character.
                </p>

                <button type="submit">
                    Update Password
                </button>

            </form>

            {passwordMessage && (
                <p>{passwordMessage}</p>
            )}


            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {message && (
                <p>{message}</p>
            )}

        </div>
    );
}

export default OwnerDashboard;