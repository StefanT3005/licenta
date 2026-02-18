const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * User Controller
 * Gestionează operațiile pe profilul utilizatorului
 */

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }
    
    // Verifică dacă email-ul e deja folosit de alt user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email-ul este deja folosit' });
      }
    }
    
    // Actualizează câmpurile
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.json({
      message: 'Profil actualizat cu succes',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Parola nouă trebuie să aibă minim 6 caractere' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }
    
    // Verifică parola curentă
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Parola curentă este incorectă' });
    }
    
    // Hash-uiește noua parolă
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ message: 'Parola a fost schimbată cu succes' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Eroare server', error: error.message });
  }
};