function add(a, b) {
  return a + b
}

function errorHandler(err, req, res, next) {
  return res.status(err.status || 500).json({
    err: {
      message: err.message || 'Something went wrong.'
    }
  })
}

export default errorHandler
