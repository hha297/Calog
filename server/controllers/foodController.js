const Food = require('../models/Food');

const foodController = {
  getAllFoods: async (req, res) => {
    try {
      const foods = await Food.find();
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getFoodById: async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);
      if (!food) {
        return res.status(404).json({ message: 'Food not found' });
      }
      res.json(food);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  createFood: async (req, res) => {
    try {
      const { name, calories, protein, carbs, fat, image, category } = req.body;

      const food = new Food({
        name,
        calories,
        protein,
        carbs,
        fat,
        image,
        category,
      });

      await food.save();
      res.status(201).json(food);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  searchFoods: async (req, res) => {
    try {
      const { query } = req.query;
      const foods = await Food.find({
        name: { $regex: query, $options: 'i' },
      });
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

module.exports = foodController;
