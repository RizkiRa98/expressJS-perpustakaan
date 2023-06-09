import express from 'express';

import {getBorrowing} from '../controllers/Borrowing/getBorrowing';
import {addBorrowing} from '../controllers/Borrowing/createBorrowing';
import {updateBorrowing} from '../controllers/Borrowing/updateBorrowing';
import {deleteBorrowing} from '../controllers/Borrowing/deleteBorrowing';
import {verifyToken} from '../middleware/verifyToken';

const BorrowingRoutes = express.Router();

BorrowingRoutes.get('/borrowing', verifyToken, getBorrowing);
BorrowingRoutes.post('/borrowing', verifyToken, addBorrowing);
BorrowingRoutes.patch('/borrowing/:id', verifyToken, updateBorrowing);
BorrowingRoutes.delete('/borrowing/:id', verifyToken, deleteBorrowing);

export default BorrowingRoutes;

