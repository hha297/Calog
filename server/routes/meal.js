const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

router.get('/user/:userId', mealController.getUserMeals);
router.post('/', mealController.addMeal);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);

module.exports = router;
