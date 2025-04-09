const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config(); // Make sure env is loaded

const TOKEN_HEADER_KEY = process.env.TOKEN_HEADER_KEY || 'Authorization';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Market API',
      version: '1.0.0',
      description: 'API for managing markets, items, locations, and item prices',
    },
    servers: [
      {
        url: 'http://localhost:7000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
		securitySchemes: {
			CustomAuth: {
			  type: 'apiKey',
			  in: 'header',
			  name: TOKEN_HEADER_KEY, 
			  description: `Enter your token in the format: Bearer &lt;token&gt;`,
			},
		  },
    },
    security: [
      {
		TokenAuth: [],
      },
    ],
  },
  apis: [
    './api/route/*.js', // Include all route files
    './api/controller/*.js', // Include controller files if you added Swagger JSDoc there
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;