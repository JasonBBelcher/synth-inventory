const checkPermission = (req, res, next) => {
  try {
    if (req.user.data.role === "Admin") {
      return next();
    }
  } catch (err) {
    return res.status(401).json({
      error: {
        message:
          err.message ||
          "you do not have permission be here without admin rights."
      }
    });
  }
};

export default checkPermission;
