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
    console.log('🚀 AppComponent - ngOnInit ejecutándose...');

    // Verificar autenticación y manejar callback
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {
      console.log('AppComponent - Estado de autenticación:');
      console.log('  ✓ Is Authenticated:', isAuthenticated);
      console.log('  ✓ User Data:', userData);
      console.log('  ✓ Has Access Token:', !!accessToken);

      if (isAuthenticated) {
        console.log('🔐 Usuario autenticado:');
        console.log('  ✓ Usuario:', userData?.preferred_username || userData?.email || 'N/A');

        // Verificar si hay una URL guardada para redirigir después del login
        const redirectUrl = sessionStorage.getItem('redirectUrl');
        if (redirectUrl) {
          console.log('➡️ Redirigiendo a URL guardada:', redirectUrl);
          sessionStorage.removeItem('redirectUrl');
          this.router.navigateByUrl(redirectUrl);
        }
      } else {
        console.log('ℹ️ Usuario no autenticado');
      }
    });
  }
}
