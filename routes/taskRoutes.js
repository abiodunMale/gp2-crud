const express = require('express');
const router = express.Router();
const {
  authenticateMember,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  getAllTask,
  createTask,
  getSingleTask,
  updateTask,
} = require('../controllers/taskController');




router.route('/').get(authenticateMember, getAllTask);
router.route('/createTask').post(authenticateMember, authorizePermissions('admin'), createTask);
router.route('/:id').get(authenticateMember, getSingleTask).put(authenticateMember, updateTask);

module.exports = router;