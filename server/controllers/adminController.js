const User = require('../models/User');
const Resume = require('../models/Resume');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalResumes = await Resume.countDocuments();
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');
    const avgAts = await Resume.aggregate([
      { $group: { _id: null, avg: { $avg: '$atsScore' } } }
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalResumes,
        avgAtsScore: avgAts[0]?.avg ? Math.round(avgAts[0].avg) : 0,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await User.countDocuments({ role: 'user' });
    const users = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');
    const usersWithCount = await Promise.all(users.map(async (user) => {
      const resumeCount = await Resume.countDocuments({ userId: user._id });
      return { ...user.toObject(), resumeCount };
    }));
    res.json({
      success: true,
      users: usersWithCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin.' });
    await Resume.deleteMany({ userId: user._id });
    await user.deleteOne();
    res.json({ success: true, message: 'User and their resumes deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Resume.countDocuments();
    const resumes = await Resume.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .select('-originalText -improvedText');
    res.json({
      success: true,
      resumes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
