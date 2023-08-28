const User = require('../models/User');
const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async (req, res, next) => {
    try {
        const token =
            req.cookies.Token ||
            req.body.Token ||
            (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : "");
        if (!token) return res.status(401).json({
            success: false,
            message: "Token is missing...",
        });
        try {
            const decode = jwt.verify(token, process.env.SECRET_JWT);
            console.log(decode);
            req.user = decode;
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while validating the token...${err.message}`,
        });
    }
}

// Middleware for checking if the user is a student
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: `This is a protected route for students only...`,
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `User role cannot be verified: ${err.message}`,
        });
    }
}

// Middleware for checking if the user is an instructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: `This is a protected route for instructors only...`,
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `User role cannot be verified: ${err.message}`,
        });
    }
}

// Middleware for checking if the user is an admin
exports.isAdmin = async (req, res, next) => {
    try {
        console.log(req.user.accountType);
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: `This is a protected route for admins only...`,
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `User role cannot be verified: ${err}`,
        });
    }
}
