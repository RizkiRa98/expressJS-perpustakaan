import {Request, Response} from 'express';
import Categories from '../../models/categoryModel';

// Fungsi tambah category baru
export const addCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // request dari body
  const {name} = req.body;

  // validasi jika category sudah ada
  const cekCategory = await Categories.findOne({
    where: {
      name: name,
    },
  });
  if (cekCategory) {
    res.status(400).json({
      msg: 'Nama category sudah ada',
    });
    return;
  }

  // Create member
  try {
    await Categories.create({
      name: name,
    });
    res.json({msg: 'Category Baru Berhasil Ditambahkan'});
  } catch (error) {
    res.json({
      msg: error,
    });
  }
};

