import express from 'express';

import {getBorrowing} from '../controllers/Borrowing/getBorrowing';
import {addBorrowing} from '../controllers/Borrowing/createBorrowing';
import {updateBorrowing} from '../controllers/Borrowing/updateBorrowing';
import {deleteBorrowing} from '../controllers/Borrowing/deleteBorrowing';
import {verifyToken} from '../middleware/verifyToken';

const BorrowingRoutes = express.Router();

/**
 * @swagger
 *  /borrowing:
 *     get:
 *      summary: Find All Borrowing
 *      tags: [Borrowing]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses mendapatkan daftar borrowing
 *       500:
 *         description: Terjadi kesalahan server
 */
BorrowingRoutes.get('/borrowing', verifyToken, getBorrowing);

/**
 * @swagger
 * /borrowing:
 *   post:
 *    summary: Create Borrowing
 *    tags: [Borrowing]
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *          schema:
 *            type: object
 *            properties:
 *             memberId:
 *              type: integer
 *             booksId:
 *              type: integer
 *             borrow_at:
 *              type: date
 *             status:
 *              type: string
 *          example:
 *            memberId: 1
 *            booksId: 1
 *            borrow_at: 2023-06-13
 *            status: not returned
 *    responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses menambahakan Peminjam
 *       500:
 *         description: Terjadi kesalahan server
 */
BorrowingRoutes.post('/borrowing', verifyToken, addBorrowing);

/**
 * @swagger
 * /borrowing/{id}:
 *    patch:
 *      summary: Update Borrowing By Id
 *      tags: [Borrowing]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Borrowing ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                memberId:
 *                  type: string
 *                booksId:
 *                  type: string
 *                borrow_at:
 *                  type: date
 *                status:
 *                  type: string
 *            example:
 *              memberId: "3"
 *              booksId: "1"
 *              borrow_at: 2023-06-13
 *              return_at: 2023-06-20
 *      responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses update Peminjam
 *       500:
 *         description: Terjadi kesalahan server
 */
BorrowingRoutes.patch('/borrowing/:id', verifyToken, updateBorrowing);

/**
 * @swagger
 * /borrowing/{id}:
 *    delete:
 *      summary: Delete Borrowing By Id
 *      tags: [Borrowing]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Borrowing ID
 *      responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses menghapus Peminjam
 *       500:
 *         description: Terjadi kesalahan server
 */
BorrowingRoutes.delete('/borrowing/:id', verifyToken, deleteBorrowing);

export default BorrowingRoutes;

