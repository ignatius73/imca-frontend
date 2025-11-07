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
 * Configuración de Keycloak
 */
export const KEYCLOAK_CONFIG = {
  /**
   * Nombre del cliente en Keycloak donde se almacenan los roles
   * Los roles vienen en: resource_access[CLIENT_ID].roles
   */
  CLIENT_ID: 'imca-app'
};

/**
 * Mapeo de roles a permisos/descripciones (opcional)
 */
export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Administrador con acceso completo',
  [ROLES.USER]: 'Usuario estándar',
  [ROLES.MANAGER]: 'Gestor con permisos intermedios'
};
