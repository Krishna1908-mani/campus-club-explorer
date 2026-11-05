/**
 * Centralized error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  const msg = (err.message || '').toLowerCase();
  if (msg.includes('not found')) {
    statusCode = 404;
  } else if (
    msg.includes('already have') ||
    msg.includes('already exists') ||
    msg.includes('already registered') ||
    msg.includes('required') ||
    msg.includes('invalid')
  ) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

