import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  backendUri: string = environment.apiUrl;
  baseUrl: string;
  isLoggedIn = false;
  private routerSubscription?: Subscription;

  constructor(
    public router: Router,
    private keycloakService: KeycloakService,
    public location: Location,
    private cdr: ChangeDetectorRef
  ) {
    this.baseUrl = window.location.origin;
  }

  async ngOnInit(): Promise<void> {
    // Verificar estado inicial
    await this.updateLoginStatus();

    // Actualizar estado en cada cambio de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateLoginStatus();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async updateLoginStatus(): Promise<void> {
    try {
      this.isLoggedIn = await this.keycloakService.isLoggedIn();
      console.log('Navbar - Estado login actualizado:', this.isLoggedIn);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al verificar estado de login:', error);
      this.isLoggedIn = false;
    }
  }

  login(): void {
    console.log('Iniciando login desde navbar...');
    this.keycloakService.login({
      redirectUri: window.location.origin + '/'
    });
  }

  logout(): void {
    console.log('Cerrando sesión...');
    // Limpiar tokens del storage antes de hacer logout
    sessionStorage.removeItem('kc_token');
    sessionStorage.removeItem('kc_refreshToken');
    sessionStorage.removeItem('kc_idToken');
    sessionStorage.removeItem('redirectUrl');
    console.log('💾 Tokens eliminados del storage');
    this.keycloakService.logout(this.baseUrl);
  }

}
