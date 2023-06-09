import {Request, Response} from 'express';
import {WhereOptions} from 'sequelize';
import Categories from '../../models/categoryModel';

// Membuat fungsi delete category
export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = await Categories.findOne({
      where: {
        id: req.params.id,
      } as WhereOptions<Categories>,
    });
    // Validasi jika category dengan id yang di request tidak ditemukan
    if (!category) {
      res
        .status(404)
        .json({msg: `Category dengan id ${req.params.id} tidak ditemukan`});
      return;
    }

    // JIka id yang di request ada
    await Categories.destroy({
      where: {
        id: category.id,
      } as WhereOptions<Categories>,
    });

    // Respond status ok
    res
      .status(200)
      .json({msg: `Category dengan Id ${req.params.id} berhasil dihapus`});
  } catch (error) {
    console.log(error);
    // Jika terjadi error pada try
    res.status(400).json({msg: error});
  }
};

