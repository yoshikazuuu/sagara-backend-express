# sagara-backend-express

## Description

This is a backend application built with Express.js and TypeScript, featuring JWT authentication, CRUD operations for tasks, and PostgreSQL database integration using Prisma ORM.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yoshikazuuu/sagara-backend-express.git
   cd sagara-backend-express
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory based on `.env.example`.
   - Configure database connection and JWT secret.
4. Generate JWT Secrets

   ```bash
   npm run jwt:generate
   ```

5. Run database migrations (for initial setup):
   ```bash
   npm run seed
   ```

## Running the App

- Development mode (with nodemon):

  ```bash
  npm run dev
  ```

  The server will restart automatically on code changes.

- Production mode:

  ```bash
  npm run compile
  npm start
  ```

  Compiles TypeScript and runs the server.

## Testing

- Run tests:

  ```bash
  npm run test
  ```

- Run tests with coverage:

  ```bash
   npm run test:coverage
  ```

## Scripts

- `npm run jwt:generate`: Generates a JWT token (example script).
- `npm run clean`: Cleans the build directory.
- `npm run compile`: Compiles TypeScript to JavaScript in the build directory.
- `npm run compile:debug`: Compiles with TypeScript diagnostics enabled.
- `npm run test`: (WARNING: Reset the database) Runs tests.
- `npm run test:coverage`: (WARNING: Reset the database) Runs tests with coverage.

## Testing with Postman

Postman collection available at the root directory `postman_collection.json`
