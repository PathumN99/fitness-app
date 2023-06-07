const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../connection');
const exerciseService = require('./exercise.service');


// GET all
router.get("/get-all", exerciseService.getAll);

// GET by ID
router.get("/get-by-id/:id", exerciseService.getById);

// Delete
router.delete("/delete/:id", exerciseService.deleteById);

// POST
router.post("/create", exerciseService.createRecord);

// PUT
router.put("/update", exerciseService.updateRecord);



module.exports = router;