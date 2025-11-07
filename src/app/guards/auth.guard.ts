import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
      map(({ isAuthenticated }) => {
        console.log('🔒 AuthGuard - Verificando acceso...');
        console.log('  ✓ Is Authenticated:', isAuthenticated);
        console.log('  ✓ URL solicitada:', state.url);

        if (!isAuthenticated) {
          console.log('⚠️ Usuario no autenticado, guardando URL y iniciando login...');

          // Guardar la URL destino para redirigir después del login
          sessionStorage.setItem('redirectUrl', state.url);

          // Iniciar el proceso de autenticación
          this.oidcSecurityService.authorize();

          return false;
        }

        console.log('✅ Usuario autenticado, permitiendo acceso');
        return true;
      })
    );
  }
}
