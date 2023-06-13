import express from 'express';

import {getMember, getMemberById} from '../controllers/Members/getMembers';
import {addMember} from '../controllers/Members/createMembers';
import {deleteMember} from '../controllers/Members/deleteMembers';
import {updateMember} from '../controllers/Members/updateMembers';
import {verifyToken} from '../middleware/verifyToken';

const MemberRoutes = express.Router();

/**
 * @swagger
 * /members:
 *    get:
 *      summary: Find All Members
 *      tags: [Members]
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        401:
 *          description: Pengguna belum login
 *        200:
 *          description: Sukses mendapatkan daftar members
 *        500:
 *          description: Terjadi kesalahan server
 */
MemberRoutes.get('/members', verifyToken, getMember);

/**
 * @swagger
 * /members/{id}:
 *    get:
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Member Id
 *      summary: Find Members By ID
 *      tags: [Members]
 *      security:
 *       - bearerAuth: []
 *      responses:
 *        401:
 *          description: Pengguna belum login
 *        404:
 *          description: Member dengan id yang di cari tidak ada
 *        200:
 *          description: Sukses mendapatkan daftar members berdasarkan id
 *        500:
 *          description: Terjadi kesalahan server
 */
MemberRoutes.get('/members/:id', verifyToken, getMemberById);

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Create Member
 *     tags: [Members]
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
 *               phone:
 *                 type: string
 *           example:
 *              name: Example Name
 *              email: examplename@example.com
 *              phone: "08123456789"
 *     responses:
 *         400:
 *           description: Terjadi kesalahan saat validasi
 *         401:
 *           description: Pengguna belum login
 *         200:
 *           description: Sukses menambahkan Member
 *         500:
 *           description: Terjadi kesalahan server
 */
MemberRoutes.post('/members', verifyToken, addMember);

/**
 * @swagger
 * /members/{id}:
 *   patch:
 *     summary: Update Member By Id
 *     tags: [Members]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Member ID
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                phone:
 *                  type: string
 *           example:
 *             name: Example Name Update
 *             email: examplename@example.com
 *             phone: "08123456789"
 *     responses:
 *       400:
 *         description: Terjadi kesalahan saat validasi
 *       401:
 *         description: Pengguna belum login
 *       200:
 *         description: Sukses update Members
 *       500:
 *         description: Terjadi kesalahan server
 */
MemberRoutes.patch('/members/:id', verifyToken, updateMember);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Delete Members By Id
 *     tags: [Members]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
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
MemberRoutes.delete('/members/:id', verifyToken, deleteMember);

export default MemberRoutes;

