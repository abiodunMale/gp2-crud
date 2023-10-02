const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const MemberSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: [true, 'Please provide title'],
        minlength: 2,
        maxlength: 50,
      },
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    position: { type: String, required: true },
    assembly: {  type: String, required: true },
    phoneNumber: {  type: String, required: true },
    dob: {  type: String, required: true },
    address: {  type: String, required: true },
    maritalStatus: {  type: String, required: true },
  },
  {
    timestamps: true,
  }
);

MemberSchema.pre('save', async function () {
  console.log(this.modifiedPaths());
  console.log(this.isModified('name'));
  
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

MemberSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('Member', MemberSchema);