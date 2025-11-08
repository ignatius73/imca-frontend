import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PortadaComponent } from './components/portada/portada.component';
import { UserModule } from './components/user/user.module';
import { CobrarComponent } from './components/cobrar/cobrar.component';
import { CajaModule } from './components/caja/caja.module';
import { SharedModule } from './shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

// angular-auth-oidc-client imports
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PortadaComponent,
    CobrarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    CajaModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    SharedModule,
    ScrollingModule,
    // Configuración de angular-auth-oidc-client
    AuthModule.forRoot({
      config: {
        authority: `${environment.keycloak.url}/realms/${environment.keycloak.realm}`,
        redirectUrl: `${window.location.origin}/`,
        postLogoutRedirectUri: `${window.location.origin}/`,
        clientId: environment.keycloak.clientId,
        scope: 'openid profile email offline_access', // scopes requeridos
        responseType: 'code', // Authorization Code Flow con PKCE
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        logLevel: LogLevel.Debug, // Cambiar a LogLevel.Warn en producción
        ignoreNonceAfterRefresh: true,
        // Configuración de storage automática - persiste en sessionStorage por defecto
        // Auto-login deshabilitado para permitir acceso a rutas públicas
        autoUserInfo: true,
        triggerAuthorizationResultEvent: true,
        // No redirigir automáticamente en unauthorized
        unauthorizedRoute: '/home'
      },
    })
  ],
  exports: [
    ScrollingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
