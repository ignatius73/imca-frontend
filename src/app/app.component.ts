import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'imca';

  constructor(
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('🚀 AppComponent - ngOnInit ejecutándose...');

    // Verificar si hay una URL guardada para redirigir después del login
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    const redirectUrl = sessionStorage.getItem('redirectUrl');

    console.log('AppComponent - Estado inicial:');
    console.log('  ✓ Logged in:', isLoggedIn);
    console.log('  ✓ Redirect URL guardada:', redirectUrl);

    if (isLoggedIn) {
      const kc = this.keycloakService.getKeycloakInstance();
      console.log('🔐 Detalles de autenticación:');
      console.log('  ✓ Token existe:', !!kc.token);
      console.log('  ✓ Refresh token existe:', !!kc.refreshToken);
      console.log('  ✓ Usuario:', kc.tokenParsed?.preferred_username || kc.tokenParsed?.email);
      console.log('  ✓ Token expira en (segundos):', kc.tokenParsed?.exp ? kc.tokenParsed.exp - Math.floor(Date.now() / 1000) : 'N/A');

      // Verificar storage
      console.log('💾 Verificando storage:');
      console.log('  ✓ SessionStorage keys:', Object.keys(sessionStorage));
      console.log('  ✓ LocalStorage keys:', Object.keys(localStorage));

      if (redirectUrl) {
        console.log('➡️ Redirigiendo a URL guardada:', redirectUrl);
        // Limpiar la URL guardada
        sessionStorage.removeItem('redirectUrl');
        // Redirigir a la URL original
        await this.router.navigateByUrl(redirectUrl);
        console.log('✅ Navegación completada');
      } else {
        console.log('ℹ️ No hay URL de redirección guardada, quedándose en ruta actual');
      }
    } else {
      console.log('⚠️ Usuario NO autenticado en AppComponent');
    }
  }
}
