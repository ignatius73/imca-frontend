import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    console.log('🔒 AuthGuard - Verificando acceso...');
    console.log('Authenticated:', this.authenticated);
    console.log('URL solicitada:', state.url);

    // Force the user to log in if not authenticated
    if (!this.authenticated) {
      console.log('⚠️ Usuario no autenticado, iniciando login...');

      // Guardar la URL destino en sessionStorage para redirigir después del login
      sessionStorage.setItem('redirectUrl', state.url);

      // Iniciar el proceso de login
      // IMPORTANTE: login() redirige al navegador, no retorna
      this.keycloak.login({
        redirectUri: window.location.origin + '/'
      });

      // Retornar false para prevenir la navegación
      // (el usuario será redirigido a Keycloak de todas formas)
      return false;
    }

    console.log('✅ Usuario autenticado');

    // Get the roles required from the route
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present
    const hasRequiredRoles = requiredRoles.every((role: string) => this.roles.includes(role));
    console.log('Roles requeridos:', requiredRoles);
    console.log('Tiene roles:', hasRequiredRoles);

    return hasRequiredRoles;
  }
}
