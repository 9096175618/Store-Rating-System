import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [message, setMessage] = useState("");

    const [searchUser, setSearchUser] = useState("");
    const [searchStore, setSearchStore] = useState("");

    const [showUserForm, setShowUserForm] = useState(false);
    const [showStoreForm, setShowStoreForm] = useState(false);

    const [activeSection, setActiveSection] = useState("dashboard");

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

    // ==============================
    // TOKEN
    // ==============================

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // ==============================
    // LOAD DATA
    // ==============================

    useEffect(() => {
        getUsers();
        getStores();
    }, []);

    // ==============================
    // GET USERS
    // ==============================

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

    // ==============================
    // GET STORES
    // ==============================

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

    // ==============================
    // VIEW USER DETAILS
    // ==============================

    const viewDetails = (user) => {
        const ownerStore = stores.find(
            (store) =>
                Number(store.owner_id) === Number(user.id)
        );

        const ratingText = ownerStore
            ? `${Number(
                ownerStore.average_rating || 0
            ).toFixed(1)} / 5`
            : "No rating yet";

        alert(
            `Name: ${user.name}\n\n` +
            `Email: ${user.email}\n\n` +
            `Address: ${user.address}\n\n` +
            `Role: ${user.role}\n\n` +
            `Store Rating: ${ratingText}`
        );
    };

    // ==============================
    // DELETE USER
    // ==============================

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

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

    // ==============================
    // CHANGE ROLE
    // ==============================

    const changeRole = async (id, currentRole) => {
        const newRole = window.prompt(
            "Enter new role: user, owner, or admin",
            currentRole
        );

        if (!newRole) return;

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
                    role
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

    // ==============================
    // ADD USER
    // ==============================

    const addUser = async (e) => {
        e.preventDefault();

        const name = newUser.name.trim();
        const email = newUser.email.trim();
        const password = newUser.password;
        const address = newUser.address.trim();

        if (name.length < 20 || name.length > 60) {
            alert(
                "Name must be between 20 and 60 characters."
            );
            return;
        }

        if (address.length > 400) {
            alert(
                "Address must not exceed 400 characters."
            );
            return;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert(
                "Please enter a valid email address."
            );
            return;
        }

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

    // ==============================
    // ADD STORE
    // ==============================

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

    // ==============================
    // LOGOUT
    // ==============================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    // ==============================
    // SORT
    // ==============================

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

    // ==============================
    // FILTER USERS
    // ==============================

    const filteredUsers = users
        .filter((user) => {
            const value = searchUser.toLowerCase();

            return (
                String(user.name || "")
                    .toLowerCase()
                    .includes(value) ||
                String(user.email || "")
                    .toLowerCase()
                    .includes(value) ||
                String(user.address || "")
                    .toLowerCase()
                    .includes(value) ||
                String(user.role || "")
                    .toLowerCase()
                    .includes(value)
            );
        })
        .sort((a, b) => {
            const field = sortUser.field;

            const first = String(
                a[field] || ""
            ).toLowerCase();

            const second = String(
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

    // ==============================
    // FILTER STORES
    // ==============================

    const filteredStores = stores
        .filter((store) => {
            const value = searchStore.toLowerCase();

            return (
                String(store.name || "")
                    .toLowerCase()
                    .includes(value) ||
                String(store.email || "")
                    .toLowerCase()
                    .includes(value) ||
                String(store.address || "")
                    .toLowerCase()
                    .includes(value)
            );
        })
        .sort((a, b) => {
            const field = sortStore.field;

            const first = String(
                a[field] || ""
            ).toLowerCase();

            const second = String(
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

    // ==============================
    // STATISTICS
    // ==============================

    const totalUsers = users.length;
    const totalStores = stores.length;

    const totalRatings = stores.reduce(
        (total, store) =>
            total +
            Number(store.total_ratings || 0),
        0
    );

    const averageRating =
        stores.length > 0
            ? stores.reduce(
                (sum, store) =>
                    sum +
                    Number(
                        store.average_rating || 0
                    ),
                0
            ) / stores.length
            : 0;

    // ==============================
    // RENDER
    // ==============================

    return (
        <div className="admin-layout">

            {/* SIDEBAR */}

            <aside className="admin-sidebar">

                <div className="brand">
                    <div className="brand-icon">
                        ★
                    </div>

                    <div>
                        <h2>StoreRate</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="sidebar-nav">

                    <button
                        className={
                            activeSection === "dashboard"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActiveSection("dashboard")
                        }
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button
                        className={
                            activeSection === "users"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() => {
                            setActiveSection("users");
                            setTimeout(() => {
                                document
                                    .getElementById("users-section")
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    });
                            }, 50);
                        }}
                    >
                        <span>♙</span>
                        Users
                    </button>

                    <button
                        className={
                            activeSection === "stores"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() => {
                            setActiveSection("stores");
                            setTimeout(() => {
                                document
                                    .getElementById("stores-section")
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    });
                            }, 50);
                        }}
                    >
                        <span>▣</span>
                        Stores
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => {
                            setActiveSection("ratings");
                            setTimeout(() => {
                                document
                                    .getElementById("stores-section")
                                    ?.scrollIntoView({
                                        behavior: "smooth"
                                    });
                            }, 50);
                        }}
                    >
                        <span>★</span>
                        Ratings
                    </button>

                </nav>

                <div className="sidebar-bottom">

                    <div className="admin-profile">
                        <div className="avatar">
                            A
                        </div>

                        <div>
                            <strong>Administrator</strong>
                            <small>System Admin</small>
                        </div>
                    </div>

                    <button
                        className="logout-sidebar"
                        onClick={logout}
                    >
                        ⇥ Logout
                    </button>

                </div>

            </aside>

            {/* MAIN */}

            <main className="admin-main">

                {/* TOP BAR */}

                <header className="topbar">

                    <div>
                        <p className="breadcrumb">
                            Admin / Dashboard
                        </p>

                        <h1>
                            Welcome back, Admin 👋
                        </h1>

                        <p className="subtitle">
                            Manage your store rating platform
                            from one place.
                        </p>
                    </div>

                    <button
                        className="top-logout"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </header>

                {/* MESSAGE */}

                {message && (
                    <div className="success-message">
                        <span>✓</span>
                        {message}

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* STATISTICS */}

                <section className="stats-grid">

                    <div className="stat-card blue">

                        <div className="stat-icon">
                            ♙
                        </div>

                        <div>
                            <p>Total Users</p>
                            <h2>{totalUsers}</h2>
                            <span>
                                Registered users
                            </span>
                        </div>

                    </div>

                    <div className="stat-card purple">

                        <div className="stat-icon">
                            ▣
                        </div>

                        <div>
                            <p>Total Stores</p>
                            <h2>{totalStores}</h2>
                            <span>
                                Stores registered
                            </span>
                        </div>

                    </div>

                    <div className="stat-card orange">

                        <div className="stat-icon">
                            ★
                        </div>

                        <div>
                            <p>Total Ratings</p>
                            <h2>{totalRatings}</h2>
                            <span>
                                Customer ratings
                            </span>
                        </div>

                    </div>

                    <div className="stat-card green">

                        <div className="stat-icon">
                            ✓
                        </div>

                        <div>
                            <p>Average Rating</p>
                            <h2>
                                {averageRating.toFixed(1)}
                            </h2>
                            <span>
                                Out of 5.0
                            </span>
                        </div>

                    </div>

                </section>

                {/* QUICK ACTIONS */}

                <section className="quick-actions">

                    <div>
                        <h2>Quick Actions</h2>
                        <p>
                            Quickly manage users and stores.
                        </p>
                    </div>

                    <div className="action-buttons">

                        <button
                            className="primary-btn"
                            onClick={() =>
                                setShowUserForm(
                                    !showUserForm
                                )
                            }
                        >
                            + Add New User
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                setShowStoreForm(
                                    !showStoreForm
                                )
                            }
                        >
                            + Add New Store
                        </button>

                    </div>

                </section>

                {/* ADD USER FORM */}

                {showUserForm && (
                    <form
                        onSubmit={addUser}
                        className="form-card"
                    >

                        <div className="form-title">
                            <div>
                                <h2>Add New User</h2>
                                <p>
                                    Create a new platform user.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="close-btn"
                                onClick={() =>
                                    setShowUserForm(false)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Name</label>

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
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    value={newUser.email}
                                    placeholder="user@example.com"
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            email:
                                                e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>

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
                                />

                                <small>
                                    8-16 characters, one uppercase
                                    and one special character.
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Role</label>

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
                            </div>

                            <div className="form-group full">
                                <label>Address</label>

                                <textarea
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
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            Create User
                        </button>

                    </form>
                )}

                {/* ADD STORE FORM */}

                {showStoreForm && (
                    <form
                        onSubmit={addStore}
                        className="form-card"
                    >

                        <div className="form-title">

                            <div>
                                <h2>Add New Store</h2>
                                <p>
                                    Register a new store.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="close-btn"
                                onClick={() =>
                                    setShowStoreForm(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Store Name</label>

                                <input
                                    value={newStore.name}
                                    placeholder="Enter store name"
                                    onChange={(e) =>
                                        setNewStore({
                                            ...newStore,
                                            name:
                                                e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    value={newStore.email}
                                    placeholder="store@example.com"
                                    onChange={(e) =>
                                        setNewStore({
                                            ...newStore,
                                            email:
                                                e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Store Owner</label>

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
                            </div>

                            <div className="form-group full">
                                <label>Address</label>

                                <textarea
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
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            Create Store
                        </button>

                    </form>
                )}

                {/* USERS */}

                <section
                    id="users-section"
                    className="data-card"
                >

                    <div className="section-header">

                        <div>
                            <h2>All Users</h2>

                            <p>
                                Manage registered users
                                and their roles.
                            </p>
                        </div>

                        <span className="count-badge">
                            {filteredUsers.length} Users
                        </span>

                    </div>

                    <div className="search-box">

                        <span>⌕</span>

                        <input
                            placeholder="Search name, email, address or role..."
                            value={searchUser}
                            onChange={(e) =>
                                setSearchUser(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="table-wrapper">

                        <table className="modern-table">

                            <thead>
                                <tr>

                                    <th
                                        onClick={() =>
                                            handleUserSort("id")
                                        }
                                    >
                                        ID ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleUserSort("name")
                                        }
                                    >
                                        User ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleUserSort("email")
                                        }
                                    >
                                        Email ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleUserSort("address")
                                        }
                                    >
                                        Address ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleUserSort("role")
                                        }
                                    >
                                        Role ↕
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="empty-state"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(
                                        (user) => (
                                            <tr
                                                key={user.id}
                                            >

                                                <td>
                                                    <span className="id-badge">
                                                        #{user.id}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="user-cell">

                                                        <div className="table-avatar">
                                                            {String(
                                                                user.name ||
                                                                "U"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <strong>
                                                            {user.name}
                                                        </strong>

                                                    </div>
                                                </td>

                                                <td>
                                                    {user.email}
                                                </td>

                                                <td>
                                                    {user.address}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`role-badge ${user.role}`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td>

                                                    <div className="action-group">

                                                        <button
                                                            className="view-btn"
                                                            onClick={() =>
                                                                viewDetails(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                        <button
                                                            className="role-btn"
                                                            onClick={() =>
                                                                changeRole(
                                                                    user.id,
                                                                    user.role
                                                                )
                                                            }
                                                        >
                                                            Role
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

                {/* STORES */}

                <section
                    id="stores-section"
                    className="data-card"
                >

                    <div className="section-header">

                        <div>
                            <h2>All Stores</h2>

                            <p>
                                View and manage registered
                                stores and ratings.
                            </p>
                        </div>

                        <span className="count-badge">
                            {filteredStores.length} Stores
                        </span>

                    </div>

                    <div className="search-box">

                        <span>⌕</span>

                        <input
                            placeholder="Search store name, email or address..."
                            value={searchStore}
                            onChange={(e) =>
                                setSearchStore(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="table-wrapper">

                        <table className="modern-table">

                            <thead>

                                <tr>

                                    <th
                                        onClick={() =>
                                            handleStoreSort("id")
                                        }
                                    >
                                        ID ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleStoreSort("name")
                                        }
                                    >
                                        Store ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleStoreSort("email")
                                        }
                                    >
                                        Email ↕
                                    </th>

                                    <th
                                        onClick={() =>
                                            handleStoreSort("address")
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

                                {filteredStores.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="empty-state"
                                        >
                                            No stores found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStores.map(
                                        (store) => (
                                            <tr
                                                key={store.id}
                                            >

                                                <td>
                                                    <span className="id-badge">
                                                        #{store.id}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="store-cell">

                                                        <div className="store-icon">
                                                            ▣
                                                        </div>

                                                        <strong>
                                                            {store.name}
                                                        </strong>

                                                    </div>
                                                </td>

                                                <td>
                                                    {store.email ||
                                                        "—"}
                                                </td>

                                                <td>
                                                    {store.address}
                                                </td>

                                                <td>

                                                    <div className="rating">

                                                        <span>
                                                            ★
                                                        </span>

                                                        <strong>
                                                            {Number(
                                                                store.average_rating ||
                                                                0
                                                            ).toFixed(1)}
                                                        </strong>

                                                        <small>
                                                            / 5
                                                        </small>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

                {/* FOOTER */}

                <footer className="dashboard-footer">
                    <span>
                        © 2026 StoreRate
                    </span>

                    <span>
                        Store Rating Management System
                    </span>
                </footer>

            </main>

        </div>
    );
}

export default AdminDashboard;