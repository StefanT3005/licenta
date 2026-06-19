const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  
  goal_amount: {
    type: Number,
    required: true
  },
  current_amount: {
    type: Number,
    default: 0
  },
  initial_savings: {
    type: Number,
    default: 0
  },
  
  payment_method: {
    type: String,
    enum: ['full_savings', 'savings_plus_credit'],
    required: true
  },
  
  monthly_savings: {
    type: Number
  },
  
  with_investments: {
    type: Boolean,
    default: false
  },
  investment_return_rate: {
    type: Number 
  },
  investment_allocations: [{
    asset: String,
    percentage: Number,
    monthly_amount: Number
  }],
  
  months_without_investments: {
    type: Number
  },
  total_saved_without_investments: {
    type: Number
  },
  
  months_with_investments: {
    type: Number
  },
  total_invested: {
    type: Number
  },
  investment_gain: {
    type: Number
  },
  
  credit_down_payment: {
    type: Number
  },
  credit_amount: {
    type: Number
  },
  credit_interest_rate: {
    type: Number 
  },
  credit_term_years: {
    type: Number 
  },
  credit_monthly_payment: {
    type: Number 
  },
  credit_total_payment: {
    type: Number
  },
  credit_total_interest: {
    type: Number 
  },
  minimum_income_required: {
    type: Number 
  },
  
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
    enum: ['active', 'completed'],
    default: 'active'
  },
  progress_percentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

planSchema.methods.updateProgress = function() {
  const target = this.payment_method === 'savings_plus_credit'
    ? (this.credit_total_payment || 0) + (this.credit_down_payment || 0)
    : this.goal_amount;

  this.progress_percentage = target > 0 
    ? (this.current_amount / target) * 100 
    : 0;

  return this.progress_percentage;
};

planSchema.methods.addContribution = function(amount, note = '') {
  this.contributions.push({ amount, note });
  this.current_amount += amount;
  this.updateProgress();
  return this.save();
};

module.exports = mongoose.model('Plan', planSchema);