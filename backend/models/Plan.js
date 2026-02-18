const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  goal_amount: {
    type: Number,
    required: true,
    min: 0
  },
  current_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  target_date: {
    type: Date,
    required: true
  },
  risk_level: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['retirement', 'education', 'home', 'emergency', 'wealth', 'other'],
    default: 'other'
  },
  monthly_contribution: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  notes: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

// Virtual pentru progress percentage
planSchema.virtual('progress').get(function() {
  if (this.goal_amount === 0) return 0;
  return Math.min(100, (this.current_amount / this.goal_amount) * 100);
});

// Virtual pentru remaining amount
planSchema.virtual('remaining_amount').get(function() {
  return Math.max(0, this.goal_amount - this.current_amount);
});

// Asigură că virtual fields sunt serializate
planSchema.set('toJSON', { virtuals: true });
planSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Plan', planSchema);