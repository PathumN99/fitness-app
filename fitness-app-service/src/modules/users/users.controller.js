const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../connection');
const dotenv = require('dotenv');
const usersService = require('./users.service');

dotenv.config();

// Create user
router.post("/create-user", usersService.createUser);


// user login
router.post("/login-user", usersService.loginUser);


// Change user password
router.put("/change-password", usersService.changePassword);


// forgot password
router.post("/forgot-password", usersService.forgotPassword);


// Update user details
router.put("/update", usersService.updateRecord);


// GET all users
router.get("/get-all", usersService.getAll);


// GET by ID
router.get("/get-by-id/:id", usersService.getById);


// Delete user account
router.delete("/delete/:id", usersService.deleteById);




module.exports = router;