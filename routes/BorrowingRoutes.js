import express from "express";

import { getBorrowing } from "../controllers/Borrowing/getBorrowing.js";
import { addBorrowing } from "../controllers/Borrowing/createBorrowing.js";
import { deleteBorrowing } from "../controllers/Borrowing/deleteBorrowing.js";
import { verifyToken } from "../middleware/verifyToken.js";

const BorrowingRoutes = express.Router();

BorrowingRoutes.get("/borrowing", verifyToken, getBorrowing);
BorrowingRoutes.post("/borrowing", verifyToken, addBorrowing);
BorrowingRoutes.delete("/borrowing/:id", verifyToken, deleteBorrowing);

export default BorrowingRoutes;
