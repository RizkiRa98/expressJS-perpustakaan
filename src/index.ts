import express from 'express';
const app = express();

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
    // await Member.sync();
    // await Borrowing.sync();
    // await Categories.sync();
    // await Books.sync();
    // await Users.sync();
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

// Middleware Router
app.use(UserRoutes);
app.use(MemberRoutes);
app.use(CategoryRoutes);
app.use(BooksRoutes);
app.use(BorrowingRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on localhost:${process.env.PORT}`);
});
