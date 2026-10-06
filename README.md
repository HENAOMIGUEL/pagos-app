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

## Estructura de datos

Los datos están en `bd.json`. json-server devuelve los `id` como texto.

**Usuario:** `id`, `username`, `password`, `name`, `role`. El login envía usuario y contraseña. La sesión guarda al usuario en `localStorage`, sin `password` y sin token.

**Método de pago:** `id`, `name`, `type`, `description` (opcional), `status` y `createdAt`. `type` es Tarjeta de crédito, Tarjeta débito, Cuenta bancaria o Billetera digital. `status` es `active` o `inactive` (en pantalla, Activo o Inactivo). `createdAt` va en ISO. Un registro nuevo nace activo, con la fecha del momento.

## Arquitectura y dependencias

No hay backend real, pero se mockea la data en `bd.json` para simular API real y json-server la publica en `http://localhost:3000`.

El flujo es: componente=> store => servicio. La vista no llama a la API. El store usa `auth.service.ts` o `payment-methods.service.ts`, recibe la respuesta y actualiza el estado.

Axios es el cliente HTTP. Quasar para la UI. Pinia para el estado. Aparte de Vue, Quasar y Pinia solo se agregaron Axios y json-server.