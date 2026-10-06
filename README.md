# pagos-app

Aplicación para iniciar sesión y ver métodos de pago.

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

## Rutas

- `/login`: inicio de sesión
- `/metodos-de-pago`: solo con sesión iniciada
