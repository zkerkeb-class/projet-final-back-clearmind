module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Erreur de token invalide (JWT)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ status: 'fail', message: 'Token invalide. Connectez-vous à nouveau.' });
  }

  // Erreur de token expiré
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'fail', message: 'Votre session a expiré.' });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};