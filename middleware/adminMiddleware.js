import HTTP_STATUS from '../helpers/httpStatus.js';

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Acceso denegado. Solo para administradores.' });
  }
};

export default adminMiddleware;
