const sendResponse = (statusCode, message, data) => {
    return {
      status: statusCode,
      message: message,
      data: data
    };
  };
  //ใช้เพื่อรับค่าในคำสั่ง SendResponseและ Return response ออกมา
  const responseMiddleware = (req, res, next) => {
    res.sendResponse = (statusCode, message, data) => {
      res.status(statusCode).json(sendResponse(statusCode, message, data));
    };
    next();
  };
  
  module.exports = responseMiddleware;
  