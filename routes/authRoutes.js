const express = require('express');
const router = express.Router();

const { 
  authenticateMember, 
  authorizePermissions 
} = require('../middleware/authentication');


const {
  login,
  logout,
  resetPassword,
} = require('../controllers/authController');

router.post('/login', login);
router.delete('/logout', authenticateMember, logout);
router.post('/reset-password', authorizePermissions('admin'), resetPassword);

module.exports = router;