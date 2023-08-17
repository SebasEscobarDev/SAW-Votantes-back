import { Sequelize } from 'sequelize'

// Función genérica para manejar errores de Sequelize
export const handleSequelizeError = (error) => {
  const errorResponse = {}
  errorResponse.description = error.message
  if (
    error instanceof Sequelize.UniqueConstraintError ||
    error instanceof Sequelize.ValidationError ||
    error instanceof Sequelize.ForeignKeyConstraintError ||
    error instanceof Sequelize.DatabaseError ||
    error instanceof Sequelize.ConnectionError ||
    error instanceof Sequelize.TimeoutError
  ) {
    errorResponse.error = error.errors.map(err => err.message).join(', ')
  } else {
    errorResponse.error = 'Error is not specific'
  }
  return errorResponse
}
