const express = require('express');
const router = express.Router();
const {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  getSuggestions,
  getDashboardStats
} = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// @route   GET /api/plans/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', getDashboardStats);

// @route   GET /api/plans
// @desc    Get all plans for user
// @access  Private
router.get('/', getPlans);

// @route   POST /api/plans
// @desc    Create new plan
// @access  Private
router.post('/', createPlan);

// @route   GET /api/plans/:id
// @desc    Get single plan
// @access  Private
router.get('/:id', getPlan);

// @route   PUT /api/plans/:id
// @desc    Update plan
// @access  Private
router.put('/:id', updatePlan);

// @route   DELETE /api/plans/:id
// @desc    Delete plan
// @access  Private
router.delete('/:id', deletePlan);

// @route   GET /api/plans/:id/suggestions
// @desc    Get investment suggestions for plan
// @access  Private
router.get('/:id/suggestions', getSuggestions);

module.exports = router;