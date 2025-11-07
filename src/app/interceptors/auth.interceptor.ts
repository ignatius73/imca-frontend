import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token de acceso desde angular-auth-oidc-client
    return this.oidcSecurityService.getAccessToken().pipe(
      take(1),
      switchMap(token => {
        if (token) {
          // Clonar la request y agregar el token al header Authorization
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(clonedReq);
        }

        // Si no hay token, continuar sin modificar la request
        return next.handle(req);
      })
    );
  }
}
