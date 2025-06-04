import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Github-Ai-Scraper API',
      version: '1.0.0',
      description: 'API documentation for Github-Ai-Scraper project using Gemini 2.0 Flash Lite AI',
    },
    servers: [
      {
        url: 'http://localhost:4000', // Your app port here
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/app.js'], // Adjust if your routes path is different
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
