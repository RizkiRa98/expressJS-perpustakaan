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

CategoryRoutes.get('/category', verifyToken, getCategory);
CategoryRoutes.get('/category/:id', verifyToken, getCategoryById);
CategoryRoutes.post('/category', verifyToken, addCategory);
CategoryRoutes.delete('/category/:id', verifyToken, deleteCategory);
CategoryRoutes.patch('/category/:id', verifyToken, updateCategory);

export default CategoryRoutes;

