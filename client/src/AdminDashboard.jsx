import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [message, setMessage] = useState("");

    const [searchUser, setSearchUser] = useState("");
    const [searchStore, setSearchStore] = useState("");

    const [showUserForm, setShowUserForm] = useState(false);
    const [showStoreForm, setShowStoreForm] = useState(false);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user"
    });

    const [newStore, setNewStore] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const [sortUser, setSortUser] = useState({
        field: "id",
        direction: "asc"
    });

    const [sortStore, setSortStore] = useState({
        field: "id",
        direction: "asc"
    });

    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {
        getUsers();
        getStores();
    }, []);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // ==========================================
    // GET USERS
    // ==========================================

    const getUsers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/users",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setUsers(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to load users"
            );
        }
    };

    // ==========================================
    // GET STORES
    // ==========================================

    const getStores = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/stores",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
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
    // VIEW USER DETAILS
    // ==========================================

    const viewDetails = async (user) => {
        try {
            const token = getToken();

            // Normal user/admin details
            if (user.role !== "owner") {
                alert(
                    `Name: ${user.name}\n\n` +
                    `Email: ${user.email}\n\n` +
                    `Address: ${user.address}\n\n` +
                    `Role: ${user.role}`
                );

                return;
            }

            // Find owner's stores
            const response = await axios.get(
                "http://localhost:5000/api/stores/owner/my-stores",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Since this endpoint returns stores
            // belonging to logged-in admin? It may not
            // return another owner's store.
            // Therefore calculate rating from available stores.

            const ownerStore = stores.find(
                (store) =>
                    Number(store.owner_id) === Number(user.id)
            );

            let ratingText = "No rating yet";

            if (ownerStore) {
                ratingText =
                    `${Number(
                        ownerStore.average_rating || 0
                    ).toFixed(1)} / 5`;
            }

            alert(
                `Name: ${user.name}\n\n` +
                `Email: ${user.email}\n\n` +
                `Address: ${user.address}\n\n` +
                `Role: ${user.role}\n\n` +
                `Store Rating: ${ratingText}`
            );

        } catch (error) {
            alert(
                `Name: ${user.name}\n\n` +
                `Email: ${user.email}\n\n` +
                `Address: ${user.address}\n\n` +
                `Role: ${user.role}\n\n` +
                `Store Rating: Unable to load`
            );
        }
    };

    // ==========================================
    // DELETE USER
    // ==========================================

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setMessage(response.data.message);

            getUsers();
            getStores();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to delete user"
            );
        }
    };

    // ==========================================
    // CHANGE ROLE
    // ==========================================

    const changeRole = async (id, currentRole) => {

        const newRole = window.prompt(
            "Enter new role: user, owner, or admin",
            currentRole
        );

        if (!newRole) {
            return;
        }

        const role = newRole.toLowerCase().trim();

        if (!["user", "owner", "admin"].includes(role)) {
            alert(
                "Invalid role. Use user, owner, or admin."
            );
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/users/${id}/role`,
                {
                    role: role
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setMessage(response.data.message);

            getUsers();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to change role"
            );
        }
    };

    // ==========================================
    // ADD USER
    // ==========================================

    const addUser = async (e) => {
        e.preventDefault();

        const name = newUser.name.trim();
        const email = newUser.email.trim();
        const password = newUser.password;
        const address = newUser.address.trim();

        // Name validation
        if (name.length < 20 || name.length > 60) {
            alert(
                "Name must be between 20 and 60 characters."
            );
            return;
        }

        // Address validation
        if (address.length > 400) {
            alert(
                "Address must not exceed 400 characters."
            );
            return;
        }

        // Email validation
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert(
                "Please enter a valid email address."
            );
            return;
        }

        // Password validation
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(password)) {
            alert(
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character."
            );
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password,
                    address,
                    role: newUser.role
                }
            );

            setMessage(
                response.data.message ||
                "User added successfully"
            );

            setNewUser({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "user"
            });

            setShowUserForm(false);

            getUsers();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to add user"
            );
        }
    };

    // ==========================================
    // ADD STORE
    // ==========================================

    const addStore = async (e) => {
        e.preventDefault();

        const name = newStore.name.trim();
        const email = newStore.email.trim();
        const address = newStore.address.trim();

        if (!name) {
            alert("Store name is required.");
            return;
        }

        if (address.length > 400) {
            alert(
                "Address must not exceed 400 characters."
            );
            return;
        }

        if (email !== "") {
            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                alert(
                    "Please enter a valid store email."
                );
                return;
            }
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/stores",
                {
                    name,
                    email: email || null,
                    address,
                    owner_id:
                        newStore.owner_id || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setMessage(
                response.data.message ||
                "Store added successfully"
            );

            setNewStore({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });

            setShowStoreForm(false);

            getStores();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to add store"
            );
        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    // ==========================================
    // USER SORT
    // ==========================================

    const handleUserSort = (field) => {
        setSortUser((previous) => ({
            field,
            direction:
                previous.field === field &&
                previous.direction === "asc"
                    ? "desc"
                    : "asc"
        }));
    };

    // ==========================================
    // STORE SORT
    // ==========================================

    const handleStoreSort = (field) => {
        setSortStore((previous) => ({
            field,
            direction:
                previous.field === field &&
                previous.direction === "asc"
                    ? "desc"
                    : "asc"
        }));
    };

    // ==========================================
    // FILTER USERS
    // ==========================================

    const filteredUsers = users
        .filter((user) => {

            const value =
                searchUser.toLowerCase();

            return (
                user.name
                    .toLowerCase()
                    .includes(value) ||

                user.email
                    .toLowerCase()
                    .includes(value) ||

                user.address
                    .toLowerCase()
                    .includes(value) ||

                user.role
                    .toLowerCase()
                    .includes(value)
            );
        })
        .sort((a, b) => {

            const field = sortUser.field;

            const first =
                String(
                    a[field] || ""
                ).toLowerCase();

            const second =
                String(
                    b[field] || ""
                ).toLowerCase();

            if (first < second) {
                return sortUser.direction === "asc"
                    ? -1
                    : 1;
            }

            if (first > second) {
                return sortUser.direction === "asc"
                    ? 1
                    : -1;
            }

            return 0;
        });

    // ==========================================
    // FILTER STORES
    // ==========================================

    const filteredStores = stores
        .filter((store) => {

            const value =
                searchStore.toLowerCase();

            return (
                store.name
                    .toLowerCase()
                    .includes(value) ||

                store.email
                    .toLowerCase()
                    .includes(value) ||

                store.address
                    .toLowerCase()
                    .includes(value)
            );
        })
        .sort((a, b) => {

            const field = sortStore.field;

            const first =
                String(
                    a[field] || ""
                ).toLowerCase();

            const second =
                String(
                    b[field] || ""
                ).toLowerCase();

            if (first < second) {
                return sortStore.direction === "asc"
                    ? -1
                    : 1;
            }

            if (first > second) {
                return sortStore.direction === "asc"
                    ? 1
                    : -1;
            }

            return 0;
        });

    // ==========================================
    // STATISTICS
    // ==========================================

    const totalUsers = users.length;

    const totalStores = stores.length;

    const totalRatings = stores.reduce(
        (total, store) =>
            total +
            Number(store.total_ratings || 0),
        0
    );

    // ==========================================
    // RETURN
    // ==========================================

    return (
        <div
            style={{
                padding: "30px"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center"
                }}
            >

                <h1>
                    Admin Dashboard
                </h1>

                <button
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

            {message && (
                <p>
                    {message}
                </p>
            )}

            {/* ==================================
                STATISTICS
            ================================== */}

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "20px",
                    marginBottom: "30px"
                }}
            >

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>
                        Total Users
                    </h3>

                    <h2>
                        {totalUsers}
                    </h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>
                        Total Stores
                    </h3>

                    <h2>
                        {totalStores}
                    </h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        minWidth: "180px"
                    }}
                >
                    <h3>
                        Total Ratings
                    </h3>

                    <h2>
                        {totalRatings}
                    </h2>
                </div>

            </div>

            {/* ==================================
                ADD USER
            ================================== */}

            <button
                onClick={() =>
                    setShowUserForm(
                        !showUserForm
                    )
                }
            >
                {showUserForm
                    ? "Close Add User"
                    : "Add New User"}
            </button>

            {showUserForm && (

                <form
                    onSubmit={addUser}
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "20px",
                        marginTop: "20px",
                        width: "400px"
                    }}
                >

                    <h2>
                        Add User
                    </h2>

                    <label>
                        Name
                    </label>

                    <br />

                    <input
                        value={newUser.name}
                        placeholder="20-60 characters"
                        onChange={(e) =>
                            setNewUser({
                                ...newUser,
                                name:
                                    e.target.value
                            })
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "8px"
                        }}
                    />

                    <br />
                    <br />

                    <label>
                        Email
                    </label>

                    <br />

                    <input
                        type="email"
                        value={newUser.email}
                        placeholder="Email"
                        onChange={(e) =>
                            setNewUser({
                                ...newUser,
                                email:
                                    e.target.value
                            })
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "8px"
                        }}
                    />

                    <br />
                    <br />

                    <label>
                        Password
                    </label>

                    <br />

                    <input
                        type="password"
                        value={newUser.password}
                        placeholder="Example: TestUser@123"
                        onChange={(e) =>
                            setNewUser({
                                ...newUser,
                                password:
                                    e.target.value
                            })
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "8px"
                        }}
                    />

                    <p>
                        8-16 characters,
                        one uppercase and
                        one special character.
                    </p>

                    <label>
                        Address
                    </label>

                    <br />

                    <input
                        value={newUser.address}
                        placeholder="Maximum 400 characters"
                        onChange={(e) =>
                            setNewUser({
                                ...newUser,
                                address:
                                    e.target.value
                            })
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "8px"
                        }}
                    />

                    <br />
                    <br />

                    <label>
                        Role
                    </label>

                    <br />

                    <select
                        value={newUser.role}
                        onChange={(e) =>
                            setNewUser({
                                ...newUser,
                                role:
                                    e.target.value
                            })
                        }
                    >
                        <option value="user">
                            Normal User
                        </option>

                        <option value="owner">
                            Store Owner
                        </option>

                        <option value="admin">
                            Admin
                        </option>
                    </select>

                    <br />
                    <br />

                    <button type="submit">
                        Add User
                    </button>

                </form>
            )}

            {/* ==================================
                ADD STORE
            ================================== */}

            <br />
            <br />

            <button
                onClick={() =>
                    setShowStoreForm(
                        !showStoreForm
                    )
                }
            >
                {showStoreForm
                    ? "Close Add Store"
                    : "Add New Store"}
            </button>

            {showStoreForm && (

                <form
                    onSubmit={addStore}
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "20px",
                        marginTop: "20px",
                        width: "400px"
                    }}
                >

                    <h2>
                        Add Store
                    </h2>

                    <label>
                        Store Name
                    </label>

                    <br />

                    <input
                        value={newStore.name}
                        placeholder="Store Name"
                        onChange={(e) =>
                            setNewStore({
                                ...newStore,
                                name:
                                    e.target.value
                            })
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "8px"
                        }}
                    />

                    <br />
                    <br />

                    <label>
                        Email
                    </label>

                    <br />

                    <input
                        type="email"
                        value={newStore.email}
                        placeholder="Store Email"
                        onChange={(e) =>
                            setNewStore({
                                ...newStore,
                                email:
                                    e.target.value
                            })
                        }
                        style={{
                            width: "100%",
                            padding: "8px"
                        }}
                    />

                    <br />
                    <br />

                    <label>
                        Address
                    </label>

                    <br />

                    <input
                        value={newStore.address}
                        placeholder="Maximum 400 characters"
                        onChange={(e) =>
                            setNewStore({
                                ...newStore,
                                address:
                                    e.target.value
                            })
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "8px"
                        }}
                    />

                    <br />
                    <br />

                    <label>
                        Store Owner
                    </label>

                    <br />

                    <select
                        value={newStore.owner_id}
                        onChange={(e) =>
                            setNewStore({
                                ...newStore,
                                owner_id:
                                    e.target.value
                            })
                        }
                    >

                        <option value="">
                            Select Store Owner
                        </option>

                        {users
                            .filter(
                                (user) =>
                                    user.role ===
                                    "owner"
                            )
                            .map((owner) => (

                                <option
                                    key={owner.id}
                                    value={owner.id}
                                >
                                    {owner.name}
                                </option>

                            ))}

                    </select>

                    <br />
                    <br />

                    <button type="submit">
                        Add Store
                    </button>

                </form>
            )}

            {/* ==================================
                ALL USERS
            ================================== */}

            <h2
                style={{
                    marginTop: "40px"
                }}
            >
                All Users
            </h2>

            <input
                placeholder="Search Name, Email, Address or Role"
                value={searchUser}
                onChange={(e) =>
                    setSearchUser(
                        e.target.value
                    )
                }
                style={{
                    width: "400px",
                    padding: "10px"
                }}
            />

            <br />
            <br />

            <table
                border="1"
                cellPadding="10"
                style={{
                    borderCollapse:
                        "collapse",
                    width: "100%"
                }}
            >

                <thead>

                    <tr>

                        <th
                            onClick={() =>
                                handleUserSort(
                                    "id"
                                )
                            }
                        >
                            ID ↕
                        </th>

                        <th
                            onClick={() =>
                                handleUserSort(
                                    "name"
                                )
                            }
                        >
                            Name ↕
                        </th>

                        <th
                            onClick={() =>
                                handleUserSort(
                                    "email"
                                )
                            }
                        >
                            Email ↕
                        </th>

                        <th
                            onClick={() =>
                                handleUserSort(
                                    "address"
                                )
                            }
                        >
                            Address ↕
                        </th>

                        <th
                            onClick={() =>
                                handleUserSort(
                                    "role"
                                )
                            }
                        >
                            Role ↕
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {filteredUsers.map(
                        (user) => (

                            <tr
                                key={
                                    user.id
                                }
                            >

                                <td>
                                    {user.id}
                                </td>

                                <td>
                                    {user.name}
                                </td>

                                <td>
                                    {user.email}
                                </td>

                                <td>
                                    {user.address}
                                </td>

                                <td>
                                    {user.role}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            viewDetails(
                                                user
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            deleteUser(
                                                user.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            changeRole(
                                                user.id,
                                                user.role
                                            )
                                        }
                                    >
                                        Change Role
                                    </button>

                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

            {/* ==================================
                ALL STORES
            ================================== */}

            <h2
                style={{
                    marginTop: "40px"
                }}
            >
                All Stores
            </h2>

            <input
                placeholder="Search Store Name, Email or Address"
                value={searchStore}
                onChange={(e) =>
                    setSearchStore(
                        e.target.value
                    )
                }
                style={{
                    width: "400px",
                    padding: "10px"
                }}
            />

            <br />
            <br />

            <table
                border="1"
                cellPadding="10"
                style={{
                    borderCollapse:
                        "collapse",
                    width: "100%"
                }}
            >

                <thead>

                    <tr>

                        <th
                            onClick={() =>
                                handleStoreSort(
                                    "id"
                                )
                            }
                        >
                            ID ↕
                        </th>

                        <th
                            onClick={() =>
                                handleStoreSort(
                                    "name"
                                )
                            }
                        >
                            Store Name ↕
                        </th>

                        <th
                            onClick={() =>
                                handleStoreSort(
                                    "email"
                                )
                            }
                        >
                            Email ↕
                        </th>

                        <th
                            onClick={() =>
                                handleStoreSort(
                                    "address"
                                )
                            }
                        >
                            Address ↕
                        </th>

                        <th>
                            Rating
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {filteredStores.map(
                        (store) => (

                            <tr
                                key={
                                    store.id
                                }
                            >

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
                                    ⭐{" "}
                                    {Number(
                                        store.average_rating ||
                                        0
                                    ).toFixed(1)}
                                    {" "} / 5
                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}

export default AdminDashboard;