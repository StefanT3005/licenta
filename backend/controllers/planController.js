const Plan = require('../models/Plan');
const UserPreferences = require('../models/UserPreferences');
const financialCalc = require('../utils/financialCalculations');

exports.createPlan = async (req, res) => {
  try {
    let {
      category,
      name,
      priority,
      deadline,
      goal_amount,
      initial_savings,
      payment_method,
      monthly_savings,
      with_investments,
      credit_down_payment,
      credit_interest_rate,
      credit_term_years
    } = req.body;

    goal_amount = parseFloat(goal_amount) || 0;
    initial_savings = parseFloat(initial_savings) || 0;
    monthly_savings = parseFloat(monthly_savings) || 0;
    credit_down_payment = parseFloat(credit_down_payment) || 0;
    credit_interest_rate = parseFloat(credit_interest_rate) || 0;
    credit_term_years = parseFloat(credit_term_years) || 0;

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

    if (payment_method === 'full_savings') {
      if (!monthly_savings) {
        return res.status(400).json({ message: 'Economiile lunare sunt obligatorii' });
      }

      planData.monthly_savings = monthly_savings;
      planData.with_investments = with_investments || false;

      const remaining = goal_amount - (initial_savings || 0);

      planData.months_without_investments = financialCalc.calculateMonthsWithoutInvestments(
        goal_amount,
        monthly_savings,
        initial_savings || 0
      );
      planData.total_saved_without_investments = remaining;

      if (with_investments) {
        const preferences = await UserPreferences.findOne({ user: req.user.id });
        
        if (!preferences) {
          return res.status(400).json({ 
            message: 'Trebuie să setezi preferințele mai întâi pentru calculele cu investiții' 
          });
        }

        let annualReturn = 8; 
        if (preferences.risk_level === 'low') annualReturn = 6;
        if (preferences.risk_level === 'high') annualReturn = 10;

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
          planData.months_with_investments,
          initial_savings || 0
        );

        planData.total_invested = (initial_savings || 0 ) + monthly_savings * planData.months_with_investments;
        planData.investment_gain = financialCalc.calculateInvestmentGain(
          futureValue,
          planData.total_invested
        );

        const { generateSuggestions } = require('../utils/suggestionAlgorithm');
        const suggestions = generateSuggestions(preferences.toObject());
        planData.investment_allocations = suggestions.allocations.map(alloc => ({
          asset: alloc.asset,
          percentage: alloc.percentage,
          monthly_amount: (monthly_savings * alloc.percentage) / 100
        }));
      }
    }

    if (payment_method === 'savings_plus_credit') {
      if (!credit_down_payment || !credit_interest_rate || !credit_term_years) {
        return res.status(400).json({ 
          message: 'Detalii credit incomplete (avans, dobândă, perioadă)' 
        });
      }

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

      planData.credit_monthly_payment = financialCalc.calculateMonthlyPayment(
        planData.credit_amount,
        credit_interest_rate,
        credit_term_years
      );

      planData.credit_total_payment = financialCalc.calculateTotalPayment(
        planData.credit_monthly_payment,
        credit_term_years
      );

      planData.credit_total_interest = financialCalc.calculateTotalInterest(
        planData.credit_total_payment,
        planData.credit_amount
      );

      planData.minimum_income_required = financialCalc.calculateMinimumIncome(
        planData.credit_monthly_payment
      );

      if (monthly_savings) {
        planData.monthly_savings = monthly_savings;
        planData.months_without_investments = financialCalc.calculateMonthsWithoutInvestments(
          credit_down_payment,
          monthly_savings,
          initial_savings || 0
        );
      }
    }


    const target = planData.payment_method === 'savings_plus_credit'
    ? (planData.credit_total_payment || 0) + (planData.credit_down_payment || 0)
    : goal_amount;

    planData.progress_percentage = financialCalc.calculateProgress(
    planData.current_amount,
    target
    );

    const plan = await Plan.create(planData);
    res.status(201).json(plan);

  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Eroare la crearea planului', error: error.message });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la preluarea planurilor', error: error.message });
  }
};

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

exports.addContribution = async (req, res) => {
    try {
        const { amount, note } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Suma trebuie sa fie pozitiva' });
        }

        const plan = await Plan.findById(req.params.id);

        if (!plan) return res.status(404).json({ message: 'Planul nu exista' });

        if (plan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Nu ai acces la acest plan' });
        }

        const completionTarget = plan.payment_method === 'savings_plus_credit'
            ? (plan.credit_total_payment || 0) + (plan.credit_down_payment || 0)
            : plan.goal_amount;

        plan.contributions.push({ amount: parseFloat(amount), note: note || '' });

        plan.current_amount = (plan.current_amount || 0) + parseFloat(amount);
        plan.progress_percentage = Math.min((plan.current_amount / completionTarget) * 100, 100);

        if (plan.current_amount >= completionTarget) {
            plan.status = 'completed';
        }

        await plan.save();

        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la adaugarea contributiei' });
    }
};

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

exports.getDashboardStats = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id });

    const stats = {
      totalPlans: plans.length,
      activePlans: plans.filter(p => p.status === 'active').length,
      completedPlans: plans.filter(p => p.status === 'completed').length,
      totalGoalAmount: plans.reduce((sum, p) => {
        const target = p.payment_method === 'savings_plus_credit'
          ? (p.credit_total_payment || 0) + (p.credit_down_payment || 0)
          : p.goal_amount;
          return sum + target;}, 0),
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


