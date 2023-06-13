import express from 'express';

import {getBooks, getBookById} from '../controllers/Books/getBooks';
import {addBooks} from '../controllers/Books/createBooks';
import {deleteBooks} from '../controllers/Books/deleteBooks';
import {updateBook} from '../controllers/Books/updateBooks';
import {verifyToken} from '../middleware/verifyToken';

const BooksRoutes = express.Router();

/**
 * @swagger
 * /books:
 *   get:
 *    summary: Find All Books
 *    tags: [Books]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses mendapatkan daftar Books
 *       500:
 *         description: Terjadi kesalahan server
 */
BooksRoutes.get('/books', verifyToken, getBooks);

/**
 * @swagger
 * /books/{id}:
 *    get:
 *      parameters:
 *        - in : path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The Books Id
 *      summary: Find Users By ID
 *      tags: [Books]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *       401:
 *         description: Pengguna belum login
 *       404:
 *         description: Books dengan id yang di cari tidak ada
 *       200:
 *         description: Sukses mendapatkan daftar Books berdasarkan id
 *       500:
 *         description: Terjadi kesalahan server
 */
BooksRoutes.get('/books/:id', verifyToken, getBookById);

/**
 * @swagger
 *   /books:
 *    post:
 *      summary: Create Books
 *      tags: [Books]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  name:
 *                     type: string
 *                  author:
 *                     type: string
 *                  publisher:
 *                     type: string
 *                  categoryId:
 *                     type: integer
 *                  status:
 *                     type: string
 *             example:
 *               name: example books name
 *               author: example author name
 *               publisher: example publisher name
 *               categoryId: 1
 *               status: available
 *      responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses tambah data Books
 *       500:
 *         description: Terjadi kesalahan server
 */
BooksRoutes.post('/books', verifyToken, addBooks);

/**
 * @swagger
 * /books/{id}:
 *  patch:
 *    summary: Update books by Id
 *    tags: [Books]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Books ID
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  name:
 *                     type: string
 *                  author:
 *                     type: string
 *                  publisher:
 *                     type: string
 *                  categoryId:
 *                     type: integer
 *                  status:
 *                     type: string
 *                  borrowingId:
 *                     type: integer
 *             example:
 *               name: example books update
 *               author: example author update
 *               publisher: example publisher update
 *               categoryId: 1
 *               status: available
 *    responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses update books
 *       500:
 *         description: Terjadi kesalahan server
 */
BooksRoutes.patch('/books/:id', verifyToken, updateBook);

/**
 * @swagger
 * /books/{id}:
 *  delete:
 *   summary: Delete Books By Id
 *   tags: [Books]
 *   security:
 *      - bearerAuth: []
 *   parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Books ID
 *   responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses menghapus Books
 *       500:
 *         description: Terjadi kesalahan server
 */
BooksRoutes.delete('/books/:id', verifyToken, deleteBooks);

export default BooksRoutes;

