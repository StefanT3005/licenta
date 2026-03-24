/**
 * Admin Controller
 * Funcții pentru gestionarea utilizatorilor și statistici sistem
 */

const User = require('../models/User');
const Plan = require('../models/Plan');
const UserPreferences = require('../models/UserPreferences');

/**
 * Obține toți utilizatorii din sistem
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Construct query
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    // Fetch users (exclude password)
    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .lean();

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const plansCount = await Plan.countDocuments({ user: user._id });  // ← SCHIMBAT!
        const activePlansCount = await Plan.countDocuments({ 
          user: user._id,  // ← SCHIMBAT!
          status: 'active' 
        });
        
        const preferences = await UserPreferences.findOne({ user: user._id });  // ← SCHIMBAT!

        return {
          ...user,
          stats: {
            totalPlans: plansCount,
            activePlans: activePlansCount,
            hasPreferences: !!preferences
          }
        };
      })
    );

    res.json({
      count: usersWithStats.length,
      users: usersWithStats
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      message: 'Eroare server la obținere utilizatori',
      error: error.message 
    });
  }
};

/**
 * Obține statistici generale sistem
 * GET /api/admin/stats
 */
const getSystemStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ is_admin: true });
    const verifiedUsers = await User.countDocuments({ emailVerified: true });

    // Total plans
    const totalPlans = await Plan.countDocuments();
    const activePlans = await Plan.countDocuments({ status: 'active' });
    const completedPlans = await Plan.countDocuments({ status: 'completed' });

    // Financial stats
    const allPlans = await Plan.find().lean();
    const totalGoalAmount = allPlans.reduce((sum, plan) => sum + (plan.goal_amount || 0), 0);
    const totalCurrentAmount = allPlans.reduce((sum, plan) => sum + (plan.current_amount || 0), 0);

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    // Users with preferences
    const usersWithPreferences = await UserPreferences.countDocuments();

    res.json({
      users: {
        total: totalUsers,
        admins: adminUsers,
        verified: verifiedUsers,
        recentSignups: recentUsers,
        withPreferences: usersWithPreferences
      },
      plans: {
        total: totalPlans,
        active: activePlans,
        completed: completedPlans
      },
      financial: {
        totalGoalAmount: Math.round(totalGoalAmount * 100) / 100,
        totalCurrentAmount: Math.round(totalCurrentAmount * 100) / 100,
        progressPercentage: totalGoalAmount > 0 
          ? Math.round((totalCurrentAmount / totalGoalAmount) * 100 * 100) / 100
          : 0
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ 
      message: 'Eroare server la obținere statistici',
      error: error.message 
    });
  }
};

/**
 * Obține detalii despre un utilizator specific
 * GET /api/admin/users/:userId
 */
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({ message: 'Utilizator negăsit' });
    }

    // Get user's plans
    const plans = await Plan.find({ user: userId }).lean();  // ← SCHIMBAT!
    
    // Get user's preferences
    const preferences = await UserPreferences.findOne({ user: userId }).lean();  // ← SCHIMBAT!

    res.json({
      user,
      plans,
      preferences
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ 
      message: 'Eroare server la obținere detalii utilizator',
      error: error.message 
    });
  }
};

/**
 * Șterge un utilizator
 * DELETE /api/admin/users/:userId
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ 
        message: 'Nu poți șterge propriul cont de administrator' 
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilizator negăsit' });
    }

    console.log(`Deleting user: ${user.name} (${user.email})`);

    // ȘTERGERE CASCADĂ - TOATE DATELE ASOCIATE
    const plansDeleted = await Plan.deleteMany({ user: userId });  // ← SCHIMBAT!
    console.log(`Deleted ${plansDeleted.deletedCount} plans for user ${userId}`);
    
    const prefsDeleted = await UserPreferences.deleteOne({ user: userId });  // ← SCHIMBAT!
    console.log(`Deleted preferences for user ${userId}: ${prefsDeleted.deletedCount}`);
    
    await User.findByIdAndDelete(userId);
    console.log(`Deleted user ${userId}`);

    res.json({ 
      message: 'Utilizator și toate datele asociate au fost șterse cu succes',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      deletedData: {
        plans: plansDeleted.deletedCount,
        preferences: prefsDeleted.deletedCount
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Eroare server la ștergere utilizator',
      error: error.message 
    });
  }
};

/**
 * Schimbă statusul de admin al unui utilizator
 * PATCH /api/admin/users/:userId/toggle-admin
 */
const toggleAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    // Nu poate modifica propriul status
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ 
        message: 'Nu poți modifica propriul status de administrator' 
      });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilizator negăsit' });
    }

    // Toggle admin status
    user.is_admin = !user.is_admin;
    await user.save();

    res.json({ 
      message: `Status admin ${user.is_admin ? 'activat' : 'dezactivat'} pentru utilizator`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    res.status(500).json({ 
      message: 'Eroare server la modificare status admin',
      error: error.message 
    });
  }
};

module.exports = {
  getAllUsers,
  getSystemStats,
  getUserDetails,
  deleteUser,
  toggleAdminStatus
};
