const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP CONTROLLER
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifică dacă user-ul există deja
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Un cont cu acest email există deja' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creează user nou
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_admin: false
    });

    // Generează token JWT
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ⚠️ ASTA E PARTEA CRITICĂ - returnează formatul corect!
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Eroare la înregistrare. Încearcă din nou.' 
    });
  }
};


// LOGIN CONTROLLER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Găsește user-ul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Email sau parolă incorectă' 
      });
    }

    // Verifică parola
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Email sau parolă incorectă' 
      });
    }

    // Generează token
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ⚠️ RETURNEAZĂ formatul corect!
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Eroare la autentificare. Încearcă din nou.' 
    });
  }
};

// La sfârșitul fișierului, adaugă:

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (requires authMiddleware)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    
    // req.user vine din authMiddleware (are id-ul user-ului)
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Utilizator negăsit' 
      });
    }

    // Update name și email (dacă sunt furnizate)
    if (name && name !== user.name) {
      user.name = name;
    }
    
    if (email && email !== user.email) {
      // Verifică dacă email-ul nu e deja folosit
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ 
          message: 'Acest email este deja folosit' 
        });
      }
      user.email = email;
    }

    // Dacă vrea să schimbe parola
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ 
          message: 'Trebuie să introduci parola curentă pentru a o schimba' 
        });
      }

      // Verifică parola curentă
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: 'Parola curentă este incorectă' 
        });
      }

      // Validare parolă nouă
      if (newPassword.length < 8) {
        return res.status(400).json({ 
          message: 'Parola nouă trebuie să conțină cel puțin 8 caractere' 
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Salvează modificările
    await user.save();

    // Returnează user-ul actualizat
    res.status(200).json({
      message: 'Profil actualizat cu succes',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Eroare la actualizarea profilului. Încearcă din nou.' 
    });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Deconectat cu succes' });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilizator negăsit' });
    }
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Eroare' });
  }
};