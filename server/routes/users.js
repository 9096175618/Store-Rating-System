const express = require("express");
const db = require("../db");

const {
    verifyToken,
    isAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL USERS — ADMIN ONLY
// WITH STORE OWNER AVERAGE RATING
// ==========================================
router.get("/", verifyToken, isAdmin, (req, res) => {

    const sql = `
        SELECT
            users.id,
            users.name,
            users.email,
            users.address,
            users.role,
            users.created_at,

            COALESCE(
                AVG(
                    CASE
                        WHEN stores.owner_id = users.id
                        THEN ratings.rating
                    END
                ),
                0
            ) AS average_rating

        FROM users

        LEFT JOIN stores
            ON stores.owner_id = users.id

        LEFT JOIN ratings
            ON ratings.store_id = stores.id

        GROUP BY
            users.id,
            users.name,
            users.email,
            users.address,
            users.role,
            users.created_at

        ORDER BY users.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(
                "Get users error:",
                err
            );

            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json(results);
    });
});


// ==========================================
// DELETE USER — ADMIN ONLY
// ==========================================
router.delete("/:id", verifyToken, isAdmin, (req, res) => {

    const userId = req.params.id;

    db.query(
        "DELETE FROM users WHERE id = ?",
        [userId],
        (err, result) => {

            if (err) {

                console.error(
                    "Delete user error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "User deleted successfully"
            });
        }
    );
});


// ==========================================
// UPDATE USER ROLE — ADMIN ONLY
// ==========================================
router.put("/:id/role", verifyToken, isAdmin, (req, res) => {

    const userId = req.params.id;
    const { role } = req.body;

    const allowedRoles = [
        "user",
        "owner",
        "admin"
    ];

    if (!allowedRoles.includes(role)) {

        return res.status(400).json({
            message:
                "Invalid role. Use user, owner, or admin."
        });
    }

    db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, userId],
        (err, result) => {

            if (err) {

                console.error(
                    "Update role error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message:
                    "User role updated successfully"
            });
        }
    );
});


module.exports = router;