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
    // Verificar si hay una URL guardada para redirigir después del login
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    const redirectUrl = sessionStorage.getItem('redirectUrl');

    console.log('AppComponent - Inicializando...');
    console.log('Logged in:', isLoggedIn);
    console.log('Redirect URL guardada:', redirectUrl);

    if (isLoggedIn && redirectUrl) {
      console.log('✅ Usuario autenticado, redirigiendo a:', redirectUrl);
      // Limpiar la URL guardada
      sessionStorage.removeItem('redirectUrl');
      // Redirigir a la URL original
      this.router.navigateByUrl(redirectUrl);
    }
  }
}
