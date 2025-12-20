# calculator-api

## Description
This project implements a RESTful API using Node.js and Express to support both stack-based and independent arithmetic operations. The API provides endpoints for manipulating a stack (e.g., push, pop, peek) and for performing standalone calculations (e.g., addition, subtraction).

It includes detailed request logging with Log4js, assigns a unique identifier to each request, and tracks operation history for both modes. Clients can retrieve or clear history, check the server’s health, and dynamically manage logger levels through dedicated endpoints.

## Features
- Handles HTTP requests and responses
- Good practices for system design
- Lightweight and efficient
- Easy to configure
- Supports logging with Log4js

## Installation (Local)

1. Clone the repository:
      ```bash
      git clone https://github.com/y0ncha/calculator-api.git
      ```

2.	Navigate to the project directory:
      ```bash
      cd calculator-api
      ```

3.	Install dependencies:
      ```bash
      npm start
      ```

## Running with Docker

You can run the API directly using the pre-built image on Docker Hub.

### Quick Start

1. Make sure Docker is installed on your system.

2. Pull and run the container:
   ```bash
   docker pull y0ncha/calc-api:1.0
   docker run --name app -d -p 4785:8496 y0ncha/calc-api:1.0
   ```

3.	Access the API at:
   http://localhost:4785

4.	Example health check:
   http://localhost:4785/calculator/health

## Environment Variables

Environment settings live in `.env` at the project root. Prisma does not auto-load this file, so ensure `prisma.config.ts` imports `dotenv/config` (already noted in `.env`) or load the variables before running Prisma CLI commands.

- `POSTGRES_URI`: PostgreSQL connection string used by Prisma and the API. The default (`postgresql://postgres:docker@localhost:5432/operations`) matches the Postgres service in `docker-compose.yml`; update the credentials/host when pointing to a different database.
- `MONGO_URI`: Optional MongoDB connection string. Defaults to `mongodb://mongo:27017/<db>` when running under Docker; override only if you need a different host/database.
