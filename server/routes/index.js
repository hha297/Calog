const authRoutes = require('./auth');
const foodRoutes = require('./food');
const mealRoutes = require('./meal');

module.exports = app => {
  app.use('/api/auth', authRoutes);
  app.use('/api/foods', foodRoutes);
  app.use('/api/meals', mealRoutes);
};
