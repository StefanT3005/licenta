const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const planController = require('../controllers/planController');

router.get('/stats/dashboard', protect, planController.getDashboardStats);

router.route('/')
  .get(protect, planController.getPlans)
  .post(protect, planController.createPlan);

router.route('/:id')
  .get(protect, planController.getPlan)
  .put(protect, planController.updatePlan)
  .delete(protect, planController.deletePlan);

router.post('/:id/contribute', protect, planController.addContribution);

module.exports = router;