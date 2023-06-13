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
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *               password:
 *                 type: string
 *                 description: User password
 *             example:
 *               email: "john@example.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid email or password
 *       404:
 *         description: User not found
 */
UserRoutes.post('/login', Login);

/**
 * @swagger
 * /getUsers:
 *   get:
 *     summary: Find All Users
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
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
 *   /getUsersById/{id}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The User ID
 *     summary: Find Users By ID
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
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
 *     summary: Create User
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confPassword:
 *                 type: string
 *               role:
 *                 type: string
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: "123456"
 *             confPassword: "123456"
 *             role: super admin
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
 * /updateUsers/{id}:
 *   patch:
 *     summary: Update Users By Id
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confPassword:
 *                 type: string
 *               role:
 *                 type: string
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: "123456"
 *             confPassword: "123456"
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

/**
 * @swagger
 * /deleteUsers/{id}:
 *   delete:
 *     summary: Delete Users By Id
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses menghapus Users
 *       500:
 *         description: Terjadi kesalahan server
 * components:
 *   schemas:
 *    RoleRequest:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        role:
 *          type: string
 *          enum:
 *            - super admin
 *            - admin
 */
UserRoutes.delete('/deleteUsers/:id', verifyToken, deleteUser);

UserRoutes.delete('/logout', Logout);

export default UserRoutes;

