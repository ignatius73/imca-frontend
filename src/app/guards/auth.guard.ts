import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { KEYCLOAK_CONFIG } from '../config/roles.config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      take(1),
      switchMap(({ isAuthenticated }) => {
        if (!isAuthenticated) {
          // Guardar la URL destino para redirigir después del login
          sessionStorage.setItem('redirectUrl', state.url);

          // Iniciar el proceso de autenticación
          this.oidcSecurityService.authorize();

          return [false];
        }

        // Si la ruta requiere roles específicos, verificarlos
        const requiredRoles = route.data['roles'] as string[];

        if (requiredRoles && requiredRoles.length > 0) {
          // Obtener el payload del ACCESS TOKEN (donde están los roles en Keycloak)
          return this.oidcSecurityService.getPayloadFromAccessToken().pipe(
            take(1),
            map(tokenPayload => {
              // Extraer roles del access token
              // Keycloak puede almacenar roles en diferentes ubicaciones:
              // 1. realm_access.roles (roles del realm)
              // 2. resource_access.<client-id>.roles (roles específicos del cliente)
              const realmRoles = tokenPayload?.realm_access?.roles || [];
              const resourceRoles = tokenPayload?.resource_access?.[KEYCLOAK_CONFIG.CLIENT_ID]?.roles || [];
              const allRoles = [...realmRoles, ...resourceRoles];

              // Normalizar roles a minúsculas para comparación case-insensitive
              const normalizedUserRoles = allRoles.map(role => role.toLowerCase());
              const normalizedRequiredRoles = requiredRoles.map(role => role.toLowerCase());

              // Verificar si el usuario tiene al menos uno de los roles requeridos
              const hasRequiredRole = normalizedRequiredRoles.some(role =>
                normalizedUserRoles.includes(role)
              );

              if (!hasRequiredRole) {
                // Redirigir a página de acceso denegado o home
                return this.router.createUrlTree(['/home']);
              }

              return true;
            })
          );
        }

        return [true];
      })
    );
  }
}
