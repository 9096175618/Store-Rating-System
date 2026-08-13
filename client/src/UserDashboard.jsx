import React, { useEffect, useState } from "react";

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

    // ==========================================
    // GET STORES
    // ==========================================
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


    // ==========================================
    // SEARCH STORE
    // ==========================================
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


    // ==========================================
    // ADD / UPDATE RATING
    // ==========================================
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


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================
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


    // ==========================================
    // LOGOUT
    // ==========================================
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };


    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading stores...</h2>
            </div>
        );
    }


    // ==========================================
    // DASHBOARD
    // ==========================================
    return (
        <div style={{ padding: "30px" }}>

            {/* =====================================
                HEADER
            ====================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <h1>User Dashboard</h1>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "10px 20px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>

            </div>


            {/* =====================================
                CHANGE PASSWORD
            ====================================== */}

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    marginTop: "20px",
                    marginBottom: "30px",
                    width: "400px",
                    borderRadius: "8px"
                }}
            >

                <h2>Change Password</h2>

                <form
                    onSubmit={handlePasswordUpdate}
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
                            display: "block",
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            boxSizing: "border-box"
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
                            display: "block",
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            boxSizing: "border-box"
                        }}
                    />

                    <p style={{ fontSize: "14px" }}>
                        Password must be 8-16 characters,
                        contain at least one uppercase
                        letter and one special character.
                    </p>

                    <button
                        type="submit"
                        style={{
                            padding: "10px 20px",
                            cursor: "pointer"
                        }}
                    >
                        Update Password
                    </button>

                </form>

                {passwordMessage && (
                    <p>{passwordMessage}</p>
                )}

            </div>


            {/* =====================================
                AVAILABLE STORES
            ====================================== */}

            <h2>Available Stores</h2>


            {/* SEARCH */}

            <input
                type="text"
                placeholder="Search by store name or address"
                value={search}
                onChange={handleSearch}
                style={{
                    width: "400px",
                    padding: "10px",
                    fontSize: "16px",
                    marginBottom: "20px"
                }}
            />


            {/* =====================================
                STORE TABLE
            ====================================== */}

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

                        <th>Your Rating</th>

                        <th>Average Rating</th>

                        <th>Total Ratings</th>

                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>

                    {filteredStores.length > 0 ? (

                        filteredStores.map((store) => (

                            <tr key={store.id}>

                                <td>
                                    {store.id}
                                </td>

                                <td>
                                    {store.name}
                                </td>

                                <td>
                                    {store.email}
                                </td>

                                <td>
                                    {store.address}
                                </td>

                                <td>

                                    {store.user_rating
                                        ? `${store.user_rating} / 5`
                                        : "Not Rated"}

                                </td>


                                <td>

                                    ⭐{" "}

                                    {store.average_rating
                                        ? Number(
                                              store.average_rating
                                          ).toFixed(1)
                                        : "0.0"}

                                    {" "} / 5

                                </td>


                                <td>
                                    {store.total_ratings || 0}
                                </td>


                                <td>

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
                                            Rate Store
                                        </option>

                                        <option value="1">
                                            1 / 5
                                        </option>

                                        <option value="2">
                                            2 / 5
                                        </option>

                                        <option value="3">
                                            3 / 5
                                        </option>

                                        <option value="4">
                                            4 / 5
                                        </option>

                                        <option value="5">
                                            5 / 5
                                        </option>

                                    </select>

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="8"
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                No stores found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default UserDashboard;