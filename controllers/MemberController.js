const mongoose = require('mongoose');
const Member = require('../models/Member');
const {
  createTokenMember,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');


const validateMemberInput = ({ title, name, email, role, position, assembly }) => {
  return title && title.length >= 2 && title.length <= 50 &&
         name && name.length >= 3 && name.length <= 50 &&
         email && isValidEmail(email) &&
         (!role || ['admin', 'user'].includes(role)) &&
         position &&
         assembly;
};


const isValidEmail = (email)  => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getAllMembers = async (req, res) => {
  console.log(req.user);
  const member = await Member.find({}).select('-password');
  res.status(200).json({ member });
};

const createMember = async (req, res) => {

  const { email } = req.body;

  if (!validateMemberInput(req.body)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const emailAlreadyExists = await Member.findOne({ email });

  if (emailAlreadyExists) {
    return res.status(400).json({erro: 'Email already exists'});
  }

  await Member.create({...req.body, password: 'member@123'});
  
  res.status(201).json({msg: 'Success!'});
};

const getSingleMember = async (req, res) => {
  console.log(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({error: `not a valid user id`});
  }

  const member = await Member.findOne({ _id: req.params.id }).select('-password');
  if (!member) {
    return res.status(404).json({error: `No member with id : ${req.params.id}`})
  }

  // if(!checkPermissions(res, req.user, member._id)){
  //   return res.status(403).json({error: 'Not authorized to access this information'});
  // }
  
  res.status(200).json({ member });
};

const showCurrentMember = async (req, res) => {

  const member = await Member.findOne({_id : req.user.userId}).select('-password');

  res.status(200).json({ user: member });
};

const updateMember = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({error: 'Please provide all values'});
  }

  const member = await Member.findOneAndUpdate(
    { _id: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );

  const tokenMember = createTokenMember(member);
  attachCookiesToResponse({ res, user: tokenMember });

  res.status(200).json({ user: tokenMember });
};

const updateSingleMember = async (req, res) => {

  const member = await Member.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!member) {
    return res.status(404).json({error: `No member with id : ${req.params.id}`})
  }

  res.status(200).json({ user: member });
};

const updateMemberPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({error: 'Please provide both values'});
  }

  const member = await Member.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await member.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    return res.status(401).json({error: 'Invalid Credentials'});
  }
  member.password = newPassword;

  await member.save();
  res.status(200).json({ msg: 'Success! Password Updated.' });
};

const getAllPosition = async (req, res) => {

  const uniquePositions = await Member.aggregate([
    {
      $project: {
        position: { $split: [{ $trim: { input: '$position' } }, ','] },
      },
    },
    {
      $unwind: '$position',
    },
    {
      $group: {
        _id: { $trim: { input: '$position' } },
      },
    },
    {
      $group: {
        _id: null,
        positionsList: { $push: '$_id' },
      },
    },
  ]);
  
  const positionsList = uniquePositions.length > 0 ? uniquePositions[0].positionsList : [];

  res.status(200).json({ positions : positionsList});
};

const getAllAssembly = async (req, res) => {

  const uniqueAssembly = await Member.aggregate([
    {
      $project: {
        assembly: { $split: [{ $trim: { input: '$assembly' } }, ','] },
      },
    },
    {
      $unwind: '$assembly',
    },
    {
      $group: {
        _id: { $trim: { input: '$assembly' } },
      },
    },
    {
      $group: {
        _id: null,
        assemblysList: { $push: '$_id' },
      },
    },
  ]);
  
  const assemblyList = uniqueAssembly.length > 0 ? uniqueAssembly[0].assemblysList : [];

  res.status(200).json({ assemblys : assemblyList});

};


module.exports = {
  getAllMembers,
  getSingleMember,
  showCurrentMember,
  updateMember,
  updateMemberPassword,
  createMember,
  getAllPosition,
  getAllAssembly,
  updateSingleMember,
};