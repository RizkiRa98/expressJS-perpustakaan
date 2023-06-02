import {Request, Response} from 'express';
import Books from '../../models/booksModel';
import Categories from '../../models/categoryModel';
import {WhereOptions} from 'sequelize';

// Fungsi tambah books baru
export const addBooks = async (req: Request, res: Response): Promise<void> => {
  const {name, author, publisher, categoryId, status, borrowingId} = req.body;

  // validasi jika ada buku yang sama
  const cekBooks = await Books.findOne({
    where: {
      name: name,
    },
  });
  if (cekBooks) {
    res.json({msg: 'Buku sudah ada'});

    return;
  }

  if (status !== 'available' && status !== 'unavailable') {
    res.status(400).json({msg: 'Status harus available atau unavailable'});
    return;
  }

  // Validasi jika category tidak ada
  const cekCategory = await Categories.findOne({
    where: {
      id: categoryId,
    } as WhereOptions<Categories>,
  });

  if (!cekCategory) {
    res.status(404).json({
      msg: `Category dengan Id ${categoryId} tidak ada`,
    });
    return;
  }

  // Add Books
  try {
    await Books.create({
      name: name,
      author: author,
      publisher: publisher,
      categoryId: categoryId,
      status: status,
      borrowingId: borrowingId,
    });
    res.json({msg: 'Buku baru berhasil ditambahkan'});
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};

