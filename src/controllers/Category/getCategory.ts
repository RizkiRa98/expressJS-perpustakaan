import {Request, Response} from 'express';
import Categories from '../../models/categoryModel';
import {WhereOptions} from 'sequelize';

// Fungsi view category
export const getCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = await Categories.findAll({
      attributes: ['id', 'name', 'createdAt'],
    });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.json({msg: error});
  }
};

// Fungsi view category by Id
export const getCategoryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = await Categories.findOne({
      attributes: ['id', 'name', 'createdAt'],
      where: {
        id: req.params.id,
      } as WhereOptions<Categories>,
    });

    if (!category) {
      res.status(404).json({
        msg: `Category dengan ID ${req.params.id} tidak ditemukan`,
      });
      return;
    }
    res.json(category);
  } catch (error) {
    console.log(error);
    res.json({msg: error});
  }
};

