import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

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
        console.log('🔒 AuthGuard - Verificando acceso...');
        console.log('  ✓ Is Authenticated:', isAuthenticated);
        console.log('  ✓ URL solicitada:', state.url);

        if (!isAuthenticated) {
          console.log('⚠️ Usuario no autenticado, guardando URL y iniciando login...');

          // Guardar la URL destino para redirigir después del login
          sessionStorage.setItem('redirectUrl', state.url);

          // Iniciar el proceso de autenticación
          this.oidcSecurityService.authorize();

          return [false];
        }

        // Si la ruta requiere roles específicos, verificarlos
        const requiredRoles = route.data['roles'] as string[];

        if (requiredRoles && requiredRoles.length > 0) {
          console.log('🔐 Verificando roles requeridos:', requiredRoles);

          // Obtener los datos del usuario del token
          return this.oidcSecurityService.getUserData().pipe(
            take(1),
            map(userData => {
              console.log('👤 Datos del usuario:', userData);

              // Extraer roles del token
              // Keycloak puede almacenar roles en diferentes ubicaciones:
              // 1. realm_access.roles (roles del realm)
              // 2. resource_access.<client-id>.roles (roles específicos del cliente)
              const realmRoles = userData?.realm_access?.roles || [];
              const resourceRoles = userData?.resource_access?.['imca']?.roles || [];
              const allRoles = [...realmRoles, ...resourceRoles];

              console.log('🎭 Roles del usuario:', allRoles);

              // Normalizar roles a minúsculas para comparación case-insensitive
              const normalizedUserRoles = allRoles.map(role => role.toLowerCase());
              const normalizedRequiredRoles = requiredRoles.map(role => role.toLowerCase());

              // Verificar si el usuario tiene al menos uno de los roles requeridos
              const hasRequiredRole = normalizedRequiredRoles.some(role =>
                normalizedUserRoles.includes(role)
              );

              if (!hasRequiredRole) {
                console.log('❌ Usuario no tiene los roles requeridos');
                console.log('   Roles requeridos:', requiredRoles);
                console.log('   Roles del usuario:', allRoles);

                // Redirigir a página de acceso denegado o home
                return this.router.createUrlTree(['/home']);
              }

              console.log('✅ Usuario tiene los roles necesarios');
              return true;
            })
          );
        }

        console.log('✅ Usuario autenticado, permitiendo acceso (sin verificación de roles)');
        return [true];
      })
    );
  }
}
