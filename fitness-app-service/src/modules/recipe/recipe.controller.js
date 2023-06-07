const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../connection');
const recipeService = require('./recipe.service');


// GET all
router.get("/get-all", recipeService.getAll);

// GET by ID
router.get("/get-by-id/:id", recipeService.getById);

// Delete
router.delete("/delete/:id", recipeService.deleteById);

// POST
router.post("/create", recipeService.createRecord);

// PUT
router.put("/update", recipeService.updateRecord);



module.exports = router;