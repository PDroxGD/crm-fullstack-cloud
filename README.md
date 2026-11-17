# Mini-CRM Fullstack — Cloud-Ready Architecture

[![CI - Mini-CRM Fullstack](https://github.com/PDroxGD/crm-fullstack-cloud/actions/workflows/ci.yml/badge.svg)](https://github.com/PDroxGD/crm-fullstack-cloud/actions/workflows/ci.yml)

Aplicación Fullstack de gestión de clientes desarrollada bajo un esquema de **Monorepo**, diseñada para demostrar prácticas modernas de ingeniería de software, contenedorización multi-etapa, enrutamiento mediante proxy inverso y validación automatizada mediante Integración Continua (CI/CD).

---

## Arquitectura del Sistema

El ecosistema está orquestado con **Docker Compose** sobre una red privada aislada. **Nginx** actúa como único punto de entrada, sirviendo los archivos estáticos de React y redirigiendo las peticiones `/api/*` hacia el contenedor del backend:

```text
                        ┌─────────────────────────────────────────┐
                        │           Red Privada Docker            │
                        │                                         │
  Navegador ──(:8080)──►│  ┌───────────┐   /api/*   ┌──────────┐  │
  (Usuario)             │  │   Nginx   │───────────►│ Backend  │  │
                        │  │ (React UI)│            │ Node/TS  │  │
                        │  └───────────┘            └────┬─────┘  │
                        │                                │ SQL    │
                        │                           ┌────▼─────┐  │
                        │                           │PostgreSQL│  │
                        │                           │  (db)    │  │
                        │                           └────┬─────┘  │
                        └────────────────────────────────┼────────┘
                                                         │
                                                   [Volumen pgdata]
```

---

## Stack Tecnológico

* **Frontend:** React 18, TypeScript, Vite, CSS3 modular.
* **Backend:** Node.js 20, Express, TypeScript (modo estricto), `pg` (Connection Pooling).
* **Base de Datos:** PostgreSQL 16 (con inicialización automática de esquema y datos semilla).
* **Infraestructura & Contenedores:** Docker (Multi-stage builds), Docker Compose, Nginx (Reverse Proxy).
* **CI/CD:** GitHub Actions (compilación paralela de tipos y pruebas End-to-End automatizadas).

---

## Decisiones Técnicas y Buenas Prácticas

1. **Arquitectura Backend Modular:** Código organizado por dominios de negocio (`modules/clients`) separando rutas, controladores HTTP, servicios de datos y contratos de tipos (`DTOs`), facilitando su mantenimiento o futura extracción a microservicios.
2. **Optimización de Imágenes Docker (Multi-stage Builds):** Ambos servicios compilan TypeScript/Vite en una etapa `builder` y transfieren únicamente los artefactos finales hacia imágenes base `alpine` ligeras, ejecutando el proceso de Node.js bajo un usuario sin privilegios (`USER node`).
3. **Proxy Inverso con Nginx:** Elimina problemas de CORS y evita exponer puertos internos innecesarios al enrutar las llamadas de la API a través del mismo origen (`/api`).
4. **Resiliencia y Persistencia:** Implementación de `healthcheck` (`pg_isready`) para asegurar que el backend inicie únicamente cuando PostgreSQL acepte conexiones, junto con volúmenes nombrados (`pgdata`) para preservar la información entre reinicios.
5. **Seguridad SQL:** Uso estricto de consultas parametrizadas (`$1, $2, $3`) para prevenir inyección SQL.
6. **Pipeline CI/CD Automatizado:** Cada `push` o `pull_request` hacia `main` dispara tres trabajos en GitHub Actions: validación de compilación en paralelo para Backend y Frontend, seguida de un *Smoke Test* real levantando todo el stack con Docker Compose.

---

## Estructura del Proyecto

```text
crm-fullstack-cloud/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline de Integración Continua
├── backend/
│   ├── src/
│   │   ├── config/             # Pool de conexión a PostgreSQL
│   │   ├── modules/clients/    # Dominio de clientes (routes, controller, service)
│   │   ├── types/              # Interfaces y DTOs de TypeScript
│   │   ├── app.ts              # Configuración de Express y endpoint /health
│   │   └── server.ts           # Punto de entrada HTTP
│   ├── Dockerfile              # Build multi-etapa (Node 20 Alpine)
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Formulario y tabla de clientes
│   │   ├── services/           # Cliente HTTP tipado
│   │   └── types/              # Contratos de respuesta API
│   ├── Dockerfile              # Build Vite + Servidor Nginx
│   └── nginx.conf              # Configuración de SPA y Proxy Inverso
├── db/
│   └── init.sql                # Creación de tabla y registros iniciales
└── docker-compose.yml          # Orquestación de servicios, redes y volúmenes
```

---

## Ejecución Local con Docker

### Prerrequisitos
* Docker Engine y Docker Compose instalados.

### Levantar el ecosistema
Clona el repositorio y ejecuta un único comando desde la raíz:

```bash
git clone [https://github.com/TU-USUARIO/crm-fullstack-cloud.git](https://github.com/TU-USUARIO/crm-fullstack-cloud.git)
cd crm-fullstack-cloud
docker compose up --build -d
```

* **Aplicación Web (Frontend + Proxy API):** `http://localhost:8080`
* **Healthcheck directo del Backend:** `http://localhost:3000/health`

### Comandos útiles de administración

```bash
# Verificar estado y salud de los contenedores
docker compose ps

# Consultar registros directamente en PostgreSQL
docker exec -it crm-postgres psql -U admin -d crm_db -c "SELECT * FROM clients;"

# Detener servicios conservando los datos en el volumen
docker compose down

# Detener servicios y eliminar volúmenes (reinicio limpio)
docker compose down -v
```

---

## Proyección a Orquestación en la Nube (Kubernetes)

El diseño desacoplado y sin estado (*stateless*) de los contenedores `backend` y `frontend` permite migrar este entorno directamente a un clúster de **Kubernetes** o servicios gestionados (AWS ECS / Google Cloud Run):
* **Escalabilidad:** Los contenedores de aplicación se despliegan como `Deployments` con réplicas horizontales detrás de un `Ingress Controller`.
* **Configuración:** Las variables de entorno y credenciales de conexión se gestionan mediante `ConfigMaps` y `Secrets`.
* **Base de datos:** En un entorno productivo distribuido, el contenedor `db` se sustituye por un servicio administrado (ej. AWS RDS o Cloud SQL).
