import HTTP_STATUS from '../helpers/httpStatus.js';



// error para cuando pasa algo en el servidor 
const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error en el servidor' });
};

export default errorMiddleware;
