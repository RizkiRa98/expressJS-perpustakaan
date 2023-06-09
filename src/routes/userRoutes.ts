import express from 'express';

// import controller
import {getUser, getUserById} from '../controllers/Users/getUsers';
import {createUser} from '../controllers/Users/createUsers';
import {Login} from '../controllers/Users/loginUsers';
import {verifyToken} from '../middleware/verifyToken';
import {Logout} from '../controllers/Users/logoutUsers';
import {deleteUser} from '../controllers/Users/deleteUsers';
import {updateUser} from '../controllers/Users/updateUsers';

const UserRoutes = express.Router();
/**
 * @swagger
 * /getUsers:
 *   get:
 *     summary: Find All Users
 *     tags:
 *       - Users
 *     responses:
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses mendapatkan daftar pengguna
 *       500:
 *         description: Terjadi kesalahan server
 */
UserRoutes.get('/getUsers', verifyToken, getUser);

/**
 * @swagger
 *   /getUsersById/:id:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: The User ID
 *     tags:
 *       - Users
 *     summary: Find Users By ID
 *     responses:
 *       401:
 *         description: Pengguna belum login
 *       404:
 *         description: Pengguna dengan id yang di cari tidak ada
 *       200:
 *         description: Sukses mendapatkan daftar pengguna berdasarkan id
 *       500:
 *         description: Terjadi kesalahan server
 */
UserRoutes.get('/getUsersById/:id', verifyToken, getUserById);

/**
 * @swagger
 * /createUsers:
 *   post:
 *     summary: Tambah User
 *     tags:
 *       - Users
 *     responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses menambahakan Users
 *       500:
 *         description: Terjadi kesalahan server
 */
UserRoutes.post('/createUsers', verifyToken, createUser);

/**
 * @swagger
 * /deleteUsers/:id:
 *   delete:
 *     summary: Delete Users By Id
 *     tags:
 *      - Users
 *     responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses menghapus Users
 *       500:
 *         description: Terjadi kesalahan server
 */
UserRoutes.delete('/deleteUsers/:id', verifyToken, deleteUser);

/**
 * @swagger
 * /updateUsers/:id:
 *   patch:
 *     summary: Update Users By Id
 *     tags:
 *      - Users
 *     responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses update Users
 *       500:
 *         description: Terjadi kesalahan server
 */
UserRoutes.patch('/updateUsers/:id', verifyToken, updateUser);
UserRoutes.post('/login', Login);
UserRoutes.delete('/logout', Logout);

export default UserRoutes;

