const express = require('express');
const router = express.Router();

const { 
  authenticateMember, 
  authorizePermissions 
} = require('../middleware/authentication');


const {
    getAllAnnouncement,
    createAnnouncement,
    getSingleAnnouncement,
    updateAnnouncement,
} = require('../controllers/announcementController');
  
  
  
  
router.route('/').get(authenticateMember, getAllAnnouncement);
router.route('/createAnnouncement').post(authenticateMember, authorizePermissions('admin'), createAnnouncement);
router.route('/:id').get(authenticateMember, getSingleAnnouncement).put(authenticateMember, updateAnnouncement);

module.exports = router;