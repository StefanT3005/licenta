const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Obiectiv
  category: {
    type: String,
    enum: ['Studii', 'Locuință', 'Bunuri Diverse'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 3,
    default: 2
  },
  deadline: {
    type: Date
  },
  
  // Sumă
  goal_amount: {
    type: Number,
    required: true
  },
  inflation_adjusted_amount: {
    type: Number
  },
  current_amount: {
    type: Number,
    default: 0
  },
  initial_savings: {
    type: Number,
    default: 0
  },
  
  // Modalitate plată
  payment_method: {
    type: String,
    enum: ['full_savings', 'savings_plus_credit'],
    required: true
  },
  
  // Pentru economisire completă
  monthly_savings: {
    type: Number
  },
  
  // Investiții (dacă alege cu investiții)
  with_investments: {
    type: Boolean,
    default: false
  },
  investment_return_rate: {
    type: Number // % anual
  },
  investment_allocations: [{
    asset: String,
    percentage: Number,
    monthly_amount: Number
  }],
  
  // Calcule - fără investiții
  months_without_investments: {
    type: Number
  },
  total_saved_without_investments: {
    type: Number
  },
  
  // Calcule - cu investiții
  months_with_investments: {
    type: Number
  },
  total_invested: {
    type: Number
  },
  investment_gain: {
    type: Number
  },
  
  // Pentru credit bancar
  credit_down_payment: {
    type: Number // Avans (min 25%)
  },
  credit_amount: {
    type: Number // Suma împrumutată
  },
  credit_interest_rate: {
    type: Number // % anual
  },
  credit_term_years: {
    type: Number // Ani
  },
  credit_monthly_payment: {
    type: Number // Rată lunară
  },
  credit_total_payment: {
    type: Number // Total de plătit
  },
  credit_total_interest: {
    type: Number // Dobândă totală
  },
  minimum_income_required: {
    type: Number // Venit minim (rata ≤ 40%)
  },
  
  // Tracking
  contributions: [{
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  progress_percentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate progress
planSchema.methods.updateProgress = function() {
  this.progress_percentage = (this.current_amount / this.goal_amount) * 100;
  return this.progress_percentage;
};

// Add contribution
planSchema.methods.addContribution = function(amount, note = '') {
  this.contributions.push({ amount, note });
  this.current_amount += amount;
  this.updateProgress();
  return this.save();
};

module.exports = mongoose.model('Plan', planSchema);