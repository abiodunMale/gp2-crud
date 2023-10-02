const Member = require('../models/Member');
const Token = require('../models/Token');
const crypto = require('crypto');

const {
  attachCookiesToResponse,
  createTokenMember
} = require('../utils');


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({error: 'Please provide email and password'});
  }

  const member = await Member.findOne({ email });

  if (!member) {
    return res.status(401).json({error: 'Invalid Credentials'});
  }

  const isPasswordCorrect = await member.comparePassword(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({error: 'Invalid Credentials'});
  }

  const tokenUser = createTokenMember(member);

  // create refresh token
  let refreshToken = '';
  // check for existing token
  const existingToken = await Token.findOne({ user: member._id });

  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid) {
      return res.status(401).json({error: 'Invalid Credentials'});
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    
    const userInfo = {...tokenUser, position: member.position, assembly: member.assembly };

    return res.status(200).json({ user: userInfo });
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: member._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  const userInfo = {...tokenUser, position: member.position, assembly: member.assembly };

  res.status(200).json({ user:  userInfo});
};


const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now()),
    sameSite: 'None'
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now()),
    sameSite: 'None'
  });
  res.status(200).json({ msg: 'user logged out!' });
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({error: 'Please provide all values'});
  }

  const member = await Member.findOne({ email });

  if(!member){
    return res.status(404).json({error: `Email does not exit!!`})
  }

  member.password = password;
  await member.save();
  
  res.status(200).json({ msg: 'Success!' });
};

module.exports = {
  login,
  logout,
  resetPassword,
};