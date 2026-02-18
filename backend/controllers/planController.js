const Plan = require('../models/Plan');
const UserPreferences = require('../models/UserPreferences');
const { generateSuggestions } = require('../utils/suggestionAlgorithm');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Private
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Private
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Planul nu a fost găsit' });
    }
    
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nu ești autorizat' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

// @desc    Create new plan
// @route   POST /api/plans
// @access  Private
exports.createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      goal_amount,
      target_date,
      risk_level,
      category,
      monthly_contribution,
      notes
    } = req.body;
    
    if (!name || !goal_amount || !target_date) {
      return res.status(400).json({ 
        message: 'Nume, suma țintă și data țintă sunt obligatorii' 
      });
    }
    
    if (goal_amount <= 0) {
      return res.status(400).json({ message: 'Suma țintă trebuie să fie pozitivă' });
    }
    
    const plan = await Plan.create({
      user: req.user.id,
      name,
      description: description || '',
      goal_amount,
      target_date,
      risk_level: risk_level || 'medium',
      category: category || 'other',
      monthly_contribution: monthly_contribution || 0,
      notes: notes || '',
      status: 'active'
    });
    
    // Încearcă să genereze sugestii
    let suggestions = null;
    try {
      const preferences = await UserPreferences.findOne({ user: req.user.id });
      if (preferences) {
        suggestions = generateSuggestions(preferences.toObject());
      }
    } catch (err) {
      console.log('Could not generate suggestions:', err);
    }
    
    res.status(201).json({
      message: 'Plan creat cu succes',
      plan,
      suggestions
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Planul nu a fost găsit' });
    }
    
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nu ești autorizat' });
    }
    
    const {
      name,
      description,
      goal_amount,
      current_amount,
      target_date,
      risk_level,
      category,
      monthly_contribution,
      notes,
      status
    } = req.body;
    
    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (goal_amount !== undefined) plan.goal_amount = goal_amount;
    if (current_amount !== undefined) plan.current_amount = current_amount;
    if (target_date) plan.target_date = target_date;
    if (risk_level) plan.risk_level = risk_level;
    if (category) plan.category = category;
    if (monthly_contribution !== undefined) plan.monthly_contribution = monthly_contribution;
    if (notes !== undefined) plan.notes = notes;
    if (status) plan.status = status;
    
    await plan.save();
    
    res.json({
      message: 'Plan actualizat cu succes',
      plan
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Planul nu a fost găsit' });
    }
    
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nu ești autorizat' });
    }
    
    await plan.deleteOne();
    
    res.json({ message: 'Plan șters cu succes' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

// @desc    Get suggestions
// @route   GET /api/plans/:id/suggestions
// @access  Private
exports.getSuggestions = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Planul nu a fost găsit' });
    }
    
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nu ești autorizat' });
    }
    
    const preferences = await UserPreferences.findOne({ user: req.user.id });
    
    if (!preferences) {
      return res.status(404).json({ 
        message: 'Trebuie să configurezi mai întâi preferințele investiționale' 
      });
    }
    
    const suggestions = generateSuggestions(preferences.toObject());
    
    res.json(suggestions);
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/plans/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id });
    
    const stats = {
      totalPlans: plans.length,
      activePlans: plans.filter(p => p.status === 'active').length,
      totalGoalAmount: plans.reduce((sum, p) => sum + p.goal_amount, 0),
      totalCurrentAmount: plans.reduce((sum, p) => sum + p.current_amount, 0),
      averageProgress: plans.length > 0 
        ? plans.reduce((sum, p) => sum + p.progress, 0) / plans.length 
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};