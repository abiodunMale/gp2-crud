const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  if (requestUser.role === 'admin') return true;
  if (requestUser.userId === resourceUserId.toString()) return true;
  return false;
};

module.exports = checkPermissions;