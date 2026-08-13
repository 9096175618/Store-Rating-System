const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db");

const router = express.Router();


// ==================================================
// VALIDATION HELPERS
// ==================================================

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;


// ==================================================
// REGISTER
// ==================================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            address,
            password
        } = req.body;


        // ------------------------------------------
        // REQUIRED FIELDS
        // ------------------------------------------

        if (!name || !email || !address || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        // ------------------------------------------
        // NAME VALIDATION
        // 20 - 60 CHARACTERS
        // ------------------------------------------

        if (name.trim().length < 20 ||
            name.trim().length > 60) {

            return res.status(400).json({
                message:
                    "Name must be between 20 and 60 characters"
            });

        }


        // ------------------------------------------
        // EMAIL VALIDATION
        // ------------------------------------------

        if (!emailRegex.test(email.trim())) {

            return res.status(400).json({
                message: "Please enter a valid email address"
            });

        }


        // ------------------------------------------
        // ADDRESS VALIDATION
        // MAX 400 CHARACTERS
        // ------------------------------------------

        if (address.trim().length > 400) {

            return res.status(400).json({
                message:
                    "Address must not exceed 400 characters"
            });

        }


        // ------------------------------------------
        // PASSWORD VALIDATION
        // 8 - 16 CHARACTERS
        // 1 UPPERCASE
        // 1 SPECIAL CHARACTER
        // ------------------------------------------

        if (!passwordRegex.test(password)) {

            return res.status(400).json({
                message:
                    "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });

        }


        // ------------------------------------------
        // CHECK DUPLICATE EMAIL
        // ------------------------------------------

        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email.trim()],
            async (err, results) => {

                if (err) {

                    return res.status(500).json({
                        message: "Database error",
                        error: err.message
                    });

                }


                if (results.length > 0) {

                    return res.status(400).json({
                        message: "Email already registered"
                    });

                }


                // ----------------------------------
                // HASH PASSWORD
                // ----------------------------------

                const hashedPassword =
                    await bcrypt.hash(password, 10);


                // ----------------------------------
                // CREATE NORMAL USER
                // ----------------------------------

                db.query(
                    `INSERT INTO users
                    (name, email, password, address, role)
                    VALUES (?, ?, ?, ?, 'user')`,

                    [
                        name.trim(),
                        email.trim(),
                        hashedPassword,
                        address.trim()
                    ],

                    (err, result) => {

                        if (err) {

                            return res.status(500).json({
                                message:
                                    "Registration failed",
                                error: err.message
                            });

                        }


                        res.status(201).json({
                            message:
                                "Registration successful"
                        });

                    }
                );

            }
        );

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

});


// ==================================================
// LOGIN
// ==================================================

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    // ------------------------------------------
    // REQUIRED FIELDS
    // ------------------------------------------

    if (!email || !password) {

        return res.status(400).json({
            message:
                "Email and password are required"
        });

    }


    // ------------------------------------------
    // EMAIL FORMAT
    // ------------------------------------------

    if (!emailRegex.test(email.trim())) {

        return res.status(400).json({
            message:
                "Please enter a valid email address"
        });

    }


    // ------------------------------------------
    // FIND USER
    // ------------------------------------------

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email.trim()],
        async (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });

            }


            // ----------------------------------
            // USER NOT FOUND
            // ----------------------------------

            if (results.length === 0) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }


            const user = results[0];


            // ----------------------------------
            // CHECK PASSWORD
            // ----------------------------------

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }


            // ----------------------------------
            // CREATE JWT
            // ----------------------------------

            const token = jwt.sign(

                {
                    id: user.id,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }

            );


            // ----------------------------------
            // LOGIN RESPONSE
            // ----------------------------------

            res.json({

                message: "Login successful",

                token: token,

                user: {

                    id: user.id,

                    name: user.name,

                    email: user.email,

                    address: user.address,

                    role: user.role

                }

            });

        }
    );

});


// ==================================================
// RESET PASSWORD
// ==================================================

router.put(
    "/reset-password",
    async (req, res) => {

        try {

            const {
                email,
                newPassword
            } = req.body;


            // --------------------------------------
            // REQUIRED FIELDS
            // --------------------------------------

            if (!email || !newPassword) {

                return res.status(400).json({
                    message:
                        "Email and new password are required"
                });

            }


            // --------------------------------------
            // EMAIL VALIDATION
            // --------------------------------------

            if (!emailRegex.test(email.trim())) {

                return res.status(400).json({
                    message:
                        "Please enter a valid email address"
                });

            }


            // --------------------------------------
            // PASSWORD VALIDATION
            // --------------------------------------

            if (!passwordRegex.test(newPassword)) {

                return res.status(400).json({
                    message:
                        "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
                });

            }


            // --------------------------------------
            // HASH PASSWORD
            // --------------------------------------

            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            // --------------------------------------
            // UPDATE PASSWORD
            // --------------------------------------

            db.query(

                "UPDATE users SET password = ? WHERE email = ?",

                [
                    hashedPassword,
                    email.trim()
                ],

                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            message:
                                "Password reset failed",
                            error: err.message
                        });

                    }


                    if (result.affectedRows === 0) {

                        return res.status(404).json({
                            message:
                                "User not found"
                        });

                    }


                    res.json({
                        message:
                            "Password reset successfully"
                    });

                }
            );

        } catch (error) {

            res.status(500).json({
                message: "Server error",
                error: error.message
            });

        }

    }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;