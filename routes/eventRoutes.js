const express = require('express');
const router = express.Router();

const { 
  authenticateMember, 
  authorizePermissions 
} = require('../middleware/authentication');


const {
    getAllEvent,
    createEvent,
    getSingleEvent,
    updateEvent,
} = require('../controllers/eventController');
  

  
router.route('/').get(authenticateMember, getAllEvent);
router.route('/createEvent').post(authenticateMember, authorizePermissions('admin'), createEvent);
router.route('/:id').get(authenticateMember, getSingleEvent).put(authenticateMember, updateEvent);

module.exports = router;