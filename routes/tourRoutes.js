const express = require('express');
const {
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
  // checkID,
  // checkBody
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`Tour requested id is: ${val}`);
  next();
});

// router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router
  .route('/')
  .get(getAllTours)
  .post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
