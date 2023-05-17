import express from "express";
const app = express();

// Import cookie parser
import cookieParser from "cookie-parser";

// Import Database
import db from "./config/db.js";

// Import dotenv
import dotenv from "dotenv";
dotenv.config();

// Import Router
import UserRoutes from "./routes/UsersRoutes.js";

// Cek koneksi ke database
try {
  // Jika koneksi berhasil
  await db.authenticate();
  console.log("Database connected");
} catch (error) {
  // Jika koneksi gagal;
  console.error(error);
}

// Middleware
app.use(cookieParser()); //parsing cookie agar bisa digunakan value nya
app.use(express.json()); //agar express bisa menerima data dalam bentuk JSON
// Middleware router
app.use(UserRoutes);

// set port
const port = 5000;
app.listen(port, () => {
  console.log(`Server Running at localhost:${port}`);
});
