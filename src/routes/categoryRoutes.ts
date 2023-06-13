import express from 'express';

import {
  getCategory,
  getCategoryById,
} from '../controllers/Category/getCategory';
import {addCategory} from '../controllers/Category/createCategory';
import {deleteCategory} from '../controllers/Category/deleteCategory';
import {updateCategory} from '../controllers/Category/updateCategory';
import {verifyToken} from '../middleware/verifyToken';

const CategoryRoutes = express.Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Find All Category
 *     tags: [Category]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses mendapatkan daftar category
 *       500:
 *         description: Terjadi kesalahan server
 */

CategoryRoutes.get('/category', verifyToken, getCategory);

/**
 * @swagger
 *   /category/{id}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The Category ID
 *     summary: Find Category By ID
 *     tags: [Category]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       401:
 *         description: Pengguna belum login
 *       404:
 *         description: Category dengan id yang di cari tidak ada
 *       200:
 *         description: Sukses mendapatkan daftar category berdasarkan id
 *       500:
 *         description: Terjadi kesalahan server
 */
CategoryRoutes.get('/category/:id', verifyToken, getCategoryById);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create Catergory
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   name:
 *                     type: string
 *             example:
 *               name: Example Category Name
 *     responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses menambahakan Category
 *       500:
 *         description: Terjadi kesalahan server
 */
CategoryRoutes.post('/category', verifyToken, addCategory);

/**
 * @swagger
 * /category/{id}:
 *   patch:
 *     summary: Update Category By Id
 *     tags: [Category]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *         required: true
 *         content:
 *            application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     name:
 *                       type: string
 *                example:
 *                  name: Example Category Update
 *     responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses update Category
 *       500:
 *         description: Terjadi kesalahan server
 */
CategoryRoutes.patch('/category/:id', verifyToken, updateCategory);

/**
 * @swagger
 * /category/{id}:
 *  delete:
 *    summary: Delete Category By Id
 *    tags: [Category]
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Category ID
 *    responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses menghapus Category
 *       500:
 *         description: Terjadi kesalahan server
 */
CategoryRoutes.delete('/category/:id', verifyToken, deleteCategory);

export default CategoryRoutes;

