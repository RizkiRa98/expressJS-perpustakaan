import express from "express";

import {
  getCategory,
  getCategoryById,
} from "../controllers/Category/getCategory.js";
import { addCategory } from "../controllers/Category/createCategory.js";
import { deleteCategory } from "../controllers/Category/deleteCategory.js";
import { updateCategory } from "../controllers/Category/updateCategory.js";
import { verifyToken } from "../middleware/verifyToken.js";

const CategoryRoutes = express.Router();

CategoryRoutes.get("/category", verifyToken, getCategory);
CategoryRoutes.get("/category/:id", verifyToken, getCategoryById);
CategoryRoutes.post("/category", verifyToken, addCategory);
CategoryRoutes.delete("/category/:id", verifyToken, deleteCategory);
CategoryRoutes.patch("/category/:id", verifyToken, updateCategory);

export default CategoryRoutes;
