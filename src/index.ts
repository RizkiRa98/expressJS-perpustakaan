import express from 'express';
const app = express();
// Import swagger
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';

// Import database
import db from './config/db';

// Import cookie parser
import cookieParser from 'cookie-parser';

// Import Router
import UserRoutes from './routes/userRoutes';
import MemberRoutes from './routes/memberRoutes';
import CategoryRoutes from './routes/categoryRoutes';
import BooksRoutes from './routes/booksRoutes';
import BorrowingRoutes from './routes/borrowingRoutes';

// // Import Model
// import Member from './models/memberModel';
// import Borrowing from './models/borrowingModel';
// import Categories from './models/categoryModel';
// import Books from './models/booksModel';
// import Users from './models/userModel';

// Import dotenv
import dotenv from 'dotenv';
dotenv.config();

// Cek koneksi ke database
const connectDb = async () => {
  try {
    await db.authenticate();
    // await Member.sync({force: true});
    // await Borrowing.sync({force: true});
    // await Categories.sync({force: true});
    // await Books.sync({force: true});
    // await Users.sync({force: true});
    console.log('Database Connected');
  } catch (error) {
    console.log(error);
  }
};
connectDb();

// Middleware
// parsing cookie agar bisa digunakan value nya
app.use(cookieParser());
// Agar express bisa menerima data dalam bentuk JSON
app.use(express.json());
const options = {
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
        url: 'http://localhost:3000/',
      },
    ],
  },
  apis: [
    'src/routes/userRoutes.ts',
    'src/routes/memberRoutes.ts',
    'src/routes/categoryRoutes.ts',
    'src/routes/booksRoutes.ts',
    'src/routes/borrowingRoutes.ts',
  ],
};
const swagger = swaggerjsdoc(options);
app.use('/api-docs', swaggerui.serve, swaggerui.setup(swagger));

// Middleware Router
app.use(UserRoutes);
app.use(MemberRoutes);
app.use(CategoryRoutes);
app.use(BooksRoutes);
app.use(BorrowingRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on localhost:${process.env.PORT}`);
});

