import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
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
  private authSubscription?: Subscription;

  constructor(
    public router: Router,
    private oidcSecurityService: OidcSecurityService,
    public location: Location,
    private cdr: ChangeDetectorRef
  ) {
    this.baseUrl = window.location.origin;
  }

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authSubscription = this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isLoggedIn = isAuthenticated;
        console.log('Navbar - Estado login:', this.isLoggedIn);
        this.cdr.detectChanges();
      }
    );

    // Actualizar estado en cada cambio de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  login(): void {
    console.log('Iniciando login desde navbar...');
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    console.log('Cerrando sesión...');
    // Limpiar la URL guardada
    sessionStorage.removeItem('redirectUrl');
    console.log('💾 Storage limpiado');

    // Hacer logout con redirección al origen
    this.oidcSecurityService.logoff().subscribe(result => {
      console.log('✅ Logout completado');
    });
  }

}
