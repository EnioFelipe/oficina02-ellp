export function notFoundHandler(req, _res, next) {
  next({ statusCode: 404, message: `Rota nao encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || 'Erro interno do servidor',
    errors: error.errors
  });
}
