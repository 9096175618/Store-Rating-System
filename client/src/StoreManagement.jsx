import { useEffect, useState } from "react";
import axios from "axios";

function StoreManagement() {
    const [stores, setStores] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [ownerId, setOwnerId] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    // ==========================================
    // GET ALL STORES
    // ==========================================
    useEffect(() => {
        getStores();
    }, []);

    const getStores = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/stores",
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
    // ADD / UPDATE STORE
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const storeData = {
                name: name,
                email: email,
                address: address,
                owner_id: ownerId || null
            };

            let response;

            if (editingId) {

                // UPDATE
                response = await axios.put(
                    `http://localhost:5000/api/stores/${editingId}`,
                    storeData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            } else {

                // ADD
                response = await axios.post(
                    "http://localhost:5000/api/stores",
                    storeData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            setMessage(response.data.message);

            clearForm();
            getStores();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Operation failed"
            );
        }
    };


    // ==========================================
    // EDIT STORE
    // ==========================================
    const editStore = (store) => {

        setEditingId(store.id);

        setName(store.name || "");
        setEmail(store.email || "");
        setAddress(store.address || "");
        setOwnerId(store.owner_id || "");

        setMessage("Editing store...");
    };


    // ==========================================
    // CLEAR FORM
    // ==========================================
    const clearForm = () => {

        setEditingId(null);
        setName("");
        setEmail("");
        setAddress("");
        setOwnerId("");
    };


    // ==========================================
    // DELETE STORE
    // ==========================================
    const deleteStore = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this store?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `http://localhost:5000/api/stores/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);

            getStores();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to delete store"
            );
        }
    };


    return (
        <div>

            <h1>Store Management</h1>

            {message && (
                <p>{message}</p>
            )}


            {/* ==================================
                STORE FORM
            ================================== */}

            <h2>
                {editingId ? "Edit Store" : "Add Store"}
            </h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Store Name</label>
                    <br />

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Address</label>
                    <br />

                    <textarea
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Owner ID</label>
                    <br />

                    <input
                        type="number"
                        value={ownerId}
                        onChange={(e) =>
                            setOwnerId(e.target.value)
                        }
                    />
                </div>

                <br />

                <button type="submit">
                    {editingId ? "Update Store" : "Add Store"}
                </button>

                {editingId && (
                    <>
                        {" "}

                        <button
                            type="button"
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    </>
                )}

            </form>


            {/* ==================================
                ALL STORES
            ================================== */}

            <h2>All Stores</h2>

            {stores.length > 0 ? (

                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Owner ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {stores.map((store) => (

                            <tr key={store.id}>

                                <td>{store.id}</td>

                                <td>{store.name}</td>

                                <td>{store.email}</td>

                                <td>{store.address}</td>

                                <td>
                                    {store.owner_id || "Not assigned"}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            editStore(store)
                                        }
                                    >
                                        Edit
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            deleteStore(store.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            ) : (

                <p>No stores found.</p>

            )}

        </div>
    );
}

export default StoreManagement;