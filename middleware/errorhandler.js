const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    let errMsg = err.message || 'Something went wrong';
    if (errMsg === 'jwt expired') {
        errMsg = 'Token expired'}
        else if (errMsg === 'jwt malformed') {
            errMsg = 'Token expired'
        }
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}

module.exports = {ErrorHandler}