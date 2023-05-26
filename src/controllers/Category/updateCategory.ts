import {Request, Response} from 'express';
import Categories from '../../models/categoryModel';
import {WhereOptions} from 'sequelize';

// Fungsi update category
export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Cari category berdasarkan id dari request parameter
  const category = await Categories.findOne({
    where: {
      id: req.params.id,
    } as WhereOptions<Categories>,
  });

  // Validasi jika category dengan id yang di request tidak ditemukan
  if (!category) {
    res
      .status(404)
      .json({msg: `category dengan id ${req.params.id} tidak ditemukan`});
    return;
  }

  // request dari body
  const {name} = req.body;

  // Validasi email
  if (category) {
    const cekCategory = await Categories.findOne({
      where: {
        name: name,
      },
    });
    if (cekCategory && name !== Categories.name) {
      res.status(400).json({
        msg: `Name category ${name} sudah digunakan`,
      });
      return;
    }
  }

  // Update Category
  try {
    await Categories.update(
      {
        name: name,
      },
      {
        where: {
          id: category.id,
        } as WhereOptions<Categories>,
      },
    );
    // respond status Updated
    res.status(200).json({
      msg: `Category dengan id ${req.params.id} berhasil di update`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({msg: error});
  }
};

