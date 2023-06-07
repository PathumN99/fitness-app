const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const dotenv = require('dotenv');

dotenv.config();
var app = express();
app.use(bodyParser.json());

// Exercise Router
const exerciseRouter = require("./src/modules/exercise/exercise.controller");
app.use('/exercise', exerciseRouter); 

// Food Router
const foodRouter = require("./src/modules/food/food.controller");
app.use('/food', foodRouter);

// Recipe Router
const recipeRouter = require("./src/modules/recipe/recipe.controller");
app.use('/recipe', recipeRouter);

// Workout Router
const workoutRouter = require("./src/modules/workout/workout.controller");
app.use('/workout', workoutRouter);

// User Router
const userRouter = require("./src/modules/users/users.controller");
app.use('/users', userRouter);


// PORT
// To set a port, execute the command 'set PORT=2000' in the terminal
const port = process.env.APP_PORT;
app.listen(port, console.log(`express server running at port ${port}`));
