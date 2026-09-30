# Venturo Web

Frontend for **Venturo**, a full-stack outdoor e-commerce platform built with React and TypeScript.

The application provides the customer-facing commerce experience and connects to the Venturo backend for authentication, catalog data, checkout-oriented workflows, real-time functionality, and administration.

> Live product: https://venturo.network/  
> Backend repository: https://github.com/Max-Mukhiddin/venturo  
> Portfolio: https://max-mukhiddin.github.io/homepage/

## Tech Stack

- **React 18**
- **TypeScript**
- **Redux Toolkit** + React Redux
- **Material UI**
- **Styled Components**
- Axios
- React Router
- Socket.IO Client
- Swiper
- SweetAlert2

## Product Areas

### Storefront

- Product discovery
- Product detail flows
- Responsive commerce UI
- Cart and checkout-oriented experiences

### State Management

Redux Toolkit is used for application state and async data flows across the storefront.

### Real-Time Integration

Socket.IO client support enables real-time communication with the backend where required.

### UI System

The frontend combines Material UI and Styled Components for reusable layouts, controls, and page-level styling.

## Architecture

```text
React + TypeScript
       |
       v
Redux Toolkit / Axios
       |
       v
Express API + Socket.IO
       |
       v
MongoDB
```

## Local Development

### Install

```bash
npm install
```

### Run

```bash
npm start
```

### Build

```bash
npm run build
```

### Serve production build

```bash
npm run start:prod
```

## Project Background

Venturo was developed after learning full-stack application structure through the Burak course project. The earlier project served as a learning base; Venturo applies those concepts to a separate commerce product with its own design, user flows, functionality, and production deployment.

## Author

**Mukhiddin “Max” Solijonov**  
Full-Stack · DevOps · AI Engineer  
South Korea

- Portfolio: https://max-mukhiddin.github.io/homepage/
- GitHub: https://github.com/Max-Mukhiddin
