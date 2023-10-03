const express = require('express');
const router = express.Router();
const {
  authenticateMember,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAllMembers,
  getSingleMember,
  showCurrentMember,
  updateMember,
  updateMemberPassword,
  createMember,
  getAllPosition,
  getAllAssembly,
  updateSingleMember,
} = require('../controllers/MemberController');

router.route('/createMember').post( createMember);

router
  .route('/')
  .get(authenticateMember, authorizePermissions('admin'), getAllMembers);

router.route('/showMe').get(authenticateMember, showCurrentMember);
router.route('/updateMember').put(authenticateMember, updateMember);
router.route('/updateMemberPassword').put(authenticateMember, updateMemberPassword);

router.route('/:id').get(authenticateMember, getSingleMember).put(authenticateMember, authorizePermissions('admin'), updateSingleMember);
router.route('/positions/list').get(getAllPosition);
router.route('/assembly/list').get(getAllAssembly);

module.exports = router;