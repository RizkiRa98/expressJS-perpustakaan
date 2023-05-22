import express from "express";

import { getBooks, getBookById } from "../controllers/Books/getBooks.js";
import { addBooks } from "../controllers/Books/createBooks.js";
import { deleteBooks } from "../controllers/Books/deleteBooks.js";
import { updateBook } from "../controllers/Books/updateBooks.js";
import { verifyToken } from "../middleware/verifyToken.js";

const BooksRoutes = express.Router();

BooksRoutes.get("/books", verifyToken, getBooks);
BooksRoutes.get("/books/:id", verifyToken, getBookById);
BooksRoutes.post("/books", verifyToken, addBooks);
BooksRoutes.patch("/books/:id", verifyToken, updateBook);
BooksRoutes.delete("/books/:id", verifyToken, deleteBooks);

export default BooksRoutes;
