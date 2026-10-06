# pagos-app

Aplicación para iniciar sesión y gestionar métodos de pago. Vue 3, Pinia y Quasar.

## Instalación

```sh
npm install
```

## Desarrollo

La API de prueba usa `bd.json`. Levántala en una terminal:

```sh
npm run server
```

Queda en `http://localhost:3000`.

En otra terminal, la aplicación:

```sh
npm run dev
```

## Credenciales

| Usuario  | Contraseña |
| -------- | ---------- |
| admin    | Admin123   |
| usuario  | User123    |

## Rutas

- `/login`: inicio de sesión
- `/metodos-de-pago`: solo con sesión iniciada

## Supuestos del modelo

Los datos viven en `bd.json`. json-server devuelve los `id` como texto.

**Usuario** (`AuthUser`): `id`, `username`, `password`, `name` y `role`. El formulario de login solo envía `username` y `password`. Al guardar la sesión en `localStorage` se omite `password`. No hay token.

**Método de pago** (`PaymentMethod`): `id`, `name`, `type`, `description`, `status` y `createdAt`.

- `name`, `type` y `description` son texto. `description` puede ir vacío.
- `type` es uno de: Tarjeta de crédito, Tarjeta débito, Cuenta bancaria, Billetera digital.
- `status` es `active` o `inactive`. En pantalla se muestra como Activo o Inactivo.
- `createdAt` es una fecha en ISO. Un registro nuevo nace con `status: active` y la fecha del momento.

## Arquitectura y dependencias

Las vistas no llaman a la API. Cada store hace la llamada a través de su servicio (`auth.service.ts`, `payment-methods.service.ts`) y actualiza el estado. Si la operación falla, el store guarda `errorMessage` y la vista solo lo muestra.

`bd.json` es la única fuente de datos simulados. No hay backend propio.

Axios es el cliente HTTP, el mismo que se usaría contra una API real. json-server publica `bd.json` en `http://localhost:3000` para no mockear las respuestas dentro de los componentes. Quasar cubre la interfaz, la validación visual y los avisos. Pinia cubre el estado. No se agregaron librerías extra para UI, validación o estado.
