import { NgModule, APP_INITIALIZER } from '@angular/core';
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
import { ScrollingModule } from '@angular/cdk/scrolling'
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';

function initializeKeycloak(keycloak: KeycloakService) {
  return () => {
    console.log('🔄 Inicializando Keycloak...');
    console.log('📍 URL actual:', window.location.href);
    console.log('📍 Hash:', window.location.hash);
    console.log('📍 Search:', window.location.search);

    // Detectar si estamos regresando de una autenticación (hay parámetros en la URL)
    // Los parámetros pueden estar en query string (?) o en hash (#)
    let urlParams: URLSearchParams;
    let hasAuthParams = false;

    // Primero intentar en el query string
    urlParams = new URLSearchParams(window.location.search);
    hasAuthParams = urlParams.has('code') || urlParams.has('state') ||
                    urlParams.has('session_state') || urlParams.has('iss');

    // Si no están en query, buscar en el hash
    if (!hasAuthParams && window.location.hash) {
      // Remover el # inicial del hash
      const hashParams = window.location.hash.substring(1);
      urlParams = new URLSearchParams(hashParams);
      hasAuthParams = urlParams.has('code') || urlParams.has('state') ||
                      urlParams.has('session_state') || urlParams.has('iss');
      console.log('🔍 Parámetros encontrados en hash');
    }

    if (hasAuthParams) {
      console.log('🔄 Detectado callback de autenticación, procesando...');
      console.log('📋 Parámetros de URL:', {
        code: urlParams.get('code')?.substring(0, 20) + '...',
        state: urlParams.get('state'),
        session_state: urlParams.get('session_state'),
        iss: urlParams.get('iss')
      });
      // 🔴 BREAKPOINT: Aquí retorna de Keycloak con el código
      debugger;
    }

    const initPromise = keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        flow: 'standard',
        // Usar query mode para evitar conflicto con hash routing
        responseMode: 'query',
        // Especificar redirect URI explícito
        redirectUri: window.location.origin + '/',
        // Agregar logging para debug
        enableLogging: true,
        // IMPORTANTE: Habilitar persistencia de token en sessionStorage
        // Esto permite que el token sobreviva recargas de página dentro de la misma sesión
        // Opciones: 'localStorage' (persiste entre pestañas/sesiones) o 'sessionStorage' (solo en la pestaña actual)
        token: sessionStorage.getItem('kc_token') || undefined,
        refreshToken: sessionStorage.getItem('kc_refreshToken') || undefined
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets', '/clients/public'],
      shouldAddToken: (request) => {
        const { url } = request;
        return url.startsWith(environment.apiUrl);
      }
    });

    console.log('🔄 Init promise creada:', initPromise);

    return initPromise.then((authenticated) => {
      console.log('✅ Keycloak inicializado');
      console.log('🔐 Authenticated:', authenticated);

      // 🔴 BREAKPOINT: Aquí se procesa la respuesta de Keycloak
      debugger;

      if (authenticated) {
        const kc = keycloak.getKeycloakInstance();
        console.log('✅ Usuario autenticado exitosamente!');
        console.log('📝 Token obtenido:', kc.token ? 'Sí (' + kc.token.substring(0, 30) + '...)' : 'No');
        console.log('⏰ Token expira en:', kc.tokenParsed?.exp);
        console.log('👤 Usuario:', kc.tokenParsed?.preferred_username || kc.tokenParsed?.email);
        console.log('🎫 Token completo (primeros 100 chars):', kc.token?.substring(0, 100));
        console.log('🔍 Token parseado:', kc.tokenParsed);

        // 💾 GUARDAR TOKENS EN SESSIONSTORAGE para persistencia
        if (kc.token) {
          sessionStorage.setItem('kc_token', kc.token);
          console.log('💾 Token guardado en sessionStorage');
        }
        if (kc.refreshToken) {
          sessionStorage.setItem('kc_refreshToken', kc.refreshToken);
          console.log('💾 Refresh token guardado en sessionStorage');
        }
        if (kc.idToken) {
          sessionStorage.setItem('kc_idToken', kc.idToken);
          console.log('💾 ID token guardado en sessionStorage');
        }

        // Configurar listener para actualizar tokens cuando se refresquen
        kc.onTokenExpired = () => {
          console.log('⏰ Token expirado, refrescando...');
          kc.updateToken(30).then((refreshed) => {
            if (refreshed) {
              console.log('✅ Token refrescado exitosamente');
              if (kc.token) sessionStorage.setItem('kc_token', kc.token);
              if (kc.refreshToken) sessionStorage.setItem('kc_refreshToken', kc.refreshToken);
            } else {
              console.log('ℹ️ Token aún válido');
            }
          }).catch(() => {
            console.error('❌ Falló el refresh del token');
            sessionStorage.removeItem('kc_token');
            sessionStorage.removeItem('kc_refreshToken');
            sessionStorage.removeItem('kc_idToken');
          });
        };
      } else {
        console.log('⚠️ No autenticado después de init');
        console.log('🔍 Verificando estado de Keycloak...');
        const kc = keycloak.getKeycloakInstance();
        console.log('KC Instance:', {
          authenticated: kc.authenticated,
          token: kc.token ? 'existe' : 'null',
          refreshToken: kc.refreshToken ? 'existe' : 'null'
        });
      }

      // Manejar limpieza de URL después del login exitoso
      if (hasAuthParams && authenticated) {
        console.log('🧹 Limpiando parámetros de URL...');

        // Limpiar los parámetros de autenticación de la URL sin recargar la página
        // Esto es importante para que el usuario no vea los parámetros de OAuth en la URL
        if (window.history && window.history.replaceState) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          console.log('✅ URL limpiada:', cleanUrl);
        }

        // NO redirigir aquí - dejar que el AppComponent o el routing normal maneje la navegación
        // La redirección se manejará en el AppComponent después de la inicialización
      } else if (hasAuthParams && !authenticated) {
        console.warn('⚠️ Había parámetros de auth pero NO se autenticó!');
        debugger;
      }

      return Promise.resolve(authenticated);
    }).catch((error) => {
      console.error('❌ Error al inicializar Keycloak:', error);
      console.error('📋 Tipo de error:', typeof error);
      console.error('📋 Error completo:', error);
      console.error('📋 Error stringified:', JSON.stringify(error, null, 2));
      console.error('📋 Error stack:', error?.stack);
      console.error('📋 Error message:', error?.message);
      console.error('📋 Error name:', error?.name);

      // Intentar obtener más detalles del error
      if (error) {
        console.error('📋 Keys del error:', Object.keys(error));
        console.error('📋 Error toString:', error.toString());
      }

      // Verificar el estado de Keycloak
      try {
        const kc = keycloak.getKeycloakInstance();
        console.error('🔍 Estado de KC después del error:', {
          authenticated: kc?.authenticated,
          token: kc?.token ? 'existe' : 'null',
          error: kc
        });
      } catch (e) {
        console.error('No se pudo obtener instancia de KC:', e);
      }

      // 🔴 BREAKPOINT: Error durante la inicialización
      debugger;

      // Si hay error de nonce, limpiar todo y recargar
      if (error && error.toString().includes('nonce')) {
        console.log('🗑️ Error de nonce detectado, limpiando storage...');
        try {
          sessionStorage.clear();
          localStorage.clear();
          // Limpiar URL de parámetros y recargar
          if (window.history && hasAuthParams) {
            window.history.replaceState({}, document.title, '/');
            // Recargar la página después de limpiar
            window.location.href = '/';
          }
        } catch (e) {
          console.log('No se pudo limpiar storage:', e);
        }
      }

      console.log('Continuando sin autenticación...');
      return Promise.resolve(false);
    });
  };
}


  










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
    KeycloakAngularModule

  ],
  exports: [
    ScrollingModule
  ],
  


  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
