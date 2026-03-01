const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');
const {
  optimizeResume,
  getMyResumes,
  getResumeById,
  deleteResume
} = require('../controllers/resumeController');

const router = express.Router();

router.use(protect);

router.post('/optimize', upload.single('resume'), optimizeResume);
router.get('/', getMyResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;
