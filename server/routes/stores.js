const express = require("express");
const db = require("../db");

const {
    verifyToken,
    isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL STORES WITH AVERAGE RATING
// ==========================================
router.get("/", (req, res) => {

    const sql = `
        SELECT
            stores.id,
            stores.name,
            stores.email,
            stores.address,
            stores.owner_id,
            stores.created_at,

            COALESCE(AVG(ratings.rating), 0) AS average_rating,

            COUNT(ratings.id) AS total_ratings

        FROM stores

        LEFT JOIN ratings
            ON stores.id = ratings.store_id

        GROUP BY
            stores.id,
            stores.name,
            stores.email,
            stores.address,
            stores.owner_id,
            stores.created_at

        ORDER BY stores.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Store fetch error:", err);

            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json(results);
    });
});


// ==========================================
// GET OWNER'S STORES
// ==========================================
router.get("/owner/my-stores", verifyToken, (req, res) => {

    const ownerId = req.user.id;

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            owner_id,
            created_at
        FROM stores
        WHERE owner_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [ownerId], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json(results);
    });
});


// ==========================================
// ADD STORE — ADMIN ONLY
// ==========================================
router.post("/", verifyToken, isAdmin, (req, res) => {

    const {
        name,
        email,
        address,
        owner_id
    } = req.body;

    if (!name || !address) {
        return res.status(400).json({
            message: "Store name and address are required"
        });
    }

    const sql = `
        INSERT INTO stores
        (name, email, address, owner_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            email || null,
            address,
            owner_id || null
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to add store",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Store added successfully",
                storeId: result.insertId
            });
        }
    );
});


// ==========================================
// UPDATE STORE — ADMIN ONLY
// ==========================================
router.put("/:id", verifyToken, isAdmin, (req, res) => {

    const storeId = req.params.id;

    const {
        name,
        email,
        address,
        owner_id
    } = req.body;

    if (!name || !address) {
        return res.status(400).json({
            message: "Store name and address are required"
        });
    }

    const sql = `
        UPDATE stores
        SET
            name = ?,
            email = ?,
            address = ?,
            owner_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            email || null,
            address,
            owner_id || null,
            storeId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to update store",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Store not found"
                });
            }

            res.json({
                message: "Store updated successfully"
            });
        }
    );
});


// ==========================================
// DELETE STORE — ADMIN ONLY
// ==========================================
router.delete("/:id", verifyToken, isAdmin, (req, res) => {

    const storeId = req.params.id;

    db.query(
        "DELETE FROM stores WHERE id = ?",
        [storeId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Store not found"
                });
            }

            res.json({
                message: "Store deleted successfully"
            });
        }
    );
});


module.exports = router;