const createTokenUser = (user) => {
    return { 
      name: user.name, 
      userId: user._id, 
      role: user.role, 
      position: user.position,
      assembly: user.assembly
    };
  };
  
  module.exports = createTokenUser;