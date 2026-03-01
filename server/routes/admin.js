const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { getDashboard, getAllUsers, deleteUser, getAllResumes } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/resumes', getAllResumes);

module.exports = router;
