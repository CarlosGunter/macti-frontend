# Solución a Errores de Chunks con Keycloak Multi-Pestaña

## Problema Identificado

Los errores de carga de chunks ocurrían debido a conflictos de estado entre pestañas que navegaban diferentes institutos simultáneamente. Esto causaba:

1. **Conflictos de sesión**: Keycloak en diferentes pestañas con estados desincronizados
2. **Tokens expirados**: Una pestaña podía tener un token válido mientras otra no
3. **Errores de chunks de Next.js**: Causados por re-renderizados inconsistentes entre pestañas

## Solución Implementada

### 1. **Broadcast Channel API (Principal)**

La solución moderna usa **Broadcast Channel API** para comunicación directa entre pestañas:

```typescript
const channel = new BroadcastChannel(`keycloak_${institute}`);

channel.onmessage = (event) => {
  const { type, payload } = event.data;
  // Sincronizar LOGIN, LOGOUT, TOKEN_UPDATED
};
```

**Ventajas**:
- ✅ No requiere cookies de terceros (compatible con navegadores modernos)
- ✅ Comunicación instantánea entre pestañas
- ✅ Específico por instituto (canales separados)
- ✅ Compatible con políticas de privacidad actuales

### 2. **Storage Events (Fallback)**

Para navegadores sin soporte de Broadcast Channel, se usa Storage Events:

```typescript
window.addEventListener('storage', (event) => {
  // Detectar cambios en localStorage
});
```

**Por qué NO usamos `checkLoginIframe`**:
❌ Los navegadores modernos bloquean cookies de terceros por defecto  
❌ Safari ITP (Intelligent Tracking Prevention) bloquea iframes  
❌ Chrome planea eliminar cookies de terceros completamente  
❌ Requiere configuración SameSite=None que es insegura

### 3. **Page Visibility API**

Optimiza recursos pausando actualizaciones en pestañas inactivas:

```typescript
const isVisible = usePageVisibility();

// Solo refrescar tokens en pestañas visibles
if (isVisible && authenticated) {
  refreshToken();
}
```

**Beneficios**:
- Reduce consumo de CPU/red
- Previene race conditions entre pestañas
- Mejor experiencia de usuario

### 4. **Revalidación al volver visible**

Cuando una pestaña se vuelve visible, revalida inmediatamente su token:

```typescript
useEffect(() => {
  if (isVisible && authenticated) {
    void refreshToken(); // Revalidar inmediatamente
  }
}, [isVisible, authenticated]);
```

## Beneficios

✅ **Compatible con navegadores modernos** - No depende de cookies de terceros  
✅ **Múltiples pestañas funcionan independientemente** - Cada instituto mantiene su propia sesión  
✅ **Sincronización instantánea** - Login/logout se propaga inmediatamente vía Broadcast Channel  
✅ **Prevención de errores de chunks** - Estado consistente evita re-renderizados conflictivos  
✅ **Optimizado para rendimiento** - Solo pestañas visibles actualizan tokens  
✅ **Seguridad mejorada** - Detección inmediata de logouts en otras pestañas  
✅ **Fallback robusto** - Storage Events para navegadores antiguos

## Arquitectura de Sincronización

```
┌─────────────┐         Broadcast Channel         ┌─────────────┐
│  Pestaña 1  │ ◄────────────────────────────────► │  Pestaña 2  │
│ (instituto) │                                    │ (instituto) │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │              LocalStorage                        │
       └──────────────────┬───────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │  Tokens   │
                    │  instituto_token  │
                    │  instituto_refreshToken │
                    └───────────┘
```

### Flujo de Sincronización

1. **Pestaña A**: Usuario hace login
2. **Pestaña A**: Guarda tokens en localStorage
3. **Pestaña A**: Emite mensaje `LOGIN` vía Broadcast Channel
4. **Pestaña B**: Recibe mensaje, actualiza su estado
5. **Pestaña B**: Lee tokens de localStorage
6. **Pestaña B**: Actualiza UI sin recargar

## Consideraciones

### LocalStorage por Instituto
Cada instituto usa claves de storage separadas:
```typescript
{
  token: `${institute}_token`,
  refreshToken: `${institute}_refreshToken`,
  idToken: `${institute}_idToken`,
}
```

Esto permite tener sesiones independientes por instituto en diferentes pestañas.

### Broadcast Channel por Instituto
Cada instituto tiene su propio canal:
```typescript
const channelName = `keycloak_${institute}`;
```

Esto asegura que solo las pestañas del mismo instituto se comuniquen entre sí.

## Patrones Aplicados

### 1. **Broadcast Channel Pattern** (Moderno)
Comunicación directa entre contextos de navegación del mismo origen, sin dependencia de cookies.

### 2. **Observer Pattern** (Storage Events)
Fallback para navegadores sin Broadcast Channel API, usando eventos de storage como observadores.

### 3. **Singleton Pattern** (Per Institute)
Cada instituto mantiene una única fuente de verdad en localStorage, compartida entre pestañas.

### 4. **Circuit Breaker Pattern** (Page Visibility)
Pausa operaciones en pestañas inactivas para prevenir race conditions y ahorrar recursos.

## Debugging

Para habilitar logging detallado en desarrollo:
```typescript
enableLogging: process.env.NODE_ENV === 'development'
```

Logs útiles:
- `Keycloak: sesión cerrada en otra pestaña (BC)` - Broadcast Channel
- `Keycloak: token actualizado en otra pestaña (Storage)` - Storage Event
- `Keycloak: token refrescado correctamente`

## Compatibilidad de Navegadores

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Broadcast Channel API | ✅ 54+ | ✅ 38+ | ✅ 15.4+ | ✅ 79+ |
| Storage Events | ✅ All | ✅ All | ✅ All | ✅ All |
| Page Visibility API | ✅ All | ✅ All | ✅ All | ✅ All |

**Nota**: En navegadores antiguos sin Broadcast Channel, el sistema automáticamente usa Storage Events.

## Por qué NO usar checkLoginIframe

❌ **Políticas de cookies de terceros**:
- Safari bloquea cookies de terceros por defecto (ITP)
- Chrome eliminará cookies de terceros en 2024-2025
- Firefox Enhanced Tracking Protection bloquea trackers

❌ **Problemas de seguridad**:
- Requiere SameSite=None que es menos seguro
- Vulnerable a ataques CSRF si no se configura correctamente

❌ **Experiencia de usuario**:
- Puede causar múltiples redirects
- Degrada el rendimiento con checks frecuentes

✅ **Alternativa moderna**: Broadcast Channel API + Storage Events

## Recursos

- [Broadcast Channel API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [Storage Event API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [Page Visibility API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [Keycloak JavaScript Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
- [Third-party cookies - Chrome Developers](https://developers.google.com/privacy-sandbox/3pcd)
