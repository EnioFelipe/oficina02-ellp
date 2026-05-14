export function authorizeRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.type)) {
      return next({ statusCode: 403, message: 'Acesso negado para este perfil' });
    }

    next();
  };
}
