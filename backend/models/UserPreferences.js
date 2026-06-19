const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  budget_monthly: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  risk_level: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
    default: 'medium'
  },
  main_goal: {
    type: String,
    enum: ['retirement', 'education', 'home', 'emergency', 'wealth', 'other'],
    required: true,
    default: 'wealth'
  },
  horizon_months: {
    type: Number,
    required: true,
    min: 1,
    default: 12
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

userPreferencesSchema.methods.isComplete = function() {
  return !!(this.risk_level && this.horizon_months && this.budget_monthly);
};

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);