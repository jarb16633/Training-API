const sendResponse = (statusCode, message, data) => {
    res.status(statusCode).json({
            status: statusCode,
            message: message,
            data: data
        })
}

module.exports = sendResponse;