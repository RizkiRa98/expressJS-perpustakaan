import express from "express";
const app = express();

// Import cookie parser
import cookieParser from "cookie-parser";

// Import Database
import db from "./config/db.js";

// import model
import Users from "./models/userModel.js";
import Categories from "./models/CategoryModel.js";
import Books from "./models/BookModel.js";
import Member from "./models/MemberModel.js";
import Borrowing from "./models/BorrowingModel.js";

// Import dotenv
import dotenv from "dotenv";
dotenv.config();

// Import Router
import UserRoutes from "./routes/UsersRoutes.js";
import MemberRoutes from "./routes/MembersRoutes.js";
import CategoryRoutes from "./routes/CategoryRoutes.js";

// (async () => {
//   await db.sync();
// })();

// // Cek koneksi ke database
try {
  // Jika koneksi berhasil
  await db.authenticate();
  console.log("Database connected");
  // await Member.sync();
  // await Borrowing.sync();
  // await Categories.sync();
  // await Books.sync();
  // await Users.sync();
} catch (error) {
  // Jika koneksi gagal;
  console.error(error);
}

// Middleware
app.use(cookieParser()); //parsing cookie agar bisa digunakan value nya
app.use(express.json()); //agar express bisa menerima data dalam bentuk JSON

// Middleware router
app.use(CategoryRoutes);
app.use(UserRoutes);
app.use(MemberRoutes);

// set port
const port = 5000;
app.listen(port, () => {
  console.log(`Server Running at localhost:${port}`);
});
