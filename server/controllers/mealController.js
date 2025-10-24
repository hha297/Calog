const Meal = require('../models/Meal');

const mealController = {
  getUserMeals: async (req, res) => {
    try {
      const { userId } = req.params;
      const { date } = req.query;

      let query = { userId };
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        query.date = { $gte: startDate, $lt: endDate };
      }

      const meals = await Meal.find(query).populate('foodId');
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  addMeal: async (req, res) => {
    try {
      const { userId, foodId, quantity, mealType } = req.body;

      const meal = new Meal({
        userId,
        foodId,
        quantity,
        mealType,
      });

      await meal.save();
      await meal.populate('foodId');

      res.status(201).json(meal);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  updateMeal: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity, mealType } = req.body;

      const meal = await Meal.findByIdAndUpdate(
        id,
        { quantity, mealType },
        { new: true },
      ).populate('foodId');

      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }

      res.json(meal);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  deleteMeal: async (req, res) => {
    try {
      const { id } = req.params;

      const meal = await Meal.findByIdAndDelete(id);
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }

      res.json({ message: 'Meal deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

module.exports = mealController;
