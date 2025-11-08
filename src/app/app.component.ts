import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'imca';

  constructor(
    private router: Router,
    private oidcSecurityService: OidcSecurityService
  ) {}

  ngOnInit(): void {
    // Verificar autenticación al iniciar la app
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      // Si está autenticado y hay una URL guardada, redirigir a ella
      if (isAuthenticated) {
        const redirectUrl = sessionStorage.getItem('redirectUrl');

        if (redirectUrl) {
          sessionStorage.removeItem('redirectUrl');

          // Pequeño delay para asegurar que Angular esté listo
          setTimeout(() => {
            this.router.navigateByUrl(redirectUrl);
          }, 50);
        }
      }
    });
  }
}
