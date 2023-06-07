const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../connection');
const workoutService = require('./workout.service');

// GET all
router.get("/get-all", workoutService.getAll);

// GET by ID
router.get("/get-by-id/:id", workoutService.getById);

// Delete
router.delete("/delete/:id", workoutService.deleteById);

// POST
router.post("/create", workoutService.createRecord);

// PUT
router.put("/update", workoutService.updateRecord);



module.exports = router;