const UserPreferences = require('../models/UserPreferences');

exports.getPreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ user: req.user.id });
    
    if (!preferences) {
      return res.status(404).json({ 
        message: 'Nu ați configurat încă preferințele',
        hasPreferences: false 
      });
    }
    
    res.json(preferences);
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

exports.setPreferences = async (req, res) => {
  try {
    const { budget_monthly, risk_level, main_goal, horizon_months, notes } = req.body;
    
    if (!budget_monthly || budget_monthly < 0) {
      return res.status(400).json({ message: 'Bugetul lunar trebuie să fie pozitiv' });
    }
    
    if (!risk_level || !['low', 'medium', 'high'].includes(risk_level)) {
      return res.status(400).json({ message: 'Nivel de risc invalid' });
    }
    
    if (!main_goal || !['retirement', 'education', 'home', 'emergency', 'wealth', 'other'].includes(main_goal)) {
      return res.status(400).json({ message: 'Obiectiv invalid' });
    }
    
    if (!horizon_months || horizon_months < 1) {
      return res.status(400).json({ message: 'Orizontul de timp trebuie să fie minim 1 lună' });
    }
    
    let preferences = await UserPreferences.findOne({ user: req.user.id });
    
    if (preferences) {
      preferences.budget_monthly = budget_monthly;
      preferences.risk_level = risk_level;
      preferences.main_goal = main_goal;
      preferences.horizon_months = horizon_months;
      preferences.notes = notes || '';
      
      await preferences.save();
      
      res.json({
        message: 'Preferințe actualizate cu succes',
        preferences
      });
    } else {
      preferences = new UserPreferences({
        user: req.user.id,
        budget_monthly,
        risk_level,
        main_goal,
        horizon_months,
        notes: notes || ''
      });
      
      await preferences.save();
      
      res.status(201).json({
        message: 'Preferințe create cu succes',
        preferences
      });
    }
  } catch (error) {
    console.error('Set preferences error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

exports.checkPreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ user: req.user.id });
    
    res.json({
      hasPreferences: !!preferences,
      isComplete: preferences ? preferences.isComplete() : false
    });
  } catch (error) {
    console.error('Check preferences error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

exports.deletePreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ user: req.user.id });
    
    if (!preferences) {
      return res.status(404).json({ message: 'Nu există preferințe de șters' });
    }
    
    await preferences.deleteOne();
    
    res.json({ message: 'Preferințe șterse cu succes' });
  } catch (error) {
    console.error('Delete preferences error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ user: req.user.id });
    
    if (!preferences) {
      return res.status(404).json({ 
        message: 'Trebuie să configurezi mai întâi preferințele' 
      });
    }
    
    const { generateSuggestions } = require('../utils/suggestionAlgorithm');
    const suggestions = generateSuggestions(preferences.toObject());
    
    res.json(suggestions);
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};