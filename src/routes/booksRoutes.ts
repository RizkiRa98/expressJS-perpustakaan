import express from 'express';

import {getBooks, getBookById} from '../controllers/Books/getBooks';
import {addBooks} from '../controllers/Books/createBooks';
import {deleteBooks} from '../controllers/Books/deleteBooks';
import {updateBook} from '../controllers/Books/updateBooks';
import {verifyToken} from '../middleware/verifyToken';

const BooksRoutes = express.Router();

BooksRoutes.get('/books', verifyToken, getBooks);
BooksRoutes.get('/books/:id', verifyToken, getBookById);
BooksRoutes.post('/books', verifyToken, addBooks);
BooksRoutes.patch('/books/:id', verifyToken, updateBook);
BooksRoutes.delete('/books/:id', verifyToken, deleteBooks);

export default BooksRoutes;

