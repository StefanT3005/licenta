const User = require('../models/User');
const Plan = require('../models/Plan');
const Preferences = require('../models/UserPreferences');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const sendVerificationEmail = async (user) => {
  try {
    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const transporter = createTransporter();

      const mailOptions = {
        from: `"TS FinVest" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Verificare email, echipa TS FinVest',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Verificare Email</h1>
              </div>
              <div class="content">
                <h2>Bună ${user.name}!</h2>
                <p>Bun venit la TS FinVest!</p>
                <p>Pentru a-ți verifica contul, te rugăm să-ți verifici adresa de email apăsând pe butonul de mai jos:</p>
                
                <center>
                  <a href="${verificationLink}" 
                     style="display: inline-block; padding: 15px 30px; background-color: #667eea; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
                    Verifică Email-ul
                  </a>
                </center>
                
                <p>Mulțumim că te-ai alăturat TS FinVest!</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} TS FinVest. Toate drepturile rezervate.</p>
                <p>Acest email a fost generat automat. Te rugăm să nu răspunzi.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email verificare trimis cu succes la:', user.email);
      return true;
    } else {
      console.log('Email Verification Link:', verificationLink);
      return false;
    }
  } catch (error) {
    console.error('Eroare trimitere email verificare:', error);
    return false;
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Completează toate câmpurile' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email-ul este deja înregistrat' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_admin: false,
      emailVerified: false
    });

    await sendVerificationEmail(user);

    const token = jwt.sign(
      { id: user._id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        emailVerified: user.emailVerified
      },
      message: 'Cont creat! Verifică email-ul pentru a îl verifica.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Eroare la înregistrare' });
  }
};

exports.login = async (req, res ) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Completează toate câmpurile' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credențiale invalide' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credențiale invalide' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Eroare la autentificare' });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Deconectat cu succes' });
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilizator negăsit' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Numele și email-ul sunt obligatorii' });
    }

    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email-ul este deja folosit' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Eroare la actualizarea profilului' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token lipsă' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { emailVerified: true },
      { returnDocument: 'after' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilizator negăsit' });
    }

    res.status(200).json({ 
      message: 'Email verificat cu succes!',
      user 
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Token invalid' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token expirat. Retrimite email-ul de verificare.' });
    }
    res.status(500).json({ message: 'Eroare la verificarea email-ului' });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Utilizator negăsit' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email-ul este deja verificat' });
    }

    await sendVerificationEmail(user);

    res.status(200).json({ 
      message: 'Email de verificare retrimis! Verifică inbox-ul (și spam folder).'
    });
  } catch (error) {
    console.error('Error resending verification:', error);
    res.status(500).json({ message: 'Eroare la retrimierea email-ului' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Completează toate câmpurile' });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Parola curentă este incorectă' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Parola nouă trebuie să conțină cel puțin 8 caractere' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Parola a fost schimbată cu succes!' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Eroare la schimbarea parolei' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await Plan.deleteMany({ user: req.user._id });
    await Preferences.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ message: 'Cont șters cu succes' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Eroare la ștergerea contului' });
  }
};