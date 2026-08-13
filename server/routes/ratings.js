const express = require("express");
const db = require("../db");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// ADD / UPDATE RATING — LOGGED-IN USER
// ==========================================
router.post("/", verifyToken, (req, res) => {

    const userId = req.user.id;
    const { store_id, rating } = req.body;

    if (!store_id || rating === undefined) {
        return res.status(400).json({
            message: "Store ID and rating are required"
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5"
        });
    }

    db.query(
        "SELECT id, owner_id FROM stores WHERE id = ?",
        [store_id],
        (err, stores) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (stores.length === 0) {
                return res.status(404).json({
                    message: "Store not found"
                });
            }

            const store = stores[0];

            // Owner cannot rate own store
            if (store.owner_id === userId) {
                return res.status(403).json({
                    message: "You cannot rate your own store"
                });
            }

            // Check existing rating
            db.query(
                "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
                [userId, store_id],
                (err, existingRating) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Database error",
                            error: err.message
                        });
                    }

                    // Update existing rating
                    if (existingRating.length > 0) {

                        db.query(
                            `UPDATE ratings
                             SET rating = ?
                             WHERE user_id = ? AND store_id = ?`,
                            [rating, userId, store_id],
                            (err) => {

                                if (err) {
                                    return res.status(500).json({
                                        message: "Failed to update rating",
                                        error: err.message
                                    });
                                }

                                res.json({
                                    message: "Rating updated successfully"
                                });
                            }
                        );

                    } else {

                        // Add new rating
                        db.query(
                            `INSERT INTO ratings
                             (user_id, store_id, rating)
                             VALUES (?, ?, ?)`,
                            [userId, store_id, rating],
                            (err) => {

                                if (err) {
                                    return res.status(500).json({
                                        message: "Failed to add rating",
                                        error: err.message
                                    });
                                }

                                res.status(201).json({
                                    message: "Rating added successfully"
                                });
                            }
                        );
                    }
                }
            );
        }
    );
});


// ==========================================
// OWNER DASHBOARD
// GET OWNER'S RATINGS + AVERAGE
// ==========================================
router.get("/owner", verifyToken, (req, res) => {

    const ownerId = req.user.id;

    const sql = `
        SELECT
            stores.id AS store_id,
            stores.name AS store_name,
            stores.email AS store_email,
            stores.address AS store_address,

            COALESCE(AVG(ratings.rating), 0) AS average_rating,
            COUNT(ratings.id) AS total_ratings,

            ratings.id AS rating_id,
            ratings.rating,
            ratings.created_at,
            ratings.updated_at,

            users.id AS user_id,
            users.name AS user_name,
            users.email AS user_email

        FROM stores

        LEFT JOIN ratings
            ON stores.id = ratings.store_id

        LEFT JOIN users
            ON ratings.user_id = users.id

        WHERE stores.owner_id = ?

        GROUP BY
            stores.id,
            stores.name,
            stores.email,
            stores.address,
            ratings.id,
            ratings.rating,
            ratings.created_at,
            ratings.updated_at,
            users.id,
            users.name,
            users.email

        ORDER BY ratings.created_at DESC
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
// GET MY RATINGS — LOGGED-IN USER
// ==========================================
router.get("/my-ratings", verifyToken, (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            ratings.id,
            ratings.store_id,
            ratings.rating,
            ratings.created_at,
            ratings.updated_at,
            stores.name AS store_name
        FROM ratings
        INNER JOIN stores
            ON ratings.store_id = stores.id
        WHERE ratings.user_id = ?
        ORDER BY ratings.updated_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json(results);
    });
});


module.exports = router;