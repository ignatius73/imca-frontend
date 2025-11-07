# Configuración de Keycloak para imca-app

## ⚠️ IMPORTANTE: Error "Invalid nonce" con Google Identity Provider

Si ves el error `[KEYCLOAK] Invalid nonce, clearing token` cuando regresas de la autenticación de Google, esto ocurre porque el flujo de autenticación pasa por múltiples redirecciones:

```
Angular → Keycloak → Google → Keycloak → Angular
```

El nonce se pierde o expira durante este proceso. Sigue EXACTAMENTE estos pasos:

## Configuración del Cliente en Keycloak

Accede a tu servidor Keycloak en `https://kck.automago.cloud/admin`

1. Login al admin console
2. Selecciona el realm `imca`
3. Ve a Clients → `imca-app`

### 1. Settings (Configuración General) ⭐

```
Client ID: imca-app
Client Protocol: openid-connect
Access Type: public
Standard Flow Enabled: ON
Direct Access Grants Enabled: ON
Implicit Flow Enabled: OFF
Service Accounts Enabled: OFF
Authorization Enabled: OFF

Root URL: http://localhost:4200
Valid Redirect URIs: (ver abajo)
Valid Post Logout Redirect URIs: (ver abajo)
Web Origins: (ver abajo)
Admin URL: (dejar vacío)
```

### 2. Valid Redirect URIs (MUY IMPORTANTE) ⭐⭐⭐

**CRÍTICO**: Agrega EXACTAMENTE estas URIs (una por línea, presiona + para agregar más):

```
http://localhost:4200
http://localhost:4200/*
http://localhost:4200/user
```

⚠️ **NO uses comodines como `*` solos, siempre con el path completo**

Para producción, agrega también:
```
https://tudominio.com
https://tudominio.com/*
```

### 3. Valid Post Logout Redirect URIs ⭐

```
http://localhost:4200
http://localhost:4200/*
```

### 4. Web Origins (para CORS) ⭐

```
http://localhost:4200
```

**O usa el símbolo `+` para permitir todos los orígenes de las redirect URIs:**
```
+
```

### 5. Advanced Settings ⭐

Scroll hacia abajo en la pestaña Settings hasta encontrar "Advanced Settings":

```
Proof Key for Code Exchange Code Challenge Method: plain
Access Token Lifespan: 5 Minutes (o el que prefieras)
SSO Session Idle: 30 Minutes
SSO Session Max: 10 Hours
```

⚠️ **IMPORTANTE para Google Identity Provider**:
- Usa **`plain`** en lugar de `S256` para PKCE
- `S256` puede causar problemas de "Invalid nonce" con flujos de redirección múltiple (Google → Keycloak → Angular)
- `plain` es menos seguro pero más compatible con Identity Providers externos

### 6. Configuración del Identity Provider (Google) ⭐⭐⭐

Ve a **Identity Providers** → Tu proveedor de Google

Verifica:
```
Redirect URI: https://kck.automago.cloud/realms/imca/broker/google/endpoint
(Este debe estar configurado en Google Cloud Console)

Trust Email: ON
Link Only: OFF
Store Tokens: ON (recomendado)
```

### 7. Guardar cambios

Haz clic en **Save** en todas las pantallas.

## Verificación de la URL del Servidor

Tu servidor Keycloak parece ser versión 17+ (por la estructura de la URL con `/realms/`).

Verifica que puedas acceder a:
```
https://kck.automago.cloud/realms/imca/.well-known/openid-configuration
```

Esta URL debe devolver un JSON con la configuración de OpenID Connect.

## Problemas Comunes y Soluciones

### 1. Error: `[KEYCLOAK] Invalid nonce, clearing token` ⚠️

**Causas principales con Google Identity Provider:**
- PKCE configurado como `S256` (debe ser `plain`)
- Redirect URIs mal configuradas en Keycloak
- Timeout muy corto en el flujo de autenticación
- Cache del navegador con datos corruptos

**Solución paso a paso:**

1. **Cambiar PKCE a `plain` en Keycloak**:
   - Clients → imca-app → Settings → Advanced Settings
   - Proof Key for Code Exchange Code Challenge Method: **`plain`** (no S256)
   - Click en Save

2. **Limpiar el navegador**:
   - Abre DevTools (F12)
   - Application → Storage → Clear site data
   - Cierra todas las pestañas de localhost:4200

3. **Usar la herramienta de limpieza**:
   - Abre: `http://localhost:4200/assets/fix-nonce.html`
   - Click en "Limpiar Todo"

4. **Reiniciar servidor**:
   ```bash
   npm start
   ```

5. **Probar en modo incógnito** para evitar cache

### 2. **Pantalla en blanco después de login**

**Solución:**
- Verifica que el cliente sea tipo `public`
- Asegúrate que Standard Flow esté `ON`
- Verifica las redirect URIs

### 3. **Error de CORS**

**Solución:**
- Configura Web Origins con `+` o agrega `http://localhost:4200`

### 4. **Invalid redirect_uri**

**Solución:**
- Las URIs en Keycloak deben coincidir EXACTAMENTE
- No olvides los `/*` al final

## Testing

Una vez configurado, prueba:
1. Acceder a `http://localhost:4200/home` (debe cargar sin login)
2. Acceder a `http://localhost:4200/user` (debe redirigir a Keycloak)
3. Hacer login en Keycloak
4. Debe redirigir de vuelta a la aplicación correctamente
