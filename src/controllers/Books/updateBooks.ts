import {Request, Response} from 'express';
import Books from '../../models/booksModel';
import Categories from '../../models/categoryModel';
import {WhereOptions} from 'sequelize';

// Fungsi update buku
export const updateBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Cari buku berdasarkan id dari request parameter
  const book = await Books.findOne({
    where: {
      id: req.params.id,
    } as WhereOptions<Books>,
  });

  // Validasi jika id yang dicari tidak ada
  if (!book) {
    res.status(404).json({
      msg: `Buku dengan id ${req.params.id} tidak ditemukan`,
    });
    return;
  }

  const {name, author, publisher, categoryId, status, borrowingId} = req.body;

  // validasi jika ada buku yang sama
  const cekBooks = await Books.findOne({
    where: {
      name: name,
    },
  });
  if (cekBooks && name !== book.name) {
    res.status(400).json({msg: 'Buku sudah ada'});
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

  // Update Buku
  try {
    await Books.update(
      {
        name: name,
        author: author,
        publisher: publisher,
        categoryId: categoryId,
        status: status,
        borrowingId: borrowingId,
      },
      {
        where: {
          id: book.id,
        } as WhereOptions<Books>,
      },
    );

    // respon status updated
    res.status(200).json({
      msg: `Buku dengan id ${req.params.id} berhasil di update`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({msg: error});
  }
};

