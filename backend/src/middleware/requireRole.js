function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return function roleMiddleware(req, res, next) {
    if (!req.user || !req.user.role) return res.status(403).json({ message: 'Forbidden' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    return next();
  };
}

module.exports = requireRole;

