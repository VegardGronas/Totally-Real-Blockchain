// swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Totally Real Blockchain API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // <-- point to your route files
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
