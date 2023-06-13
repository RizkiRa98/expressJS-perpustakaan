const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpressTS Perpustakaan',
      version: '1.0.0',
      description:
        'Dokumentasi API express typescript perpustakaan menggunakan Swagger',
    },
    servers: [
      {
        url: 'http://localhost:8080/',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    'src/routes/userRoutes.ts',
    'src/routes/memberRoutes.ts',
    'src/routes/categoryRoutes.ts',
    'src/routes/booksRoutes.ts',
    'src/routes/borrowingRoutes.ts',
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export default swaggerOptions;

