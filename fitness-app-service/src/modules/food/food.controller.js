const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../connection');
const foodService = require('./food.service');


// GET all
router.get("/get-all", foodService.getAll);

// GET by ID
router.get("/get-by-id/:id", foodService.getById);

// Delete
router.delete("/delete/:id", foodService.deleteById);

// POST
router.post("/create", foodService.createRecord);

// PUT
router.put("/update", foodService.updateRecord);



module.exports = router;