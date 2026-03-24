const Plan = require('../models/Plan');
const UserPreferences = require('../models/UserPreferences');
const financialCalc = require('../utils/financialCalculations');

// @desc    Create new plan with comprehensive calculations
// @route   POST /api/plans
// @access  Private
exports.createPlan = async (req, res) => {
  try {
    const {
      category,
      name,
      priority,
      deadline,
      goal_amount,
      initial_savings,
      payment_method,
      monthly_savings,
      with_investments,
      // Pentru credit
      credit_down_payment,
      credit_interest_rate,
      credit_term_years
    } = req.body;

    // Validare bază
    if (!category || !name || !goal_amount || !payment_method) {
      return res.status(400).json({ message: 'Câmpuri obligatorii lipsesc' });
    }

    const planData = {
      user: req.user.id,
      category,
      name,
      priority: priority || 2,
      deadline,
      goal_amount,
      initial_savings: initial_savings || 0,
      current_amount: initial_savings || 0,
      payment_method
    };

    // Calcul ajustare inflație (3% presupus)
    if (deadline) {
      const yearsUntilDeadline = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24 * 365);
      planData.inflation_adjusted_amount = financialCalc.calculateInflationAdjustedAmount(
        goal_amount,
        3, // 3% inflație anuală
        yearsUntilDeadline
      );
    }

    // Calcule pentru SURSĂ PROPRIE INTEGRALĂ
    if (payment_method === 'full_savings') {
      if (!monthly_savings) {
        return res.status(400).json({ message: 'Economiile lunare sunt obligatorii' });
      }

      planData.monthly_savings = monthly_savings;
      planData.with_investments = with_investments || false;

      const remaining = goal_amount - (initial_savings || 0);

      // Calcul FĂRĂ investiții
      planData.months_without_investments = financialCalc.calculateMonthsWithoutInvestments(
        goal_amount,
        monthly_savings,
        initial_savings || 0
      );
      planData.total_saved_without_investments = remaining;

      // Calcul CU investiții (dacă selectat)
      if (with_investments) {
        // Preia preferințe utilizator pentru randament
        const preferences = await UserPreferences.findOne({ user: req.user.id });
        
        if (!preferences) {
          return res.status(400).json({ 
            message: 'Trebuie să setezi preferințele mai întâi pentru calculele cu investiții' 
          });
        }

        // Calculează randament bazat pe risc
        let annualReturn = 7; // Default echilibrat
        if (preferences.risk_tolerance === 'low') annualReturn = 5;
        if (preferences.risk_tolerance === 'high') annualReturn = 12;

        planData.investment_return_rate = annualReturn;
        
        planData.months_with_investments = financialCalc.calculateMonthsWithInvestments(
          goal_amount,
          monthly_savings,
          annualReturn,
          initial_savings || 0
        );

        const futureValue = financialCalc.calculateFutureValue(
          monthly_savings,
          annualReturn,
          planData.months_with_investments
        );

        planData.total_invested = monthly_savings * planData.months_with_investments;
        planData.investment_gain = financialCalc.calculateInvestmentGain(
          futureValue,
          planData.total_invested
        );

        // Generează alocări din preferințe
        const { generateSuggestions } = require('../utils/suggestionAlgorithm');
        const suggestions = generateSuggestions(preferences.toObject());
        planData.investment_allocations = suggestions.allocations.map(alloc => ({
          asset: alloc.asset,
          percentage: alloc.percentage,
          monthly_amount: (monthly_savings * alloc.percentage) / 100
        }));
      }
    }

    // Calcule pentru CREDIT BANCAR
    if (payment_method === 'savings_plus_credit') {
      if (!credit_down_payment || !credit_interest_rate || !credit_term_years) {
        return res.status(400).json({ 
          message: 'Detalii credit incomplete (avans, dobândă, perioadă)' 
        });
      }

      // Validare avans minim 25%
      const minimumDownPayment = goal_amount * 0.25;
      if (credit_down_payment < minimumDownPayment) {
        return res.status(400).json({ 
          message: `Avansul minim este ${minimumDownPayment} (25% din ${goal_amount})` 
        });
      }

      planData.credit_down_payment = credit_down_payment;
      planData.credit_amount = goal_amount - credit_down_payment;
      planData.credit_interest_rate = credit_interest_rate;
      planData.credit_term_years = credit_term_years;

      // Calculează rată lunară
      planData.credit_monthly_payment = financialCalc.calculateMonthlyPayment(
        planData.credit_amount,
        credit_interest_rate,
        credit_term_years
      );

      // Calculează total de plătit
      planData.credit_total_payment = financialCalc.calculateTotalPayment(
        planData.credit_monthly_payment,
        credit_term_years
      );

      // Calculează dobândă totală
      planData.credit_total_interest = financialCalc.calculateTotalInterest(
        planData.credit_total_payment,
        planData.credit_amount
      );

      // Calculează venit minim necesar
      planData.minimum_income_required = financialCalc.calculateMinimumIncome(
        planData.credit_monthly_payment
      );

      // Dacă are economii lunare pentru avans
      if (monthly_savings) {
        planData.monthly_savings = monthly_savings;
        planData.months_without_investments = financialCalc.calculateMonthsWithoutInvestments(
          credit_down_payment,
          monthly_savings,
          initial_savings || 0
        );
      }
    }

    // Calculează progres inițial
    planData.progress_percentage = financialCalc.calculateProgress(
      planData.current_amount,
      goal_amount
    );

    const plan = await Plan.create(planData);
    res.status(201).json(plan);

  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Eroare la crearea planului', error: error.message });
  }
};

// @desc    Get all user plans
// @route   GET /api/plans
// @access  Private
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la preluarea planurilor', error: error.message });
  }
};

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Private
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Planul nu există' });
    }

    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nu ai acces la acest plan' });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la preluarea planului', error: error.message });
  }
};

// @desc    Add contribution to plan
// @route   POST /api/plans/:id/contribute
// @access  Private
exports.addContribution = async (req, res) => {
  try {
    const { amount, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Suma trebuie să fie pozitivă' });
    }

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Planul nu există' });
    }

    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nu ai acces la acest plan' });
    }

    await plan.addContribution(amount, note);

    // Check if goal reached
    if (plan.current_amount >= plan.goal_amount) {
      plan.status = 'completed';
      await plan.save();
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la adăugarea contribuției', error: error.message });
  }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Planul nu există' });
    }

    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nu ai acces la acest plan' });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la actualizarea planului', error: error.message });
  }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Planul nu există' });
    }

    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nu ai acces la acest plan' });
    }

    await plan.deleteOne();
    res.json({ message: 'Plan șters cu succes' });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la ștergerea planului', error: error.message });
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
      completedPlans: plans.filter(p => p.status === 'completed').length,
      totalGoalAmount: plans.reduce((sum, p) => sum + p.goal_amount, 0),
      totalCurrentAmount: plans.reduce((sum, p) => sum + p.current_amount, 0),
      averageProgress: plans.length > 0 
        ? plans.reduce((sum, p) => sum + p.progress_percentage, 0) / plans.length 
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la preluarea statisticilor', error: error.message });
  }
};


