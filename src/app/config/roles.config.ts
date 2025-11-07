/**
 * Configuración centralizada de roles de la aplicación
 * Modificar aquí para cambiar los nombres de roles en toda la app
 */
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager'
} as const;

/**
 * Mapeo de roles a permisos/descripciones (opcional)
 */
export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Administrador con acceso completo',
  [ROLES.USER]: 'Usuario estándar',
  [ROLES.MANAGER]: 'Gestor con permisos intermedios'
};
